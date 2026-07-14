// ============================================
// CORE TYPES
// ============================================

export type UserRole = 'ADMIN' | 'TRAINER' | 'STUDENT' | 'SPONSOR' | 'COORDINATOR';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
export type DigitalLiteracyLevel = 'NONE' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type Municipality = 'CATIA_LA_MAR' | 'MAIQUETIA' | 'MACUTO' | 'CARABALLEDA';

// ============================================
// USER TYPES
// ============================================

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  phone: string | null;
  cedula: string;
  municipality: Municipality;
  digital_literacy_level: DigitalLiteracyLevel;
  is_affected: boolean;
  camp_id: string | null;
}

// ============================================
// EDUCATION TYPES
// ============================================

export interface Track {
  id: string;
  name: string;
  description: string;
  module_count: number;
  duration_hours: number;
  icon: string;
  order: number;
  status: 'ACTIVE' | 'INACTIVE' | 'COMING_SOON';
}

export interface Course {
  id: string;
  track_id: string;
  title: string;
  description: string;
  module_number: number;
  total_modules: number;
  duration_minutes: number;
  content_type: 'VIDEO' | 'INTERACTIVE' | 'MIXED';
  video_url: string | null;
  document_url: string | null;
  thumbnail_url: string | null;
  quiz: Quiz | null;
  created_at: string;
  order: number;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passing_score: number;
  time_limit_minutes: number | null;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

// ============================================
// ENROLLMENT TYPES
// ============================================

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  track_id: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress_percent: number;
  completed_resources: string[];
  quiz_score: number | null;
  started_at: string;
  completed_at: string | null;
  last_accessed: string;
}

// ============================================
// RESILIENCE POINTS TYPES
// ============================================

export interface ResiliencePoint {
  id: string;
  student_id: string;
  points: number;
  reason: PointReason;
  reference_id: string | null;
  created_at: string;
}

export type PointReason = 
  | 'MODULE_COMPLETED'
  | 'QUIZ_PASSED'
  | 'COURSE_COMPLETED'
  | 'TRACK_COMPLETED'
  | 'DAILY_ATTENDANCE'
  | 'REFERRAL'
  | 'MANUAL_ADJUSTMENT'
  | 'REDEMPTION';

// ============================================
// SPONSOR TYPES
// ============================================

export interface Sponsor {
  uid: string;
  company_name: string;
  rif: string;
  company_type: 'NATIONAL' | 'MULTINATIONAL' | 'SME' | 'STARTUP';
  sector: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  logo_url: string | null;
  total_contribution: number;
  active_sponsorships: number;
  certification_status: 'NONE' | 'PENDING' | 'CERTIFIED' | 'EXPIRED';
  created_at: string;
}

// ============================================
// SPONSORSHIP TYPES
// ============================================

export interface Sponsorship {
  id: string;
  sponsor_id: string;
  type: 'COMMERCIAL' | 'CONNECTIVITY_TALENT' | 'INFRASTRUCTURE';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  beneficiary_id: string;
  beneficiary_type: 'INDIVIDUAL' | 'COMMUNITY' | 'BUSINESS';
  financial_contribution: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface SponsorshipPackage {
  id: string;
  name: string;
  type: 'INDIVIDUAL' | 'MUNICIPALITY';
  amount_usd: number;
  benefits: {
    seats_purchased: number;
    registration_fee_covered: boolean;
    certificacion_included: boolean;
  };
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  company_id: string;
  expires_at: string;
  created_at: string;
}

export interface GraduatesHiredReport {
  id: string;
  sponsorship_id: string;
  graduate_id: string;
  graduate_name: string;
  hired_at: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// ============================================
// CENSUS TYPES
// ============================================

export interface CensusSurvey {
  id: string;
  surveyor_id: string;
  respondent_name: string;
  respondent_cedula: string;
  municipality: Municipality;
  camp_id?: string;
  coordinates: { latitude: number; longitude: number };
  responses: CensusResponse[];
  status: 'SUBMITTED' | 'VERIFIED' | 'INVALID';
  timestamp: string;
}

export interface CensusResponse {
  question_id: string;
  answer: string | number | boolean;
  skipped: boolean;
}

// ============================================
// EMPLOYMENT TYPES
// ============================================

export interface Employment {
  id: string;
  graduate_id: string;
  company_id: string;
  opportunity_id: string;
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
  start_date: string;
  end_date?: string;
  created_at: string;
}

// ============================================
// MILESTONE TYPES
// ============================================

export interface Milestone {
  id: string;
  sponsorship_id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  target_date: string;
  completed_date?: string;
  created_at: string;
}

export type SponsorshipStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

// ============================================
// BENEFICIARY TYPES
// ============================================

export interface Beneficiary {
  id: string;
  anonymous_code: string;
  location: string;
  profile_type: string;
  digital_level: DigitalLiteracyLevel;
  track_interest: string[];
  needs: SponsorshipNeed[];
  priority_score: number;
  enrollment_status: string | null;
  total_resilience_points: number;
  created_at: string;
}

export interface SponsorshipNeed {
  type: string;
  description: string;
  estimated_cost: number;
}

// ============================================
// JOB TYPES
// ============================================

export interface JobOpportunity {
  id: string;
  company_id: string;
  company_name: string;
  title: string;
  description: string;
  type: 'REMOTE' | 'ONSITE' | 'HYBRID';
  modality: 'REMOTE' | 'HYBRID' | 'ONSITE';
  municipality: Municipality;
  requirements: string[];
  salary_min: number;
  salary_max: number;
  salary_usd?: number;
  employment_type: string;
  status: 'OPEN' | 'FILLED' | 'CLOSED';
  created_at: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'ENROLLMENT' | 'QUIZ_RESULT' | 'MILESTONE' | 'SPONSORSHIP' | 'SYSTEM';
  data: Record<string, string>;
  read: boolean;
  created_at: string;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface ImpactMetrics {
  total_beneficiaries: number;
  total_users: number;
  courses_completed: number;
  total_sponsorships_active: number;
  total_funds_raised: number;
  updated_at: string;
}
