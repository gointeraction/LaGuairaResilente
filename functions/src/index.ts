import * as admin from 'firebase-admin';
admin.initializeApp();

// ============================================
// TRIGGERS - Firestore
// ============================================
export { onUserCreated } from './triggers/index';
export { onEnrollmentCompleted } from './triggers/index';
export { onSponsorshipCreated } from './triggers/index';
export { onMilestoneCompleted } from './triggers/index';
export { onRedemptionCreated } from './triggers/index';
export { onCampUpdated } from './triggers/index';

// ============================================
// CALLABLE FUNCTIONS
// ============================================
export { getStudentTotalPoints } from './callable/index';
export { awardDailyAttendance } from './callable/index';
export { submitQuiz } from './callable/index';
export { awardReferral } from './callable/index';
export { autoMatchSponsors } from './callable/index';
export { approveUser } from './callable/index';

// ============================================
// SCHEDULED JOBS
// ============================================
export { scheduledMetricsUpdate } from './jobs/index';
export { scheduledStreakCheck } from './jobs/index';
export { scheduledMilestoneCheck } from './jobs/index';
export { scheduledWeeklyReport } from './jobs/index';
export { scheduledCampMonitor } from './jobs/index';

// ============================================
// HTTP FUNCTIONS
// ============================================
export { verifyCertificate } from './http/index';
export { getPublicStats } from './http/index';
export { processWebhook } from './http/index';
