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

export type CampStatus = 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO' | 'EVACUADO';
export type CampZone = 'CATIA_LA_MAR' | 'MAIQUETIA' | 'MACUTO' | 'CARABALLEDA';

export interface Camp {
  id: string;
  name: string;
  code: string;
  municipality: string;
  zone: CampZone;
  address: string;
  coordinates: { lat: number; lng: number };
  capacity: number;
  current_occupancy: number;
  status: CampStatus;
  type: 'TRANSITORIO' | 'REFUGIO' | 'CENTRO_OPERACIONES';
  amenities: string[];
  contact_name: string;
  contact_phone: string;
  coordinator_id: string | null;
  coordinator_name: string | null;
  wifi_available: boolean;
  solar_power: boolean;
  water_available: boolean;
  medical_post: boolean;
  food_distribution: boolean;
  education_area: boolean;
  created_at: any;
  updated_at: any;
}

export interface CampStats {
  total_camps: number;
  active_camps: number;
  total_capacity: number;
  total_occupancy: number;
  camps_with_wifi: number;
  camps_with_solar: number;
  camps_with_medical: number;
  camps_with_food: number;
}

// ============================================
// 15 CAMPS DATA
// ============================================

export const CAMPS_DATA: Omit<Camp, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    code: 'CAMP-001',
    name: 'Refugio Principal Catia La Mar',
    municipality: 'Catia La Mar',
    zone: 'CATIA_LA_MAR',
    address: 'Av. Principal, Catia La Mar',
    coordinates: { lat: 10.6012, lng: -66.8864 },
    capacity: 500,
    current_occupancy: 320,
    status: 'ACTIVO',
    type: 'REFUGIO',
    amenities: ['WiFi', 'Solar', 'Agua', 'Comedor', 'Salón Educativo'],
    contact_name: 'María García',
    contact_phone: '+58 412-1234567',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: true,
    water_available: true,
    medical_post: true,
    food_distribution: true,
    education_area: true
  },
  {
    code: 'CAMP-002',
    name: 'Centro Comunal Maiquetía',
    municipality: 'Maiquetía',
    zone: 'MAIQUETIA',
    address: 'Calle 5, Maiquetía',
    coordinates: { lat: 10.6000, lng: -66.9333 },
    capacity: 350,
    current_occupancy: 280,
    status: 'ACTIVO',
    type: 'TRANSITORIO',
    amenities: ['WiFi', 'Agua', 'Comedor'],
    contact_name: 'Carlos Rodríguez',
    contact_phone: '+58 414-2345678',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: false,
    water_available: true,
    medical_post: false,
    food_distribution: true,
    education_area: false
  },
  {
    code: 'CAMP-003',
    name: 'Escuela Bolivariana Macuto',
    municipality: 'Macuto',
    zone: 'MACUTO',
    address: 'Av. 5 de Julio, Macuto',
    coordinates: { lat: 10.6100, lng: -66.9000 },
    capacity: 400,
    current_occupancy: 310,
    status: 'ACTIVO',
    type: 'REFUGIO',
    amenities: ['WiFi', 'Solar', 'Agua', 'Comedor', 'Salón Educativo', 'Área Médica'],
    contact_name: 'Ana Martínez',
    contact_phone: '+58 416-3456789',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: true,
    water_available: true,
    medical_post: true,
    food_distribution: true,
    education_area: true
  },
  {
    code: 'CAMP-004',
    name: 'Centro Deportivo Caraballeda',
    municipality: 'Caraballeda',
    zone: 'CARABALLEDA',
    address: 'Calle Principal, Caraballeda',
    coordinates: { lat: 10.6200, lng: -66.8500 },
    capacity: 300,
    current_occupancy: 190,
    status: 'ACTIVO',
    type: 'TRANSITORIO',
    amenities: ['WiFi', 'Agua', 'Comedor'],
    contact_name: 'Luis Hernández',
    contact_phone: '+58 418-4567890',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: false,
    water_available: true,
    medical_post: false,
    food_distribution: true,
    education_area: false
  },
  {
    code: 'CAMP-005',
    name: 'Refugio temporal La Guaira Centro',
    municipality: 'Catia La Mar',
    zone: 'CATIA_LA_MAR',
    address: 'Av. Libertador, Catia La Mar',
    coordinates: { lat: 10.6050, lng: -66.8800 },
    capacity: 250,
    current_occupancy: 200,
    status: 'ACTIVO',
    type: 'TRANSITORIO',
    amenities: ['WiFi', 'Agua'],
    contact_name: 'Pedro López',
    contact_phone: '+58 412-5678901',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: false,
    water_available: true,
    medical_post: false,
    food_distribution: false,
    education_area: false
  },
  {
    code: 'CAMP-006',
    name: 'Centro Social Maiquetía Norte',
    municipality: 'Maiquetía',
    zone: 'MAIQUETIA',
    address: 'Urb. El Paraíso, Maiquetía',
    coordinates: { lat: 10.6100, lng: -66.9400 },
    capacity: 200,
    current_occupancy: 150,
    status: 'ACTIVO',
    type: 'TRANSITORIO',
    amenities: ['WiFi', 'Solar', 'Comedor'],
    contact_name: 'Rosa Díaz',
    contact_phone: '+58 414-6789012',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: true,
    water_available: false,
    medical_post: false,
    food_distribution: true,
    education_area: false
  },
  {
    code: 'CAMP-007',
    name: 'Instalación Deportiva Macuto',
    municipality: 'Macuto',
    zone: 'MACUTO',
    address: 'Polideportivo Macuto',
    coordinates: { lat: 10.6150, lng: -66.9050 },
    capacity: 280,
    current_occupancy: 220,
    status: 'ACTIVO',
    type: 'TRANSITORIO',
    amenities: ['WiFi', 'Agua', 'Comedor'],
    contact_name: 'Jorge Suárez',
    contact_phone: '+58 416-7890123',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: false,
    water_available: true,
    medical_post: false,
    food_distribution: true,
    education_area: false
  },
  {
    code: 'CAMP-008',
    name: 'Centro Comunal Caraballeda Sur',
    municipality: 'Caraballeda',
    zone: 'CARABALLEDA',
    address: 'Av. Costanera, Caraballeda',
    coordinates: { lat: 10.6250, lng: -66.8550 },
    capacity: 180,
    current_occupancy: 120,
    status: 'ACTIVO',
    type: 'TRANSITORIO',
    amenities: ['WiFi', 'Agua'],
    contact_name: 'Carmen Rivas',
    contact_phone: '+58 418-8901234',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: false,
    water_available: true,
    medical_post: false,
    food_distribution: false,
    education_area: false
  },
  {
    code: 'CAMP-009',
    name: 'Refugio Playa Grande',
    municipality: 'Catia La Mar',
    zone: 'CATIA_LA_MAR',
    address: 'Playa Grande, Catia La Mar',
    coordinates: { lat: 10.5950, lng: -66.8900 },
    capacity: 320,
    current_occupancy: 270,
    status: 'ACTIVO',
    type: 'REFUGIO',
    amenities: ['WiFi', 'Solar', 'Agua', 'Comedor', 'Área Médica'],
    contact_name: 'Miguel Torres',
    contact_phone: '+58 412-9012345',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: true,
    water_available: true,
    medical_post: true,
    food_distribution: true,
    education_area: false
  },
  {
    code: 'CAMP-010',
    name: 'Centro Operaciones Maiquetía',
    municipality: 'Maiquetía',
    zone: 'MAIQUETIA',
    address: 'Base Aérea, Maiquetía',
    coordinates: { lat: 10.5980, lng: -66.9350 },
    capacity: 450,
    current_occupancy: 380,
    status: 'ACTIVO',
    type: 'CENTRO_OPERACIONES',
    amenities: ['WiFi', 'Solar', 'Agua', 'Comedor', 'Salón Educativo', 'Área Médica'],
    contact_name: 'Comandante Rodríguez',
    contact_phone: '+58 414-0123456',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: true,
    water_available: true,
    medical_post: true,
    food_distribution: true,
    education_area: true
  },
  {
    code: 'CAMP-011',
    name: 'Escuela Urbana Macuto',
    municipality: 'Macuto',
    zone: 'MACUTO',
    address: 'Calle Principal, Macuto',
    coordinates: { lat: 10.6120, lng: -66.9020 },
    capacity: 220,
    current_occupancy: 180,
    status: 'ACTIVO',
    type: 'TRANSITORIO',
    amenities: ['WiFi', 'Agua', 'Comedor'],
    contact_name: 'Teresa Pérez',
    contact_phone: '+58 416-1234567',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: false,
    water_available: true,
    medical_post: false,
    food_distribution: true,
    education_area: false
  },
  {
    code: 'CAMP-012',
    name: 'Centro de Salud Caraballeda',
    municipality: 'Caraballeda',
    zone: 'CARABALLEDA',
    address: 'Av. Principal, Caraballeda',
    coordinates: { lat: 10.6220, lng: -66.8520 },
    capacity: 150,
    current_occupancy: 90,
    status: 'ACTIVO',
    type: 'TRANSITORIO',
    amenities: ['WiFi', 'Agua', 'Área Médica'],
    contact_name: 'Dr. Carlos Mendoza',
    contact_phone: '+58 418-2345678',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: false,
    water_available: true,
    medical_post: true,
    food_distribution: false,
    education_area: false
  },
  {
    code: 'CAMP-013',
    name: 'Albergue Temporal La Guaira',
    municipality: 'Catia La Mar',
    zone: 'CATIA_LA_MAR',
    address: 'Av. Costanera, La Guaira',
    coordinates: { lat: 10.6030, lng: -66.8830 },
    capacity: 280,
    current_occupancy: 230,
    status: 'ACTIVO',
    type: 'TRANSITORIO',
    amenities: ['WiFi', 'Solar', 'Agua', 'Comedor'],
    contact_name: 'Fernando Castro',
    contact_phone: '+58 412-3456789',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: true,
    water_available: true,
    medical_post: false,
    food_distribution: true,
    education_area: false
  },
  {
    code: 'CAMP-014',
    name: 'Centro de Capacitación Maiquetía',
    municipality: 'Maiquetía',
    zone: 'MAIQUETIA',
    address: 'Av. 12 de Octubre, Maiquetía',
    coordinates: { lat: 10.6070, lng: -66.9380 },
    capacity: 300,
    current_occupancy: 240,
    status: 'ACTIVO',
    type: 'CENTRO_OPERACIONES',
    amenities: ['WiFi', 'Solar', 'Agua', 'Comedor', 'Salón Educativo'],
    contact_name: 'Lic. Ana Bolívar',
    contact_phone: '+58 414-4567890',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: true,
    water_available: true,
    medical_post: false,
    food_distribution: true,
    education_area: true
  },
  {
    code: 'CAMP-015',
    name: 'Refugio Emergencia Macuto',
    municipality: 'Macuto',
    zone: 'MACUTO',
    address: 'Zona Industrial, Macuto',
    coordinates: { lat: 10.6180, lng: -66.9080 },
    capacity: 350,
    current_occupancy: 290,
    status: 'ACTIVO',
    type: 'REFUGIO',
    amenities: ['WiFi', 'Solar', 'Agua', 'Comedor', 'Área Médica', 'Salón Educativo'],
    contact_name: 'Cmdte. Luis Méndez',
    contact_phone: '+58 416-5678901',
    coordinator_id: null,
    coordinator_name: null,
    wifi_available: true,
    solar_power: true,
    water_available: true,
    medical_post: true,
    food_distribution: true,
    education_area: true
  }
];

