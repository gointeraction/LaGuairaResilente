import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// ============================================
// TRIGGERS - Firestore
// ============================================

// On user creation, create default notification
export const onUserCreated = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const userId = context.params.userId;

    // Create welcome notification
    await db.collection('notifications').add({
      user_id: userId,
      title: '¡Bienvenido a La Guaira Resiliente Digital!',
      body: `Hola ${userData.profile.first_name}, comienza tu camino hacia la reconstrucción digital.`,
      type: 'SYSTEM',
      data: {},
      read: false,
      created_at: new Date().toISOString()
    });

    // Update impact metrics
    await updateImpactMetrics();

    functions.logger.info(`New user created: ${userId}`);
  });

// On enrollment completed, award resilience points
export const onEnrollmentCompleted = functions.firestore
  .document('enrollments/{enrollmentId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if enrollment just completed
    if (before.status !== 'COMPLETED' && after.status === 'COMPLETED') {
      // Award 100 points for course completion
      await db.collection('resilience_points').add({
        student_id: after.student_id,
        points: 100,
        reason: 'COURSE_COMPLETED',
        reference_id: context.params.enrollmentId,
        created_at: new Date().toISOString()
      });

      // Get course info to check if track is complete
      const courseDoc = await db.collection('courses').doc(after.course_id).get();
      const course = courseDoc.data();

      if (course) {
        // Check if all courses in track are completed
        const enrollments = await db.collection('enrollments')
          .where('student_id', '==', after.student_id)
          .where('track_id', '==', after.track_id)
          .where('status', '==', 'COMPLETED')
          .get();

        const trackDoc = await db.collection('tracks').doc(after.track_id).get();
        const track = trackDoc.data();

        if (track && enrollments.docs.length >= track.module_count) {
          // Track completed! Award 300 bonus points
          await db.collection('resilience_points').add({
            student_id: after.student_id,
            points: 300,
            reason: 'TRACK_COMPLETED',
            reference_id: after.track_id,
            created_at: new Date().toISOString()
          });

          // Send notification
          await db.collection('notifications').add({
            user_id: after.student_id,
            title: '¡Felicitaciones! Track completado',
            body: `Has completado el track "${track.name}". ¡Sigue así!`,
            type: 'ENROLLMENT',
            data: { track_id: after.track_id },
            read: false,
            created_at: new Date().toISOString()
          });
        }
      }

      // Send completion notification
      await db.collection('notifications').add({
        user_id: after.student_id,
        title: 'Curso completado',
        body: `Has completado el curso "${course?.title}". ¡Excelente trabajo!`,
        type: 'ENROLLMENT',
        data: { course_id: after.course_id },
        read: false,
        created_at: new Date().toISOString()
      });

      // Update impact metrics
      await updateImpactMetrics();
    }
  });

// On sponsorship created, update counts
export const onSponsorshipCreated = functions.firestore
  .document('sponsorships/{sponsorshipId}')
  .onCreate(async (snap, context) => {
    const sponsorship = snap.data();

    // Send notification to sponsor
    await db.collection('notifications').add({
      user_id: sponsorship.sponsor_id,
      title: 'Nuevo patrocinio registrado',
      body: `Tu patrocinio ha sido registrado exitosamente.`,
      type: 'SPONSORSHIP',
      data: { sponsorship_id: context.params.sponsorshipId },
      read: false,
      created_at: new Date().toISOString()
    });

    // Update impact metrics
    await updateImpactMetrics();
  });

// On milestone completed, check if sponsorship is complete
export const onMilestoneCompleted = functions.firestore
  .document('milestones/{milestoneId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== 'COMPLETED' && after.status === 'COMPLETED') {
      // Check if all milestones for this sponsorship are completed
      const milestones = await db.collection('milestones')
        .where('sponsorship_id', '==', after.sponsorship_id)
        .get();

      const allCompleted = milestones.docs.every(doc => doc.data().status === 'COMPLETED');

      if (allCompleted) {
        // Mark sponsorship as completed
        await db.collection('sponsorships').doc(after.sponsorship_id).update({
          status: 'COMPLETED',
          end_date: new Date().toISOString()
        });

        const sponsorship = await db.collection('sponsorships').doc(after.sponsorship_id).get();
        const sponsorshipData = sponsorship.data();

        if (sponsorshipData) {
          // Update sponsor's active count
          const sponsor = await db.collection('sponsors').doc(sponsorshipData.sponsor_id).get();
          const sponsorData = sponsor.data();

          if (sponsorData) {
            await db.collection('sponsors').doc(sponsorshipData.sponsor_id).update({
              active_sponsorships: Math.max(0, sponsorData.active_sponsorships - 1)
            });
          }

          // Send notification to sponsor
          await db.collection('notifications').add({
            user_id: sponsorshipData.sponsor_id,
            title: '¡Patrocinio completado!',
            body: 'Tu patrocinio ha sido completado exitosamente. ¡Gracias por tu apoyo!',
            type: 'SPONSORSHIP',
            data: { sponsorship_id: context.params.milestoneId },
            read: false,
            created_at: new Date().toISOString()
          });
        }
      }
    }
  });

