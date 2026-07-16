import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  query, 
  where, 
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { 
  Sponsor, 
  Sponsorship, 
  Beneficiary,
  Milestone,
  SponsorshipStatus
} from '../types';

// ============================================================
// PUBLIC SPONSOR — types for the public registration portal
// ============================================================

export type SponsorType =
  | 'ECONOMIC'
  | 'TECH'
  | 'SPACE'
  | 'MEDIA'
  | 'TRAINING'
  | 'MATERIALS';

export type PublicSponsorStatus =
  | 'PENDING'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface PublicSponsorCommon {
  org_name:       string;
  contact_name:   string;
  email:          string;
  phone_prefix:   string;
  phone:          string;
  country:        string;
  city:           string;
  message:        string;
}

export interface EconomicData {
  amount_estimate: string;
  currency:        'USD' | 'VES' | 'EUR' | 'OTRO';
  frequency:       'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  contact_method:  string;
}

export interface TechData {
  resource_type:  'HARDWARE' | 'SOFTWARE' | 'SERVER_CLOUD' | 'CONNECTIVITY' | 'OTHER';
  description:    string;
  quantity:       string;
  available_now:  boolean;
  available_date: string;
}

export interface SpaceData {
  address:       string;
  capacity:      string;
  availability:  string;
  duration:      string;
  has_equipment: boolean;
  equipment_detail: string;
}

export interface MediaData {
  channel_type:   'SOCIAL_MEDIA' | 'TRADITIONAL' | 'PRESS' | 'PODCAST' | 'OTHER';
  platform_name:  string;
  estimated_reach: string;
  support_type:   string;
}

export interface TrainingData {
  specialty:      string;
  format:         'WORKSHOP' | 'TALK' | 'MENTORING' | 'WEBINAR';
  duration_hours: string;
  target_audience: string;
  availability:   string;
}

export interface MaterialsData {
  material_type:   string;
  description:     string;
  quantity:        string;
  covers_delivery: 'YES' | 'NO' | 'PARTIAL';
  current_location: string;
}

export interface PublicSponsorRegistration extends PublicSponsorCommon {
  id:             string;
  sponsor_type:   SponsorType;
  status:         PublicSponsorStatus;
  type_data:      EconomicData | TechData | SpaceData | MediaData | TrainingData | MaterialsData;
  tracking_code:  string;
  coordinator_notes: string;
  submitted_at:   string;
  updated_at:     string;
}

// ============================================================
// PUBLIC SPONSOR SERVICE
// ============================================================

