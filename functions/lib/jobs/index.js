"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledCampMonitor = exports.scheduledWeeklyReport = exports.scheduledMilestoneCheck = exports.scheduledStreakCheck = exports.scheduledMetricsUpdate = void 0;
const functions = __importStar(require("firebase-functions"));
const admin_1 = require("../lib/admin");
const helpers_1 = require("../lib/helpers");
// ============================================
// DAILY METRICS UPDATE
// ============================================
exports.scheduledMetricsUpdate = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async () => {
    await (0, helpers_1.updateImpactMetrics)();
    functions.logger.info('Impact metrics updated');
});
// ============================================
// DAILY STREAK CHECKER
// ============================================
exports.scheduledStreakCheck = functions.pubsub
    .schedule('every 24 hours')
    .timeZone('America/Caracas')
    .onRun(async () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const users = await admin_1.db.collection('users')
        .where('role', '==', 'STUDENT')
        .where('is_active', '==', true)
        .get();
    const batch = admin_1.db.batch();
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
        }
        else if (lastActivity !== today) {
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
exports.scheduledMilestoneCheck = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async () => {
    const now = new Date().toISOString();
    const overdueMilestones = await admin_1.db.collection('milestones')
        .where('status', '==', 'PENDING')
        .where('target_date', '<', now)
        .get();
    const batch = admin_1.db.batch();
    overdueMilestones.docs.forEach(doc => {
        batch.update(doc.ref, { status: 'OVERDUE' });
    });
    await batch.commit();
    functions.logger.info(`Updated ${overdueMilestones.size} overdue milestones`);
});
// ============================================
// WEEKLY IMPACT REPORT
// ============================================
exports.scheduledWeeklyReport = functions.pubsub
    .schedule('every monday 09:00')
    .timeZone('America/Caracas')
    .onRun(async () => {
    const admins = await admin_1.db.collection('users')
        .where('role', '==', 'ADMIN')
        .get();
    const metricsDoc = await admin_1.db.collection('impact_metrics').doc('current').get();
    const metrics = metricsDoc.data();
    for (const admin of admins.docs) {
        await (0, helpers_1.createNotification)(admin.id, '📊 Reporte Semanal', `Resumen: ${(metrics === null || metrics === void 0 ? void 0 : metrics.total_users) || 0} usuarios, ${(metrics === null || metrics === void 0 ? void 0 : metrics.courses_completed) || 0} cursos completados, $${(metrics === null || metrics === void 0 ? void 0 : metrics.total_funds_raised) || 0} recaudados.`, 'SYSTEM');
    }
    functions.logger.info('Weekly report sent to admins');
});
// ============================================
// CAMP CAPACITY MONITOR (every 6 hours)
// ============================================
exports.scheduledCampMonitor = functions.pubsub
    .schedule('every 6 hours')
    .onRun(async () => {
    const camps = await admin_1.db.collection('camps')
        .where('status', '==', 'ACTIVO')
        .get();
    for (const campDoc of camps.docs) {
        const camp = campDoc.data();
        const occupancyPercent = (camp.current_occupancy / camp.capacity) * 100;
        if (occupancyPercent >= 95) {
            const coordinators = await admin_1.db.collection('users')
                .where('role', 'in', ['COORDINATOR', 'ADMIN'])
                .get();
            for (const coord of coordinators.docs) {
                await (0, helpers_1.createNotification)(coord.id, '🚨 Campamento casi lleno', `"${camp.name}" está al ${Math.round(occupancyPercent)}% de capacidad. Se requiere acción inmediata.`, 'SYSTEM', { camp_id: campDoc.id });
            }
        }
    }
    functions.logger.info('Camp capacity monitor completed');
});
//# sourceMappingURL=index.js.map