// ============================================
// CAMPS SERVICE
// ============================================

export const campService = {
  async getCamps(): Promise<Camp[]> {
    const snapshot = await getDocs(collection(db, 'camps'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Camp[];
  },

  async getCampById(id: string): Promise<Camp | null> {
    const q = query(collection(db, 'camps'), where('id', '==', id));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Camp;
  },

  async getCampsByMunicipality(municipality: string): Promise<Camp[]> {
    const q = query(collection(db, 'camps'), where('municipality', '==', municipality));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Camp[];
  },

  async getCampsByStatus(status: CampStatus): Promise<Camp[]> {
    const q = query(collection(db, 'camps'), where('status', '==', status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Camp[];
  },

  async getActiveCamps(): Promise<Camp[]> {
    return this.getCampsByStatus('ACTIVO');
  },

  async getCampStats(): Promise<CampStats> {
    const camps = await this.getCamps();
    return {
      total_camps: camps.length,
      active_camps: camps.filter(c => c.status === 'ACTIVO').length,
      total_capacity: camps.reduce((sum, c) => sum + c.capacity, 0),
      total_occupancy: camps.reduce((sum, c) => sum + c.current_occupancy, 0),
      camps_with_wifi: camps.filter(c => c.wifi_available).length,
      camps_with_solar: camps.filter(c => c.solar_power).length,
      camps_with_medical: camps.filter(c => c.medical_post).length,
      camps_with_food: camps.filter(c => c.food_distribution).length
    };
  },

  async createCamp(camp: Omit<Camp, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'camps'), {
      ...camp,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async updateCamp(id: string, updates: Partial<Camp>): Promise<void> {
    const docRef = doc(db, 'camps', id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: Timestamp.now()
    });
  },

  async updateOccupancy(id: string, newOccupancy: number): Promise<void> {
    const docRef = doc(db, 'camps', id);
    await updateDoc(docRef, {
      current_occupancy: newOccupancy,
      updated_at: Timestamp.now()
    });
  }
};
