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

export type DeliveryStatus = 'PENDIENTE' | 'EN_TRANSITO' | 'ENTREGADO' | 'CANCELADO' | 'COMPLETADO';
export type DeliveryType = 'ALIMENTOS' | 'MEDICAMENTOS' | 'EQUIPOS' | 'BOLSAS' | 'RECARGAS' | 'OTROS';
export type RouteStatus = 'ACTIVA' | 'COMPLETADA' | 'CANCELADA';

export interface Delivery {
  id: string;
  code: string;
  type: DeliveryType;
  description: string;
  origin: string;
  destination_camp_id: string;
  destination_camp_name: string;
  destination_municipality: string;
  quantity: number;
  unit: string;
  status: DeliveryStatus;
  priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  assigned_driver: string | null;
  assigned_vehicle: string | null;
  estimated_arrival: any;
  actual_arrival: any;
  notes: string;
  created_at: any;
  updated_at: any;
}

export interface DistributionRoute {
  id: string;
  code: string;
  name: string;
  description: string;
  camp_ids: string[];
  camp_names: string[];
  municipality: string;
  status: RouteStatus;
  total_deliveries: number;
  completed_deliveries: number;
  total_distance_km: number;
  estimated_duration_minutes: number;
  start_time: string;
  end_time: string;
  driver: string;
  vehicle: string;
  created_at: any;
  updated_at: any;
}

export interface FoodDistribution {
  id: string;
  camp_id: string;
  camp_name: string;
  date: any;
  meals_served: number;
  families_served: number;
  food_type: string;
  supplier: string;
  status: 'PROGRAMADO' | 'EN_CURSO' | 'COMPLETADO';
  notes: string;
  created_at: any;
  updated_at: any;
}

export interface MobileTopUp {
  id: string;
  user_id: string;
  user_name: string;
  phone_number: string;
  carrier: string;
  amount_bs: number;
  amount_usd: number;
  status: 'PENDIENTE' | 'PROCESADO' | 'FALLIDO';
  points_used: number;
  camp_id: string;
  camp_name: string;
  created_at: any;
  updated_at: any;
}

export interface LogisticsStats {
  total_deliveries: number;
  pending_deliveries: number;
  in_transit_deliveries: number;
  completed_deliveries: number;
  total_routes: number;
  active_routes: number;
  total_meals_served: number;
  total_topups: number;
  total_families_served: number;
}

// ============================================
// DELIVERIES DATA
// ============================================

