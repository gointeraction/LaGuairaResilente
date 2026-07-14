import * as functions from 'firebase-functions';
import { db } from '../lib/admin';
import { createNotification, updateImpactMetrics } from '../lib/helpers';

// ============================================
// DAILY METRICS UPDATE
// ============================================
export const scheduledMetricsUpdate = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    await updateImpactMetrics();
    functions.logger.info('Impact metrics updated');
  });

// ============================================
// DAILY STREAK CHECKER
// ============================================
export const scheduledStreakCheck = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('America/Caracas')
  .onRun(async () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const users = await db.collection('users')
      .where('role', '==', 'STUDENT')
      .where('is_active', '==', true)
      .get();

    const batch = db.batch();
    let streaksUpdated = 0;

    for (const userDoc of users.docs) {
      const userData = userDoc.data();
      const lastActivity = userData.last_activity_date;

      // Check if user was active yesterday
      if (lastActivity === yesterday) {
        // Increment streak
        batch.update(userDoc.ref, {
          current_streak: (userData.current_streak || 0) + 1,
          last_activity_date: today
        });
        streaksUpdated++;
      } else if (lastActivity !== today) {
        // Reset streak
        batch.update(userDoc.ref, {
          current_streak: 0,
          last_activity_date: today
        });
      }
    }

    await batch.commit();
    functions.logger.info(`Streak check completed: ${streaksUpdated} streaks incremented`);
  });

// ============================================
// OVERDUE MILESTONES CHECK
// ============================================
export const scheduledMilestoneCheck = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
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

// ============================================
// WEEKLY IMPACT REPORT
// ============================================
export const scheduledWeeklyReport = functions.pubsub
  .schedule('every monday 09:00')
  .timeZone('America/Caracas')
  .onRun(async () => {
    const admins = await db.collection('users')
      .where('role', '==', 'ADMIN')
      .get();

    const metricsDoc = await db.collection('impact_metrics').doc('current').get();
    const metrics = metricsDoc.data();

    for (const admin of admins.docs) {
      await createNotification(
        admin.id,
        '📊 Reporte Semanal',
        `Resumen: ${metrics?.total_users || 0} usuarios, ${metrics?.courses_completed || 0} cursos completados, $${metrics?.total_funds_raised || 0} recaudados.`,
        'SYSTEM'
      );
    }

    functions.logger.info('Weekly report sent to admins');
  });

// ============================================
// CAMP CAPACITY MONITOR (every 6 hours)
// ============================================
export const scheduledCampMonitor = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async () => {
    const camps = await db.collection('camps')
      .where('status', '==', 'ACTIVO')
      .get();

    for (const campDoc of camps.docs) {
      const camp = campDoc.data();
      const occupancyPercent = (camp.current_occupancy / camp.capacity) * 100;

      if (occupancyPercent >= 95) {
        const coordinators = await db.collection('users')
          .where('role', 'in', ['COORDINATOR', 'ADMIN'])
          .get();

        for (const coord of coordinators.docs) {
          await createNotification(
            coord.id,
            '🚨 Campamento casi lleno',
            `"${camp.name}" está al ${Math.round(occupancyPercent)}% de capacidad. Se requiere acción inmediata.`,
            'SYSTEM',
            { camp_id: campDoc.id }
          );
        }
      }
    }

    functions.logger.info('Camp capacity monitor completed');
  });
