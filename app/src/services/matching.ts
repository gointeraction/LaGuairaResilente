import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';

// ============================================
// TYPES
// ============================================

export type MatchStatus = 'PENDIENTE' | 'ASIGNADO' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
export type SponsorType = 'COMERCIAL' | 'CONECTIVIDAD' | 'INFRAESTRUCTURA';
export type BeneficiaryType = 'COMERCIANTE' | 'ESTUDIANTE' | 'EMPLEADO' | 'FAMILIA';

export interface Sponsor {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  company_type: string;
  logo_url: string | null;
  sponsorship_types: SponsorType[];
  total_budget_bs: number;
  total_budget_usd: number;
  allocated_bs: number;
  allocated_usd: number;
  beneficiaries_count: number;
  status: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  preferred_municipality: string;
  preferred_beneficiary_type: BeneficiaryType[];
  auto_match: boolean;
  created_at: any;
  updated_at: any;
}

export interface Beneficiary {
  id: string;
  user_id: string;
  full_name: string;
  municipality: string;
  camp_id: string;
  camp_name: string;
  beneficiary_type: BeneficiaryType;
  needs: string[];
  digital_literacy: 'BAJA' | 'MEDIA' | 'ALTA';
  has_device: boolean;
  has_internet: boolean;
  family_size: number;
  monthly_income_bs: number;
  status: 'ELEGIBLE' | 'EN_CAPACITACION' | 'EMPADRONADO' | 'EMPLEADO';
  points_balance: number;
  courses_completed: number;
  current_track: string | null;
  sponsor_id: string | null;
  created_at: any;
  updated_at: any;
}

export interface SponsorMatch {
  id: string;
  sponsor_id: string;
  sponsor_name: string;
  beneficiary_id: string;
  beneficiary_name: string;
  match_type: SponsorType;
  status: MatchStatus;
  match_score: number;
  match_reasons: string[];
  assistance_details: string;
  total_assistance_bs: number;
  total_assistance_usd: number;
  assigned_date: any;
  start_date: any;
  end_date: any;
  progress_percentage: number;
  modules_completed: number;
  modules_total: number;
  notes: string;
  created_at: any;
  updated_at: any;
}

export interface MatchingStats {
  total_sponsors: number;
  active_sponsors: number;
  total_beneficiaries: number;
  eligible_beneficiaries: number;
  total_matches: number;
  active_matches: number;
  completed_matches: number;
  pending_matches: number;
  total_assistance_bs: number;
  total_assistance_usd: number;
  average_match_score: number;
}

// ============================================
// SPONSORS DATA
// ============================================

