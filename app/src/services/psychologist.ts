import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ============================================
// TYPES
// ============================================

export interface Psychologist {
  id: string;
  name: string;
  specialty: string;
  description: string;
  university: string;
  location: string;
  country: string;
  modality: 'ONLINE' | 'IN_PERSON' | 'BOTH';
  verification: string;
  phone: string;
  email: string;
  website?: string;
  instagram?: string;
  linkedin?: string;
  profile_image?: string;
  is_solidarity_network: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportNetworkRegistration {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  cedula: string;
  email: string;
  phone_prefix: string;
  phone: string;
  address: string;
  postal_code: string;
  locality: string;
  province: string;
  country: string;
  situation: 'STUDENT' | 'PROFESSIONAL' | 'OTHER';
  hours_confirmation: boolean;
  policy_acceptance: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

// ============================================
// PRE-LOADED PSYCHOLOGISTS (from directory)
// ============================================

const PRELOADED_PSYCHOLOGISTS: Omit<Psychologist, 'id'>[] = [
  {
    name: 'Luis E. Chesneau R.',
    specialty: 'Terapia psicodinámica/psicoanalítica',
    description: 'Trabajo ofreciendo una escucha atenta a lo que decidas traer a este espacio, acompañándote en la comprensión y atravesamiento de tus conflictos',
    university: 'Universidad Central de Venezuela, Nueva Escuela Lacaniana',
    location: 'Caracas',
    country: 'Venezuela',
    modality: 'BOTH',
    verification: 'FPV 15811',
    phone: '+584242291761',
    email: 'chesneau.luis@gmail.com',
    is_solidarity_network: true,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Marián Brando',
    specialty: 'Psicólogo clínico con enfoque Psicoanalítico',
    description: 'Soy Psicóloga formada en atención de adultos desde la perspectiva psicoanalítica. Te ofrezco un espacio de escucha para abordar lo que te preocupa y construir opciones que apunten hacia tu bienestar.',
    university: 'Universidad Central de Venezuela / Universidad Nacional de Colombia',
    location: 'Miami, Florida',
    country: 'Estados Unidos',
    modality: 'ONLINE',
    verification: 'FPV 6883',
    phone: '+17867102035',
    email: 'marian.brando@gmail.com',
    is_solidarity_network: true,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Oriana Valladares',
    specialty: 'Psicóloga Clínica y Psicoterapeuta Cognitivo Conductual',
    description: 'Acompaño a personas creativas en su proceso hacia el bienestar, integrando cuerpo, mente y expresión para fortalecer su identidad',
    university: 'Universidad Metropolitana / ISEP',
    location: 'Caracas',
    country: 'Venezuela',
    modality: 'BOTH',
    verification: 'FPV 11302',
    phone: '+584140109920',
    email: 'oriana.valladaresh@gmail.com',
    is_solidarity_network: true,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Ana Margarita Omaña',
    specialty: 'Médico Psiquiatra',
    description: 'Psiquiatra y Psicoterapeuta de jóvenes y adultos además del adulto mayor. Atención presencial en Caracas, Las Mercedes y Online todo el mundo',
    university: 'UCV',
    location: 'Caracas',
    country: 'Venezuela',
    modality: 'BOTH',
    verification: 'MPPS 40515',
    phone: '+584166234583',
    email: 'anampsiquiatra@gmail.com',
    is_solidarity_network: true,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Sofía Hernández',
    specialty: 'Psicóloga Psicoterapeuta',
    description: 'Psicóloga venezolana con experiencia en Psicoterapia Psicoanalítica. Acompaño a personas que atraviesan momentos de malestar emocional.',
    university: 'Universidad Central de Venezuela',
    location: 'Montevideo',
    country: 'Uruguay',
    modality: 'BOTH',
    verification: 'FPV 8804',
    phone: '+59891528373',
    email: 'psico.sofiahg@gmail.com',
    is_solidarity_network: true,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Alexis González (Msc)',
    specialty: 'Psicólogo Clínico Socio-Dinámico, Psicólogo del Deporte',
    description: 'Ayudo a que las personas construyan condiciones mentales para identificar el Sentido que tienen las dificultades cotidianas a las que se enfrentan',
    university: 'Universidad Central de Venezuela',
    location: 'Isla Margarita',
    country: 'Venezuela',
    modality: 'BOTH',
    verification: 'FPV 7026',
    phone: '+584148411587',
    email: 'alexisfgonzalez@gmail.com',
    is_solidarity_network: true,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Natalia Mudarra',
    specialty: 'Psicóloga Clínica – Psicoanalista de niños, adolescentes y adultos',
    description: 'Brindo acompañamiento profesional para ayudar a niños, adolescentes y adultos, incluyendo familias y parejas, a identificar, comprender y resolver conflictos emocionales.',
    university: 'UCAB / UCV / Asociación Panameña de Psicoanálisis',
    location: 'Ciudad de Panamá',
    country: 'Panamá',
    modality: 'BOTH',
    verification: 'FPV 6658 - MPPS 51',
    phone: '+50769693031',
    email: 'natmudarra@gmail.com',
    is_solidarity_network: true,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Yamila Guerrero',
    specialty: 'Psicólogo Clínico / Magister en Intervención en la Ansiedad y el Estrés',
    description: 'Terapia Cognitiva Conductual para la ansiedad, estrés, depresión, insomnio, comunicación, toma de decisiones, pareja.',
    university: 'UCV / Universidad Complutense de Madrid',
    location: 'Caracas',
    country: 'Venezuela',
    modality: 'BOTH',
    verification: 'FPV 5004',
    phone: '+584122277417',
    email: 'yamilaguerrero500@gmail.com',
    is_solidarity_network: true,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// ============================================
// PSYCHOLOGIST SERVICE
// ============================================

export const psychologistService = {
  // Initialize pre-loaded psychologists (call once)
  async initializePreloadedData(): Promise<void> {
    const existingDocs = await getDocs(collection(db, 'psychologists'));
    if (existingDocs.empty) {
      const batch = writeBatch(db);
      PRELOADED_PSYCHOLOGISTS.forEach((psych) => {
        const docRef = doc(collection(db, 'psychologists'));
        batch.set(docRef, psych);
      });
      await batch.commit();
    }
  },

  // Get all psychologists
  async getPsychologists(filters?: {
    country?: string;
    modality?: string;
    specialty?: string;
    is_solidarity_network?: boolean;
  }): Promise<Psychologist[]> {
    let q = query(collection(db, 'psychologists'), orderBy('name'));
    
    if (filters?.country) {
      q = query(q, where('country', '==', filters.country));
    }
    if (filters?.modality) {
      q = query(q, where('modality', '==', filters.modality));
    }
    if (filters?.is_solidarity_network !== undefined) {
      q = query(q, where('is_solidarity_network', '==', filters.is_solidarity_network));
    }
    
    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Psychologist));
    
    // Client-side filtering for specialty (partial match)
    if (filters?.specialty) {
      const search = filters.specialty.toLowerCase();
      results = results.filter(p => 
        p.specialty.toLowerCase().includes(search) ||
        p.name.toLowerCase().includes(search)
      );
    }
    
    return results;
  },

  // Get solidarity network psychologists
  async getSolidarityNetwork(): Promise<Psychologist[]> {
    return this.getPsychologists({ is_solidarity_network: true });
  },

  // Get psychologist by ID
  async getPsychologist(id: string): Promise<Psychologist | null> {
    const docRef = doc(db, 'psychologists', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Psychologist : null;
  },

  // Register for support network
  async registerForSupportNetwork(data: Omit<SupportNetworkRegistration, 'id' | 'status' | 'created_at'>): Promise<SupportNetworkRegistration> {
    const registration = {
      ...data,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'support_network_registrations'), registration);
    return { id: docRef.id, ...registration } as SupportNetworkRegistration;
  },

  // Get pending registrations (admin)
  async getPendingRegistrations(): Promise<SupportNetworkRegistration[]> {
    const q = query(
      collection(db, 'support_network_registrations'),
      where('status', '==', 'PENDING'),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportNetworkRegistration));
  },

  // Approve registration (admin)
  async approveRegistration(registrationId: string): Promise<void> {
    // Get registration data
    const regDoc = doc(db, 'support_network_registrations', registrationId);
    const regSnap = await getDoc(regDoc);
    
    if (regSnap.exists()) {
      const regData = regSnap.data() as SupportNetworkRegistration;
      
      const specialtyMap = {
        'PROFESSIONAL': 'Psicólogo Profesional',
        'STUDENT': 'Estudiante de Psicología',
        'OTHER': 'Voluntario de Apoyo'
      };
      
      // Create psychologist entry
      await addDoc(collection(db, 'psychologists'), {
        name: `${regData.first_name} ${regData.last_name}`,
        specialty: specialtyMap[regData.situation] || 'Especialista',
        description: `Voluntario de la Red de Apoyo Solidario. Dirección: ${regData.address || ''}, Localidad: ${regData.locality || ''}, Provincia: ${regData.province || ''}.`,
        university: regData.situation === 'STUDENT' ? 'Estudiante de Psicología' : 'N/A',
        location: regData.locality || '',
        country: regData.country || 'Venezuela',
        modality: 'ONLINE',
        verification: regData.cedula || 'N/A',
        phone: `${regData.phone_prefix || ''}${regData.phone || ''}`,
        email: regData.email || '',
        is_solidarity_network: true,
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      // Update registration status
      await updateDoc(regDoc, { status: 'APPROVED' });
    }
  },

  // Reject registration (admin)
  async rejectRegistration(registrationId: string, reason: string): Promise<void> {
    await updateDoc(doc(db, 'support_network_registrations', registrationId), {
      status: 'REJECTED',
      rejection_reason: reason
    });
  },

  // Get countries list
  getCountries(): string[] {
    return [
      'Venezuela',
      'Argentina',
      'Chile',
      'Colombia',
      'Ecuador',
      'España',
      'Estados Unidos',
      'México',
      'Panamá',
      'Perú',
      'Uruguay',
      'Otros'
    ];
  },

  // Get specialties list
  getSpecialties(): string[] {
    return [
      'Psicología Clínica',
      'Psicoterapia Cognitivo-Conductual',
      'Psicoanálisis',
      'Terapia Familiar',
      'Terapia de Pareja',
      'Neuropsicología',
      'Psicología Infantil',
      'Psicología del Deporte',
      'Psicología Organizacional',
      'Psiquiatría',
      'Arteterapia',
      'Coach Emocional',
      'Otros'
    ];
  }
};
