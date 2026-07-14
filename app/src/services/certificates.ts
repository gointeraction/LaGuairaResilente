import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';

// ============================================
// TYPES
// ============================================

export type CertificateType = 'MODULO' | 'CURSO' | 'TRACK' | 'ESPECIALIDAD';
export type CertificateStatus = 'EMITIDO' | 'VERIFICADO' | 'REVOCADO';

export interface Certificate {
  id: string;
  code: string;
  user_id: string;
  user_name: string;
  user_email: string;
  certificate_type: CertificateType;
  title: string;
  description: string;
  track_name: string | null;
  course_name: string | null;
  module_name: string | null;
  issued_date: any;
  expiry_date: any;
  status: CertificateStatus;
  qr_code: string;
  verification_url: string;
  issuer: string;
  issuer_signature: string;
  points_earned: number;
  hours_completed: number;
  skills_acquired: string[];
  created_at: any;
}

export interface VerificationResult {
  valid: boolean;
  certificate: Certificate | null;
  message: string;
}

export interface CertificateStats {
  total_issued: number;
  total_verified: number;
  total_revoked: number;
  by_type: Record<CertificateType, number>;
  by_track: Record<string, number>;
  by_municipality: Record<string, number>;
  monthly_issued: { month: string; count: number }[];
}

// ============================================
// CERTIFICATES DATA
// ============================================

export const CERTIFICATES_DATA: Omit<Certificate, 'id' | 'created_at'>[] = [
  {
    code: 'CERT-2025-001',
    user_id: 'USR-001',
    user_name: 'Juan Pérez',
    user_email: 'juan.perez@email.com',
    certificate_type: 'MODULO',
    title: 'Módulo: Pagos Digitales',
    description: 'Ha completado exitosamente el módulo de Pagos Digitales',
    track_name: null,
    course_name: 'Continuidad Comercial Digital',
    module_name: 'Pagos Digitales e Interbancarios',
    issued_date: Timestamp.fromDate(new Date(Date.now() - 2592000000)),
    expiry_date: Timestamp.fromDate(new Date(Date.now() + 31536000000)),
    status: 'EMITIDO',
    qr_code: 'QR-CERT-2025-001-VER',
    verification_url: 'https://laguaira-resiliente.com/verify/CERT-2025-001',
    issuer: 'CAVECOM-E',
    issuer_signature: 'SIG-CAVECOM-2025-001',
    points_earned: 25,
    hours_completed: 8,
    skills_acquired: ['Pagos móviles', 'Transferencias interbancarias', 'QR payments']
  },
  {
    code: 'CERT-2025-002',
    user_id: 'USR-001',
    user_name: 'Juan Pérez',
    user_email: 'juan.perez@email.com',
    certificate_type: 'CURSO',
    title: 'Curso: Continuidad Comercial Digital',
    description: 'Ha completado exitosamente el curso de Continuidad Comercial Digital',
    track_name: null,
    course_name: 'Continuidad Comercial Digital',
    module_name: null,
    issued_date: Timestamp.fromDate(new Date(Date.now() - 1728000000)),
    expiry_date: Timestamp.fromDate(new Date(Date.now() + 31536000000)),
    status: 'EMITIDO',
    qr_code: 'QR-CERT-2025-002-VER',
    verification_url: 'https://laguaira-resiliente.com/verify/CERT-2025-002',
    issuer: 'CAVECOM-E',
    issuer_signature: 'SIG-CAVECOM-2025-002',
    points_earned: 100,
    hours_completed: 40,
    skills_acquired: [
      'E-commerce',
      'Pagos digitales',
      'Logística',
      'Gestión financiera',
      'Marketing digital'
    ]
  },
  {
    code: 'CERT-2025-003',
    user_id: 'USR-003',
    user_name: 'Carlos Mendoza',
    user_email: 'carlos.mendoza@email.com',
    certificate_type: 'TRACK',
    title: 'Track: Logística de Suministros',
    description: 'Ha completado exitosamente el track de Logística de Suministros',
    track_name: 'Logística de Suministros',
    course_name: null,
    module_name: null,
    issued_date: Timestamp.fromDate(new Date(Date.now() - 864000000)),
    expiry_date: Timestamp.fromDate(new Date(Date.now() + 31536000000)),
    status: 'EMITIDO',
    qr_code: 'QR-CERT-2025-003-VER',
    verification_url: 'https://laguaira-resiliente.com/verify/CERT-2025-003',
    issuer: 'CAVECOM-E',
    issuer_signature: 'SIG-CAVECOM-2025-003',
    points_earned: 300,
    hours_completed: 25,
    skills_acquired: [
      'Almacenes inteligentes',
      'Ruteo óptimo',
      'Seguridad de envíos',
      'Apps de delivery'
    ]
  },
  {
    code: 'CERT-2025-004',
    user_id: 'USR-005',
    user_name: 'Pedro Suárez',
    user_email: 'pedro.suarez@email.com',
    certificate_type: 'TRACK',
    title: 'Track: Continuidad Comercial Digital',
    description: 'Ha completado exitosamente el track de Continuidad Comercial Digital',
    track_name: 'Continuidad Comercial Digital',
    course_name: null,
    module_name: null,
    issued_date: Timestamp.fromDate(new Date(Date.now() - 432000000)),
    expiry_date: Timestamp.fromDate(new Date(Date.now() + 31536000000)),
    status: 'EMITIDO',
    qr_code: 'QR-CERT-2025-004-VER',
    verification_url: 'https://laguaira-resiliente.com/verify/CERT-2025-004',
    issuer: 'CAVECOM-E',
    issuer_signature: 'SIG-CAVECOM-2025-004',
    points_earned: 300,
    hours_completed: 40,
    skills_acquired: [
      'Tienda en línea',
      'Pagos móviles',
      'Envíos nacionales',
      'Gestión financiera',
      'Logística última milla'
    ]
  }
];