export const SPONSORS_DATA: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    company_name: 'Banco Mercantil',
    contact_name: 'Roberto Méndez',
    contact_email: 'rmendez@mercantil.com',
    contact_phone: '+58 414-1002003',
    company_type: 'BANCO',
    logo_url: null,
    sponsorship_types: ['COMERCIAL', 'CONECTIVIDAD'],
    total_budget_bs: 500000,
    total_budget_usd: 12500,
    allocated_bs: 250000,
    allocated_usd: 6250,
    beneficiaries_count: 50,
    status: 'ACTIVO',
    preferred_municipality: 'Catia La Mar',
    preferred_beneficiary_type: ['COMERCIANTE', 'ESTUDIANTE'],
    auto_match: true
  },
  {
    company_name: 'Empresas Polar',
    contact_name: 'María Fernández',
    contact_email: 'mfernandez@polar.com',
    contact_phone: '+58 412-4005006',
    company_type: 'ALIMENTOS',
    logo_url: null,
    sponsorship_types: ['COMERCIAL'],
    total_budget_bs: 300000,
    total_budget_usd: 7500,
    allocated_bs: 150000,
    allocated_usd: 3750,
    beneficiaries_count: 30,
    status: 'ACTIVO',
    preferred_municipality: 'Maiquetía',
    preferred_beneficiary_type: ['COMERCIANTE'],
    auto_match: false
  },
  {
    company_name: 'Telefonía Móvil (Movilnet)',
    contact_name: 'Carlos López',
    contact_email: 'clopez@movilnet.com.ve',
    contact_phone: '+58 416-7008009',
    company_type: 'TELECOMUNICACIONES',
    logo_url: null,
    sponsorship_types: ['CONECTIVIDAD', 'INFRAESTRUCTURA'],
    total_budget_bs: 800000,
    total_budget_usd: 20000,
    allocated_bs: 400000,
    allocated_usd: 10000,
    beneficiaries_count: 100,
    status: 'ACTIVO',
    preferred_municipality: 'Macuto',
    preferred_beneficiary_type: ['ESTUDIANTE', 'EMPLEADO'],
    auto_match: true
  },
  {
    company_name: 'CAVECOM-E (Sede Central)',
    contact_name: 'Ing. Pedro Salazar',
    contact_email: 'psalazar@cavecom.org.ve',
    contact_phone: '+58 418-3004005',
    company_type: 'CÁMARA COMERCIAL',
    logo_url: null,
    sponsorship_types: ['COMERCIAL', 'CONECTIVIDAD', 'INFRAESTRUCTURA'],
    total_budget_bs: 1500000,
    total_budget_usd: 37500,
    allocated_bs: 750000,
    allocated_usd: 18750,
    beneficiaries_count: 200,
    status: 'ACTIVO',
    preferred_municipality: 'Caraballeda',
    preferred_beneficiary_type: ['COMERCIANTE', 'ESTUDIANTE', 'EMPLEADO', 'FAMILIA'],
    auto_match: true
  },
  {
    company_name: 'Coca-Cola FEMSA',
    contact_name: 'Ana Bolívar',
    contact_email: 'abolivar@cocacola.com',
    contact_phone: '+58 412-6007008',
    company_type: 'BEBIDAS',
    logo_url: null,
    sponsorship_types: ['COMERCIAL'],
    total_budget_bs: 200000,
    total_budget_usd: 5000,
    allocated_bs: 100000,
    allocated_usd: 2500,
    beneficiaries_count: 25,
    status: 'ACTIVO',
    preferred_municipality: 'Catia La Mar',
    preferred_beneficiary_type: ['COMERCIANTE'],
    auto_match: false
  }
];

// ============================================
// BENEFICIARIES DATA
// ============================================

export const BENEFICIARIES_DATA: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    user_id: 'USR-001',
    full_name: 'Juan Pérez',
    municipality: 'Catia La Mar',
    camp_id: 'CAMP-001',
    camp_name: 'Refugio Principal Catia La Mar',
    beneficiary_type: 'COMERCIANTE',
    needs: ['Reconstrucción negocio', 'Capacitación digital', 'Equipo'],
    digital_literacy: 'MEDIA',
    has_device: false,
    has_internet: false,
    family_size: 5,
    monthly_income_bs: 0,
    status: 'EN_CAPACITACION',
    points_balance: 450,
    courses_completed: 3,
    current_track: 'CONTINUIDAD_COMERCIAL',
    sponsor_id: null
  },
  {
    user_id: 'USR-002',
    full_name: 'María González',
    municipality: 'Maiquetía',
    camp_id: 'CAMP-002',
    camp_name: 'Centro Comunal Maiquetía',
    beneficiary_type: 'ESTUDIANTE',
    needs: ['Tablet', 'Plan de datos', 'Capacitación'],
    digital_literacy: 'BAJA',
    has_device: false,
    has_internet: false,
    family_size: 3,
    monthly_income_bs: 0,
    status: 'ELEGIBLE',
    points_balance: 150,
    courses_completed: 1,
    current_track: 'MICRO_OFICIOS',
    sponsor_id: null
  },
  {
    user_id: 'USR-003',
    full_name: 'Carlos Mendoza',
    municipality: 'Macuto',
    camp_id: 'CAMP-003',
    camp_name: 'Escuela Bolivariana Macuto',
    beneficiary_type: 'EMPLEADO',
    needs: ['Reconexión laboral', 'Capacitación técnica'],
    digital_literacy: 'ALTA',
    has_device: true,
    has_internet: true,
    family_size: 4,
    monthly_income_bs: 50000,
    status: 'EN_CAPACITACION',
    points_balance: 320,
    courses_completed: 4,
    current_track: 'LOGISTICA_SUMINISTROS',
    sponsor_id: null
  },
  {
    user_id: 'USR-004',
    full_name: 'Ana Rodríguez',
    municipality: 'Caraballeda',
    camp_id: 'CAMP-004',
    camp_name: 'Centro Deportivo Caraballeda',
    beneficiary_type: 'FAMILIA',
    needs: ['Alimentos', 'Medicamentos', 'Apoyo psicológico'],
    digital_literacy: 'BAJA',
    has_device: false,
    has_internet: false,
    family_size: 6,
    monthly_income_bs: 0,
    status: 'ELEGIBLE',
    points_balance: 80,
    courses_completed: 0,
    current_track: null,
    sponsor_id: null
  },
  {
    user_id: 'USR-005',
    full_name: 'Pedro Suárez',
    municipality: 'Catia La Mar',
    camp_id: 'CAMP-009',
    camp_name: 'Refugio Playa Grande',
    beneficiary_type: 'COMERCIANTE',
    needs: ['Reconstrucción tienda', 'Pasarela de pagos', 'Inventario'],
    digital_literacy: 'MEDIA',
    has_device: true,
    has_internet: false,
    family_size: 4,
    monthly_income_bs: 30000,
    status: 'EN_CAPACITACION',
    points_balance: 520,
    courses_completed: 5,
    current_track: 'CONTINUIDAD_COMERCIAL',
    sponsor_id: null
  }
];

