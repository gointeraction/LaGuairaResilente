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

export type WiFiStatus = 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO' | 'DAÑADO';
export type WiFiType = 'FIBRA_OPTICA' | 'SATELITAL' | '4G_LTE' | 'MESH';

export interface WiFiNode {
  id: string;
  code: string;
  name: string;
  camp_id: string;
  camp_name: string;
  municipality: string;
  type: WiFiType;
  status: WiFiStatus;
  signal_strength: number;
  bandwidth_mbps: number;
  connected_users: number;
  max_users: number;
  last_maintenance: any;
  provider: string;
  installation_date: any;
  solar_powered: boolean;
  backup_battery: boolean;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  created_at: any;
  updated_at: any;
}

export interface WiFiStats {
  total_nodes: number;
  active_nodes: number;
  total_bandwidth: number;
  total_connected: number;
  total_capacity: number;
  nodes_by_type: Record<WiFiType, number>;
  nodes_by_municipality: Record<string, number>;
  average_uptime: number;
}

// ============================================
// WIFI NODES DATA
// ============================================

export const WIFI_NODES_DATA: Omit<WiFiNode, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    code: 'WF-001',
    name: 'Nodo WiFi Principal Catia La Mar',
    camp_id: 'CAMP-001',
    camp_name: 'Refugio Principal Catia La Mar',
    municipality: 'Catia La Mar',
    type: 'FIBRA_OPTICA',
    status: 'ACTIVO',
    signal_strength: 95,
    bandwidth_mbps: 100,
    connected_users: 180,
    max_users: 300,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-10')),
    provider: 'CAVECOM Telecom',
    installation_date: Timestamp.fromDate(new Date('2025-01-05')),
    solar_powered: true,
    backup_battery: true,
    ip_address: '192.168.1.1',
    mac_address: '00:1A:2B:3C:4D:01',
    firmware_version: '3.2.1'
  },
  {
    code: 'WF-002',
    name: 'Nodo WiFi Maiquetía Centro',
    camp_id: 'CAMP-002',
    camp_name: 'Centro Comunal Maiquetía',
    municipality: 'Maiquetía',
    type: 'FIBRA_OPTICA',
    status: 'ACTIVO',
    signal_strength: 88,
    bandwidth_mbps: 80,
    connected_users: 150,
    max_users: 250,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-08')),
    provider: 'CAVECOM Telecom',
    installation_date: Timestamp.fromDate(new Date('2025-01-06')),
    solar_powered: false,
    backup_battery: true,
    ip_address: '192.168.1.2',
    mac_address: '00:1A:2B:3C:4D:02',
    firmware_version: '3.2.1'
  },
  {
    code: 'WF-003',
    name: 'Nodo Satelital Macuto',
    camp_id: 'CAMP-003',
    camp_name: 'Escuela Bolivariana Macuto',
    municipality: 'Macuto',
    type: 'SATELITAL',
    status: 'ACTIVO',
    signal_strength: 75,
    bandwidth_mbps: 50,
    connected_users: 120,
    max_users: 200,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-12')),
    provider: 'Starlink Venezuela',
    installation_date: Timestamp.fromDate(new Date('2025-01-07')),
    solar_powered: true,
    backup_battery: true,
    ip_address: '192.168.1.3',
    mac_address: '00:1A:2B:3C:4D:03',
    firmware_version: '2.1.0'
  },
  {
    code: 'WF-004',
    name: 'Nodo 4G Caraballeda',
    camp_id: 'CAMP-004',
    camp_name: 'Centro Deportivo Caraballeda',
    municipality: 'Caraballeda',
    type: '4G_LTE',
    status: 'ACTIVO',
    signal_strength: 82,
    bandwidth_mbps: 40,
    connected_users: 95,
    max_users: 150,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-11')),
    provider: 'Movilnet',
    installation_date: Timestamp.fromDate(new Date('2025-01-08')),
    solar_powered: false,
    backup_battery: false,
    ip_address: '192.168.1.4',
    mac_address: '00:1A:2B:3C:4D:04',
    firmware_version: '1.5.0'
  },
  {
    code: 'WF-005',
    name: 'Nodo MESH Playa Grande',
    camp_id: 'CAMP-009',
    camp_name: 'Refugio Playa Grande',
    municipality: 'Catia La Mar',
    type: 'MESH',
    status: 'ACTIVO',
    signal_strength: 70,
    bandwidth_mbps: 30,
    connected_users: 85,
    max_users: 120,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-09')),
    provider: 'CAVECOM Telecom',
    installation_date: Timestamp.fromDate(new Date('2025-01-09')),
    solar_powered: true,
    backup_battery: true,
    ip_address: '192.168.1.5',
    mac_address: '00:1A:2B:3C:4D:05',
    firmware_version: '2.0.3'
  },
  {
    code: 'WF-006',
    name: 'Nodo Fibra Maiquetía Norte',
    camp_id: 'CAMP-006',
    camp_name: 'Centro Social Maiquetía Norte',
    municipality: 'Maiquetía',
    type: 'FIBRA_OPTICA',
    status: 'ACTIVO',
    signal_strength: 92,
    bandwidth_mbps: 100,
    connected_users: 110,
    max_users: 200,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-13')),
    provider: 'CAVECOM Telecom',
    installation_date: Timestamp.fromDate(new Date('2025-01-10')),
    solar_powered: true,
    backup_battery: true,
    ip_address: '192.168.1.6',
    mac_address: '00:1A:2B:3C:4D:06',
    firmware_version: '3.2.1'
  },
  {
    code: 'WF-007',
    name: 'Nodo Satelital Macuto Deportivo',
    camp_id: 'CAMP-007',
    camp_name: 'Instalación Deportiva Macuto',
    municipality: 'Macuto',
    type: 'SATELITAL',
    status: 'MANTENIMIENTO',
    signal_strength: 0,
    bandwidth_mbps: 0,
    connected_users: 0,
    max_users: 150,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-14')),
    provider: 'Starlink Venezuela',
    installation_date: Timestamp.fromDate(new Date('2025-01-11')),
    solar_powered: false,
    backup_battery: true,
    ip_address: '192.168.1.7',
    mac_address: '00:1A:2B:3C:4D:07',
    firmware_version: '2.1.0'
  },
  {
    code: 'WF-008',
    name: 'Nodo 4G Caraballeda Sur',
    camp_id: 'CAMP-008',
    camp_name: 'Centro Comunal Caraballeda Sur',
    municipality: 'Caraballeda',
    type: '4G_LTE',
    status: 'ACTIVO',
    signal_strength: 78,
    bandwidth_mbps: 35,
    connected_users: 60,
    max_users: 100,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-07')),
    provider: 'Digitel',
    installation_date: Timestamp.fromDate(new Date('2025-01-12')),
    solar_powered: false,
    backup_battery: false,
    ip_address: '192.168.1.8',
    mac_address: '00:1A:2B:3C:4D:08',
    firmware_version: '1.5.0'
  },
  {
    code: 'WF-009',
    name: 'Nodo Fibra Centro Operaciones',
    camp_id: 'CAMP-010',
    camp_name: 'Centro Operaciones Maiquetía',
    municipality: 'Maiquetía',
    type: 'FIBRA_OPTICA',
    status: 'ACTIVO',
    signal_strength: 98,
    bandwidth_mbps: 200,
    connected_users: 250,
    max_users: 400,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-14')),
    provider: 'CAVECOM Telecom',
    installation_date: Timestamp.fromDate(new Date('2025-01-04')),
    solar_powered: true,
    backup_battery: true,
    ip_address: '192.168.1.9',
    mac_address: '00:1A:2B:3C:4D:09',
    firmware_version: '3.2.1'
  },
  {
    code: 'WF-010',
    name: 'Nodo MESH Macuto Emergencia',
    camp_id: 'CAMP-015',
    camp_name: 'Refugio Emergencia Macuto',
    municipality: 'Macuto',
    type: 'MESH',
    status: 'ACTIVO',
    signal_strength: 85,
    bandwidth_mbps: 45,
    connected_users: 140,
    max_users: 200,
    last_maintenance: Timestamp.fromDate(new Date('2025-01-13')),
    provider: 'CAVECOM Telecom',
    installation_date: Timestamp.fromDate(new Date('2025-01-06')),
    solar_powered: true,
    backup_battery: true,
    ip_address: '192.168.1.10',
    mac_address: '00:1A:2B:3C:4D:0A',
    firmware_version: '2.0.3'
  }
];

