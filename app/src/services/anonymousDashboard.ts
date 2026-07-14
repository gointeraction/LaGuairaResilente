// ============================================
// TYPES
// ============================================

import { Timestamp } from 'firebase/firestore';

export interface AnonymousBeneficiary {
  id: string;
  code: string;
  municipality: string;
  camp_name: string;
  beneficiary_type: string;
  digital_literacy: string;
  family_size: number;
  has_device: boolean;
  needs_summary: string[];
  status: string;
  current_track: string | null;
  courses_completed: number;
  points_balance: number;
  sponsor_id: string | null;
  match_score: number | null;
}

export interface SponsorDashboardStats {
  total_beneficiaries: number;
  active_beneficiaries: number;
  average_progress: number;
  total_courses_completed: number;
  total_points_awarded: number;
  beneficiaries_by_municipality: Record<string, number>;
  beneficiaries_by_type: Record<string, number>;
  beneficiaries_by_status: Record<string, number>;
  progress_distribution: {
    not_started: number;
    in_progress: number;
    completed: number;
  };
  monthly_activity: {
    month: string;
    active_users: number;
    courses_completed: number;
    points_awarded: number;
  }[];
}

export interface ImpactReport {
  id: string;
  sponsor_id: string;
  period: string;
  total_beneficiaries: number;
  active_beneficiaries: number;
  courses_completed: number;
  certificates_issued: number;
  points_awarded: number;
  average_progress: number;
  municipality_distribution: Record<string, number>;
  top_tracks: { track: string; count: number }[];
  highlights: string[];
  generated_at: any;
}

// ============================================
// ANONYMOUS DASHBOARD DATA
// ============================================

export const ANONYMOUS_BENEFICIARY_DATA: AnonymousBeneficiary[] = [
  {
    id: 'ANON-001',
    code: 'Familia 024 - Catia La Mar',
    municipality: 'Catia La Mar',
    camp_name: 'Refugio Principal Catia La Mar',
    beneficiary_type: 'COMERCIANTE',
    digital_literacy: 'MEDIA',
    family_size: 5,
    has_device: false,
    needs_summary: ['Reconstrucción negocio', 'Capacitación digital'],
    status: 'EN_CAPACITACION',
    current_track: 'CONTINUIDAD_COMERCIAL',
    courses_completed: 4,
    points_balance: 450,
    sponsor_id: 'SPN-001',
    match_score: 92
  },
  {
    id: 'ANON-002',
    code: 'Estudiante 112 - Macuto',
    municipality: 'Macuto',
    camp_name: 'Escuela Bolivariana Macuto',
    beneficiary_type: 'ESTUDIANTE',
    digital_literacy: 'BAJA',
    family_size: 3,
    has_device: false,
    needs_summary: ['Tablet', 'Plan de datos', 'Capacitación'],
    status: 'ELEGIBLE',
    current_track: 'MICRO_OFICIOS',
    courses_completed: 1,
    points_balance: 150,
    sponsor_id: 'SPN-003',
    match_score: 88
  },
  {
    id: 'ANON-003',
    code: 'Comerciante 089 - Maiquetía',
    municipality: 'Maiquetía',
    camp_name: 'Centro Comunal Maiquetía',
    beneficiary_type: 'COMERCIANTE',
    digital_literacy: 'ALTA',
    family_size: 4,
    has_device: true,
    needs_summary: ['Pasarela de pagos', 'Marketing digital'],
    status: 'EN_CAPACITACION',
    current_track: 'CONTINUIDAD_COMERCIAL',
    courses_completed: 6,
    points_balance: 680,
    sponsor_id: null,
    match_score: null
  },
  {
    id: 'ANON-004',
    code: 'Familia 156 - Caraballeda',
    municipality: 'Caraballeda',
    camp_name: 'Centro Deportivo Caraballeda',
    beneficiary_type: 'FAMILIA',
    digital_literacy: 'BAJA',
    family_size: 6,
    has_device: false,
    needs_summary: ['Alimentos', 'Medicamentos', 'Apoyo psicológico'],
    status: 'ELEGIBLE',
    current_track: null,
    courses_completed: 0,
    points_balance: 80,
    sponsor_id: null,
    match_score: null
  },
  {
    id: 'ANON-005',
    code: 'Operador 045 - Catia La Mar',
    municipality: 'Catia La Mar',
    camp_name: 'Refugio Playa Grande',
    beneficiary_type: 'EMPLEADO',
    digital_literacy: 'MEDIA',
    family_size: 4,
    has_device: true,
    needs_summary: ['Reconexión laboral', 'CRM'],
    status: 'EN_CAPACITACION',
    current_track: 'MICRO_OFICIOS',
    courses_completed: 3,
    points_balance: 320,
    sponsor_id: 'SPN-004',
    match_score: 85
  }
];

