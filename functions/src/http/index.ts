import * as functions from 'firebase-functions';
import * as cors from 'cors';
import { db } from '../lib/admin';

const corsHandler = cors({ origin: true });

// ============================================
// VERIFY CERTIFICATE (Public HTTP endpoint)
// ============================================
export const verifyCertificate = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ valid: false, error: 'Código de certificado requerido' });
      return;
    }

    const certSnapshot = await db.collection('certificates')
      .where('verification_code', '==', code)
      .limit(1)
      .get();

    if (certSnapshot.empty) {
      res.status(404).json({ valid: false, error: 'Certificado no encontrado' });
      return;
    }

    const cert = certSnapshot.docs[0].data();
    const userDoc = await db.collection('users').doc(cert.user_id).get();
    const user = userDoc.data();

    res.json({
      valid: true,
      certificate: {
        id: certSnapshot.docs[0].id,
        holder_name: user?.full_name || 'N/A',
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
export const getPublicStats = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const metricsDoc = await db.collection('impact_metrics').doc('current').get();
    const metrics = metricsDoc.data();

    const campsSnapshot = await db.collection('camps')
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
      beneficiaries: metrics?.total_beneficiaries || 0,
      courses_completed: metrics?.courses_completed || 0,
      active_sponsorships: metrics?.total_sponsorships_active || 0,
      funds_raised: metrics?.total_funds_raised || 0,
      camp_capacity: totalCapacity,
      camp_occupancy: totalOccupancy,
    });
  });
});

// ============================================
// PROCESS WEBHOOK (External integrations)
// ============================================
export const processWebhook = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { type, payload } = req.body;

    switch (type) {
      case 'PAYMENT_RECEIVED':
        // Handle payment confirmation
        if (payload?.sponsor_id && payload?.amount) {
          const sponsorRef = db.collection('sponsors').doc(payload.sponsor_id);
          const sponsorDoc = await sponsorRef.get();
          if (sponsorDoc.exists) {
            const current = sponsorDoc.data()?.total_contribution || 0;
            await sponsorRef.update({
              total_contribution: current + payload.amount
            });
          }
        }
        res.json({ processed: true });
        break;

      case 'DELIVERY_CONFIRMED':
        // Handle delivery confirmation
        if (payload?.delivery_id) {
          await db.collection('deliveries').doc(payload.delivery_id).update({
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
