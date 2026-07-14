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

export type RedemptionType = 'RECARGA_MOVIL' | 'BOLSA_ALIMENTOS' | 'CAPITAL_SEMILLA' | 'DISPOSITIVO' | 'CURSO_EXTRA' | 'CERTIFICADO';
export type RedemptionStatus = 'PENDIENTE' | 'PROCESADO' | 'ENTREGADO' | 'CANCELADO';

export interface RedemptionItem {
  id: string;
  code: string;
  name: string;
  description: string;
  type: RedemptionType;
  points_cost: number;
  value_bs: number;
  value_usd: number;
  stock: number;
  max_per_user: number;
  requirements: string[];
  available: boolean;
  created_at: any;
  updated_at: any;
}

export interface UserRedemption {
  id: string;
  user_id: string;
  user_name: string;
  item_id: string;
  item_name: string;
  item_type: RedemptionType;
  points_used: number;
  value_bs: number;
  value_usd: number;
  status: RedemptionStatus;
  camp_id: string;
  camp_name: string;
  redemption_date: any;
  delivery_date: any;
  delivery_method: string;
  tracking_code: string | null;
  notes: string;
  created_at: any;
  updated_at: any;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  type: 'GANADO' | 'GASTADO' | 'BONUS' | 'PENALIZACION';
  amount: number;
  balance_after: number;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  created_at: any;
}

export interface RedemptionStats {
  total_items: number;
  total_redemptions: number;
  total_points_redeemed: number;
  total_value_bs: number;
  total_value_usd: number;
  redemptions_by_type: Record<RedemptionType, number>;
  redemptions_by_municipality: Record<string, number>;
  top_items: { item: string; count: number }[];
}

// ============================================
// REDEMPTION CATALOG DATA
// ============================================

export const REDEMPTION_CATALOG: Omit<RedemptionItem, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    code: 'RDM-001',
    name: 'Recarga Móvil Bs. 100',
    description: 'Recarga de saldo móvil para cualquier operador',
    type: 'RECARGA_MOVIL',
    points_cost: 50,
    value_bs: 100,
    value_usd: 2.50,
    stock: 5000,
    max_per_user: 4,
    requirements: ['Mínimo 50 puntos'],
    available: true
  },
  {
    code: 'RDM-002',
    name: 'Recarga Móvil Bs. 200',
    description: 'Recarga de saldo móvil para cualquier operador',
    type: 'RECARGA_MOVIL',
    points_cost: 100,
    value_bs: 200,
    value_usd: 5.00,
    stock: 3000,
    max_per_user: 2,
    requirements: ['Mínimo 100 puntos'],
    available: true
  },
  {
    code: 'RDM-003',
    name: 'Bolsa de Alimentos Básica',
    description: 'Bolsa con arroz, pasta, atún, aceite, sal',
    type: 'BOLSA_ALIMENTOS',
    points_cost: 200,
    value_bs: 500,
    value_usd: 12.50,
    stock: 1000,
    max_per_user: 2,
    requirements: ['Mínimo 200 puntos', 'Registro en albergue'],
    available: true
  },
  {
    code: 'RDM-004',
    name: 'Bolsa de Alimentos Premium',
    description: 'Bolsa completa con proteínas, frutas y verduras',
    type: 'BOLSA_ALIMENTOS',
    points_cost: 350,
    value_bs: 850,
    value_usd: 21.25,
    stock: 500,
    max_per_user: 1,
    requirements: ['Mínimo 350 puntos', 'Familia 4+ miembros'],
    available: true
  },
  {
    code: 'RDM-005',
    name: 'Capital Semilla Pequeño',
    description: 'Capital semilla para emprendimiento digital',
    type: 'CAPITAL_SEMILLA',
    points_cost: 500,
    value_bs: 2000,
    value_usd: 50.00,
    stock: 200,
    max_per_user: 1,
    requirements: ['Mínimo 500 puntos', 'Completar track 1', 'Plan de negocio'],
    available: true
  },
  {
    code: 'RDM-006',
    name: 'Capital Semilla Mediano',
    description: 'Capital semilla para negocio establecido',
    type: 'CAPITAL_SEMILLA',
    points_cost: 1000,
    value_bs: 5000,
    value_usd: 125.00,
    stock: 100,
    max_per_user: 1,
    requirements: ['Mínimo 1000 puntos', 'Completar track 1', 'Negocio 6+ meses'],
    available: true
  },
  {
    code: 'RDM-007',
    name: 'Tablet Básica',
    description: 'Tablet reacondicionada para capacitación',
    type: 'DISPOSITIVO',
    points_cost: 800,
    value_bs: 3000,
    value_usd: 75.00,
    stock: 150,
    max_per_user: 1,
    requirements: ['Mínimo 800 puntos', 'Sin dispositivo propio'],
    available: true
  },
  {
    code: 'RDM-008',
    name: 'Kit Punto de Venta Digital',
    description: 'Lector de códigos + acceso plataforma pagos',
    type: 'DISPOSITIVO',
    points_cost: 600,
    value_bs: 2500,
    value_usd: 62.50,
    stock: 200,
    max_per_user: 1,
    requirements: ['Mínimo 600 puntos', 'Completar módulo pagos'],
    available: true
  },
  {
    code: 'RDM-009',
    name: 'Curso Extra: Marketing Digital',
    description: 'Curso avanzado de marketing digital',
    type: 'CURSO_EXTRA',
    points_cost: 150,
    value_bs: 0,
    value_usd: 0,
    stock: 999,
    max_per_user: 1,
    requirements: ['Mínimo 150 puntos'],
    available: true
  },
  {
    code: 'RDM-010',
    name: 'Certificado QR Premium',
    description: 'Certificado verificable con QR + carta presentación',
    type: 'CERTIFICADO',
    points_cost: 250,
    value_bs: 0,
    value_usd: 0,
    stock: 999,
    max_per_user: 1,
    requirements: ['Mínimo 250 puntos', 'Completar al menos 1 track'],
    available: true
  }
];