// ============================================
// MATCHES DATA
// ============================================

export const MATCHES_DATA: Omit<SponsorMatch, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    sponsor_id: 'SPN-001',
    sponsor_name: 'Banco Mercantil',
    beneficiary_id: 'USR-001',
    beneficiary_name: 'Juan Pérez',
    match_type: 'COMERCIAL',
    status: 'EN_PROCESO',
    match_score: 92,
    match_reasons: [
      'Mismo municipio (Catia La Mar)',
      'Tipo de beneficiario coincide (Comerciante)',
      'Necesidades alineadas (Reconstrucción negocio)',
      'Alfabetización digital media (aptitud para capacitación)'
    ],
    assistance_details: 'Financiamiento reconstrucción tienda digital + tableta + curso completo',
    total_assistance_bs: 150000,
    total_assistance_usd: 3750,
    assigned_date: Timestamp.fromDate(new Date(Date.now() - 2592000000)),
    start_date: Timestamp.fromDate(new Date(Date.now() - 2592000000)),
    end_date: null,
    progress_percentage: 45,
    modules_completed: 4,
    modules_total: 8,
    notes: 'Avanzando bien en módulo de pagos digitales'
  },
  {
    sponsor_id: 'SPN-003',
    sponsor_name: 'Telefonía Móvil (Movilnet)',
    beneficiary_id: 'USR-002',
    beneficiary_name: 'María González',
    match_type: 'CONECTIVIDAD',
    status: 'ASIGNADO',
    match_score: 88,
    match_reasons: [
      'Tipo de necesidad: conectividad',
      'Alfabetización digital baja (requiere capacitación)',
      'Sin dispositivo propio',
      'Familia numerosa (prioridad social)'
    ],
    assistance_details: 'Tableta reacondicionada + plan datos 3 meses + asignación vida básica',
    total_assistance_bs: 80000,
    total_assistance_usd: 2000,
    assigned_date: Timestamp.fromDate(new Date(Date.now() - 864000000)),
    start_date: Timestamp.fromDate(new Date(Date.now() - 864000000)),
    end_date: null,
    progress_percentage: 20,
    modules_completed: 1,
    modules_total: 6,
    notes: 'Tableta entregada, esperando inicio de curso'
  },
  {
    sponsor_id: 'SPN-004',
    sponsor_name: 'CAVECOM-E (Sede Central)',
    beneficiary_id: 'USR-005',
    beneficiary_name: 'Pedro Suárez',
    match_type: 'COMERCIAL',
    status: 'EN_PROCESO',
    match_score: 95,
    match_reasons: [
      'Comerciante experimentado',
      'Ya tiene dispositivo',
      'Curso avanzado (5 módulos completados)',
      'Municipio priorizado (Catia La Mar)'
    ],
    assistance_details: 'Suscripción e-commerce + kit punto de venta + exención comisiones 6 meses',
    total_assistance_bs: 200000,
    total_assistance_usd: 5000,
    assigned_date: Timestamp.fromDate(new Date(Date.now() - 1728000000)),
    start_date: Timestamp.fromDate(new Date(Date.now() - 1728000000)),
    end_date: null,
    progress_percentage: 65,
    modules_completed: 5,
    modules_total: 8,
    notes: 'Casi listo para graduación, pendiente módulo de marketing digital'
  }
];

// ============================================
// MATCHING SERVICE
// ============================================

