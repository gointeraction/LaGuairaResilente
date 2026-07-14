import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const isEmulator = process.argv.includes('--emulator');
const shouldClear = process.argv.includes('--clear');
const collectionFilter = process.argv.find(a => a.startsWith('--collection='))?.split('=')[1];

if (isEmulator) {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  console.log('🔌 Using Firestore Emulator');
}

initializeApp({
  projectId: isEmulator ? 'demo-lgresiliente' : undefined,
  credential: isEmulator ? undefined : applicationDefault(),
});

const db = getFirestore();

// ============================================
// HELPER FUNCTIONS
// ============================================

async function clearCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log(`  🗑️  Cleared ${snapshot.size} documents from ${collectionName}`);
}

async function seedCollection(collectionName, data) {
  if (shouldClear) {
    await clearCollection(collectionName);
  }
  
  const batch = db.batch();
  let count = 0;
  
  for (const item of data) {
    const ref = db.collection(collectionName).doc(item.id);
    batch.set(ref, {
      ...item,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });
    count++;
    
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  ✅ Seeded ${count} documents to ${collectionName}...`);
    }
  }
  
  await batch.commit();
  console.log(`  ✅ Seeded ${count} documents to ${collectionName}`);
}

// ============================================
// SEED DATA - USERS
// ============================================

const MUNICIPALITIES = ['CATIA_LA_MAR', 'MAIQUETIA', 'MACUTO', 'CARABALLEDA'];
const FIRST_NAMES = [
  'María', 'José', 'Ana', 'Carlos', 'Luis', 'Carmen', 'Pedro', 'Rosa',
  'Miguel', 'Teresa', 'Francisco', 'Lucía', 'Antonio', 'Carmen', 'Manuel',
  'Patricia', 'Jorge', 'Gloria', 'Fernando', 'Isabel', 'Ricardo', 'Marta',
  'Eduardo', 'Laura', 'Roberto', 'Sandra', 'Alejandro', 'Diana', 'Daniel', 'Nancy'
];
const LAST_NAMES = [
  'González', 'Rodríguez', 'Martínez', 'López', 'Hernández', 'García',
  'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez',
  'Díaz', 'Cruz', 'Morales', 'Reyes', 'Ortiz', 'Gutiérrez', 'Chávez'
];

function generateUsers(count) {
  const users = [];
  
  users.push({
    id: 'admin-001', email: 'admin@laguairaresiliente.gob.ve', full_name: 'Admin Principal',
    role: 'ADMIN', municipality: 'MAIQUETIA', is_active: true, is_approved: true,
    points: 500, courses_completed: 5, current_streak: 30, phone: '+58-414-1234567',
    cedula: 'V-12345678', digital_literacy: 'ADVANCED',
  });
  
  for (let i = 0; i < 5; i++) {
    users.push({
      id: `trainer-${String(i + 1).padStart(3, '0')}`,
      email: `trainer${i + 1}@laguairaresiliente.gob.ve`,
      full_name: `${FIRST_NAMES[i]} ${LAST_NAMES[i]}`,
      role: 'TRAINER', municipality: MUNICIPALITIES[i % 4], is_active: true, is_approved: true,
      points: 300, courses_completed: 3, current_streak: 15,
      phone: `+58-414-${1000000 + i}`, cedula: `V-${20000000 + i}`, digital_literacy: 'ADVANCED',
    });
  }
  
  for (let i = 0; i < 4; i++) {
    users.push({
      id: `coord-${String(i + 1).padStart(3, '0')}`,
      email: `coordinator${i + 1}@laguairaresiliente.gob.ve`,
      full_name: `${FIRST_NAMES[5 + i]} ${LAST_NAMES[5 + i]}`,
      role: 'COORDINATOR', municipality: MUNICIPALITIES[i], is_active: true, is_approved: true,
      points: 250, courses_completed: 2, current_streak: 10,
      phone: `+58-412-${2000000 + i}`, cedula: `V-${25000000 + i}`, digital_literacy: 'INTERMEDIATE',
    });
  }
  
  for (let i = 0; i < count - 10; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    users.push({
      id: `user-${String(i + 1).padStart(4, '0')}`,
      email: `user${i + 1}@email.com`,
      full_name: `${firstName} ${lastName}`,
      role: 'STUDENT', municipality: MUNICIPALITIES[i % 4], is_active: true,
      is_approved: Math.random() > 0.15,
      points: Math.floor(Math.random() * 500),
      courses_completed: Math.floor(Math.random() * 5),
      current_streak: Math.floor(Math.random() * 30),
      phone: `+58-4${Math.floor(Math.random() * 10)}-${3000000 + i}`,
      cedula: `V-${30000000 + i}`,
      digital_literacy: ['NONE', 'BASIC', 'INTERMEDIATE', 'ADVANCED'][Math.floor(Math.random() * 4)],
      is_affected: Math.random() > 0.3,
      last_activity_date: new Date(Date.now() - Math.floor(Math.random() * 3) * 86400000).toISOString().split('T')[0],
    });
  }
  
  return users;
}

// ============================================
// SEED DATA - TRACKS & COURSES
// ============================================

const TRACKS = [
  { id: 'track-001', name: 'Continuidad Comercial Digital', description: 'Aprende a digitalizar tu negocio', module_count: 8, duration_hours: 40, icon: '💻', order: 1, status: 'ACTIVE' },
  { id: 'track-002', name: 'Micro-oficios Remotos', description: 'Desarrolla habilidades para trabajar remoto', module_count: 6, duration_hours: 30, icon: '🔧', order: 2, status: 'ACTIVE' },
  { id: 'track-003', name: 'Logística de Suministros', description: 'Gestiona cadenas de suministro', module_count: 5, duration_hours: 25, icon: '📦', order: 3, status: 'ACTIVE' },
];

function generateCourses() {
  const courses = [];
  const trackData = [
    { trackId: 'track-001', modules: [
      { title: 'Fundamentos del Marketing Digital', description: 'Conceptos básicos de marketing digital' },
      { title: 'Redes Sociales para Negocios', description: 'Facebook, Instagram y WhatsApp Business' },
      { title: 'Tiendas Online', description: 'Crea tu tienda virtual' },
      { title: 'Pagos Digitales', description: 'Métodos de pago digital' },
      { title: 'Atención al Cliente Digital', description: 'Gestiona clientes digitalmente' },
      { title: 'Análisis de Datos', description: 'Decisiones basadas en datos' },
      { title: 'Publicidad Digital', description: 'Campañas con poco presupuesto' },
      { title: 'Plan de Negocio Digital', description: 'Plan de negocio completo' },
    ]},
    { trackId: 'track-002', modules: [
      { title: 'Introducción al Trabajo Remoto', description: 'Beneficios del teletrabajo' },
      { title: 'Atención al Cliente Remoto', description: 'Soporte técnico virtual' },
      { title: 'Asistente Virtual', description: 'Habilidades de asistente virtual' },
      { title: 'Diseño Gráfico Básico', description: 'Canva y herramientas de diseño' },
      { title: 'Redacción de Contenidos', description: 'Contenido para web y redes' },
      { title: 'Gestión de Proyectos', description: 'Organiza proyectos remotos' },
    ]},
    { trackId: 'track-003', modules: [
      { title: 'Fundamentos de Logística', description: 'Conceptos de cadena de suministro' },
      { title: 'Gestión de Inventarios', description: 'Control de existencias' },
      { title: 'Transporte y Distribución', description: 'Planeación de rutas' },
      { title: 'Logística de Emergencia', description: 'Gestión en desastres' },
      { title: 'Tecnología en Logística', description: 'Herramientas digitales' },
    ]},
  ];
  
  trackData.forEach(track => {
    track.modules.forEach((mod, i) => {
      courses.push({
        id: `course-${track.trackId}-${String(i + 1).padStart(2, '0')}`,
        track_id: track.trackId, title: mod.title, description: mod.description,
        module_number: i + 1, total_modules: track.modules.length,
        duration_minutes: 300, content_type: 'MIXED',
        video_url: null, document_url: null, thumbnail_url: null, order: i + 1,
      });
    });
  });
  
  return courses;
}

// ============================================
// SEED DATA - CAMPS (15)
// ============================================

const CAMPS = [
  { id: 'camp-001', name: 'Centro Comunal El Paraiso', municipality: 'CATIA_LA_MAR', zone: 'CATIA_LA_MAR', address: 'Av. Principal El Paraiso', capacity: 200, current_occupancy: 145, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'cocina', 'sanitarios'], latitude: 10.6017, longitude: -66.9654 },
  { id: 'camp-002', name: 'Escuela Bolivariana Catia La Mar', municipality: 'CATIA_LA_MAR', zone: 'CATIA_LA_MAR', address: 'Calle 5 con Av. 4', capacity: 150, current_occupancy: 98, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios'], latitude: 10.6035, longitude: -66.9678 },
  { id: 'camp-003', name: 'Plaza Bolívar Refugio', municipality: 'CATIA_LA_MAR', zone: 'CATIA_LA_MAR', address: 'Plaza Bolívar Centro', capacity: 100, current_occupancy: 67, status: 'ACTIVO', amenities: ['agua', 'sanitarios'], latitude: 10.6022, longitude: -66.9661 },
  { id: 'camp-004', name: 'Polideportivo La Honda', municipality: 'CATIA_LA_MAR', zone: 'CATIA_LA_MAR', address: 'Carrera 7 La Honda', capacity: 300, current_occupancy: 234, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'cocina', 'sanitarios', 'dormitorios'], latitude: 10.6050, longitude: -66.9700 },
  { id: 'camp-005', name: 'Centro de Salud Barlovento', municipality: 'CATIA_LA_MAR', zone: 'CATIA_LA_MAR', address: 'Av. Barlovento', capacity: 80, current_occupancy: 52, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios', 'medico'], latitude: 10.6010, longitude: -66.9640 },
  { id: 'camp-006', name: 'Colegio República de Venezuela', municipality: 'MAIQUETIA', zone: 'MAIQUETIA', address: 'Av. Bolívar', capacity: 250, current_occupancy: 189, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'cocina', 'sanitarios'], latitude: 10.6000, longitude: -66.9350 },
  { id: 'camp-007', name: 'Centro Social Maiquetía', municipality: 'MAIQUETIA', zone: 'MAIQUETIA', address: 'Calle Principal', capacity: 180, current_occupancy: 132, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios', 'cocina'], latitude: 10.5985, longitude: -66.9335 },
  { id: 'camp-008', name: 'Parque Central Refugio', municipality: 'MAIQUETIA', zone: 'MAIQUETIA', address: 'Parque Central', capacity: 120, current_occupancy: 87, status: 'ACTIVO', amenities: ['agua', 'sanitarios'], latitude: 10.5990, longitude: -66.9340 },
  { id: 'camp-009', name: 'Unidad Educativa Simón Bolívar', municipality: 'MAIQUETIA', zone: 'MAIQUETIA', address: 'Av. 5 de Julio', capacity: 200, current_occupancy: 156, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'sanitarios', 'dormitorios'], latitude: 10.6005, longitude: -66.9360 },
  { id: 'camp-010', name: 'Centro Comunal Macuto', municipality: 'MACUTO', zone: 'MACUTO', address: 'Av. Principal Macuto', capacity: 180, current_occupancy: 123, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios', 'cocina'], latitude: 10.6100, longitude: -66.9200 },
  { id: 'camp-011', name: 'Escuela Ramón Escobar Salas', municipality: 'MACUTO', zone: 'MACUTO', address: 'Calle Macuto', capacity: 150, current_occupancy: 101, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios'], latitude: 10.6110, longitude: -66.9210 },
  { id: 'camp-012', name: 'Playa Caraballeda Refugio', municipality: 'MACUTO', zone: 'MACUTO', address: 'Zona Costera', capacity: 100, current_occupancy: 78, status: 'ACTIVO', amenities: ['agua', 'sanitarios', 'cocina'], latitude: 10.6120, longitude: -66.9220 },
  { id: 'camp-013', name: 'Centro de Educación Caraballeda', municipality: 'CARABALLEDA', zone: 'CARABALLEDA', address: 'Av. Caraballeda Centro', capacity: 220, current_occupancy: 167, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'cocina', 'sanitarios'], latitude: 10.6150, longitude: -66.9100 },
  { id: 'camp-014', name: 'Polideportivo Caraballeda', municipality: 'CARABALLEDA', zone: 'CARABALLEDA', address: 'Carrera 3', capacity: 280, current_occupancy: 215, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios', 'dormitorios', 'cocina'], latitude: 10.6160, longitude: -66.9110 },
  { id: 'camp-015', name: 'Centro San José Caraballeda', municipality: 'CARABALLEDA', zone: 'CARABALLEDA', address: 'Calle San José', capacity: 120, current_occupancy: 89, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios'], latitude: 10.6170, longitude: -66.9120 },
];

// ============================================
// SEED DATA - WIFI NODES (10) - collection: wifi_nodes
// ============================================

const WIFI_NODES = [
  { id: 'wifi-001', name: 'Nodo Fibra Catia Centro', type: 'FIBRA_OPTICA', status: 'ACTIVO', zone: 'CATIA_LA_MAR', signal_strength: 95, bandwidth_mbps: 100, connected_users: 45, max_users: 100, latitude: 10.6020, longitude: -66.9660 },
  { id: 'wifi-002', name: 'Nodo 4G Maiquetía Norte', type: '4G_LTE', status: 'ACTIVO', zone: 'MAIQUETIA', signal_strength: 82, bandwidth_mbps: 50, connected_users: 32, max_users: 80, latitude: 10.5995, longitude: -66.9345 },
  { id: 'wifi-003', name: 'Nodo Satelital Macuto', type: 'SATELITAL', status: 'ACTIVO', zone: 'MACUTO', signal_strength: 75, bandwidth_mbps: 25, connected_users: 28, max_users: 60, latitude: 10.6105, longitude: -66.9205 },
  { id: 'wifi-004', name: 'Nodo MESH Caraballeda', type: 'MESH', status: 'ACTIVO', zone: 'CARABALLEDA', signal_strength: 88, bandwidth_mbps: 75, connected_users: 52, max_users: 120, latitude: 10.6155, longitude: -66.9105 },
  { id: 'wifi-005', name: 'Nodo Fibra La Honda', type: 'FIBRA_OPTICA', status: 'ACTIVO', zone: 'CATIA_LA_MAR', signal_strength: 92, bandwidth_mbps: 100, connected_users: 38, max_users: 100, latitude: 10.6045, longitude: -66.9695 },
  { id: 'wifi-006', name: 'Nodo 4G Av. 5 de Julio', type: '4G_LTE', status: 'MANTENIMIENTO', zone: 'MAIQUETIA', signal_strength: 0, bandwidth_mbps: 0, connected_users: 0, max_users: 80, latitude: 10.6002, longitude: -66.9355 },
  { id: 'wifi-007', name: 'Nodo Satelital Costa Azul', type: 'SATELITAL', status: 'ACTIVO', zone: 'MACUTO', signal_strength: 70, bandwidth_mbps: 25, connected_users: 19, max_users: 60, latitude: 10.6115, longitude: -66.9215 },
  { id: 'wifi-008', name: 'Nodo MESH El Paraíso', type: 'MESH', status: 'ACTIVO', zone: 'CATIA_LA_MAR', signal_strength: 85, bandwidth_mbps: 50, connected_users: 41, max_users: 80, latitude: 10.6025, longitude: -66.9665 },
  { id: 'wifi-009', name: 'Nodo Fibra Caraballeda Centro', type: 'FIBRA_OPTICA', status: 'ACTIVO', zone: 'CARABALLEDA', signal_strength: 97, bandwidth_mbps: 150, connected_users: 67, max_users: 150, latitude: 10.6152, longitude: -66.9102 },
  { id: 'wifi-010', name: 'Nodo 4G Maiquetía Sur', type: '4G_LTE', status: 'DAÑADO', zone: 'MAIQUETIA', signal_strength: 0, bandwidth_mbps: 0, connected_users: 0, max_users: 80, latitude: 10.5988, longitude: -66.9338 },
];

// ============================================
// SEED DATA - PSYCHOLOGISTS (8)
// ============================================

const PSYCHOLOGISTS = [
  { id: 'psy-001', name: 'Dra. Carmen Rosa Martínez', specialty: 'Psicología Clínica', municipality: 'CATIA_LA_MAR', phone: '+58-414-5550001', email: 'carmen.martinez@psi.lg', is_active: true, rating: 4.8, consultations: 156, availability: 'L-V 8am-4pm', modality: 'PRESENCIAL', is_solidarity_network: false, country: 'VE' },
  { id: 'psy-002', name: 'Dr. Luis Fernando Pérez', specialty: 'Psicología de Emergencia', municipality: 'MAIQUETIA', phone: '+58-412-5550002', email: 'luis.perez@psi.lg', is_active: true, rating: 4.9, consultations: 203, availability: 'L-V 7am-3pm', modality: 'ONLINE', is_solidarity_network: false, country: 'VE' },
  { id: 'psy-003', name: 'Dra. Ana Lucía González', specialty: 'Terapia Familiar', municipality: 'MACUTO', phone: '+58-416-5550003', email: 'ana.gonzalez@psi.lg', is_active: true, rating: 4.7, consultations: 134, availability: 'L-V 9am-5pm', modality: 'PRESENCIAL', is_solidarity_network: false, country: 'VE' },
  { id: 'psy-004', name: 'Dr. Roberto Carlos Díaz', specialty: 'Psicología Infantil', municipality: 'CARABALLEDA', phone: '+58-424-5550004', email: 'roberto.diaz@psi.lg', is_active: true, rating: 4.6, consultations: 98, availability: 'L-V 10am-6pm', modality: 'AMBOS', is_solidarity_network: false, country: 'VE' },
  { id: 'psy-005', name: 'Dra. María Eugenia Torres', specialty: 'Trauma y Duelo', municipality: 'CATIA_LA_MAR', phone: '+58-414-5550005', email: 'maria.torres@psi.lg', is_active: true, rating: 4.9, consultations: 245, availability: 'L-V 8am-2pm', modality: 'PRESENCIAL', is_solidarity_network: true, country: 'VE' },
  { id: 'psy-006', name: 'Dr. José Antonio Ramírez', specialty: 'Psicología Social', municipality: 'MAIQUETIA', phone: '+58-412-5550006', email: 'jose.ramirez@psi.lg', is_active: true, rating: 4.5, consultations: 87, availability: 'L-V 1pm-7pm', modality: 'ONLINE', is_solidarity_network: true, country: 'VE' },
  { id: 'psy-007', name: 'Dra. Gabriela Elena López', specialty: 'Manejo de Ansiedad', municipality: 'MACUTO', phone: '+58-416-5550007', email: 'gabriela.lopez@psi.lg', is_active: true, rating: 4.8, consultations: 178, availability: 'L-V 9am-3pm', modality: 'AMBOS', is_solidarity_network: false, country: 'VE' },
  { id: 'psy-008', name: 'Dr. Fernando José García', specialty: 'Rehabilitación Psicosocial', municipality: 'CARABALLEDA', phone: '+58-424-5550008', email: 'fernando.garcia@psi.lg', is_active: true, rating: 4.7, consultations: 112, availability: 'L-V 8am-4pm', modality: 'PRESENCIAL', is_solidarity_network: false, country: 'VE' },
];

// ============================================
// SEED DATA - JOB OPPORTUNITIES (5) - collection: job_opportunities
// ============================================

const JOB_OPPORTUNITIES = [
  { id: 'job-001', company_name: 'Corporación Digitales CA', title: 'Asistente Virtual Remoto', description: 'Buscamos asistente virtual para soporte al cliente', type: 'REMOTE', municipality: 'CATIA_LA_MAR', requirements: ['Computadora propia', 'Internet estable', 'Dominio de redes sociales'], salary_min: 300, salary_max: 500, status: 'OPEN', company_id: 'sponsor-001' },
  { id: 'job-002', company_name: 'Telecom La Guaira', title: 'Técnico de Soporte', description: 'Técnico para instalación y mantenimiento', type: 'ONSITE', municipality: 'MAIQUETIA', requirements: ['Conocimientos técnicos', 'Disponibilidad horaria'], salary_min: 400, salary_max: 700, status: 'OPEN', company_id: 'sponsor-002' },
  { id: 'job-003', company_name: 'Banco del Pueblo', title: 'Ejecutivo de Atención al Cliente', description: 'Ejecutivo para atención digital', type: 'HYBRID', municipality: 'MACUTO', requirements: ['Experiencia en atención al cliente', 'Manejo de computadora'], salary_min: 350, salary_max: 550, status: 'OPEN', company_id: 'sponsor-003' },
  { id: 'job-004', company_name: 'Alimentos del Sur CA', title: 'Auxiliar de Logística', description: 'Auxiliar para gestión de inventarios', type: 'ONSITE', municipality: 'CARABALLEDA', requirements: ['Capacidad física', 'Organización'], salary_min: 280, salary_max: 420, status: 'OPEN', company_id: 'sponsor-004' },
  { id: 'job-005', company_name: 'Construcciones Resilientes', title: 'Diseñador Gráfico Freelance', description: 'Diseñador para redes sociales', type: 'REMOTE', municipality: 'CATIA_LA_MAR', requirements: ['Portafolio', 'Dominio de Canva'], salary_min: 300, salary_max: 600, status: 'OPEN', company_id: 'sponsor-005' },
];

// ============================================
// SEED DATA - SPONSORS (5)
// ============================================

const SPONSORS_DATA = [
  { id: 'spn-001', name: 'Corporación Digitales CA', type: 'COMERCIAL', sector: 'Tecnología', total_contribution: 50000, beneficiaries_assigned: 45, status: 'ACTIVO', zone: 'CATIA_LA_MAR' },
  { id: 'spn-002', name: 'Telecom La Guaira', type: 'CONECTIVIDAD', sector: 'Telecomunicaciones', total_contribution: 75000, beneficiaries_assigned: 62, status: 'ACTIVO', zone: 'MAIQUETIA' },
  { id: 'spn-003', name: 'Banco del Pueblo', type: 'COMERCIAL', sector: 'Finanzas', total_contribution: 30000, beneficiaries_assigned: 28, status: 'ACTIVO', zone: 'MACUTO' },
  { id: 'spn-004', name: 'Alimentos del Sur CA', type: 'INFRAESTRUCTURA', sector: 'Alimentos', total_contribution: 40000, beneficiaries_assigned: 35, status: 'ACTIVO', zone: 'CARABALLEDA' },
  { id: 'spn-005', name: 'Construcciones Resilientes', type: 'INFRAESTRUCTURA', sector: 'Construcción', total_contribution: 60000, beneficiaries_assigned: 50, status: 'ACTIVO', zone: 'CATIA_LA_MAR' },
];

// ============================================
// SEED DATA - REDEMPTION CATALOG (10 items) - collection: redemption_catalog
// ============================================

const REDEMPTION_CATALOG = [
  { id: 'rc-001', name: 'Recarga Móvil $5', description: 'Recarga de $5 para cualquier operador', type: 'RECARGA_MOVIL', points_cost: 50, available: true, image_url: null, stock: 1000 },
  { id: 'rc-002', name: 'Recarga Móvil $10', description: 'Recarga de $10 para cualquier operador', type: 'RECARGA_MOVIL', points_cost: 100, available: true, image_url: null, stock: 1000 },
  { id: 'rc-003', name: 'Bolsa de Alimentos Básica', description: 'Arroz, pasta, atún, aceite, sal', type: 'BOLSA_ALIMENTOS', points_cost: 200, available: true, image_url: null, stock: 500 },
  { id: 'rc-004', name: 'Bolsa de Alimentos Familiar', description: 'Bolsa completa para familia de 4', type: 'BOLSA_ALIMENTOS', points_cost: 400, available: true, image_url: null, stock: 300 },
  { id: 'rc-005', name: 'Capital Semilla $25', description: 'Micro-crédito para emprendimiento', type: 'CAPITAL_SEMILLA', points_cost: 500, available: true, image_url: null, stock: 100 },
  { id: 'rc-006', name: 'Tablet Básica', description: 'Tablet para acceso digital', type: 'DISPOSITIVO', points_cost: 1000, available: true, image_url: null, stock: 50 },
  { id: 'rc-007', name: 'Curso Extra: Inglés', description: 'Curso de inglés básico online', type: 'CURSO_EXTRA', points_cost: 300, available: true, image_url: null, stock: 200 },
  { id: 'rc-008', name: 'Certificado Digital', description: 'Certificado con QR verificable', type: 'CERTIFICADO', points_cost: 150, available: true, image_url: null, stock: 9999 },
  { id: 'rc-009', name: 'Kit de Oficina', description: 'Cuaderno, bolígrafos, clips, carpeta', type: 'BOLSA_ALIMENTOS', points_cost: 100, available: true, image_url: null, stock: 400 },
  { id: 'rc-010', name: 'Recarga Móvil $20', description: 'Recarga de $20 para cualquier operador', type: 'RECARGA_MOVIL', points_cost: 200, available: true, image_url: null, stock: 800 },
];

// ============================================
// SEED DATA - DELIVERIES (5)
// ============================================

const DELIVERIES = [
  { id: 'del-001', type: 'ALIMENTOS', destination: 'Centro Comunal El Paraiso', destination_camp_id: 'camp-001', status: 'ENTREGADO', quantity: 200, unit: 'raciones', date: '2026-07-10', route: 'Ruta Catia La Mar' },
  { id: 'del-002', type: 'MEDICAMENTOS', destination: 'Centro de Salud Barlovento', destination_camp_id: 'camp-005', status: 'EN_TRANSITO', quantity: 50, unit: 'kits', date: '2026-07-12', route: 'Ruta Catia Sur' },
  { id: 'del-003', type: 'EQUIPOS', destination: 'Escuela Bolivariana', destination_camp_id: 'camp-002', status: 'PENDIENTE', quantity: 30, unit: 'laptops', date: '2026-07-14', route: 'Ruta Maiquetía' },
  { id: 'del-004', type: 'BOLSAS', destination: 'Polideportivo La Honda', destination_camp_id: 'camp-004', status: 'ENTREGADO', quantity: 150, unit: 'bolsas', date: '2026-07-09', route: 'Ruta La Honda' },
  { id: 'del-005', type: 'RECARGAS', destination: 'Múltiples beneficiarios', destination_camp_id: null, status: 'COMPLETADO', quantity: 500, unit: 'recargas', date: '2026-07-11', route: 'Distribución digital' },
];

// ============================================
// SEED DATA - DISTRIBUTION ROUTES (3)
// ============================================

const DISTRIBUTION_ROUTES = [
  { id: 'route-001', name: 'Ruta Catia La Mar', status: 'COMPLETADA', camps: ['camp-001', 'camp-002', 'camp-003', 'camp-004', 'camp-005'], total_deliveries: 12, completed_deliveries: 12 },
  { id: 'route-002', name: 'Ruta Maiquetía', status: 'ACTIVA', camps: ['camp-006', 'camp-007', 'camp-008', 'camp-009'], total_deliveries: 8, completed_deliveries: 5 },
  { id: 'route-003', name: 'Ruta Macuto-Caraballeda', status: 'ACTIVA', camps: ['camp-010', 'camp-011', 'camp-012', 'camp-013', 'camp-014', 'camp-015'], total_deliveries: 10, completed_deliveries: 3 },
];

// ============================================
// SEED DATA - FOOD DISTRIBUTIONS (5)
// ============================================

const FOOD_DISTRIBUTIONS = [
  { id: 'fd-001', camp_id: 'camp-001', date: '2026-07-10', meals_served: 200, type: 'ALMUERZO', status: 'COMPLETADO' },
  { id: 'fd-002', camp_id: 'camp-006', date: '2026-07-10', meals_served: 189, type: 'ALMUERZO', status: 'COMPLETADO' },
  { id: 'fd-003', camp_id: 'camp-004', date: '2026-07-11', meals_served: 234, type: 'ALMUERZO', status: 'COMPLETADO' },
  { id: 'fd-004', camp_id: 'camp-010', date: '2026-07-11', meals_served: 123, type: 'DESAYUNO', status: 'COMPLETADO' },
  { id: 'fd-005', camp_id: 'camp-013', date: '2026-07-12', meals_served: 167, type: 'ALMUERZO', status: 'PENDIENTE' },
];

// ============================================
// SEED DATA - MOBILE TOPUPS (10)
// ============================================

const MOBILE_TOPUPS = [
  { id: 'mt-001', user_id: 'user-0001', amount: 5, carrier: 'MOVILNET', status: 'COMPLETADO', date: '2026-07-10' },
  { id: 'mt-002', user_id: 'user-0002', amount: 5, carrier: 'MOVISTAR', status: 'COMPLETADO', date: '2026-07-10' },
  { id: 'mt-003', user_id: 'user-0003', amount: 10, carrier: 'DIGITEL', status: 'COMPLETADO', date: '2026-07-11' },
  { id: 'mt-004', user_id: 'user-0004', amount: 5, carrier: 'MOVILNET', status: 'COMPLETADO', date: '2026-07-11' },
  { id: 'mt-005', user_id: 'user-0005', amount: 10, carrier: 'MOVISTAR', status: 'PENDIENTE', date: '2026-07-12' },
  { id: 'mt-006', user_id: 'user-0006', amount: 5, carrier: 'DIGITEL', status: 'COMPLETADO', date: '2026-07-12' },
  { id: 'mt-007', user_id: 'user-0007', amount: 5, carrier: 'MOVILNET', status: 'COMPLETADO', date: '2026-07-10' },
  { id: 'mt-008', user_id: 'user-0008', amount: 10, carrier: 'MOVISTAR', status: 'COMPLETADO', date: '2026-07-11' },
  { id: 'mt-009', user_id: 'user-0009', amount: 5, carrier: 'DIGITEL', status: 'PENDIENTE', date: '2026-07-12' },
  { id: 'mt-010', user_id: 'user-0010', amount: 10, carrier: 'MOVILNET', status: 'COMPLETADO', date: '2026-07-10' },
];

// ============================================
// SEED DATA - COMPANIES (5)
// ============================================

const COMPANIES = [
  { id: 'comp-001', name: 'Corporación Digitales CA', sector: 'Tecnología', is_sponsor: true, owner_id: 'sponsor-001', municipality: 'CATIA_LA_MAR', employee_count: 45 },
  { id: 'comp-002', name: 'Telecom La Guaira', sector: 'Telecomunicaciones', is_sponsor: true, owner_id: 'sponsor-002', municipality: 'MAIQUETIA', employee_count: 120 },
  { id: 'comp-003', name: 'Banco del Pueblo', sector: 'Finanzas', is_sponsor: true, owner_id: 'sponsor-003', municipality: 'MACUTO', employee_count: 80 },
  { id: 'comp-004', name: 'Alimentos del Sur CA', sector: 'Alimentos', is_sponsor: true, owner_id: 'sponsor-004', municipality: 'CARABALLEDA', employee_count: 60 },
  { id: 'comp-005', name: 'Construcciones Resilientes', sector: 'Construcción', is_sponsor: true, owner_id: 'sponsor-005', municipality: 'CATIA_LA_MAR', employee_count: 35 },
];

// ============================================
// SEED DATA - COORDINATION EVENTS (5) - collection: coordination_events
// ============================================

const COORDINATION_EVENTS = [
  { id: 'evt-001', title: 'Charla: Prevención de Riesgos', description: 'Charla informativa sobre seguridad', type: 'CHARLA', status: 'PROGRAMADO', date: '2026-07-20T10:00:00', shelter_id: 'camp-001', speakers: ['Dr. Carlos Méndez'], capacity: 50, registered: 32 },
  { id: 'evt-002', title: 'Taller: Primeros Auxilios', description: 'Taller práctico de primeros auxilios', type: 'TALLER', status: 'PROGRAMADO', date: '2026-07-22T14:00:00', shelter_id: 'camp-006', speakers: ['Enf. María López'], capacity: 30, registered: 28 },
  { id: 'evt-003', title: 'Capacitación: Marketing Digital', description: 'Curso intensivo de marketing', type: 'CAPACITACION', status: 'PROGRAMADO', date: '2026-07-25T09:00:00', shelter_id: 'camp-004', speakers: ['Ing. Ana García'], capacity: 40, registered: 35 },
  { id: 'evt-004', title: 'Reunión de Coordinación', description: 'Reunión de coordinadores', type: 'REUNION', status: 'FINALIZADO', date: '2026-07-01T10:00:00', shelter_id: 'camp-013', speakers: [], capacity: 20, registered: 15 },
  { id: 'evt-005', title: 'Evento Social: Día de la Amistad', description: 'Actividad recreativa para familias', type: 'SOCIAL', status: 'PROGRAMADO', date: '2026-07-30T15:00:00', shelter_id: 'camp-010', speakers: [], capacity: 100, registered: 65 },
];

// ============================================
// SEED DATA - COORDINATION MEETINGS (5) - collection: coordination_meetings
// ============================================

const COORDINATION_MEETINGS = [
  { id: 'mtg-001', title: 'Reunión Semanal de Coordinadores', description: 'Seguimiento semanal de actividades', status: 'PROGRAMADO', date: '2026-07-14T09:00:00', shelter_id: 'camp-001', participants: ['coord-001', 'coord-002', 'coord-003', 'coord-004'], action_items: [] },
  { id: 'mtg-002', title: 'Reunión de Logística', description: 'Coordinación de entregas', status: 'PROGRAMADO', date: '2026-07-15T14:00:00', shelter_id: 'camp-006', participants: ['coord-001', 'coord-002'], action_items: [] },
  { id: 'mtg-003', title: 'Reunión con Patrocinadores', description: 'Presentación de avances', status: 'FINALIZADO', date: '2026-07-08T10:00:00', shelter_id: 'camp-013', participants: ['coord-001', 'spn-001', 'spn-002'], action_items: [{ description: 'Enviar reporte mensual', completed: false }] },
  { id: 'mtg-004', title: 'Evaluación de Emergencia', description: 'Revisión de protocolos', status: 'FINALIZADO', date: '2026-07-05T08:00:00', shelter_id: 'camp-004', participants: ['coord-001', 'coord-003'], action_items: [{ description: 'Actualizar lista de contactos', completed: true }] },
  { id: 'mtg-005', title: 'Reunión de Planificación', description: 'Planificación del próximo mes', status: 'PROGRAMADO', date: '2026-07-28T10:00:00', shelter_id: 'camp-010', participants: ['coord-001', 'coord-002', 'coord-003', 'coord-004'], action_items: [] },
];

// ============================================
// SEED DATA - SHELTERS (5 - additional to camps)
// ============================================

const SHELTERS = [
  { id: 'shl-001', name: 'Albergue Principal Catia La Mar', municipality: 'CATIA_LA_MAR', status: 'ACTIVO', capacity: 500, current_occupancy: 380, coordinator_id: 'coord-001' },
  { id: 'shl-002', name: 'Albergue Maiquetía Centro', municipality: 'MAIQUETIA', status: 'ACTIVO', capacity: 350, current_occupancy: 275, coordinator_id: 'coord-002' },
  { id: 'shl-003', name: 'Albergue Macuto Playa', municipality: 'MACUTO', status: 'ACTIVO', capacity: 250, current_occupancy: 190, coordinator_id: 'coord-003' },
  { id: 'shl-004', name: 'Albergue Caraballeda Norte', municipality: 'CARABALLEDA', status: 'ACTIVO', capacity: 400, current_occupancy: 310, coordinator_id: 'coord-004' },
  { id: 'shl-005', name: 'Albergue de Respaldo La Honda', municipality: 'CATIA_LA_MAR', status: 'INACTIVO', capacity: 200, current_occupancy: 0, coordinator_id: 'coord-001' },
];

// ============================================
// SEED DATA - BENEFICIARIES (10 - for matching)
// ============================================

const BENEFICIARIES = [
  { id: 'ben-001', anonymous_code: 'BEN-CAT-001', location: 'CATIA_LA_MAR', profile_type: 'COMERCIANTE', digital_level: 'BASIC', track_interest: ['Continuidad Comercial Digital'], needs: [{ type: 'CONECTIVIDAD', description: 'Acceso a internet', estimated_cost: 50 }], priority_score: 85, enrollment_status: 'IN_PROGRESS', total_resilience_points: 150, user_id: 'user-0001' },
  { id: 'ben-002', anonymous_code: 'BEN-MAI-002', location: 'MAIQUETIA', profile_type: 'ESTUDIANTE', digital_level: 'NONE', track_interest: ['Micro-oficios Remotos'], needs: [{ type: 'INFRAESTRUCTURA', description: 'Computadora', estimated_cost: 200 }], priority_score: 92, enrollment_status: null, total_resilience_points: 0, user_id: 'user-0005' },
  { id: 'ben-003', anonymous_code: 'BEN-MAC-003', location: 'MACUTO', profile_type: 'EMPLEADO', digital_level: 'INTERMEDIATE', track_interest: ['Logística de Suministros'], needs: [], priority_score: 60, enrollment_status: 'COMPLETED', total_resilience_points: 350, user_id: 'user-0010' },
  { id: 'ben-004', anonymous_code: 'BEN-CAR-004', location: 'CARABALLEDA', profile_type: 'COMERCIANTE', digital_level: 'BASIC', track_interest: ['Continuidad Comercial Digital'], needs: [{ type: 'CONECTIVIDAD', description: 'WiFi', estimated_cost: 30 }], priority_score: 78, enrollment_status: 'IN_PROGRESS', total_resilience_points: 100, user_id: 'user-0015' },
  { id: 'ben-005', anonymous_code: 'BEN-CAT-005', location: 'CATIA_LA_MAR', profile_type: 'FAMILIA', digital_level: 'NONE', track_interest: ['Micro-oficios Remotos'], needs: [{ type: 'INFRAESTRUCTURA', description: 'Tablet', estimated_cost: 150 }], priority_score: 88, enrollment_status: null, total_resilience_points: 0, user_id: 'user-0020' },
  { id: 'ben-006', anonymous_code: 'BEN-MAI-006', location: 'MAIQUETIA', profile_type: 'COMERCIANTE', digital_level: 'BASIC', track_interest: ['Continuidad Comercial Digital'], needs: [], priority_score: 55, enrollment_status: 'IN_PROGRESS', total_resilience_points: 200, user_id: 'user-0025' },
  { id: 'ben-007', anonymous_code: 'BEN-MAC-007', location: 'MACUTO', profile_type: 'ESTUDIANTE', digital_level: 'INTERMEDIATE', track_interest: ['Logística de Suministros'], needs: [], priority_score: 45, enrollment_status: 'COMPLETED', total_resilience_points: 400, user_id: 'user-0030' },
  { id: 'ben-008', anonymous_code: 'BEN-CAR-008', location: 'CARABALLEDA', profile_type: 'EMPLEADO', digital_level: 'BASIC', track_interest: ['Micro-oficios Remotos'], needs: [{ type: 'CONECTIVIDAD', description: 'Internet', estimated_cost: 40 }], priority_score: 72, enrollment_status: 'IN_PROGRESS', total_resilience_points: 80, user_id: 'user-0035' },
  { id: 'ben-009', anonymous_code: 'BEN-CAT-009', location: 'CATIA_LA_MAR', profile_type: 'COMERCIANTE', digital_level: 'ADVANCED', track_interest: ['Continuidad Comercial Digital'], needs: [], priority_score: 30, enrollment_status: 'COMPLETED', total_resilience_points: 500, user_id: 'user-0040' },
  { id: 'ben-010', anonymous_code: 'BEN-MAI-010', location: 'MAIQUETIA', profile_type: 'FAMILIA', digital_level: 'NONE', track_interest: ['Micro-oficios Remotos'], needs: [{ type: 'INFRAESTRUCTURA', description: 'Computadora', estimated_cost: 200 }], priority_score: 95, enrollment_status: null, total_resilience_points: 0, user_id: 'user-0045' },
];

// ============================================
// SEED DATA - SPONSOR MATCHES (5)
// ============================================

const SPONSOR_MATCHES = [
  { id: 'match-001', sponsor_id: 'spn-001', beneficiary_id: 'ben-001', status: 'ASIGNADO', score: 85, match_date: '2026-07-01' },
  { id: 'match-002', sponsor_id: 'spn-002', beneficiary_id: 'ben-002', status: 'ASIGNADO', score: 78, match_date: '2026-07-02' },
  { id: 'match-003', sponsor_id: 'spn-003', beneficiary_id: 'ben-003', status: 'COMPLETADO', score: 92, match_date: '2026-06-15' },
  { id: 'match-004', sponsor_id: 'spn-004', beneficiary_id: 'ben-004', status: 'PENDIENTE', score: 70, match_date: '2026-07-10' },
  { id: 'match-005', sponsor_id: 'spn-005', beneficiary_id: 'ben-005', status: 'ASIGNADO', score: 88, match_date: '2026-07-05' },
];

// ============================================
// SEED DATA - RESILIENCE ACTIVITIES (6) - user data samples
// ============================================

const RESILIENCE_EMOTIONAL_CANVAS = [
  { id: 'ec-001', user_id: 'user-0001', emotion: 'esperanza', color: '#4ade80', shapes: 12, created_at: '2026-07-10T14:30:00' },
  { id: 'ec-002', user_id: 'user-0005', emotion: 'tristeza', color: '#60a5fa', shapes: 8, created_at: '2026-07-11T10:15:00' },
  { id: 'ec-003', user_id: 'user-0010', emotion: 'alegría', color: '#fbbf24', shapes: 15, created_at: '2026-07-12T16:00:00' },
];

const RESILIENCE_MY_GIFTS = [
  { id: 'mg-001', user_id: 'user-0001', gifts: ['Creatividad', 'Empatía', 'Resiliencia'], custom_gifts: ['Leadership'], created_at: '2026-07-10T15:00:00' },
  { id: 'mg-002', user_id: 'user-0005', gifts: ['Paciencia', 'Optimismo'], custom_gifts: [], created_at: '2026-07-11T11:00:00' },
];

const RESILIENCE_JOURNAL = [
  { id: 'jn-001', user_id: 'user-0001', date: '2026-07-10', mood: 'bien', content: 'Hoy me sentí productivo. Completé dos módulos del curso.', gratitude: ['Salud', 'Familia'], created_at: '2026-07-10T20:00:00' },
  { id: 'jn-002', user_id: 'user-0001', date: '2026-07-11', mood: 'regular', content: 'Difícil día pero seguí adelante.', gratitude: ['Comida', 'Techo'], created_at: '2026-07-11T21:00:00' },
  { id: 'jn-003', user_id: 'user-0005', date: '2026-07-10', mood: 'genial', content: 'Aprendí algo nuevo hoy.', gratitude: ['Oportunidad', 'Apoyo'], created_at: '2026-07-10T19:30:00' },
];

const RESILIENCE_MINDFULNESS = [
  { id: 'mf-001', user_id: 'user-0001', session_type: 'respiracion', duration_minutes: 10, completed: true, created_at: '2026-07-10T08:00:00' },
  { id: 'mf-002', user_id: 'user-0005', session_type: 'body_scan', duration_minutes: 15, completed: true, created_at: '2026-07-11T07:30:00' },
];

const RESILIENCE_ACTION_PLANS = [
  { id: 'ap-001', user_id: 'user-0001', title: 'Plan de Emprendimiento Digital', steps: [{ text: 'Completar módulo de marketing', completed: true }, { text: 'Crear cuenta de negocio en redes', completed: false }, { text: 'Diseñar primer post', completed: false }], status: 'EN_PROGRESO', created_at: '2026-07-10T16:00:00' },
];

const RESILIENCE_APA_ASSESSMENTS = [
  { id: 'aa-001', user_id: 'user-0001', score: 75, principles: { self_awareness: 8, self_regulation: 7, optimism: 8, empathy: 9, social_skills: 7, motivation: 8, resilience: 8, gratitude: 7, mindfulness: 6, growth_mindset: 8 }, completed_at: '2026-07-10T17:00:00' },
];

// ============================================
// SEED DATA - SUPPORT NETWORK REGISTRATIONS (3)
// ============================================

const SUPPORT_NETWORK_REGISTRATIONS = [
  { id: 'snr-001', user_id: 'user-0001', full_name: 'María González', specialty: 'Trabajo Social', institution: 'FPV', status: 'VERIFICADO', created_at: '2026-07-01T10:00:00' },
  { id: 'snr-002', user_id: 'user-0005', full_name: 'Carlos López', specialty: 'Psicología Comunitaria', institution: 'MPPS', status: 'PENDIENTE', created_at: '2026-07-05T14:00:00' },
  { id: 'snr-003', user_id: 'user-0010', full_name: 'Ana Martínez', specialty: 'Educación', institution: 'MINEDU', status: 'VERIFICADO', created_at: '2026-07-08T09:00:00' },
];

// ============================================
// SEED DATA - NOTIFICATIONS (10)
// ============================================

const NOTIFICATIONS = [
  { id: 'notif-001', user_id: 'user-0001', title: '¡Bienvenido!', body: 'Comienza tu camino hacia la reconstrucción digital.', type: 'SYSTEM', read: false },
  { id: 'notif-002', user_id: 'user-0001', title: 'Curso completado', body: 'Has completado "Fundamentos del Marketing Digital".', type: 'ENROLLMENT', read: false },
  { id: 'notif-003', user_id: 'user-0005', title: '¡Bienvenido!', body: 'Comienza tu camino hacia la reconstrucción digital.', type: 'SYSTEM', read: true },
  { id: 'notif-004', user_id: 'user-0010', title: 'Puntos otorgados', body: 'Has ganado 25 puntos por aprobar un quiz.', type: 'SYSTEM', read: false },
  { id: 'notif-005', user_id: 'spn-001', title: 'Nuevo patrocinio', body: 'Tu patrocinio ha sido registrado.', type: 'SPONSORSHIP', read: false },
  { id: 'notif-006', user_id: 'user-0001', title: 'Recordatorio', body: 'No olvides completar tu diario de hoy.', type: 'SYSTEM', read: false },
  { id: 'notif-007', user_id: 'user-0015', title: 'Nuevo curso disponible', body: 'Continuidad Comercial Digital ya está disponible.', type: 'ENROLLMENT', read: true },
  { id: 'notif-008', user_id: 'user-0020', title: 'Canje procesado', body: 'Tu recarga móvil está en camino.', type: 'SYSTEM', read: false },
  { id: 'notif-009', user_id: 'user-0001', title: 'Racha de 7 días', body: '¡Felicidades! Llevas 7 días consecutivos.', type: 'SYSTEM', read: false },
  { id: 'notif-010', user_id: 'user-0025', title: 'Certificado listo', body: 'Tu certificado de "Micro-oficios" está disponible.', type: 'SYSTEM', read: false },
];

// ============================================
// SEED DATA - CERTIFICATES (5)
// ============================================

const CERTIFICATES = [
  { id: 'cert-001', user_id: 'user-0001', course_name: 'Fundamentos del Marketing Digital', track_name: 'Continuidad Comercial Digital', verification_code: 'LG-2026-0001', issued_at: '2026-07-10', completion_date: '2026-07-10' },
  { id: 'cert-002', user_id: 'user-0010', course_name: 'Introducción al Trabajo Remoto', track_name: 'Micro-oficios Remotos', verification_code: 'LG-2026-0002', issued_at: '2026-07-05', completion_date: '2026-07-05' },
  { id: 'cert-003', user_id: 'user-0030', course_name: 'Fundamentos de Logística', track_name: 'Logística de Suministros', verification_code: 'LG-2026-0003', issued_at: '2026-06-28', completion_date: '2026-06-28' },
  { id: 'cert-004', user_id: 'user-0040', course_name: 'Redes Sociales para Negocios', track_name: 'Continuidad Comercial Digital', verification_code: 'LG-2026-0004', issued_at: '2026-07-12', completion_date: '2026-07-12' },
  { id: 'cert-005', user_id: 'user-0005', course_name: 'Asistente Virtual', track_name: 'Micro-oficios Remotos', verification_code: 'LG-2026-0005', issued_at: '2026-07-08', completion_date: '2026-07-08' },
];

// ============================================
// SEED DATA - IMPACT METRICS
// ============================================

const IMPACT_METRICS = [{
  id: 'current',
  total_beneficiaries: 85,
  total_users: 100,
  courses_completed: 42,
  total_sponsorships_active: 5,
  total_funds_raised: 255000,
}];

// ============================================
// SEED DATA - USER REDEMPTIONS (5) - collection: user_redemptions
// ============================================

const USER_REDEMPTIONS = [
  { id: 'ur-001', user_id: 'user-0001', item_id: 'rc-001', item_name: 'Recarga Móvil $5', points_cost: 50, status: 'ENTREGADO', camp_id: 'camp-001', created_at: '2026-07-08' },
  { id: 'ur-002', user_id: 'user-0005', item_id: 'rc-003', item_name: 'Bolsa de Alimentos Básica', points_cost: 200, status: 'PROCESADO', camp_id: 'camp-006', created_at: '2026-07-10' },
  { id: 'ur-003', user_id: 'user-0010', item_id: 'rc-008', item_name: 'Certificado Digital', points_cost: 150, status: 'ENTREGADO', camp_id: null, created_at: '2026-07-05' },
  { id: 'ur-004', user_id: 'user-0015', item_id: 'rc-002', item_name: 'Recarga Móvil $10', points_cost: 100, status: 'PENDIENTE', camp_id: 'camp-010', created_at: '2026-07-12' },
  { id: 'ur-005', user_id: 'user-0020', item_id: 'rc-009', item_name: 'Kit de Oficina', points_cost: 100, status: 'ENTREGADO', camp_id: 'camp-004', created_at: '2026-07-11' },
];

// ============================================
// SEED DATA - RESILIENCE ACTIVITIES CATALOG (6) - collection: resilienceActivities
// ============================================

const RESILIENCE_ACTIVITIES_CATALOG = [
  { id: 'activity-001', title: 'Claridad Emocional', description: 'Explora tus sentimientos a través del color y las formas', type: 'EMOTIONAL_CANVAS', points: 15, icon: '🎨' },
  { id: 'activity-002', title: 'Mis Dones y Talentos', description: 'Descubre y celebra tus cualidades positivas', type: 'MY_GIFTS', points: 20, icon: '🎁' },
  { id: 'activity-003', title: 'Diario de Reflexión', description: 'Reflexiona sobre tu día y cultiva la gratitud', type: 'DAILY_JOURNAL', points: 10, icon: '📝' },
  { id: 'activity-004', title: 'Sesiones de Mindfulness', description: 'Practica la atención plena con sesiones guiadas', type: 'MINDFULNESS', points: 10, icon: '🧘' },
  { id: 'activity-005', title: 'Plan de Acción Personal', description: 'Crea un plan para alcanzar tus metas', type: 'ACTION_PLAN', points: 15, icon: '🎯' },
  { id: 'activity-006', title: 'Evaluación de Resiliencia', description: 'Mide tu nivel de resiliencia personal', type: 'APA_ASSESSMENT', points: 25, icon: '📋' },
];

// ============================================
// GENERATE ENROLLMENTS
// ============================================

function generateEnrollments(users) {
  const enrollments = [];
  const students = users.filter(u => u.role === 'STUDENT').slice(0, 50);
  
  students.forEach((student, i) => {
    const trackIndex = i % 3;
    const trackId = `track-00${trackIndex + 1}`;
    const maxModules = [8, 6, 5][trackIndex];
    const moduleIndex = i % maxModules;
    const courseId = `course-${trackId}-${String(moduleIndex + 1).padStart(2, '0')}`;
    const progress = Math.floor(Math.random() * 100);
    const status = progress === 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
    
    enrollments.push({
      id: `enrollment-${String(i + 1).padStart(4, '0')}`,
      student_id: student.id, course_id: courseId, track_id: trackId,
      status, progress_percent: progress, completed_resources: [],
      quiz_score: progress === 100 ? Math.floor(Math.random() * 30) + 70 : null,
      started_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
      completed_at: progress === 100 ? new Date().toISOString() : null,
      last_accessed: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000).toISOString(),
    });
  });
  
  return enrollments;
}

// ============================================
// GENERATE POINTS TRANSACTIONS
// ============================================

function generatePointsTransactions(users) {
  const transactions = [];
  const students = users.filter(u => u.role === 'STUDENT');
  const reasons = ['MODULE_COMPLETED', 'QUIZ_PASSED', 'COURSE_COMPLETED', 'DAILY_ATTENDANCE', 'REFERRAL'];
  
  students.slice(0, 30).forEach((student, i) => {
    const numTransactions = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < numTransactions; j++) {
      transactions.push({
        id: `tx-${String(i * 5 + j + 1).padStart(5, '0')}`,
        user_id: student.id,
        points: [10, 25, 100, 5, 50][Math.floor(Math.random() * 5)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        reference_id: null,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
      });
    }
  });
  
  return transactions;
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function seed() {
  console.log('🌱 Starting Firestore seed...\n');
  
  try {
    // Core collections
    if (!collectionFilter || collectionFilter === 'users') {
      console.log('👤 Seeding users...');
      const users = generateUsers(100);
      await seedCollection('users', users);
      
      if (!collectionFilter || collectionFilter === 'enrollments') {
        console.log('\n📚 Seeding enrollments...');
        await seedCollection('enrollments', generateEnrollments(users));
      }
      
      if (!collectionFilter || collectionFilter === 'points') {
        console.log('\n⭐ Seeding points transactions...');
        await seedCollection('points_transactions', generatePointsTransactions(users));
      }
    }
    
    if (!collectionFilter || collectionFilter === 'tracks') {
      console.log('\n🛤️  Seeding tracks...');
      await seedCollection('tracks', TRACKS);
    }
    
    if (!collectionFilter || collectionFilter === 'courses') {
      console.log('\n📖 Seeding courses...');
      await seedCollection('courses', generateCourses());
    }
    
    if (!collectionFilter || collectionFilter === 'camps') {
      console.log('\n🏕️  Seeding camps...');
      await seedCollection('camps', CAMPS);
    }
    
    // Infrastructure
    if (!collectionFilter || collectionFilter === 'wifi_nodes') {
      console.log('\n📶 Seeding wifi_nodes...');
      await seedCollection('wifi_nodes', WIFI_NODES);
    }
    
    if (!collectionFilter || collectionFilter === 'psychologists') {
      console.log('\n🧠 Seeding psychologists...');
      await seedCollection('psychologists', PSYCHOLOGISTS);
    }
    
    if (!collectionFilter || collectionFilter === 'jobs') {
      console.log('\n💼 Seeding job_opportunities...');
      await seedCollection('job_opportunities', JOB_OPPORTUNITIES);
    }
    
    // Sponsorship ecosystem
    if (!collectionFilter || collectionFilter === 'sponsors') {
      console.log('\n🏢 Seeding sponsors...');
      await seedCollection('sponsors', SPONSORS_DATA);
    }
    
    if (!collectionFilter || collectionFilter === 'companies') {
      console.log('\n🏭 Seeding companies...');
      await seedCollection('companies', COMPANIES);
    }
    
    if (!collectionFilter || collectionFilter === 'beneficiaries') {
      console.log('\n👥 Seeding beneficiaries...');
      await seedCollection('beneficiaries', BENEFICIARIES);
    }
    
    if (!collectionFilter || collectionFilter === 'sponsor_matches') {
      console.log('\n🤝 Seeding sponsor_matches...');
      await seedCollection('sponsor_matches', SPONSOR_MATCHES);
    }
    
    // Logistics
    if (!collectionFilter || collectionFilter === 'deliveries') {
      console.log('\n🚚 Seeding deliveries...');
      await seedCollection('deliveries', DELIVERIES);
    }
    
    if (!collectionFilter || collectionFilter === 'routes') {
      console.log('\n🗺️  Seeding distribution_routes...');
      await seedCollection('distribution_routes', DISTRIBUTION_ROUTES);
    }
    
    if (!collectionFilter || collectionFilter === 'food') {
      console.log('\n🍽️  Seeding food_distributions...');
      await seedCollection('food_distributions', FOOD_DISTRIBUTIONS);
    }
    
    if (!collectionFilter || collectionFilter === 'topups') {
      console.log('\n📱 Seeding mobile_topups...');
      await seedCollection('mobile_topups', MOBILE_TOPUPS);
    }
    
    // Coordination
    if (!collectionFilter || collectionFilter === 'shelters') {
      console.log('\n🏠 Seeding shelters...');
      await seedCollection('shelters', SHELTERS);
    }
    
    if (!collectionFilter || collectionFilter === 'events') {
      console.log('\n🎤 Seeding coordination_events...');
      await seedCollection('coordination_events', COORDINATION_EVENTS);
    }
    
    if (!collectionFilter || collectionFilter === 'meetings') {
      console.log('\n👥 Seeding coordination_meetings...');
      await seedCollection('coordination_meetings', COORDINATION_MEETINGS);
    }
    
    // Resilience activities
    if (!collectionFilter || collectionFilter === 'resilience') {
      console.log('\n💪 Seeding resilience activity data...');
      await seedCollection('resilience_emotional_canvas', RESILIENCE_EMOTIONAL_CANVAS);
      await seedCollection('resilience_my_gifts', RESILIENCE_MY_GIFTS);
      await seedCollection('resilience_journal', RESILIENCE_JOURNAL);
      await seedCollection('resilience_mindfulness', RESILIENCE_MINDFULNESS);
      await seedCollection('resilience_action_plans', RESILIENCE_ACTION_PLANS);
      await seedCollection('resilience_apa_assessments', RESILIENCE_APA_ASSESSMENTS);
    }
    
    if (!collectionFilter || collectionFilter === 'resilienceActivities') {
      console.log('\n📋 Seeding resilienceActivities catalog...');
      await seedCollection('resilienceActivities', RESILIENCE_ACTIVITIES_CATALOG);
    }
    
    // Redemption
    if (!collectionFilter || collectionFilter === 'catalog') {
      console.log('\n🎁 Seeding redemption_catalog...');
      await seedCollection('redemption_catalog', REDEMPTION_CATALOG);
    }
    
    if (!collectionFilter || collectionFilter === 'redemptions') {
      console.log('\n🏅 Seeding user_redemptions...');
      await seedCollection('user_redemptions', USER_REDEMPTIONS);
    }
    
    // Notifications & certificates
    if (!collectionFilter || collectionFilter === 'notifications') {
      console.log('\n🔔 Seeding notifications...');
      await seedCollection('notifications', NOTIFICATIONS);
    }
    
    if (!collectionFilter || collectionFilter === 'certificates') {
      console.log('\n📜 Seeding certificates...');
      await seedCollection('certificates', CERTIFICATES);
    }
    
    // Support network
    if (!collectionFilter || collectionFilter === 'support_network') {
      console.log('\n🌐 Seeding support_network_registrations...');
      await seedCollection('support_network_registrations', SUPPORT_NETWORK_REGISTRATIONS);
    }
    
    // Impact metrics
    if (!collectionFilter || collectionFilter === 'metrics') {
      console.log('\n📊 Seeding impact_metrics...');
      await seedCollection('impact_metrics', IMPACT_METRICS);
    }
    
    console.log('\n✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  ─── Core ───');
    console.log('  users:                ~100');
    console.log('  tracks:               3');
    console.log('  courses:              19');
    console.log('  enrollments:          ~50');
    console.log('  points_transactions:  ~150');
    console.log('  ─── Infrastructure ───');
    console.log('  camps:                15');
    console.log('  wifi_nodes:           10');
    console.log('  psychologists:        8');
    console.log('  shelters:             5');
    console.log('  ─── Sponsorship ───');
    console.log('  sponsors:             5');
    console.log('  companies:            5');
    console.log('  beneficiaries:        10');
    console.log('  sponsor_matches:      5');
    console.log('  ─── Logistics ───');
    console.log('  deliveries:           5');
    console.log('  distribution_routes:  3');
    console.log('  food_distributions:   5');
    console.log('  mobile_topups:        10');
    console.log('  ─── Coordination ───');
    console.log('  coordination_events:  5');
    console.log('  coordination_meetings: 5');
    console.log('  ─── Resilience ───');
    console.log('  resilienceActivities: 6 (catalog)');
    console.log('  resilience_emotional_canvas: 3');
    console.log('  resilience_my_gifts:  2');
    console.log('  resilience_journal:   3');
    console.log('  resilience_mindfulness: 2');
    console.log('  resilience_action_plans: 1');
    console.log('  resilience_apa_assessments: 1');
    console.log('  ─── Redemption ───');
    console.log('  redemption_catalog:   10');
    console.log('  user_redemptions:     5');
    console.log('  ─── Other ───');
    console.log('  job_opportunities:    5');
    console.log('  notifications:        10');
    console.log('  certificates:         5');
    console.log('  support_network_registrations: 3');
    console.log('  impact_metrics:       1');
    console.log('  ─── Total: 40 collections ───');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