export const DELIVERIES_DATA: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    code: 'DEL-001',
    type: 'ALIMENTOS',
    description: 'Ración diaria de alimentos para familias',
    origin: 'Centro de Acopio Maiquetía',
    destination_camp_id: 'CAMP-001',
    destination_camp_name: 'Refugio Principal Catia La Mar',
    destination_municipality: 'Catia La Mar',
    quantity: 200,
    unit: 'raciones',
    status: 'EN_TRANSITO',
    priority: 'ALTA',
    assigned_driver: 'Carlos Méndez',
    assigned_vehicle: 'Camión CAVECOM-01',
    estimated_arrival: Timestamp.fromDate(new Date(Date.now() + 3600000)),
    actual_arrival: null,
    notes: 'Entrega prioritaria para familias con niños'
  },
  {
    code: 'DEL-002',
    type: 'MEDICAMENTOS',
    description: 'Kit de primeros auxilios y medicamentos básicos',
    origin: 'Bodega Central La Guaira',
    destination_camp_id: 'CAMP-003',
    destination_camp_name: 'Escuela Bolivariana Macuto',
    destination_municipality: 'Macuto',
    quantity: 50,
    unit: 'kits',
    status: 'PENDIENTE',
    priority: 'CRITICA',
    assigned_driver: null,
    assigned_vehicle: null,
    estimated_arrival: Timestamp.fromDate(new Date(Date.now() + 7200000)),
    actual_arrival: null,
    notes: 'Medicamentos esenciales para área médica'
  },
  {
    code: 'DEL-003',
    type: 'EQUIPOS',
    description: 'Tablets reacondicionadas para capacitación',
    origin: 'Almacén CAVECOM',
    destination_camp_id: 'CAMP-010',
    destination_camp_name: 'Centro Operaciones Maiquetía',
    destination_municipality: 'Maiquetía',
    quantity: 30,
    unit: 'tablets',
    status: 'ENTREGADO',
    priority: 'MEDIA',
    assigned_driver: 'Luis Torres',
    assigned_vehicle: 'Van CAVECOM-03',
    estimated_arrival: Timestamp.fromDate(new Date(Date.now() - 86400000)),
    actual_arrival: Timestamp.fromDate(new Date(Date.now() - 82800000)),
    notes: 'Entrega completada exitosamente'
  },
  {
    code: 'DEL-004',
    type: 'BOLSAS',
    description: 'Bolsas de alimentos prioritarias por canje de puntos',
    origin: 'Centro de Acopio Catia La Mar',
    destination_camp_id: 'CAMP-009',
    destination_camp_name: 'Refugio Playa Grande',
    destination_municipality: 'Catia La Mar',
    quantity: 100,
    unit: 'bolsas',
    status: 'PENDIENTE',
    priority: 'ALTA',
    assigned_driver: null,
    assigned_vehicle: null,
    estimated_arrival: Timestamp.fromDate(new Date(Date.now() + 14400000)),
    actual_arrival: null,
    notes: 'Canjes de puntos de resiliencia'
  },
  {
    code: 'DEL-005',
    type: 'RECARGAS',
    description: 'Recargas de saldo móvil para beneficiarios',
    origin: 'Sistema Automatizado',
    destination_camp_id: 'CAMP-004',
    destination_camp_name: 'Centro Deportivo Caraballeda',
    destination_municipality: 'Caraballeda',
    quantity: 50,
    unit: 'recargas',
    status: 'EN_TRANSITO',
    priority: 'MEDIA',
    assigned_driver: 'Sistema API',
    assigned_vehicle: 'Digital',
    estimated_arrival: Timestamp.fromDate(new Date(Date.now() + 1800000)),
    actual_arrival: null,
    notes: 'Procesamiento automático de recargas'
  },
  {
    code: 'DEL-006',
    type: 'ALIMENTOS',
    description: 'Desayuno y almuerzo para campamento',
    origin: 'Cocina Comunal Maiquetía',
    destination_camp_id: 'CAMP-002',
    destination_camp_name: 'Centro Comunal Maiquetía',
    destination_municipality: 'Maiquetía',
    quantity: 350,
    unit: 'raciones',
    status: 'COMPLETADO',
    priority: 'ALTA',
    assigned_driver: 'Ana Martínez',
    assigned_vehicle: 'Camión CAVECOM-02',
    estimated_arrival: Timestamp.fromDate(new Date(Date.now() - 3600000)),
    actual_arrival: Timestamp.fromDate(new Date(Date.now() - 39600000)),
    notes: 'Entrega completada a tiempo'
  }
];

// ============================================
// FOOD DISTRIBUTION DATA
// ============================================

export const FOOD_DISTRIBUTION_DATA: Omit<FoodDistribution, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    camp_id: 'CAMP-001',
    camp_name: 'Refugio Principal Catia La Mar',
    date: Timestamp.fromDate(new Date()),
    meals_served: 640,
    families_served: 160,
    food_type: 'Desayuno y Almuerzo',
    supplier: 'Cocina Comunal Catia La Mar',
    status: 'COMPLETADO',
    notes: 'Distribución exitosa'
  },
  {
    camp_id: 'CAMP-003',
    camp_name: 'Escuela Bolivariana Macuto',
    date: Timestamp.fromDate(new Date()),
    meals_served: 520,
    families_served: 130,
    food_type: 'Almuerzo',
    supplier: 'Restaurante Solidario Macuto',
    status: 'EN_CURSO',
    notes: 'En proceso de distribución'
  },
  {
    camp_id: 'CAMP-010',
    camp_name: 'Centro Operaciones Maiquetía',
    date: Timestamp.fromDate(new Date()),
    meals_served: 760,
    families_served: 190,
    food_type: 'Desayuno, Almuerzo y Cena',
    supplier: 'Red de Cocinas Comunales',
    status: 'PROGRAMADO',
    notes: 'Programado para tarde'
  }
];

// ============================================
// MOBILE TOPUP DATA
// ============================================