// ============================================
// USER REDEMPTIONS DATA
// ============================================

export const USER_REDEMPTIONS_DATA: Omit<UserRedemption, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    user_id: 'USR-001',
    user_name: 'Juan Pérez',
    item_id: 'RDM-001',
    item_name: 'Recarga Móvil Bs. 100',
    item_type: 'RECARGA_MOVIL',
    points_used: 50,
    value_bs: 100,
    value_usd: 2.50,
    status: 'ENTREGADO',
    camp_id: 'CAMP-001',
    camp_name: 'Refugio Principal Catia La Mar',
    redemption_date: Timestamp.fromDate(new Date(Date.now() - 86400000)),
    delivery_date: Timestamp.fromDate(new Date(Date.now() - 82800000)),
    delivery_method: 'Recarga automática',
    tracking_code: 'REC-2025-001',
    notes: 'Recarga procesada exitosamente'
  },
  {
    user_id: 'USR-002',
    user_name: 'Carlos Rodríguez',
    item_id: 'RDM-003',
    item_name: 'Bolsa de Alimentos Básica',
    item_type: 'BOLSA_ALIMENTOS',
    points_used: 200,
    value_bs: 500,
    value_usd: 12.50,
    status: 'PROCESADO',
    camp_id: 'CAMP-002',
    camp_name: 'Centro Comunal Maiquetía',
    redemption_date: Timestamp.fromDate(new Date(Date.now() - 43200000)),
    delivery_date: null,
    delivery_method: 'Entrega en albergue',
    tracking_code: 'BOL-2025-001',
    notes: 'En proceso de preparación'
  },
  {
    user_id: 'USR-005',
    user_name: 'Pedro Suárez',
    item_id: 'RDM-008',
    item_name: 'Kit Punto de Venta Digital',
    item_type: 'DISPOSITIVO',
    points_used: 600,
    value_bs: 2500,
    value_usd: 62.50,
    status: 'PENDIENTE',
    camp_id: 'CAMP-009',
    camp_name: 'Refugio Playa Grande',
    redemption_date: Timestamp.fromDate(new Date(Date.now() - 21600000)),
    delivery_date: null,
    delivery_method: 'Entrega en albergue',
    tracking_code: 'KIT-2025-001',
    notes: 'Pendiente de entrega'
  }
];

// ============================================
// POINTS TRANSACTIONS DATA
// ============================================

export const POINTS_TRANSACTIONS_DATA: Omit<PointsTransaction, 'id' | 'created_at'>[] = [
  {
    user_id: 'USR-001',
    type: 'GANADO',
    amount: 10,
    balance_after: 450,
    description: 'Módulo completado: Pagos Digitales',
    reference_id: 'MOD-001',
    reference_type: 'MODULO'
  },
  {
    user_id: 'USR-001',
    type: 'GANADO',
    amount: 25,
    balance_after: 440,
    description: 'Quiz aprobado: Logística Post-Desastre',
    reference_id: 'QUIZ-001',
    reference_type: 'QUIZ'
  },
  {
    user_id: 'USR-001',
    type: 'GASTADO',
    amount: 50,
    balance_after: 415,
    description: 'Canje: Recarga Móvil Bs. 100',
    reference_id: 'RDM-001',
    reference_type: 'CANJE'
  },
  {
    user_id: 'USR-001',
    type: 'BONUS',
    amount: 5,
    balance_after: 465,
    description: 'Bono: Día consecutivo de actividad',
    reference_id: null,
    reference_type: 'BONO'
  }
];

// ============================================
// REDEMPTION SERVICE
// ============================================

