import * as functions from 'firebase-functions';
import { db } from '../lib/admin';
import { createNotification, updateImpactMetrics, awardPoints } from '../lib/helpers';

// ============================================
// ON USER CREATED
// ============================================
export const onUserCreated = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const userId = context.params.userId;

    await createNotification(
      userId,
      '¡Bienvenido a La Guaira Resiliente Digital!',
      `Hola ${userData.profile?.first_name || userData.full_name?.split(' ')[0]}, comienza tu camino hacia la reconstrucción digital.`,
      'SYSTEM'
    );

    await updateImpactMetrics();
    functions.logger.info(`New user created: ${userId}`);
  });

// ============================================
// ON ENROLLMENT COMPLETED
// ============================================
export const onEnrollmentCompleted = functions.firestore
  .document('enrollments/{enrollmentId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== 'COMPLETED' && after.status === 'COMPLETED') {
      // Award 100 points for course completion
      await awardPoints(after.student_id, 100, 'COURSE_COMPLETED', context.params.enrollmentId);

      // Check if track is complete
      const enrollments = await db.collection('enrollments')
        .where('student_id', '==', after.student_id)
        .where('track_id', '==', after.track_id)
        .where('status', '==', 'COMPLETED')
        .get();

      const trackDoc = await db.collection('tracks').doc(after.track_id).get();
      const track = trackDoc.data();

      if (track && enrollments.docs.length >= track.module_count) {
        await awardPoints(after.student_id, 300, 'TRACK_COMPLETED', after.track_id);

        await createNotification(
          after.student_id,
          '¡Felicitaciones! Track completado',
          `Has completado el track "${track.name}". ¡Sigue así!`,
          'ENROLLMENT',
          { track_id: after.track_id }
        );
      }

      // Get course info for notification
      const courseDoc = await db.collection('courses').doc(after.course_id).get();
      const course = courseDoc.data();

      await createNotification(
        after.student_id,
        'Curso completado',
        `Has completado el curso "${course?.title}". ¡Excelente trabajo!`,
        'ENROLLMENT',
        { course_id: after.course_id }
      );

      await updateImpactMetrics();
    }
  });

// ============================================
// ON SPONSORSHIP CREATED
// ============================================
export const onSponsorshipCreated = functions.firestore
  .document('sponsorships/{sponsorshipId}')
  .onCreate(async (snap, context) => {
    const sponsorship = snap.data();

    await createNotification(
      sponsorship.sponsor_id,
      'Nuevo patrocinio registrado',
      'Tu patrocinio ha sido registrado exitosamente.',
      'SPONSORSHIP',
      { sponsorship_id: context.params.sponsorshipId }
    );

    await updateImpactMetrics();
  });

// ============================================
// ON MILESTONE COMPLETED
// ============================================
export const onMilestoneCompleted = functions.firestore
  .document('milestones/{milestoneId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== 'COMPLETED' && after.status === 'COMPLETED') {
      const milestones = await db.collection('milestones')
        .where('sponsorship_id', '==', after.sponsorship_id)
        .get();

      const allCompleted = milestones.docs.every(doc => doc.data().status === 'COMPLETED');

      if (allCompleted) {
        await db.collection('sponsorships').doc(after.sponsorship_id).update({
          status: 'COMPLETED',
          end_date: new Date().toISOString()
        });

        const sponsorship = await db.collection('sponsorships').doc(after.sponsorship_id).get();
        const sponsorshipData = sponsorship.data();

        if (sponsorshipData) {
          const sponsor = await db.collection('sponsors').doc(sponsorshipData.sponsor_id).get();
          const sponsorData = sponsor.data();

          if (sponsorData) {
            await db.collection('sponsors').doc(sponsorshipData.sponsor_id).update({
              active_sponsorships: Math.max(0, sponsorData.active_sponsorships - 1)
            });
          }

          await createNotification(
            sponsorshipData.sponsor_id,
            '¡Patrocinio completado!',
            'Tu patrocinio ha sido completado exitosamente. ¡Gracias por tu apoyo!',
            'SPONSORSHIP',
            { sponsorship_id: after.sponsorship_id }
          );
        }
      }
    }
  });

// ============================================
// ON REDEMPTION CREATED
// ============================================
export const onRedemptionCreated = functions.firestore
  .document('redemptions/{redemptionId}')
  .onCreate(async (snap, context) => {
    const redemption = snap.data();

    // Deduct points from user
    const userRef = db.collection('users').doc(redemption.user_id);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const currentPoints = userDoc.data()?.points || 0;
      await userRef.update({ points: Math.max(0, currentPoints - redemption.points_cost) });
    }

    // Record points deduction
    await db.collection('points_transactions').add({
      user_id: redemption.user_id,
      points: -redemption.points_cost,
      reason: 'REDEMPTION',
      reference_id: context.params.redemptionId,
      created_at: new Date().toISOString()
    });

    await createNotification(
      redemption.user_id,
      'Canje registrado',
      `Tu canje de "${redemption.item_name}" ha sido registrado. Te contactaremos pronto.`,
      'SYSTEM',
      { redemption_id: context.params.redemptionId }
    );
  });

// ============================================
// ON CAMP OCCUPANCY UPDATED
// ============================================
export const onCampUpdated = functions.firestore
  .document('camps/{campId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Alert if camp is near capacity
    if (after.current_occupancy > after.capacity * 0.9 && before.current_occupancy <= before.capacity * 0.9) {
      const coordinators = await db.collection('users')
        .where('role', '==', 'COORDINATOR')
        .where('municipality', '==', after.zone)
        .get();

      for (const coord of coordinators.docs) {
        await createNotification(
          coord.id,
          '⚠️ Alerta de capacidad',
          `El campamento "${after.name}" está al ${Math.round((after.current_occupancy / after.capacity) * 100)}% de capacidad.`,
          'SYSTEM',
          { camp_id: context.params.campId }
        );
      }
    }
  });