// ============================================
// ANONYMOUS DASHBOARD SERVICE
// ============================================

export const anonymousDashboardService = {
  async getAnonymousBeneficiaries(sponsorId?: string): Promise<AnonymousBeneficiary[]> {
    // In production, this would filter by sponsor_id
    // For now, return mock data
    let data = ANONYMOUS_BENEFICIARY_DATA;
    
    if (sponsorId) {
      data = data.filter(b => b.sponsor_id === sponsorId);
    }
    
    return data;
  },

  async getAnonymousBeneficiaryById(id: string): Promise<AnonymousBeneficiary | null> {
    return ANONYMOUS_BENEFICIARY_DATA.find(b => b.id === id) || null;
  },

  async getSponsorDashboardStats(sponsorId: string): Promise<SponsorDashboardStats> {
    const beneficiaries = await this.getAnonymousBeneficiaries(sponsorId);
    
    const byMunicipality: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    
    beneficiaries.forEach(b => {
      byMunicipality[b.municipality] = (byMunicipality[b.municipality] || 0) + 1;
      byType[b.beneficiary_type] = (byType[b.beneficiary_type] || 0) + 1;
      byStatus[b.status] = (byStatus[b.status] || 0) + 1;
    });

    const activeCount = beneficiaries.filter(b => b.status === 'EN_CAPACITACION').length;
    const totalCourses = beneficiaries.reduce((sum, b) => sum + b.courses_completed, 0);
    const totalPoints = beneficiaries.reduce((sum, b) => sum + b.points_balance, 0);

    return {
      total_beneficiaries: beneficiaries.length,
      active_beneficiaries: activeCount,
      average_progress: beneficiaries.length > 0 
        ? Math.round((totalCourses / (beneficiaries.length * 8)) * 100) 
        : 0,
      total_courses_completed: totalCourses,
      total_points_awarded: totalPoints,
      beneficiaries_by_municipality: byMunicipality,
      beneficiaries_by_type: byType,
      beneficiaries_by_status: byStatus,
      progress_distribution: {
        not_started: beneficiaries.filter(b => b.courses_completed === 0).length,
        in_progress: beneficiaries.filter(b => b.courses_completed > 0 && b.courses_completed < 8).length,
        completed: beneficiaries.filter(b => b.courses_completed >= 8).length
      },
      monthly_activity: [
        { month: 'Ene 2025', active_users: 45, courses_completed: 120, points_awarded: 2500 },
        { month: 'Feb 2025', active_users: 62, courses_completed: 180, points_awarded: 3800 },
        { month: 'Mar 2025', active_users: 78, courses_completed: 240, points_awarded: 5200 },
        { month: 'Abr 2025', active_users: 85, courses_completed: 310, points_awarded: 6800 },
        { month: 'May 2025', active_users: 92, courses_completed: 380, points_awarded: 8500 },
        { month: 'Jun 2025', active_users: 98, courses_completed: 450, points_awarded: 10200 }
      ]
    };
  },

  async generateImpactReport(sponsorId: string, period: string): Promise<ImpactReport> {
    const stats = await this.getSponsorDashboardStats(sponsorId);
    
    const topTracks = [
      { track: 'Continuidad Comercial Digital', count: 35 },
      { track: 'Micro-oficios Remotos', count: 28 },
      { track: 'Logística de Suministros', count: 15 }
    ];

    return {
      id: `RPT-IMP-${Date.now()}`,
      sponsor_id: sponsorId,
      period,
      total_beneficiaries: stats.total_beneficiaries,
      active_beneficiaries: stats.active_beneficiaries,
      courses_completed: stats.total_courses_completed,
      certificates_issued: Math.floor(stats.total_courses_completed * 0.3),
      points_awarded: stats.total_points_awarded,
      average_progress: stats.average_progress,
      municipality_distribution: stats.beneficiaries_by_municipality,
      top_tracks: topTracks,
      highlights: [
        `${stats.active_beneficiaries} beneficiarios activos en capacitación`,
        `${stats.total_courses_completed} módulos completados este período`,
        `${stats.total_points_awarded} puntos de resiliencia acumulados`,
        `${stats.average_progress}% de avance promedio`,
        `Presente en ${Object.keys(stats.beneficiaries_by_municipality).length} municipios`
      ],
      generated_at: Timestamp.now()
    };
  },

  async getImpactTimeline(_sponsorId: string): Promise<{date: string; active: number; completed: number}[]> {
    return [
      { date: '2025-01', active: 20, completed: 5 },
      { date: '2025-02', active: 35, completed: 12 },
      { date: '2025-03', active: 50, completed: 25 },
      { date: '2025-04', active: 65, completed: 40 },
      { date: '2025-05', active: 78, completed: 58 },
      { date: '2025-06', active: 92, completed: 75 }
    ];
  }
};
