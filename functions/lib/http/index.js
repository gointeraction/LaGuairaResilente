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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWebhook = exports.getPublicStats = exports.verifyCertificate = void 0;
const functions = __importStar(require("firebase-functions"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = require("../lib/admin");
const corsHandler = (0, cors_1.default)({ origin: true });
// ============================================
// VERIFY CERTIFICATE (Public HTTP endpoint)
// ============================================
exports.verifyCertificate = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const { code } = req.query;
        if (!code || typeof code !== 'string') {
            res.status(400).json({ valid: false, error: 'Código de certificado requerido' });
            return;
        }
        const certSnapshot = await admin_1.db.collection('certificates')
            .where('verification_code', '==', code)
            .limit(1)
            .get();
        if (certSnapshot.empty) {
            res.status(404).json({ valid: false, error: 'Certificado no encontrado' });
            return;
        }
        const cert = certSnapshot.docs[0].data();
        const userDoc = await admin_1.db.collection('users').doc(cert.user_id).get();
        const user = userDoc.data();
        res.json({
            valid: true,
            certificate: {
                id: certSnapshot.docs[0].id,
                holder_name: (user === null || user === void 0 ? void 0 : user.full_name) || 'N/A',
                course_name: cert.course_name,
                track_name: cert.track_name,
                issued_at: cert.issued_at,
                completion_date: cert.completion_date,
            }
        });
    });
});
// ============================================
// GET PUBLIC STATS (No auth required)
// ============================================
exports.getPublicStats = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const metricsDoc = await admin_1.db.collection('impact_metrics').doc('current').get();
        const metrics = metricsDoc.data();
        const campsSnapshot = await admin_1.db.collection('camps')
            .where('status', '==', 'ACTIVO')
            .get();
        let totalCapacity = 0;
        let totalOccupancy = 0;
        campsSnapshot.docs.forEach(doc => {
            const camp = doc.data();
            totalCapacity += camp.capacity || 0;
            totalOccupancy += camp.current_occupancy || 0;
        });
        res.json({
            beneficiaries: (metrics === null || metrics === void 0 ? void 0 : metrics.total_beneficiaries) || 0,
            courses_completed: (metrics === null || metrics === void 0 ? void 0 : metrics.courses_completed) || 0,
            active_sponsorships: (metrics === null || metrics === void 0 ? void 0 : metrics.total_sponsorships_active) || 0,
            funds_raised: (metrics === null || metrics === void 0 ? void 0 : metrics.total_funds_raised) || 0,
            camp_capacity: totalCapacity,
            camp_occupancy: totalOccupancy,
        });
    });
});
// ============================================
// PROCESS WEBHOOK (External integrations)
// ============================================
exports.processWebhook = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        var _a;
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method not allowed' });
            return;
        }
        const { type, payload } = req.body;
        switch (type) {
            case 'PAYMENT_RECEIVED':
                // Handle payment confirmation
                if ((payload === null || payload === void 0 ? void 0 : payload.sponsor_id) && (payload === null || payload === void 0 ? void 0 : payload.amount)) {
                    const sponsorRef = admin_1.db.collection('sponsors').doc(payload.sponsor_id);
                    const sponsorDoc = await sponsorRef.get();
                    if (sponsorDoc.exists) {
                        const current = ((_a = sponsorDoc.data()) === null || _a === void 0 ? void 0 : _a.total_contribution) || 0;
                        await sponsorRef.update({
                            total_contribution: current + payload.amount
                        });
                    }
                }
                res.json({ processed: true });
                break;
            case 'DELIVERY_CONFIRMED':
                // Handle delivery confirmation
                if (payload === null || payload === void 0 ? void 0 : payload.delivery_id) {
                    await admin_1.db.collection('deliveries').doc(payload.delivery_id).update({
                        status: 'ENTREGADO',
                        confirmed_at: new Date().toISOString()
                    });
                }
                res.json({ processed: true });
                break;
            default:
                res.status(400).json({ error: `Unknown webhook type: ${type}` });
        }
    });
});
//# sourceMappingURL=index.js.map