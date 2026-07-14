import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Track, Course, Enrollment } from '../types';

export const educationService = {
  // ============================================
  // TRACKS
  // ============================================
  
  async getTracks(): Promise<Track[]> {
    const q = query(
      collection(db, 'tracks'),
      where('status', '==', 'ACTIVE'),
      orderBy('order')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Track));
  },

  async getTrack(trackId: string): Promise<Track | null> {
    const docRef = doc(db, 'tracks', trackId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Track : null;
  },

  // ============================================
  // COURSES
  // ============================================

  async getCoursesByTrack(trackId: string): Promise<Course[]> {
    const q = query(
      collection(db, 'courses'),
      where('track_id', '==', trackId),
      orderBy('order')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  },

  async getCourse(courseId: string): Promise<Course | null> {
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Course : null;
  },

  async getAllCourses(): Promise<Course[]> {
    const q = query(collection(db, 'courses'), orderBy('order'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  },

  // ============================================
  // ENROLLMENTS
  // ============================================

  async enrollStudent(studentId: string, courseId: string, trackId: string): Promise<Enrollment> {
    // Check if already enrolled
    const existingEnrollment = await this.getStudentEnrollment(studentId, courseId);
    if (existingEnrollment) {
      throw new Error('Ya estás inscrito en este curso');
    }

    const enrollmentData = {
      student_id: studentId,
      course_id: courseId,
      track_id: trackId,
      status: 'NOT_STARTED',
      progress_percent: 0,
      completed_resources: [],
      quiz_score: null,
      started_at: new Date().toISOString(),
      completed_at: null,
      last_accessed: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'enrollments'), enrollmentData);
    return { id: docRef.id, ...enrollmentData } as Enrollment;
  },

  async getStudentEnrollment(studentId: string, courseId: string): Promise<Enrollment | null> {
    const q = query(
      collection(db, 'enrollments'),
      where('student_id', '==', studentId),
      where('course_id', '==', courseId)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Enrollment;
  },

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const q = query(
      collection(db, 'enrollments'),
      where('student_id', '==', studentId),
      orderBy('last_accessed', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment));
  },

  async updateEnrollmentProgress(
    enrollmentId: string, 
    updates: Partial<Pick<Enrollment, 'progress_percent' | 'completed_resources' | 'status' | 'last_accessed'>>
  ): Promise<void> {
    await updateDoc(doc(db, 'enrollments', enrollmentId), {
      ...updates,
      last_accessed: new Date().toISOString()
    });
  },

  async completeEnrollment(enrollmentId: string, quizScore: number): Promise<void> {
    await updateDoc(doc(db, 'enrollments', enrollmentId), {
      status: 'COMPLETED',
      progress_percent: 100,
      quiz_score: quizScore,
      completed_at: new Date().toISOString()
    });
  },

  // ============================================
  // PROGRESS TRACKING
  // ============================================

  async markResourceCompleted(enrollmentId: string, resourceId: string): Promise<void> {
    const enrollment = await getDoc(doc(db, 'enrollments', enrollmentId));
    if (!enrollment.exists()) throw new Error('Inscripción no encontrada');
    
    const data = enrollment.data() as Enrollment;
    const completedResources = [...new Set([...data.completed_resources, resourceId])];
    
    const course = await this.getCourse(data.course_id);
    const totalResources = course?.total_modules || 1;
    const progressPercent = Math.round((completedResources.length / totalResources) * 100);
    
    await updateDoc(doc(db, 'enrollments', enrollmentId), {
      completed_resources: completedResources,
      progress_percent: Math.min(progressPercent, 100),
      status: progressPercent >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
      last_accessed: new Date().toISOString()
    });
  }
};
