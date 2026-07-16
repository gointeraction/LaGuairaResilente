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
exports.onCampUpdated = exports.onRedemptionCreated = exports.onMilestoneCompleted = exports.onSponsorshipCreated = exports.onEnrollmentCompleted = exports.onUserCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin_1 = require("../lib/admin");
const helpers_1 = require("../lib/helpers");
// ============================================
// ON USER CREATED
// ============================================
exports.onUserCreated = functions.firestore
    .document('users/{userId}')
    .onCreate(async (snap, context) => {
    var _a, _b;
    const userData = snap.data();
    const userId = context.params.userId;
    await (0, helpers_1.createNotification)(userId, '¡Bienvenido a La Guaira Resiliente Digital!', `Hola ${((_a = userData.profile) === null || _a === void 0 ? void 0 : _a.first_name) || ((_b = userData.full_name) === null || _b === void 0 ? void 0 : _b.split(' ')[0])}, comienza tu camino hacia la reconstrucción digital.`, 'SYSTEM');
    await (0, helpers_1.updateImpactMetrics)();
    functions.logger.info(`New user created: ${userId}`);
});
// ============================================
// ON ENROLLMENT COMPLETED
// ============================================
exports.onEnrollmentCompleted = functions.firestore
    .document('enrollments/{enrollmentId}')
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.status !== 'COMPLETED' && after.status === 'COMPLETED') {
        // Award 100 points for course completion
        await (0, helpers_1.awardPoints)(after.student_id, 100, 'COURSE_COMPLETED', context.params.enrollmentId);
        // Check if track is complete
        const enrollments = await admin_1.db.collection('enrollments')
            .where('student_id', '==', after.student_id)
            .where('track_id', '==', after.track_id)
            .where('status', '==', 'COMPLETED')
            .get();
        const trackDoc = await admin_1.db.collection('tracks').doc(after.track_id).get();
        const track = trackDoc.data();
        if (track && enrollments.docs.length >= track.module_count) {
            await (0, helpers_1.awardPoints)(after.student_id, 300, 'TRACK_COMPLETED', after.track_id);
            await (0, helpers_1.createNotification)(after.student_id, '¡Felicitaciones! Track completado', `Has completado el track "${track.name}". ¡Sigue así!`, 'ENROLLMENT', { track_id: after.track_id });
        }
        // Get course info for notification
        const courseDoc = await admin_1.db.collection('courses').doc(after.course_id).get();
        const course = courseDoc.data();
        await (0, helpers_1.createNotification)(after.student_id, 'Curso completado', `Has completado el curso "${course === null || course === void 0 ? void 0 : course.title}". ¡Excelente trabajo!`, 'ENROLLMENT', { course_id: after.course_id });
        await (0, helpers_1.updateImpactMetrics)();
    }
});
// ============================================
// ON SPONSORSHIP CREATED
// ============================================
exports.onSponsorshipCreated = functions.firestore
    .document('sponsorships/{sponsorshipId}')
    .onCreate(async (snap, context) => {
    const sponsorship = snap.data();
    await (0, helpers_1.createNotification)(sponsorship.sponsor_id, 'Nuevo patrocinio registrado', 'Tu patrocinio ha sido registrado exitosamente.', 'SPONSORSHIP', { sponsorship_id: context.params.sponsorshipId });
    await (0, helpers_1.updateImpactMetrics)();
});
// ============================================
// ON MILESTONE COMPLETED
// ============================================
exports.onMilestoneCompleted = functions.firestore
    .document('milestones/{milestoneId}')
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.status !== 'COMPLETED' && after.status === 'COMPLETED') {
        const milestones = await admin_1.db.collection('milestones')
            .where('sponsorship_id', '==', after.sponsorship_id)
            .get();
        const allCompleted = milestones.docs.every(doc => doc.data().status === 'COMPLETED');
        if (allCompleted) {
            await admin_1.db.collection('sponsorships').doc(after.sponsorship_id).update({
                status: 'COMPLETED',
                end_date: new Date().toISOString()
            });
            const sponsorship = await admin_1.db.collection('sponsorships').doc(after.sponsorship_id).get();
            const sponsorshipData = sponsorship.data();
            if (sponsorshipData) {
                const sponsor = await admin_1.db.collection('sponsors').doc(sponsorshipData.sponsor_id).get();
                const sponsorData = sponsor.data();
                if (sponsorData) {
                    await admin_1.db.collection('sponsors').doc(sponsorshipData.sponsor_id).update({
                        active_sponsorships: Math.max(0, sponsorData.active_sponsorships - 1)
                    });
                }
                await (0, helpers_1.createNotification)(sponsorshipData.sponsor_id, '¡Patrocinio completado!', 'Tu patrocinio ha sido completado exitosamente. ¡Gracias por tu apoyo!', 'SPONSORSHIP', { sponsorship_id: after.sponsorship_id });
            }
        }
    }
});
// ============================================
// ON REDEMPTION CREATED
// ============================================
exports.onRedemptionCreated = functions.firestore
    .document('redemptions/{redemptionId}')
    .onCreate(async (snap, context) => {
    var _a;
    const redemption = snap.data();
    // Deduct points from user
    const userRef = admin_1.db.collection('users').doc(redemption.user_id);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
        const currentPoints = ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.points) || 0;
        await userRef.update({ points: Math.max(0, currentPoints - redemption.points_cost) });
    }
    // Record points deduction
    await admin_1.db.collection('points_transactions').add({
        user_id: redemption.user_id,
        points: -redemption.points_cost,
        reason: 'REDEMPTION',
        reference_id: context.params.redemptionId,
        created_at: new Date().toISOString()
    });
    await (0, helpers_1.createNotification)(redemption.user_id, 'Canje registrado', `Tu canje de "${redemption.item_name}" ha sido registrado. Te contactaremos pronto.`, 'SYSTEM', { redemption_id: context.params.redemptionId });
});
// ============================================
// ON CAMP OCCUPANCY UPDATED
// ============================================
exports.onCampUpdated = functions.firestore
    .document('camps/{campId}')
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    // Alert if camp is near capacity
    if (after.current_occupancy > after.capacity * 0.9 && before.current_occupancy <= before.capacity * 0.9) {
        const coordinators = await admin_1.db.collection('users')
            .where('role', '==', 'COORDINATOR')
            .where('municipality', '==', after.zone)
            .get();
        for (const coord of coordinators.docs) {
            await (0, helpers_1.createNotification)(coord.id, '⚠️ Alerta de capacidad', `El campamento "${after.name}" está al ${Math.round((after.current_occupancy / after.capacity) * 100)}% de capacidad.`, 'SYSTEM', { camp_id: context.params.campId });
        }
    }
});
//# sourceMappingURL=index.js.map