// ============================================
// CALLABLE FUNCTIONS
// ============================================

// Calculate total resilience points for a student
export const getStudentTotalPoints = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
  }

  const pointsSnapshot = await db.collection('resilience_points')
    .where('student_id', '==', data.studentId)
    .get();

  const totalPoints = pointsSnapshot.docs.reduce(
    (sum, doc) => sum + doc.data().points, 
    0
  );

  return { totalPoints };
});

// Award daily attendance points
export const awardDailyAttendance = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
  }

  // Check if already awarded today
  const today = new Date().toISOString().split('T')[0];
  const existingPoints = await db.collection('resilience_points')
    .where('student_id', '==', data.studentId)
    .where('reason', '==', 'DAILY_ATTENDANCE')
    .where('created_at', '>=', today)
    .get();

  if (!existingPoints.empty) {
    return { awarded: false, message: 'Ya se otorgaron puntos de asistencia hoy' };
  }

  await db.collection('resilience_points').add({
    student_id: data.studentId,
    points: 5,
    reason: 'DAILY_ATTENDANCE',
    reference_id: null,
    created_at: new Date().toISOString()
  });

  return { awarded: true, points: 5 };
});

// Submit quiz and calculate score
export const submitQuiz = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
  }

  const { courseId, answers, enrollmentId } = data;

  // Get quiz from course
  const courseDoc = await db.collection('courses').doc(courseId).get();
  const course = courseDoc.data();

  if (!course || !course.quiz) {
    throw new functions.https.HttpsError('not-found', 'Curso o quiz no encontrado');
  }

  const quiz = course.quiz;
  let correctAnswers = 0;

  // Calculate score
  const processedAnswers = quiz.questions.map((question: any, index: number) => {
    const isCorrect = answers[index] === question.correct_answer;
    if (isCorrect) correctAnswers++;
    return {
      question_id: question.id,
      selected_answer: answers[index],
      is_correct: isCorrect
    };
  });

  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  const passed = score >= quiz.passing_score;

  // Create submission
  const submission = {
    student_id: context.auth.uid,
    course_id: courseId,
    enrollment_id: enrollmentId,
    answers: processedAnswers,
    score,
    passed,
    submitted_at: new Date().toISOString()
  };

  const docRef = await db.collection('quiz_submissions').add(submission);

  // Update enrollment
  await db.collection('enrollments').doc(enrollmentId).update({
    quiz_score: score,
    status: passed ? 'COMPLETED' : 'FAILED',
    completed_at: passed ? new Date().toISOString() : null
  });

  // Award points if passed
  if (passed) {
    await db.collection('resilience_points').add({
      student_id: context.auth.uid,
      points: 25,
      reason: 'QUIZ_PASSED',
      reference_id: courseId,
      created_at: new Date().toISOString()
    });
  }

  return { 
    submissionId: docRef.id, 
    score, 
    passed,
    correctAnswers,
    totalQuestions: quiz.questions.length
  };
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function updateImpactMetrics() {
  const usersSnapshot = await db.collection('users').get();
  const enrollmentsSnapshot = await db.collection('enrollments').get();
  const sponsorshipsSnapshot = await db.collection('sponsorships').get();

  const totalUsers = usersSnapshot.size;
  const totalStudents = usersSnapshot.docs.filter(doc => doc.data().role === 'STUDENT').length;
  const completedEnrollments = enrollmentsSnapshot.docs.filter(doc => doc.data().status === 'COMPLETED').length;
  const activeSponsorships = sponsorshipsSnapshot.docs.filter(doc => doc.data().status === 'ACTIVE').length;

  // Calculate total funds
  let totalFunds = 0;
  sponsorshipsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.status !== 'CANCELLED') {
      totalFunds += data.financial_contribution || 0;
    }
  });

  // Update metrics
  await db.collection('impact_metrics').doc('current').set({
    total_beneficiaries: totalStudents,
    total_users: totalUsers,
    courses_completed: completedEnrollments,
    total_sponsorships_active: activeSponsorships,
    total_funds_raised: totalFunds,
    updated_at: new Date().toISOString()
  });
}

// ============================================
// SCHEDULED FUNCTIONS
// ============================================

// Update impact metrics daily
export const scheduledMetricsUpdate = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    await updateImpactMetrics();
    functions.logger.info('Impact metrics updated');
  });

// Check for overdue milestones daily
export const scheduledMilestoneCheck = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const now = new Date().toISOString();
    
    const overdueMilestones = await db.collection('milestones')
      .where('status', '==', 'PENDING')
      .where('target_date', '<', now)
      .get();

    const batch = db.batch();

    overdueMilestones.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'OVERDUE' });
    });

    await batch.commit();
    functions.logger.info(`Updated ${overdueMilestones.size} overdue milestones`);
  });