export const redemptionService = {
  async getCatalog(): Promise<RedemptionItem[]> {
    const snapshot = await getDocs(collection(db, 'redemption_catalog'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as RedemptionItem[];
  },

  async getCatalogByType(type: RedemptionType): Promise<RedemptionItem[]> {
    const q = query(collection(db, 'redemption_catalog'), where('type', '==', type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RedemptionItem[];
  },

  async getAvailableItems(): Promise<RedemptionItem[]> {
    const q = query(collection(db, 'redemption_catalog'), where('available', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RedemptionItem[];
  },

  async getUserRedemptions(userId: string): Promise<UserRedemption[]> {
    const q = query(collection(db, 'user_redemptions'), where('user_id', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserRedemption[];
  },

  async getRedemptionsByCamp(campId: string): Promise<UserRedemption[]> {
    const q = query(collection(db, 'user_redemptions'), where('camp_id', '==', campId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserRedemption[];
  },

  async getPendingRedemptions(): Promise<UserRedemption[]> {
    const q = query(collection(db, 'user_redemptions'), where('status', '==', 'PENDIENTE'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserRedemption[];
  },

  async getUserPointsHistory(userId: string): Promise<PointsTransaction[]> {
    const q = query(collection(db, 'points_transactions'), where('user_id', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PointsTransaction[];
  },

  async getRedemptionStats(): Promise<RedemptionStats> {
    const [catalog, redemptions] = await Promise.all([
      this.getCatalog(),
      this.getUserRedemptions('ALL') // In production, fetch all
    ]);

    const byType: Record<RedemptionType, number> = {
      RECARGA_MOVIL: 0,
      BOLSA_ALIMENTOS: 0,
      CAPITAL_SEMILLA: 0,
      DISPOSITIVO: 0,
      CURSO_EXTRA: 0,
      CERTIFICADO: 0
    };

    const byMunicipality: Record<string, number> = {};
    const itemCounts: Record<string, number> = {};

    redemptions.forEach(r => {
      byType[r.item_type]++;
      byMunicipality[r.camp_name] = (byMunicipality[r.camp_name] || 0) + 1;
      itemCounts[r.item_name] = (itemCounts[r.item_name] || 0) + 1;
    });

    const topItems = Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([item, count]) => ({ item, count }));

    return {
      total_items: catalog.length,
      total_redemptions: redemptions.length,
      total_points_redeemed: redemptions.reduce((sum, r) => sum + r.points_used, 0),
      total_value_bs: redemptions.reduce((sum, r) => sum + r.value_bs, 0),
      total_value_usd: redemptions.reduce((sum, r) => sum + r.value_usd, 0),
      redemptions_by_type: byType,
      redemptions_by_municipality: byMunicipality,
      top_items: topItems
    };
  },

  async redeemItem(userId: string, userName: string, itemId: string, userPoints: number, campId: string, campName: string): Promise<string> {
    // Get item
    const items = await this.getCatalog();
    const item = items.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');

    // Check points
    if (userPoints < item.points_cost) {
      throw new Error('Insufficient points');
    }

    // Check stock
    if (item.stock <= 0) {
      throw new Error('Out of stock');
    }

    // Check user limit
    const userRedemptions = await this.getUserRedemptions(userId);
    const itemRedemptions = userRedemptions.filter(r => r.item_id === itemId);
    if (itemRedemptions.length >= item.max_per_user) {
      throw new Error('Maximum per user reached');
    }

    // Create redemption
    const redemptionData: Omit<UserRedemption, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      user_name: userName,
      item_id: item.id,
      item_name: item.name,
      item_type: item.type,
      points_used: item.points_cost,
      value_bs: item.value_bs,
      value_usd: item.value_usd,
      status: 'PENDIENTE',
      camp_id: campId,
      camp_name: campName,
      redemption_date: Timestamp.now(),
      delivery_date: null,
      delivery_method: item.type === 'RECARGA_MOVIL' ? 'Recarga automática' : 'Entrega en albergue',
      tracking_code: `${item.code}-${Date.now()}`,
      notes: 'Canje registrado exitosamente'
    };

    const docRef = await addDoc(collection(db, 'user_redemptions'), {
      ...redemptionData,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });

    // Create points transaction
    const transactionData: Omit<PointsTransaction, 'id' | 'created_at'> = {
      user_id: userId,
      type: 'GASTADO',
      amount: item.points_cost,
      balance_after: userPoints - item.points_cost,
      description: `Canje: ${item.name}`,
      reference_id: docRef.id,
      reference_type: 'CANJE'
    };

    await addDoc(collection(db, 'points_transactions'), {
      ...transactionData,
      created_at: Timestamp.now()
    });

    return docRef.id;
  },

  async updateRedemptionStatus(id: string, status: RedemptionStatus): Promise<void> {
    const docRef = doc(db, 'user_redemptions', id);
    const updates: any = { status, updated_at: Timestamp.now() };
    
    if (status === 'ENTREGADO') {
      updates.delivery_date = Timestamp.now();
    }
    
    await updateDoc(docRef, updates);
  },

  async processAutomaticTopUp(redemptionId: string): Promise<void> {
    // In production, this would call a mobile top-up API
    await this.updateRedemptionStatus(redemptionId, 'PROCESADO');
    
    // Simulate processing delay
    setTimeout(async () => {
      await this.updateRedemptionStatus(redemptionId, 'ENTREGADO');
    }, 5000);
  }
};
