"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWebhook = exports.getPublicStats = exports.verifyCertificate = exports.scheduledCampMonitor = exports.scheduledWeeklyReport = exports.scheduledMilestoneCheck = exports.scheduledStreakCheck = exports.scheduledMetricsUpdate = exports.approveUser = exports.autoMatchSponsors = exports.awardReferral = exports.submitQuiz = exports.awardDailyAttendance = exports.getStudentTotalPoints = exports.onCampUpdated = exports.onRedemptionCreated = exports.onMilestoneCompleted = exports.onSponsorshipCreated = exports.onEnrollmentCompleted = exports.onUserCreated = void 0;
// ============================================
// TRIGGERS - Firestore
// ============================================
var index_1 = require("./triggers/index");
Object.defineProperty(exports, "onUserCreated", { enumerable: true, get: function () { return index_1.onUserCreated; } });
var index_2 = require("./triggers/index");
Object.defineProperty(exports, "onEnrollmentCompleted", { enumerable: true, get: function () { return index_2.onEnrollmentCompleted; } });
var index_3 = require("./triggers/index");
Object.defineProperty(exports, "onSponsorshipCreated", { enumerable: true, get: function () { return index_3.onSponsorshipCreated; } });
var index_4 = require("./triggers/index");
Object.defineProperty(exports, "onMilestoneCompleted", { enumerable: true, get: function () { return index_4.onMilestoneCompleted; } });
var index_5 = require("./triggers/index");
Object.defineProperty(exports, "onRedemptionCreated", { enumerable: true, get: function () { return index_5.onRedemptionCreated; } });
var index_6 = require("./triggers/index");
Object.defineProperty(exports, "onCampUpdated", { enumerable: true, get: function () { return index_6.onCampUpdated; } });
// ============================================
// CALLABLE FUNCTIONS
// ============================================
var index_7 = require("./callable/index");
Object.defineProperty(exports, "getStudentTotalPoints", { enumerable: true, get: function () { return index_7.getStudentTotalPoints; } });
var index_8 = require("./callable/index");
Object.defineProperty(exports, "awardDailyAttendance", { enumerable: true, get: function () { return index_8.awardDailyAttendance; } });
var index_9 = require("./callable/index");
Object.defineProperty(exports, "submitQuiz", { enumerable: true, get: function () { return index_9.submitQuiz; } });
var index_10 = require("./callable/index");
Object.defineProperty(exports, "awardReferral", { enumerable: true, get: function () { return index_10.awardReferral; } });
var index_11 = require("./callable/index");
Object.defineProperty(exports, "autoMatchSponsors", { enumerable: true, get: function () { return index_11.autoMatchSponsors; } });
var index_12 = require("./callable/index");
Object.defineProperty(exports, "approveUser", { enumerable: true, get: function () { return index_12.approveUser; } });
// ============================================
// SCHEDULED JOBS
// ============================================
var index_13 = require("./jobs/index");
Object.defineProperty(exports, "scheduledMetricsUpdate", { enumerable: true, get: function () { return index_13.scheduledMetricsUpdate; } });
var index_14 = require("./jobs/index");
Object.defineProperty(exports, "scheduledStreakCheck", { enumerable: true, get: function () { return index_14.scheduledStreakCheck; } });
var index_15 = require("./jobs/index");
Object.defineProperty(exports, "scheduledMilestoneCheck", { enumerable: true, get: function () { return index_15.scheduledMilestoneCheck; } });
var index_16 = require("./jobs/index");
Object.defineProperty(exports, "scheduledWeeklyReport", { enumerable: true, get: function () { return index_16.scheduledWeeklyReport; } });
var index_17 = require("./jobs/index");
Object.defineProperty(exports, "scheduledCampMonitor", { enumerable: true, get: function () { return index_17.scheduledCampMonitor; } });
// ============================================
// HTTP FUNCTIONS
// ============================================
var index_18 = require("./http/index");
Object.defineProperty(exports, "verifyCertificate", { enumerable: true, get: function () { return index_18.verifyCertificate; } });
var index_19 = require("./http/index");
Object.defineProperty(exports, "getPublicStats", { enumerable: true, get: function () { return index_19.getPublicStats; } });
var index_20 = require("./http/index");
Object.defineProperty(exports, "processWebhook", { enumerable: true, get: function () { return index_20.processWebhook; } });
//# sourceMappingURL=index.js.map