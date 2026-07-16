import * as functions from 'firebase-functions';
import { db } from '../lib/admin';
import { awardPoints, createNotification } from '../lib/helpers';

// ============================================
// GET STUDENT TOTAL POINTS
// ============================================
export const getStudentTotalPoints = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
  }

  const userDoc = await db.collection('users').doc(data.studentId).get();
  const points = userDoc.data()?.points || 0;

  return { totalPoints: points };
});

// ============================================
// AWARD DAILY ATTENDANCE
// ============================================
export const awardDailyAttendance = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
  }

  const today = new Date().toISOString().split('T')[0];
  const existingPoints = await db.collection('points_transactions')
    .where('user_id', '==', data.studentId)
    .where('reason', '==', 'DAILY_ATTENDANCE')
    .where('created_at', '>=', today)
    .get();

  if (!existingPoints.empty) {
    return { awarded: false, message: 'Ya se otorgaron puntos de asistencia hoy' };
  }

  await awardPoints(data.studentId, 5, 'DAILY_ATTENDANCE');

  return { awarded: true, points: 5 };
});

// ============================================
// SUBMIT QUIZ
// ============================================
export const submitQuiz = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
  }

  const { courseId, answers, enrollmentId } = data;

  const courseDoc = await db.collection('courses').doc(courseId).get();
  const course = courseDoc.data();

  if (!course || !course.quiz) {
    throw new functions.https.HttpsError('not-found', 'Curso o quiz no encontrado');
  }

  const quiz = course.quiz;
  let correctAnswers = 0;

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

  await db.collection('enrollments').doc(enrollmentId).update({
    quiz_score: score,
    status: passed ? 'COMPLETED' : 'FAILED',
    completed_at: passed ? new Date().toISOString() : null
  });

  if (passed) {
    await awardPoints(context.auth.uid, 25, 'QUIZ_PASSED', courseId);
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
// AWARD REFERRAL POINTS
// ============================================
export const awardReferral = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
  }

  const { referredUserId } = data;

  // Award points to referrer
  await awardPoints(context.auth.uid, 50, 'REFERRAL', referredUserId);

  // Award points to referred user
  await awardPoints(referredUserId, 25, 'REFERRAL', context.auth.uid);

  // Notify both users
  await createNotification(
    context.auth.uid,
    '¡Referido exitoso!',
    'Has ganado 50 puntos por referir a un amigo.',
    'SYSTEM'
  );

  await createNotification(
    referredUserId,
    '¡Bienvenido por referido!',
    'Has ganado 25 puntos de bienvenida.',
    'SYSTEM'
  );

  return { success: true };
});

// ============================================
// AUTO-MATCH SPONSORS TO BENEFICIARIES
// ============================================
export const autoMatchSponsors = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
  }

  const userDoc = await db.collection('users').doc(context.auth.uid).get();
  const isSuperAdmin = context.auth.token.email?.toLowerCase() === 'bbmintellegent@gmail.com';
  if (userDoc.data()?.role !== 'ADMIN' && userDoc.data()?.role !== 'COORDINATOR' && !isSuperAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'No autorizado');
  }

  const sponsors = await db.collection('sponsors').where('status', '==', 'ACTIVO').get();
  const beneficiaries = await db.collection('beneficiaries')
    .where('enrollment_status', '==', null)
    .get();

  const matches: any[] = [];

  for (const sponsorDoc of sponsors.docs) {
    const sponsor = sponsorDoc.data();
    let bestMatch = null;
    let bestScore = 0;

    for (const benDoc of beneficiaries.docs) {
      const beneficiary = benDoc.data();
      
      // Calculate match score
      let score = 0;
      
      // Municipality match
      if (sponsor.zone === beneficiary.location) score += 30;
      
      // Type compatibility
      if (sponsor.type === 'CONECTIVIDAD' && beneficiary.digital_level === 'NONE') score += 25;
      if (sponsor.type === 'INFRAESTRUCTURA' && beneficiary.needs?.some((n: any) => n.type === 'INFRAESTRUCTURA')) score += 25;
      if (sponsor.type === 'COMERCIAL') score += 20;
      
      // Priority score from beneficiary
      score += (beneficiary.priority_score || 0) * 0.2;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = { id: benDoc.id, ...beneficiary };
      }
    }

    if (bestMatch && bestScore > 20) {
      matches.push({
        sponsor_id: sponsorDoc.id,
        beneficiary_id: bestMatch.id,
        score: Math.round(bestScore),
        status: 'PENDIENTE'
      });
    }
  }

  // Create match records
  for (const match of matches) {
    await db.collection('sponsorships').add({
      ...match,
      type: 'COMMERCIAL',
      beneficiary_type: 'INDIVIDUAL',
      financial_contribution: 0,
      start_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
  }

  return { matchesCreated: matches.length, matches };
});

// ============================================
// APPROVE USER
// ============================================
export const approveUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
  }

  const adminDoc = await db.collection('users').doc(context.auth.uid).get();
  const isSuperAdmin = context.auth.token.email?.toLowerCase() === 'bbmintellegent@gmail.com';
  if (adminDoc.data()?.role !== 'ADMIN' && !isSuperAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Solo admins pueden aprobar usuarios');
  }

  const { userId, approved } = data;

  await db.collection('users').doc(userId).update({
    is_approved: approved,
    updated_at: new Date().toISOString()
  });

  await createNotification(
    userId,
    approved ? '¡Cuenta aprobada!' : 'Cuenta no aprobada',
    approved
      ? 'Tu cuenta ha sido aprobada. Ya puedes acceder a todas las funcionalidades.'
      : 'Tu cuenta no fue aprobada. Contacta al administrador.',
    'SYSTEM'
  );

  return { success: true };
});
