import { db, auth } from './admin';

export async function updateImpactMetrics() {
  const usersSnapshot = await db.collection('users').get();
  const enrollmentsSnapshot = await db.collection('enrollments').get();
  const sponsorshipsSnapshot = await db.collection('sponsorships').get();

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

  await db.collection('impact_metrics').doc('current').set({
    total_beneficiaries: totalStudents,
    total_users: totalUsers,
    courses_completed: completedEnrollments,
    total_sponsorships_active: activeSponsorships,
    total_funds_raised: totalFunds,
    updated_at: new Date().toISOString()
  });
}

export async function createNotification(
  userId: string,
  title: string,
  body: string,
  type: string,
  data: Record<string, string> = {}
) {
  await db.collection('notifications').add({
    user_id: userId,
    title,
    body,
    type,
    data,
    read: false,
    created_at: new Date().toISOString()
  });
}

export async function awardPoints(
  userId: string,
  points: number,
  reason: string,
  referenceId: string | null = null
) {
  await db.collection('points_transactions').add({
    user_id: userId,
    points,
    reason,
    reference_id: referenceId,
    created_at: new Date().toISOString()
  });

  // Update user total points
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  if (userDoc.exists) {
    const currentPoints = userDoc.data()?.points || 0;
    await userRef.update({ points: currentPoints + points });
  }
}

export async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const userRecord = await auth.getUser(userId);
    return userRecord.email ?? null;
  } catch {
    return null;
  }
}