// ============================================
// WIFI SERVICE
// ============================================

export const wifiService = {
  async getNodes(): Promise<WiFiNode[]> {
    const snapshot = await getDocs(collection(db, 'wifi_nodes'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WiFiNode[];
  },

  async getNodeById(id: string): Promise<WiFiNode | null> {
    const q = query(collection(db, 'wifi_nodes'), where('id', '==', id));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as WiFiNode;
  },

  async getNodesByCamp(campId: string): Promise<WiFiNode[]> {
    const q = query(collection(db, 'wifi_nodes'), where('camp_id', '==', campId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WiFiNode[];
  },

  async getNodesByMunicipality(municipality: string): Promise<WiFiNode[]> {
    const q = query(collection(db, 'wifi_nodes'), where('municipality', '==', municipality));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WiFiNode[];
  },

  async getNodesByStatus(status: WiFiStatus): Promise<WiFiNode[]> {
    const q = query(collection(db, 'wifi_nodes'), where('status', '==', status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WiFiNode[];
  },

  async getActiveNodes(): Promise<WiFiNode[]> {
    return this.getNodesByStatus('ACTIVO');
  },

  async getWiFiStats(): Promise<WiFiStats> {
    const nodes = await this.getNodes();
    const activeNodes = nodes.filter(n => n.status === 'ACTIVO');
    
    const nodesByType: Record<WiFiType, number> = {
      FIBRA_OPTICA: 0,
      SATELITAL: 0,
      '4G_LTE': 0,
      MESH: 0
    };
    
    const nodesByMunicipality: Record<string, number> = {};
    
    nodes.forEach(node => {
      nodesByType[node.type]++;
      nodesByMunicipality[node.municipality] = (nodesByMunicipality[node.municipality] || 0) + 1;
    });

    return {
      total_nodes: nodes.length,
      active_nodes: activeNodes.length,
      total_bandwidth: activeNodes.reduce((sum, n) => sum + n.bandwidth_mbps, 0),
      total_connected: activeNodes.reduce((sum, n) => sum + n.connected_users, 0),
      total_capacity: activeNodes.reduce((sum, n) => sum + n.max_users, 0),
      nodes_by_type: nodesByType,
      nodes_by_municipality: nodesByMunicipality,
      average_uptime: 98.5
    };
  },

  async createNode(node: Omit<WiFiNode, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'wifi_nodes'), {
      ...node,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async updateNode(id: string, updates: Partial<WiFiNode>): Promise<void> {
    const docRef = doc(db, 'wifi_nodes', id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: Timestamp.now()
    });
  },

  async updateNodeStatus(id: string, status: WiFiStatus): Promise<void> {
    const docRef = doc(db, 'wifi_nodes', id);
    await updateDoc(docRef, {
      status,
      updated_at: Timestamp.now()
    });
  },

  async updateConnectedUsers(id: string, count: number): Promise<void> {
    const docRef = doc(db, 'wifi_nodes', id);
    await updateDoc(docRef, {
      connected_users: count,
      updated_at: Timestamp.now()
    });
  }
};