export const matchingService = {
  async getSponsors(): Promise<Sponsor[]> {
    const snapshot = await getDocs(collection(db, 'sponsors'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Sponsor[];
  },

  async getSponsorById(id: string): Promise<Sponsor | null> {
    const q = query(collection(db, 'sponsors'), where('id', '==', id));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Sponsor;
  },

  async getActiveSponsors(): Promise<Sponsor[]> {
    const q = query(collection(db, 'sponsors'), where('status', '==', 'ACTIVO'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Sponsor[];
  },

  async getBeneficiaries(): Promise<Beneficiary[]> {
    const snapshot = await getDocs(collection(db, 'beneficiaries'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Beneficiary[];
  },

  async getBeneficiaryById(id: string): Promise<Beneficiary | null> {
    const q = query(collection(db, 'beneficiaries'), where('id', '==', id));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Beneficiary;
  },

  async getEligibleBeneficiaries(): Promise<Beneficiary[]> {
    const q = query(collection(db, 'beneficiaries'), where('status', '==', 'ELEGIBLE'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Beneficiary[];
  },

  async getUnmatchedBeneficiaries(): Promise<Beneficiary[]> {
    const q = query(collection(db, 'beneficiaries'), where('sponsor_id', '==', null));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Beneficiary[];
  },

  async getMatches(): Promise<SponsorMatch[]> {
    const snapshot = await getDocs(collection(db, 'sponsor_matches'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SponsorMatch[];
  },

  async getMatchesBySponsor(sponsorId: string): Promise<SponsorMatch[]> {
    const q = query(collection(db, 'sponsor_matches'), where('sponsor_id', '==', sponsorId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SponsorMatch[];
  },

  async getMatchesByBeneficiary(beneficiaryId: string): Promise<SponsorMatch[]> {
    const q = query(collection(db, 'sponsor_matches'), where('beneficiary_id', '==', beneficiaryId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SponsorMatch[];
  },

  async getActiveMatches(): Promise<SponsorMatch[]> {
    const q = query(collection(db, 'sponsor_matches'), where('status', 'in', ['ASIGNADO', 'EN_PROCESO']));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SponsorMatch[];
  },

  async getMatchingStats(): Promise<MatchingStats> {
    const [sponsors, beneficiaries, matches] = await Promise.all([
      this.getSponsors(),
      this.getBeneficiaries(),
      this.getMatches()
    ]);

    const activeMatches = matches.filter(m => m.status === 'ASIGNADO' || m.status === 'EN_PROCESO');
    const completedMatches = matches.filter(m => m.status === 'COMPLETADO');
    const pendingMatches = matches.filter(m => m.status === 'PENDIENTE');

    return {
      total_sponsors: sponsors.length,
      active_sponsors: sponsors.filter(s => s.status === 'ACTIVO').length,
      total_beneficiaries: beneficiaries.length,
      eligible_beneficiaries: beneficiaries.filter(b => b.status === 'ELEGIBLE').length,
      total_matches: matches.length,
      active_matches: activeMatches.length,
      completed_matches: completedMatches.length,
      pending_matches: pendingMatches.length,
      total_assistance_bs: matches.reduce((sum, m) => sum + m.total_assistance_bs, 0),
      total_assistance_usd: matches.reduce((sum, m) => sum + m.total_assistance_usd, 0),
      average_match_score: matches.length > 0 
        ? matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length 
        : 0
    };
  },

  async calculateMatchScore(sponsor: Sponsor, beneficiary: Beneficiary): Promise<{score: number, reasons: string[]}> {
    let score = 0;
    const reasons: string[] = [];

    // Municipality match (+20)
    if (sponsor.preferred_municipality === beneficiary.municipality) {
      score += 20;
      reasons.push(`Mismo municipio (${beneficiary.municipality})`);
    }

    // Beneficiary type match (+25)
    if (sponsor.preferred_beneficiary_type.includes(beneficiary.beneficiary_type)) {
      score += 25;
      reasons.push(`Tipo de beneficiario coincide (${beneficiary.beneficiary_type})`);
    }

    // Sponsorship type alignment (+20)
    if (beneficiary.needs.some(n => n.includes('conectividad') || n.includes('Tablet') || n.includes('Plan de datos'))) {
      if (sponsor.sponsorship_types.includes('CONECTIVIDAD')) {
        score += 20;
        reasons.push('Necesidades de conectividad alineadas');
      }
    }
    if (beneficiary.needs.some(n => n.includes('negocio') || n.includes('tienda') || n.includes('e-commerce'))) {
      if (sponsor.sponsorship_types.includes('COMERCIAL')) {
        score += 20;
        reasons.push('Necesidades comerciales alineadas');
      }
    }

    // Digital literacy (+15)
    if (beneficiary.digital_literacy === 'BAJA') {
      score += 15;
      reasons.push('Requiere capacitación básica (beneficiario prioritario)');
    } else if (beneficiary.digital_literacy === 'MEDIA') {
      score += 10;
      reasons.push('Alfabetización digital media');
    } else {
      score += 5;
      reasons.push('Alfabetización digital alta');
    }

    // Family size (+10)
    if (beneficiary.family_size >= 5) {
      score += 10;
      reasons.push(`Familia numerosa (${beneficiary.family_size} miembros)`);
    } else if (beneficiary.family_size >= 3) {
      score += 5;
      reasons.push(`Familia de tamaño medio (${beneficiary.family_size} miembros)`);
    }

    // No device (+10)
    if (!beneficiary.has_device) {
      score += 10;
      reasons.push('Sin dispositivo propio (requiere dotación)');
    }

    // Course progress (+10)
    if (beneficiary.courses_completed >= 3) {
      score += 10;
      reasons.push(`Progreso avanzado (${beneficiary.courses_completed} cursos completados)`);
    } else if (beneficiary.courses_completed >= 1) {
      score += 5;
      reasons.push(`Progreso inicial (${beneficiary.courses_completed} cursos completados)`);
    }

    return { score: Math.min(score, 100), reasons };
  },

  async autoMatch(): Promise<SponsorMatch[]> {
    const sponsors = await this.getActiveSponsors();
    const unmatched = await this.getUnmatchedBeneficiaries();
    const matches: SponsorMatch[] = [];

    for (const sponsor of sponsors.filter(s => s.auto_match)) {
      for (const beneficiary of unmatched) {
        if (beneficiary.sponsor_id) continue;

        const { score, reasons } = await this.calculateMatchScore(sponsor, beneficiary);

        if (score >= 70) {
          const matchData: Omit<SponsorMatch, 'id' | 'created_at' | 'updated_at'> = {
            sponsor_id: sponsor.id,
            sponsor_name: sponsor.company_name,
            beneficiary_id: beneficiary.id,
            beneficiary_name: beneficiary.full_name,
            match_type: sponsor.sponsorship_types[0],
            status: 'PENDIENTE',
            match_score: score,
            match_reasons: reasons,
            assistance_details: 'Asignación automática basada en compatibilidad',
            total_assistance_bs: Math.floor(sponsor.total_budget_bs / sponsor.beneficiaries_count),
            total_assistance_usd: Math.floor(sponsor.total_budget_usd / sponsor.beneficiaries_count),
            assigned_date: Timestamp.now(),
            start_date: null,
            end_date: null,
            progress_percentage: 0,
            modules_completed: 0,
            modules_total: 0,
            notes: 'Match generado automáticamente'
          };

          const docRef = await addDoc(collection(db, 'sponsor_matches'), {
            ...matchData,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now()
          });

          matches.push({ id: docRef.id, ...matchData } as SponsorMatch);
        }
      }
    }

    return matches;
  },

  async createSponsor(sponsor: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'sponsors'), {
      ...sponsor,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async updateSponsor(id: string, updates: Partial<Sponsor>): Promise<void> {
    const docRef = doc(db, 'sponsors', id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: Timestamp.now()
    });
  },

  async createMatch(match: Omit<SponsorMatch, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'sponsor_matches'), {
      ...match,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async updateMatch(id: string, updates: Partial<SponsorMatch>): Promise<void> {
    const docRef = doc(db, 'sponsor_matches', id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: Timestamp.now()
    });
  },

  async updateMatchStatus(id: string, status: MatchStatus): Promise<void> {
    const docRef = doc(db, 'sponsor_matches', id);
    const updates: any = { status, updated_at: Timestamp.now() };
    
    if (status === 'COMPLETADO') {
      updates.end_date = Timestamp.now();
      updates.progress_percentage = 100;
    } else if (status === 'EN_PROCESO' || status === 'ASIGNADO') {
      updates.start_date = Timestamp.now();
    }
    
    await updateDoc(docRef, updates);
  }
};
