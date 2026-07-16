"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImpactMetrics = updateImpactMetrics;
exports.createNotification = createNotification;
exports.awardPoints = awardPoints;
exports.getUserEmail = getUserEmail;
const admin_1 = require("./admin");
async function updateImpactMetrics() {
    const usersSnapshot = await admin_1.db.collection('users').get();
    const enrollmentsSnapshot = await admin_1.db.collection('enrollments').get();
    const sponsorshipsSnapshot = await admin_1.db.collection('sponsorships').get();
    const totalUsers = usersSnapshot.size;
    const totalStudents = usersSnapshot.docs.filter(doc => doc.data().role === 'STUDENT').length;
    const completedEnrollments = enrollmentsSnapshot.docs.filter(doc => doc.data().status === 'COMPLETED').length;
    const activeSponsorships = sponsorshipsSnapshot.docs.filter(doc => doc.data().status === 'ACTIVE').length;
    let totalFunds = 0;
    sponsorshipsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'CANCELLED') {
            totalFunds += data.financial_contribution || 0;
        }
    });
    await admin_1.db.collection('impact_metrics').doc('current').set({
        total_beneficiaries: totalStudents,
        total_users: totalUsers,
        courses_completed: completedEnrollments,
        total_sponsorships_active: activeSponsorships,
        total_funds_raised: totalFunds,
        updated_at: new Date().toISOString()
    });
}
async function createNotification(userId, title, body, type, data = {}) {
    await admin_1.db.collection('notifications').add({
        user_id: userId,
        title,
        body,
        type,
        data,
        read: false,
        created_at: new Date().toISOString()
    });
}
async function awardPoints(userId, points, reason, referenceId = null) {
    var _a;
    await admin_1.db.collection('points_transactions').add({
        user_id: userId,
        points,
        reason,
        reference_id: referenceId,
        created_at: new Date().toISOString()
    });
    // Update user total points
    const userRef = admin_1.db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
        const currentPoints = ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.points) || 0;
        await userRef.update({ points: currentPoints + points });
    }
}
async function getUserEmail(userId) {
    var _a;
    try {
        const userRecord = await admin_1.auth.getUser(userId);
        return (_a = userRecord.email) !== null && _a !== void 0 ? _a : null;
    }
    catch (_b) {
        return null;
    }
}
//# sourceMappingURL=helpers.js.map