// ============================================
// CERTIFICATE SERVICE
// ============================================

export const certificateService = {
  async getCertificates(): Promise<Certificate[]> {
    const snapshot = await getDocs(collection(db, 'certificates'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Certificate[];
  },

  async getCertificateById(id: string): Promise<Certificate | null> {
    const q = query(collection(db, 'certificates'), where('id', '==', id));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Certificate;
  },

  async getCertificateByCode(code: string): Promise<Certificate | null> {
    const q = query(collection(db, 'certificates'), where('code', '==', code));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Certificate;
  },

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    const q = query(collection(db, 'certificates'), where('user_id', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Certificate[];
  },

  async getCertificatesByTrack(trackName: string): Promise<Certificate[]> {
    const q = query(collection(db, 'certificates'), where('track_name', '==', trackName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Certificate[];
  },

  async verifyCertificate(code: string): Promise<VerificationResult> {
    const certificate = await this.getCertificateByCode(code);
    
    if (!certificate) {
      return {
        valid: false,
        certificate: null,
        message: 'Certificado no encontrado'
      };
    }

    if (certificate.status === 'REVOCADO') {
      return {
        valid: false,
        certificate,
        message: 'Certificado revocado'
      };
    }

    const now = new Date();
    const expiry = certificate.expiry_date?.toDate();
    if (expiry && expiry < now) {
      return {
        valid: false,
        certificate,
        message: 'Certificado expirado'
      };
    }

    return {
      valid: true,
      certificate,
      message: 'Certificado válido y verificado'
    };
  },

  async getCertificateStats(): Promise<CertificateStats> {
    const certificates = await this.getCertificates();
    
    const byType: Record<CertificateType, number> = {
      MODULO: 0,
      CURSO: 0,
      TRACK: 0,
      ESPECIALIDAD: 0
    };

    const byTrack: Record<string, number> = {};
    const byMunicipality: Record<string, number> = {};

    certificates.forEach(cert => {
      byType[cert.certificate_type]++;
      if (cert.track_name) {
        byTrack[cert.track_name] = (byTrack[cert.track_name] || 0) + 1;
      }
    });

    const monthlyIssued: Record<string, number> = {};
    certificates.forEach(cert => {
      const date = cert.issued_date?.toDate();
      if (date) {
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyIssued[month] = (monthlyIssued[month] || 0) + 1;
      }
    });

    return {
      total_issued: certificates.length,
      total_verified: certificates.filter(c => c.status === 'VERIFICADO').length,
      total_revoked: certificates.filter(c => c.status === 'REVOCADO').length,
      by_type: byType,
      by_track: byTrack,
      by_municipality: byMunicipality,
      monthly_issued: Object.entries(monthlyIssued)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({ month, count }))
    };
  },

  async generateCertificate(data: {
    user_id: string;
    user_name: string;
    user_email: string;
    certificate_type: CertificateType;
    title: string;
    description: string;
    track_name?: string;
    course_name?: string;
    module_name?: string;
    points_earned: number;
    hours_completed: number;
    skills_acquired: string[];
  }): Promise<string> {
    const code = `CERT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const qrCode = `QR-${code}-VER`;
    const verificationUrl = `https://laguaira-resiliente.com/verify/${code}`;

    const certificateData: Omit<Certificate, 'id' | 'created_at'> = {
      code,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      certificate_type: data.certificate_type,
      title: data.title,
      description: data.description,
      track_name: data.track_name || null,
      course_name: data.course_name || null,
      module_name: data.module_name || null,
      issued_date: Timestamp.now(),
      expiry_date: Timestamp.fromDate(new Date(Date.now() + 31536000000)),
      status: 'EMITIDO',
      qr_code: qrCode,
      verification_url: verificationUrl,
      issuer: 'CAVECOM-E',
      issuer_signature: `SIG-CAVECOM-${code}`,
      points_earned: data.points_earned,
      hours_completed: data.hours_completed,
      skills_acquired: data.skills_acquired
    };

    const docRef = await addDoc(collection(db, 'certificates'), {
      ...certificateData,
      created_at: Timestamp.now()
    });

    return docRef.id;
  },

  async generateModuleCertificate(userId: string, userName: string, userEmail: string, moduleName: string, courseName: string, points: number, hours: number): Promise<string> {
    return this.generateCertificate({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      certificate_type: 'MODULO',
      title: `Módulo: ${moduleName}`,
      description: `Ha completado exitosamente el módulo de ${moduleName}`,
      course_name: courseName,
      module_name: moduleName,
      points_earned: points,
      hours_completed: hours,
      skills_acquired: []
    });
  },

  async generateCourseCertificate(userId: string, userName: string, userEmail: string, courseName: string, points: number, hours: number, skills: string[]): Promise<string> {
    return this.generateCertificate({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      certificate_type: 'CURSO',
      title: `Curso: ${courseName}`,
      description: `Ha completado exitosamente el curso de ${courseName}`,
      course_name: courseName,
      points_earned: points,
      hours_completed: hours,
      skills_acquired: skills
    });
  },

  async generateTrackCertificate(userId: string, userName: string, userEmail: string, trackName: string, points: number, hours: number, skills: string[]): Promise<string> {
    return this.generateCertificate({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      certificate_type: 'TRACK',
      title: `Track: ${trackName}`,
      description: `Ha completado exitosamente el track de ${trackName}`,
      track_name: trackName,
      points_earned: points,
      hours_completed: hours,
      skills_acquired: skills
    });
  }
};
