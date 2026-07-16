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
exports.approveUser = exports.autoMatchSponsors = exports.awardReferral = exports.submitQuiz = exports.awardDailyAttendance = exports.getStudentTotalPoints = void 0;
const functions = __importStar(require("firebase-functions"));
const admin_1 = require("../lib/admin");
const helpers_1 = require("../lib/helpers");
// ============================================
// GET STUDENT TOTAL POINTS
// ============================================
exports.getStudentTotalPoints = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
    }
    const userDoc = await admin_1.db.collection('users').doc(data.studentId).get();
    const points = ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.points) || 0;
    return { totalPoints: points };
});
// ============================================
// AWARD DAILY ATTENDANCE
// ============================================
exports.awardDailyAttendance = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
    }
    const today = new Date().toISOString().split('T')[0];
    const existingPoints = await admin_1.db.collection('points_transactions')
        .where('user_id', '==', data.studentId)
        .where('reason', '==', 'DAILY_ATTENDANCE')
        .where('created_at', '>=', today)
        .get();
    if (!existingPoints.empty) {
        return { awarded: false, message: 'Ya se otorgaron puntos de asistencia hoy' };
    }
    await (0, helpers_1.awardPoints)(data.studentId, 5, 'DAILY_ATTENDANCE');
    return { awarded: true, points: 5 };
});
// ============================================
// SUBMIT QUIZ
// ============================================
exports.submitQuiz = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
    }
    const { courseId, answers, enrollmentId } = data;
    const courseDoc = await admin_1.db.collection('courses').doc(courseId).get();
    const course = courseDoc.data();
    if (!course || !course.quiz) {
        throw new functions.https.HttpsError('not-found', 'Curso o quiz no encontrado');
    }
    const quiz = course.quiz;
    let correctAnswers = 0;
    const processedAnswers = quiz.questions.map((question, index) => {
        const isCorrect = answers[index] === question.correct_answer;
        if (isCorrect)
            correctAnswers++;
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
    const docRef = await admin_1.db.collection('quiz_submissions').add(submission);
    await admin_1.db.collection('enrollments').doc(enrollmentId).update({
        quiz_score: score,
        status: passed ? 'COMPLETED' : 'FAILED',
        completed_at: passed ? new Date().toISOString() : null
    });
    if (passed) {
        await (0, helpers_1.awardPoints)(context.auth.uid, 25, 'QUIZ_PASSED', courseId);
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
exports.awardReferral = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
    }
    const { referredUserId } = data;
    // Award points to referrer
    await (0, helpers_1.awardPoints)(context.auth.uid, 50, 'REFERRAL', referredUserId);
    // Award points to referred user
    await (0, helpers_1.awardPoints)(referredUserId, 25, 'REFERRAL', context.auth.uid);
    // Notify both users
    await (0, helpers_1.createNotification)(context.auth.uid, '¡Referido exitoso!', 'Has ganado 50 puntos por referir a un amigo.', 'SYSTEM');
    await (0, helpers_1.createNotification)(referredUserId, '¡Bienvenido por referido!', 'Has ganado 25 puntos de bienvenida.', 'SYSTEM');
    return { success: true };
});
// ============================================
// AUTO-MATCH SPONSORS TO BENEFICIARIES
// ============================================
exports.autoMatchSponsors = functions.https.onCall(async (data, context) => {
    var _a, _b, _c;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
    }
    const userDoc = await admin_1.db.collection('users').doc(context.auth.uid).get();
    if (((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN' && ((_b = userDoc.data()) === null || _b === void 0 ? void 0 : _b.role) !== 'COORDINATOR') {
        throw new functions.https.HttpsError('permission-denied', 'No autorizado');
    }
    const sponsors = await admin_1.db.collection('sponsors').where('status', '==', 'ACTIVO').get();
    const beneficiaries = await admin_1.db.collection('beneficiaries')
        .where('enrollment_status', '==', null)
        .get();
    const matches = [];
    for (const sponsorDoc of sponsors.docs) {
        const sponsor = sponsorDoc.data();
        let bestMatch = null;
        let bestScore = 0;
        for (const benDoc of beneficiaries.docs) {
            const beneficiary = benDoc.data();
            // Calculate match score
            let score = 0;
            // Municipality match
            if (sponsor.zone === beneficiary.location)
                score += 30;
            // Type compatibility
            if (sponsor.type === 'CONECTIVIDAD' && beneficiary.digital_level === 'NONE')
                score += 25;
            if (sponsor.type === 'INFRAESTRUCTURA' && ((_c = beneficiary.needs) === null || _c === void 0 ? void 0 : _c.some((n) => n.type === 'INFRAESTRUCTURA')))
                score += 25;
            if (sponsor.type === 'COMERCIAL')
                score += 20;
            // Priority score from beneficiary
            score += (beneficiary.priority_score || 0) * 0.2;
            if (score > bestScore) {
                bestScore = score;
                bestMatch = Object.assign({ id: benDoc.id }, beneficiary);
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
        await admin_1.db.collection('sponsorships').add(Object.assign(Object.assign({}, match), { type: 'COMMERCIAL', beneficiary_type: 'INDIVIDUAL', financial_contribution: 0, start_date: new Date().toISOString(), created_at: new Date().toISOString() }));
    }
    return { matchesCreated: matches.length, matches };
});
// ============================================
// APPROVE USER
// ============================================
exports.approveUser = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Debe estar autenticado');
    }
    const adminDoc = await admin_1.db.collection('users').doc(context.auth.uid).get();
    if (((_a = adminDoc.data()) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN') {
        throw new functions.https.HttpsError('permission-denied', 'Solo admins pueden aprobar usuarios');
    }
    const { userId, approved } = data;
    await admin_1.db.collection('users').doc(userId).update({
        is_approved: approved,
        updated_at: new Date().toISOString()
    });
    await (0, helpers_1.createNotification)(userId, approved ? '¡Cuenta aprobada!' : 'Cuenta no aprobada', approved
        ? 'Tu cuenta ha sido aprobada. Ya puedes acceder a todas las funcionalidades.'
        : 'Tu cuenta no fue aprobada. Contacta al administrador.', 'SYSTEM');
    return { success: true };
});
//# sourceMappingURL=index.js.map