export const MOBILE_TOPUP_DATA: Omit<MobileTopUp, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    user_id: 'USR-001',
    user_name: 'María García',
    phone_number: '+58 412-1234567',
    carrier: 'Movilnet',
    amount_bs: 100,
    amount_usd: 2.50,
    status: 'PROCESADO',
    points_used: 50,
    camp_id: 'CAMP-001',
    camp_name: 'Refugio Principal Catia La Mar'
  },
  {
    user_id: 'USR-002',
    user_name: 'Carlos Rodríguez',
    phone_number: '+58 414-2345678',
    carrier: 'Movistar',
    amount_bs: 200,
    amount_usd: 5.00,
    status: 'PROCESADO',
    points_used: 100,
    camp_id: 'CAMP-002',
    camp_name: 'Centro Comunal Maiquetía'
  },
  {
    user_id: 'USR-003',
    user_name: 'Ana Martínez',
    phone_number: '+58 416-3456789',
    carrier: 'Digitel',
    amount_bs: 150,
    amount_usd: 3.75,
    status: 'PENDIENTE',
    points_used: 75,
    camp_id: 'CAMP-003',
    camp_name: 'Escuela Bolivariana Macuto'
  }
];

// ============================================
// LOGISTICS SERVICE
// ============================================

export const logisticsService = {
  async getDeliveries(): Promise<Delivery[]> {
    const snapshot = await getDocs(collection(db, 'deliveries'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Delivery[];
  },

  async getDeliveryById(id: string): Promise<Delivery | null> {
    const q = query(collection(db, 'deliveries'), where('id', '==', id));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Delivery;
  },

  async getDeliveriesByCamp(campId: string): Promise<Delivery[]> {
    const q = query(collection(db, 'deliveries'), where('destination_camp_id', '==', campId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Delivery[];
  },

  async getDeliveriesByStatus(status: DeliveryStatus): Promise<Delivery[]> {
    const q = query(collection(db, 'deliveries'), where('status', '==', status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Delivery[];
  },

  async getPendingDeliveries(): Promise<Delivery[]> {
    return this.getDeliveriesByStatus('PENDIENTE');
  },

  async getInTransitDeliveries(): Promise<Delivery[]> {
    return this.getDeliveriesByStatus('EN_TRANSITO');
  },

  async getRoutes(): Promise<DistributionRoute[]> {
    const snapshot = await getDocs(collection(db, 'distribution_routes'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DistributionRoute[];
  },

  async getActiveRoutes(): Promise<DistributionRoute[]> {
    const q = query(collection(db, 'distribution_routes'), where('status', '==', 'ACTIVA'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DistributionRoute[];
  },

  async getFoodDistributions(): Promise<FoodDistribution[]> {
    const snapshot = await getDocs(collection(db, 'food_distributions'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FoodDistribution[];
  },

  async getMobileTopUps(): Promise<MobileTopUp[]> {
    const snapshot = await getDocs(collection(db, 'mobile_topups'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MobileTopUp[];
  },

  async getLogisticsStats(): Promise<LogisticsStats> {
    const [deliveries, routes, foodDistributions, topUps] = await Promise.all([
      this.getDeliveries(),
      this.getRoutes(),
      this.getFoodDistributions(),
      this.getMobileTopUps()
    ]);

    return {
      total_deliveries: deliveries.length,
      pending_deliveries: deliveries.filter(d => d.status === 'PENDIENTE').length,
      in_transit_deliveries: deliveries.filter(d => d.status === 'EN_TRANSITO').length,
      completed_deliveries: deliveries.filter(d => d.status === 'ENTREGADO' || d.status === 'COMPLETADO').length,
      total_routes: routes.length,
      active_routes: routes.filter(r => r.status === 'ACTIVA').length,
      total_meals_served: foodDistributions.reduce((sum, f) => sum + f.meals_served, 0),
      total_topups: topUps.length,
      total_families_served: foodDistributions.reduce((sum, f) => sum + f.families_served, 0)
    };
  },

  async createDelivery(delivery: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'deliveries'), {
      ...delivery,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async updateDelivery(id: string, updates: Partial<Delivery>): Promise<void> {
    const docRef = doc(db, 'deliveries', id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: Timestamp.now()
    });
  },

  async updateDeliveryStatus(id: string, status: DeliveryStatus): Promise<void> {
    const docRef = doc(db, 'deliveries', id);
    const updates: any = { status, updated_at: Timestamp.now() };
    
    if (status === 'ENTREGADO') {
      updates.actual_arrival = Timestamp.now();
    }
    
    await updateDoc(docRef, updates);
  },

  async createRoute(route: Omit<DistributionRoute, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'distribution_routes'), {
      ...route,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async updateRoute(id: string, updates: Partial<DistributionRoute>): Promise<void> {
    const docRef = doc(db, 'distribution_routes', id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: Timestamp.now()
    });
  }
};
