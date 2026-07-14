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
import type { JobOpportunity, Employment } from '../types';

export const employmentService = {
  // ============================================
  // JOB OPPORTUNITIES
  // ============================================

  async createJob(data: Omit<JobOpportunity, 'id' | 'created_at'>): Promise<JobOpportunity> {
    const jobData = {
      ...data,
      status: 'OPEN',
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'job_opportunities'), jobData);
    return { id: docRef.id, ...jobData } as JobOpportunity;
  },

  async getOpenJobs(): Promise<JobOpportunity[]> {
    const q = query(
      collection(db, 'job_opportunities'),
      where('status', '==', 'OPEN'),
      orderBy('created_at', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobOpportunity));
  },

  async getCompanyJobs(companyId: string): Promise<JobOpportunity[]> {
    const q = query(
      collection(db, 'job_opportunities'),
      where('company_id', '==', companyId),
      orderBy('created_at', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobOpportunity));
  },

  async getJob(jobId: string): Promise<JobOpportunity | null> {
    const docRef = doc(db, 'job_opportunities', jobId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as JobOpportunity : null;
  },

  async updateJobStatus(jobId: string, status: JobOpportunity['status']): Promise<void> {
    await updateDoc(doc(db, 'job_opportunities', jobId), { status });
  },

  // ============================================
  // EMPLOYMENTS
  // ============================================

  async createEmployment(data: Omit<Employment, 'id' | 'created_at'>): Promise<Employment> {
    const employmentData = {
      ...data,
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'employments'), employmentData);
    
    // Update job status to FILLED
    await this.updateJobStatus(data.opportunity_id, 'FILLED');
    
    return { id: docRef.id, ...employmentData } as Employment;
  },

  async getGraduateEmployments(graduateId: string): Promise<Employment[]> {
    const q = query(
      collection(db, 'employments'),
      where('graduate_id', '==', graduateId),
      orderBy('created_at', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employment));
  },

  async getCompanyEmployments(companyId: string): Promise<Employment[]> {
    const q = query(
      collection(db, 'employments'),
      where('company_id', '==', companyId),
      orderBy('created_at', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employment));
  },

  async updateEmploymentStatus(employmentId: string, status: Employment['status']): Promise<void> {
    await updateDoc(doc(db, 'employments', employmentId), { status });
  },

  // ============================================
  // MATCHING
  // ============================================

  async findMatchingJobs(graduateSkills: string[]): Promise<JobOpportunity[]> {
    const openJobs = await this.getOpenJobs();
    
    // Simple matching: check if any job requirement matches graduate skills
    return openJobs.filter(job => {
      const jobReqs = job.requirements.map(r => r.toLowerCase());
      return graduateSkills.some(skill => 
        jobReqs.some(req => req.includes(skill.toLowerCase()))
      );
    });
  }
};
