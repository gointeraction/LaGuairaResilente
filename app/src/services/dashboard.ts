import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalGraduates: number;
  totalCourses: number;
  totalSponsors: number;
  totalEmployments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalResiliencePoints: number;
  completionRate: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // Fetch all stats in parallel
    const [
      usersSnapshot,
      studentsSnapshot,
      graduatesSnapshot,
      coursesSnapshot,
      sponsorsSnapshot,
      employmentsSnapshot,
      enrollmentsSnapshot,
      completedSnapshot
    ] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(query(collection(db, 'users'), where('role', '==', 'STUDENT'))),
      getDocs(query(collection(db, 'users'), where('role', '==', 'GRADUATE'))),
      getDocs(collection(db, 'courses')),
      getDocs(query(collection(db, 'companies'), where('is_sponsor', '==', true))),
      getDocs(collection(db, 'employments')),
      getDocs(collection(db, 'enrollments')),
      getDocs(query(collection(db, 'enrollments'), where('status', '==', 'COMPLETED')))
    ]);

    const totalUsers = usersSnapshot.size;
    const totalStudents = studentsSnapshot.size;
    const totalGraduates = graduatesSnapshot.size;
    const totalCourses = coursesSnapshot.size;
    const totalSponsors = sponsorsSnapshot.size;
    const totalEmployments = employmentsSnapshot.size;
    const activeEnrollments = enrollmentsSnapshot.size;
    const completedEnrollments = completedSnapshot.size;

    const completionRate = activeEnrollments > 0 
      ? Math.round((completedEnrollments / activeEnrollments) * 100) 
      : 0;

    // Calculate total resilience points from all enrollments
    let totalResiliencePoints = 0;
    enrollmentsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalResiliencePoints += data.resilience_points_earned || 0;
    });

    return {
      totalUsers,
      totalStudents,
      totalGraduates,
      totalCourses,
      totalSponsors,
      totalEmployments,
      activeEnrollments,
      completedEnrollments,
      totalResiliencePoints,
      completionRate
    };
  },

  async getMunicipalityStats() {
    const municipalities = ['CATIA_LA_MAR', 'MAIQUETIA', 'MACUTO', 'CARABALLEDA'];
    
    const stats = await Promise.all(
      municipalities.map(async (m) => {
        const q = query(
          collection(db, 'users'),
          where('profile.municipality', '==', m)
        );
        const snapshot = await getDocs(q);
        return { municipality: m, count: snapshot.size };
      })
    );

    return stats;
  }
};