function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SPO-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const publicSponsorService = {
  async submitPublicSponsor(
    data: PublicSponsorCommon & {
      sponsor_type: SponsorType;
      type_data: EconomicData | TechData | SpaceData | MediaData | TrainingData | MaterialsData;
    }
  ): Promise<{ tracking_code: string }> {
    const now = new Date().toISOString();
    const tracking_code = generateTrackingCode();

    const record = {
      ...data,
      status: 'PENDING' as PublicSponsorStatus,
      tracking_code,
      coordinator_notes: '',
      submitted_at: now,
      updated_at: now,
    };

    await addDoc(collection(db, 'public_sponsor_registrations'), record);
    return { tracking_code };
  },

  async getAllRegistrations(): Promise<PublicSponsorRegistration[]> {
    const q = query(
      collection(db, 'public_sponsor_registrations'),
      orderBy('submitted_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PublicSponsorRegistration));
  },

  async getRegistrationsByStatus(status: PublicSponsorStatus): Promise<PublicSponsorRegistration[]> {
    const q = query(
      collection(db, 'public_sponsor_registrations'),
      where('status', '==', status),
      orderBy('submitted_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PublicSponsorRegistration));
  },

  async updateStatus(
    id: string,
    status: PublicSponsorStatus,
    coordinator_notes?: string
  ): Promise<void> {
    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (coordinator_notes !== undefined) {
      updates.coordinator_notes = coordinator_notes;
    }
    await updateDoc(doc(db, 'public_sponsor_registrations', id), updates);
  },

  async addNote(id: string, note: string): Promise<void> {
    await updateDoc(doc(db, 'public_sponsor_registrations', id), {
      coordinator_notes: note,
      updated_at: new Date().toISOString(),
    });
  },
};

// ============================================================
// ORIGINAL SPONSORSHIP SERVICE (unchanged)
// ============================================================

export const sponsorshipService = {
  // ============================================
  // SPONSORS
  // ============================================

  async createSponsor(uid: string, data: Omit<Sponsor, 'uid' | 'total_contribution' | 'active_sponsorships' | 'certification_status' | 'created_at'>): Promise<Sponsor> {
    const sponsorData: Sponsor = {
      uid,
      ...data,
      total_contribution: 0,
      active_sponsorships: 0,
      certification_status: 'NONE',
      created_at: new Date().toISOString()
    };

    await setDoc(doc(db, 'sponsors', uid), sponsorData);
    return sponsorData;
  },

  async getSponsor(uid: string): Promise<Sponsor | null> {
    const docRef = doc(db, 'sponsors', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { uid: docSnap.id, ...docSnap.data() } as Sponsor : null;
  },

  async updateSponsor(uid: string, updates: Partial<Sponsor>): Promise<void> {
    await updateDoc(doc(db, 'sponsors', uid), updates);
  },

  // ============================================
  // BENEFICIARIES (Anonymous profiles)
  // ============================================

  async getAvailableBeneficiaries(): Promise<Beneficiary[]> {
    const q = query(
      collection(db, 'beneficiaries'),
      where('enrollment_status', 'in', ['IN_PROGRESS', 'COMPLETED']),
      orderBy('priority_score', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Beneficiary));
  },

  async getBeneficiary(beneficiaryId: string): Promise<Beneficiary | null> {
    const docRef = doc(db, 'beneficiaries', beneficiaryId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Beneficiary : null;
  },

  async updateBeneficiary(beneficiaryId: string, updates: Partial<Beneficiary>): Promise<void> {
    await updateDoc(doc(db, 'beneficiaries', beneficiaryId), updates);
  },

  // ============================================
  // SPONSORSHIPS
  // ============================================

  async createSponsorship(data: Omit<Sponsorship, 'id' | 'created_at'>): Promise<Sponsorship> {
    const sponsorshipData = {
      ...data,
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'sponsorships'), sponsorshipData);
    
    const sponsorDoc = await getDoc(doc(db, 'sponsors', data.sponsor_id));
    if (sponsorDoc.exists()) {
      const sponsor = sponsorDoc.data() as Sponsor;
      await updateDoc(doc(db, 'sponsors', data.sponsor_id), {
        active_sponsorships: sponsor.active_sponsorships + 1,
        total_contribution: sponsor.total_contribution + data.financial_contribution
      });
    }

    return { id: docRef.id, ...sponsorshipData } as Sponsorship;
  },

  async getSponsorSponsorships(sponsorId: string): Promise<Sponsorship[]> {
    const q = query(
      collection(db, 'sponsorships'),
      where('sponsor_id', '==', sponsorId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsorship));
  },

  async getActiveSponsorships(sponsorId: string): Promise<Sponsorship[]> {
    const q = query(
      collection(db, 'sponsorships'),
      where('sponsor_id', '==', sponsorId),
      where('status', '==', 'ACTIVE'),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsorship));
  },

  async getSponsorship(sponsorshipId: string): Promise<Sponsorship | null> {
    const docRef = doc(db, 'sponsorships', sponsorshipId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Sponsorship : null;
  },

  async updateSponsorshipStatus(sponsorshipId: string, status: SponsorshipStatus): Promise<void> {
    await updateDoc(doc(db, 'sponsorships', sponsorshipId), { status });
  },

  // ============================================
  // MILESTONES
  // ============================================

  async createMilestone(data: Omit<Milestone, 'id'>): Promise<Milestone> {
    const docRef = await addDoc(collection(db, 'milestones'), data);
    return { id: docRef.id, ...data } as Milestone;
  },

  async getSponsorshipMilestones(sponsorshipId: string): Promise<Milestone[]> {
    const q = query(
      collection(db, 'milestones'),
      where('sponsorship_id', '==', sponsorshipId),
      orderBy('target_date')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Milestone));
  },

  async updateMilestoneStatus(milestoneId: string, status: Milestone['status']): Promise<void> {
    const updates: Partial<Milestone> = { status };
    if (status === 'COMPLETED') {
      updates.completed_date = new Date().toISOString();
    }
    await updateDoc(doc(db, 'milestones', milestoneId), updates);
  },

  // ============================================
  // DASHBOARD DATA
  // ============================================

  async getSponsorDashboard(sponsorId: string) {
    const sponsor = await this.getSponsor(sponsorId);
    const sponsorships = await this.getSponsorSponsorships(sponsorId);
    const activeSponsorships = sponsorships.filter(s => s.status === 'ACTIVE');
    
    const allMilestones: Milestone[] = [];
    for (const sponsorship of activeSponsorships) {
      const milestones = await this.getSponsorshipMilestones(sponsorship.id);
      allMilestones.push(...milestones);
    }

    const completedMilestones = allMilestones.filter(m => m.status === 'COMPLETED');
    const totalMilestones = allMilestones.length;

    return {
      sponsor,
      totalSponsorships: sponsorships.length,
      activeSponsorships: activeSponsorships.length,
      completedMilestones,
      totalMilestones,
      completionRate: totalMilestones > 0 ? (completedMilestones.length / totalMilestones) * 100 : 0,
      totalContribution: sponsor?.total_contribution || 0
    };
  }
};
