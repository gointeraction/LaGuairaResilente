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
const ROLES = ['ADMIN', 'TRAINER', 'COORDINATOR', 'STUDENT', 'SPONSOR'];
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
  
  // Admin user
  users.push({
    id: 'admin-001',
    email: 'admin@laguairaresiliente.gob.ve',
    full_name: 'Admin Principal',
    role: 'ADMIN',
    municipality: 'MAIQUETIA',
    is_active: true,
    is_approved: true,
    points: 500,
    courses_completed: 5,
    current_streak: 30,
    phone: '+58-414-1234567',
    cedula: 'V-12345678',
    digital_literacy: 'ADVANCED',
  });
  
  // Trainers
  for (let i = 0; i < 5; i++) {
    const firstName = FIRST_NAMES[i];
    const lastName = LAST_NAMES[i];
    users.push({
      id: `trainer-${String(i + 1).padStart(3, '0')}`,
      email: `trainer${i + 1}@laguairaresiliente.gob.ve`,
      full_name: `${firstName} ${lastName}`,
      role: 'TRAINER',
      municipality: MUNICIPALITIES[i % 4],
      is_active: true,
      is_approved: true,
      points: 300,
      courses_completed: 3,
      current_streak: 15,
      phone: `+58-414-${1000000 + i}`,
      cedula: `V-${20000000 + i}`,
      digital_literacy: 'ADVANCED',
    });
  }
  
  // Coordinators
  for (let i = 0; i < 4; i++) {
    const firstName = FIRST_NAMES[5 + i];
    const lastName = LAST_NAMES[5 + i];
    users.push({
      id: `coord-${String(i + 1).padStart(3, '0')}`,
      email: `coordinator${i + 1}@laguairaresiliente.gob.ve`,
      full_name: `${firstName} ${lastName}`,
      role: 'COORDINATOR',
      municipality: MUNICIPALITIES[i],
      is_active: true,
      is_approved: true,
      points: 250,
      courses_completed: 2,
      current_streak: 10,
      phone: `+58-412-${2000000 + i}`,
      cedula: `V-${25000000 + i}`,
      digital_literacy: 'INTERMEDIATE',
    });
  }
  
  // Students (beneficiaries)
  for (let i = 0; i < count - 10; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const municipality = MUNICIPALITIES[i % 4];
    const isApproved = Math.random() > 0.15;
    const points = Math.floor(Math.random() * 500);
    const coursesCompleted = Math.floor(points / 100);
    
    users.push({
      id: `user-${String(i + 1).padStart(4, '0')}`,
      email: `user${i + 1}@email.com`,
      full_name: `${firstName} ${lastName}`,
      role: 'STUDENT',
      municipality,
      is_active: true,
      is_approved: isApproved,
      points,
      courses_completed: coursesCompleted,
      current_streak: Math.floor(Math.random() * 30),
      phone: `+58-4${Math.floor(Math.random() * 10)}-${3000000 + i}`,
      cedula: `V-${30000000 + i}`,
      digital_literacy: ['NONE', 'BASIC', 'INTERMEDIATE', 'ADVANCED'][Math.floor(Math.random() * 4)],
      is_affected: Math.random() > 0.3,
    });
  }
  
  // Sponsors
  const sponsorCompanies = [
    { name: 'Corporación Digitales CA', type: 'NATIONAL', sector: 'Tecnología' },
    { name: 'Telecom La Guaira', type: 'MULTINATIONAL', sector: 'Telecomunicaciones' },
    { name: 'Banco del Pueblo', type: 'NATIONAL', sector: 'Finanzas' },
    { name: 'Alimentos del Sur CA', type: 'SME', sector: 'Alimentos' },
    { name: 'Construcciones Resilientes', type: 'SME', sector: 'Construcción' },
  ];
  
  for (let i = 0; i < 5; i++) {
    users.push({
      id: `sponsor-${String(i + 1).padStart(3, '0')}`,
      email: `sponsor${i + 1}@${sponsorCompanies[i].name.toLowerCase().replace(/\s+/g, '')}.com`,
      full_name: `Representante ${sponsorCompanies[i].name}`,
      role: 'SPONSOR',
      municipality: MUNICIPALITIES[i % 4],
      is_active: true,
      is_approved: true,
      points: 0,
      courses_completed: 0,
      current_streak: 0,
      company_name: sponsorCompanies[i].name,
      company_type: sponsorCompanies[i].type,
      sector: sponsorCompanies[i].sector,
      total_contribution: Math.floor(Math.random() * 50000) + 10000,
    });
  }
  
  return users;
}

// ============================================
// SEED DATA - TRACKS
// ============================================

const TRACKS = [
  {
    id: 'track-001',
    name: 'Continuidad Comercial Digital',
    description: 'Aprende a digitalizar tu negocio y mantenerlo operativo después del terremoto',
    module_count: 8,
    duration_hours: 40,
    icon: '💻',
    order: 1,
    status: 'ACTIVE',
  },
  {
    id: 'track-002',
    name: 'Micro-oficios Remotos',
    description: 'Desarrolla habilidades para trabajar de forma remota y generar ingresos',
    module_count: 6,
    duration_hours: 30,
    icon: '🔧',
    order: 2,
    status: 'ACTIVE',
  },
  {
    id: 'track-003',
    name: 'Logística de Suministros',
    description: 'Gestiona cadenas de suministro y distribución en contextos de emergencia',
    module_count: 5,
    duration_hours: 25,
    icon: '📦',
    order: 3,
    status: 'ACTIVE',
  },
];

// ============================================
// SEED DATA - COURSES
// ============================================

function generateCourses() {
  const courses = [];
  
  // Track 1: Continuidad Comercial Digital
  const track1Modules = [
    { title: 'Fundamentos del Marketing Digital', description: 'Conceptos básicos de marketing digital para negocios locales' },
    { title: 'Redes Sociales para Negocios', description: 'Cómo usar Facebook, Instagram y WhatsApp Business' },
    { title: 'Tiendas Online', description: 'Crea tu tienda virtual con herramientas gratuitas' },
    { title: 'Pagos Digitales', description: 'Integra métodos de pago digital en tu negocio' },
    { title: 'Atención al Cliente Digital', description: 'Gestiona clientes a través de canales digitales' },
    { title: 'Análisis de Datos', description: 'Toma decisiones basadas en datos de tu negocio' },
    { title: 'Publicidad Digital', description: 'Campañas publicitarias efectivas con poco presupuesto' },
    { title: 'Plan de Negocio Digital', description: 'Crea tu plan de negocio digital completo' },
  ];
  
  track1Modules.forEach((mod, i) => {
    courses.push({
      id: `course-t1-${String(i + 1).padStart(2, '0')}`,
      track_id: 'track-001',
      title: mod.title,
      description: mod.description,
      module_number: i + 1,
      total_modules: 8,
      duration_minutes: 300,
      content_type: 'MIXED',
      video_url: null,
      document_url: null,
      thumbnail_url: null,
      order: i + 1,
    });
  });
  
  // Track 2: Micro-oficios Remotos
  const track2Modules = [
    { title: 'Introducción al Trabajo Remoto', description: 'Beneficios y desafíos del teletrabajo' },
    { title: 'Atención al Cliente Remoto', description: 'Soporte técnico y servicio al cliente virtual' },
    { title: 'Asistente Virtual', description: 'Habilidades para ser asistente virtual profesional' },
    { title: 'Diseño Gráfico Básico', description: 'Canva y herramientas de diseño para principiantes' },
    { title: 'Redacción de Contenidos', description: 'Crea contenido atractivo para web y redes sociales' },
    { title: 'Gestión de Proyectos', description: 'Organiza y gestiona proyectos de forma remota' },
  ];
  
  track2Modules.forEach((mod, i) => {
    courses.push({
      id: `course-t2-${String(i + 1).padStart(2, '0')}`,
      track_id: 'track-002',
      title: mod.title,
      description: mod.description,
      module_number: i + 1,
      total_modules: 6,
      duration_minutes: 300,
      content_type: 'MIXED',
      video_url: null,
      document_url: null,
      thumbnail_url: null,
      order: i + 1,
    });
  });
  
  // Track 3: Logística de Suministros
  const track3Modules = [
    { title: 'Fundamentos de Logística', description: 'Conceptos esenciales de cadena de suministro' },
    { title: 'Gestión de Inventarios', description: 'Control y optimización de existencias' },
    { title: 'Transporte y Distribución', description: 'Planeación de rutas y distribución eficiente' },
    { title: 'Logística de Emergencia', description: 'Gestión logística en contextos de desastre' },
    { title: 'Tecnología en Logística', description: 'Herramientas digitales para la gestión logística' },
  ];
  
  track3Modules.forEach((mod, i) => {
    courses.push({
      id: `course-t3-${String(i + 1).padStart(2, '0')}`,
      track_id: 'track-003',
      title: mod.title,
      description: mod.description,
      module_number: i + 1,
      total_modules: 5,
      duration_minutes: 300,
      content_type: 'MIXED',
      video_url: null,
      document_url: null,
      thumbnail_url: null,
      order: i + 1,
    });
  });
  
  return courses;
}

// ============================================
// SEED DATA - CAMPS (15 camps across 4 municipalities)
// ============================================

const CAMPS = [
  // Catia La Mar (5 camps)
  { id: 'camp-001', name: 'Centro Comunal El Paraiso', zone: 'CATIA_LA_MAR', address: 'Av. Principal El Paraiso', capacity: 200, current_occupancy: 145, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'cocina', 'sanitarios'], latitude: 10.6017, longitude: -66.9654 },
  { id: 'camp-002', name: 'Escuela Bolivariana Catia La Mar', zone: 'CATIA_LA_MAR', address: 'Calle 5 con Av. 4', capacity: 150, current_occupancy: 98, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios'], latitude: 10.6035, longitude: -66.9678 },
  { id: 'camp-003', name: 'Plaza Bolívar Refugio', zone: 'CATIA_LA_MAR', address: 'Plaza Bolívar Centro', capacity: 100, current_occupancy: 67, status: 'ACTIVO', amenities: ['agua', 'sanitarios'], latitude: 10.6022, longitude: -66.9661 },
  { id: 'camp-004', name: 'Polideportivo La Honda', zone: 'CATIA_LA_MAR', address: 'Carrera 7 La Honda', capacity: 300, current_occupancy: 234, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'cocina', 'sanitarios', 'dormitorios'], latitude: 10.6050, longitude: -66.9700 },
  { id: 'camp-005', name: 'Centro de Salud Barlovento', zone: 'CATIA_LA_MAR', address: 'Av. Barlovento', capacity: 80, current_occupancy: 52, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios', 'medico'], latitude: 10.6010, longitude: -66.9640 },
  
  // Maiquetía (4 camps)
  { id: 'camp-006', name: 'Colegio República de Venezuela', zone: 'MAIQUETIA', address: 'Av. Bolívar, Maiquetía Centro', capacity: 250, current_occupancy: 189, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'cocina', 'sanitarios'], latitude: 10.6000, longitude: -66.9350 },
  { id: 'camp-007', name: 'Centro Social Maiquetía', zone: 'MAIQUETIA', address: 'Calle Principal Maiquetía', capacity: 180, current_occupancy: 132, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios', 'cocina'], latitude: 10.5985, longitude: -66.9335 },
  { id: 'camp-008', name: 'Parque Central Refugio', zone: 'MAIQUETIA', address: 'Parque Central, Maiquetía', capacity: 120, current_occupancy: 87, status: 'ACTIVO', amenities: ['agua', 'sanitarios'], latitude: 10.5990, longitude: -66.9340 },
  { id: 'camp-009', name: 'Unidad Educativa Simón Bolívar', zone: 'MAIQUETIA', address: 'Av. 5 de Julio', capacity: 200, current_occupancy: 156, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'sanitarios', 'dormitorios'], latitude: 10.6005, longitude: -66.9360 },
  
  // Macuto (3 camps)
  { id: 'camp-010', name: 'Centro Comunal Macuto', zone: 'MACUTO', address: 'Av. Principal Macuto', capacity: 180, current_occupancy: 123, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios', 'cocina'], latitude: 10.6100, longitude: -66.9200 },
  { id: 'camp-011', name: 'Escuela Ramón Escobar Salas', zone: 'MACUTO', address: 'Calle Macuto', capacity: 150, current_occupancy: 101, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios'], latitude: 10.6110, longitude: -66.9210 },
  { id: 'camp-012', name: 'Playa Caraballeda Refugio', zone: 'MACUTO', address: 'Zona Costera Macuto', capacity: 100, current_occupancy: 78, status: 'ACTIVO', amenities: ['agua', 'sanitarios', 'cocina'], latitude: 10.6120, longitude: -66.9220 },
  
  // Caraballeda (3 camps)
  { id: 'camp-013', name: 'Centro de Educación Caraballeda', zone: 'CARABALLEDA', address: 'Av. Caraballeda Centro', capacity: 220, current_occupancy: 167, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'internet', 'cocina', 'sanitarios'], latitude: 10.6150, longitude: -66.9100 },
  { id: 'camp-014', name: 'Polideportivo Caraballeda', zone: 'CARABALLEDA', address: 'Carrera 3 Caraballeda', capacity: 280, current_occupancy: 215, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios', 'dormitorios', 'cocina'], latitude: 10.6160, longitude: -66.9110 },
  { id: 'camp-015', name: 'Centro San José Caraballeda', zone: 'CARABALLEDA', address: 'Calle San José', capacity: 120, current_occupancy: 89, status: 'ACTIVO', amenities: ['agua', 'electricidad', 'sanitarios'], latitude: 10.6170, longitude: -66.9120 },
];

// ============================================
// SEED DATA - WIFI NODES (10 nodes)
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
// SEED DATA - PSYCHOLOGISTS
// ============================================

const PSYCHOLOGISTS = [
  { id: 'psy-001', name: 'Dra. Carmen Rosa Martínez', specialty: 'Psicología Clínica', municipality: 'CATIA_LA_MAR', phone: '+58-414-5550001', email: 'carmen.martinez@psi.lg', is_active: true, rating: 4.8, consultations: 156, availability: 'L-V 8am-4pm' },
  { id: 'psy-002', name: 'Dr. Luis Fernando Pérez', specialty: 'Psicología de Emergencia', municipality: 'MAIQUETIA', phone: '+58-412-5550002', email: 'luis.perez@psi.lg', is_active: true, rating: 4.9, consultations: 203, availability: 'L-V 7am-3pm' },
  { id: 'psy-003', name: 'Dra. Ana Lucía González', specialty: 'Terapia Familiar', municipality: 'MACUTO', phone: '+58-416-5550003', email: 'ana.gonzalez@psi.lg', is_active: true, rating: 4.7, consultations: 134, availability: 'L-V 9am-5pm' },
  { id: 'psy-004', name: 'Dr. Roberto Carlos Díaz', specialty: 'Psicología Infantil', municipality: 'CARABALLEDA', phone: '+58-424-5550004', email: 'roberto.diaz@psi.lg', is_active: true, rating: 4.6, consultations: 98, availability: 'L-V 10am-6pm' },
  { id: 'psy-005', name: 'Dra. María Eugenia Torres', specialty: 'Trauma y Duelo', municipality: 'CATIA_LA_MAR', phone: '+58-414-5550005', email: 'maria.torres@psi.lg', is_active: true, rating: 4.9, consultations: 245, availability: 'L-V 8am-2pm' },
  { id: 'psy-006', name: 'Dr. José Antonio Ramírez', specialty: 'Psicología Social', municipality: 'MAIQUETIA', phone: '+58-412-5550006', email: 'jose.ramirez@psi.lg', is_active: true, rating: 4.5, consultations: 87, availability: 'L-V 1pm-7pm' },
  { id: 'psy-007', name: 'Dra. Gabriela Elena López', specialty: 'Manejo de Ansiedad', municipality: 'MACUTO', phone: '+58-416-5550007', email: 'gabriela.lopez@psi.lg', is_active: true, rating: 4.8, consultations: 178, availability: 'L-V 9am-3pm' },
  { id: 'psy-008', name: 'Dr. Fernando José García', specialty: 'Rehabilitación Psicosocial', municipality: 'CARABALLEDA', phone: '+58-424-5550008', email: 'fernando.garcia@psi.lg', is_active: true, rating: 4.7, consultations: 112, availability: 'L-V 8am-4pm' },
];

// ============================================
// SEED DATA - JOBS
// ============================================

const JOBS = [
  { id: 'job-001', company_name: 'Corporación Digitales CA', title: 'Asistente Virtual Remoto', description: 'Buscamos asistente virtual para soporte al cliente', type: 'REMOTE', municipality: 'CATIA_LA_MAR', requirements: ['Computadora propia', 'Internet estable', 'Dominio de redes sociales'], salary_min: 300, salary_max: 500, status: 'OPEN' },
  { id: 'job-002', company_name: 'Telecom La Guaira', title: 'Técnico de Soporte', description: 'Técnico para instalación y mantenimiento de equipos', type: 'ONSITE', municipality: 'MAIQUETIA', requirements: ['Conocimientos técnicos', 'Disponibilidad horaria', 'Vehículo propio'], salary_min: 400, salary_max: 700, status: 'OPEN' },
  { id: 'job-003', company_name: 'Banco del Pueblo', title: 'Ejecutivo de Atención al Cliente', description: 'Ejecutivo para atención al cliente digital', type: 'HYBRID', municipality: 'MACUTO', requirements: ['Experiencia en atención al cliente', 'Manejo de computadora', 'Comunicación efectiva'], salary_min: 350, salary_max: 550, status: 'OPEN' },
  { id: 'job-004', company_name: 'Alimentos del Sur CA', title: 'Auxiliar de Logística', description: 'Auxiliar para gestión de inventarios y distribución', type: 'ONSITE', municipality: 'CARABALLEDA', requirements: ['Capacidad física', 'Organización', 'Trabajo en equipo'], salary_min: 280, salary_max: 420, status: 'OPEN' },
  { id: 'job-005', company_name: 'Construcciones Resilientes', title: 'Diseñador Gráfico Freelance', description: 'Diseñador para contenido de redes sociales', type: 'REMOTE', municipality: 'CATIA_LA_MAR', requirements: ['Portafolio', 'Dominio de Canva', 'Creatividad'], salary_min: 300, salary_max: 600, status: 'OPEN' },
];

// ============================================
// SEED DATA - RESILIENCE ACTIVITIES
// ============================================

const RESILIENCE_ACTIVITIES = [
  { id: 'activity-001', title: 'Claridad Emocional', description: 'Explora tus sentimientos a través del color y las formas', type: 'EMOTIONAL_CANVAS', points: 15, icon: '🎨' },
  { id: 'activity-002', title: 'Mis Dones y Talentos', description: 'Descubre y celebra tus cualidades positivas', type: 'MY_GIFTS', points: 20, icon: '🎁' },
  { id: 'activity-003', title: 'Diario de Reflexión', description: 'Reflexiona sobre tu día y cultiva la gratitud', type: 'DAILY_JOURNAL', points: 10, icon: '📝' },
  { id: 'activity-004', title: 'Sesiones de Mindfulness', description: 'Practica la atención plena con sesiones guiadas', type: 'MINDFULNESS', points: 10, icon: '🧘' },
  { id: 'activity-005', title: 'Plan de Acción Personal', description: 'Crea un plan para alcanzar tus metas', type: 'ACTION_PLAN', points: 15, icon: '🎯' },
  { id: 'activity-006', title: 'Evaluación de Resiliencia', description: 'Mide tu nivel de resiliencia personal', type: 'APA_ASSESSMENT', points: 25, icon: '📋' },
];

// ============================================
// SEED DATA - SPONSORS
// ============================================

const SPONSORS_DATA = [
  { id: 'spn-001', name: 'Corporación Digitales CA', type: 'COMERCIAL', sector: 'Tecnología', total_contribution: 50000, beneficiaries_assigned: 45, status: 'ACTIVO' },
  { id: 'spn-002', name: 'Telecom La Guaira', type: 'CONECTIVIDAD', sector: 'Telecomunicaciones', total_contribution: 75000, beneficiaries_assigned: 62, status: 'ACTIVO' },
  { id: 'spn-003', name: 'Banco del Pueblo', type: 'COMERCIAL', sector: 'Finanzas', total_contribution: 30000, beneficiaries_assigned: 28, status: 'ACTIVO' },
  { id: 'spn-004', name: 'Alimentos del Sur CA', type: 'INFRAESTRUCTURA', sector: 'Alimentos', total_contribution: 40000, beneficiaries_assigned: 35, status: 'ACTIVO' },
  { id: 'spn-005', name: 'Construcciones Resilientes', type: 'INFRAESTRUCTURA', sector: 'Construcción', total_contribution: 60000, beneficiaries_assigned: 50, status: 'ACTIVO' },
];

// ============================================
// SEED DATA - ENROLLMENTS
// ============================================

function generateEnrollments(users) {
  const enrollments = [];
  const students = users.filter(u => u.role === 'STUDENT').slice(0, 50);
  
  students.forEach((student, i) => {
    const trackId = `track-00${(i % 3) + 1}`;
    const courseId = `course-t${(i % 3) + 1}-${String((i % (i % 3 === 0 ? 8 : i % 3 === 1 ? 6 : 5)) + 1).padStart(2, '0')}`;
    const progress = Math.floor(Math.random() * 100);
    const status = progress === 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
    
    enrollments.push({
      id: `enrollment-${String(i + 1).padStart(4, '0')}`,
      student_id: student.id,
      course_id: courseId,
      track_id: trackId,
      status,
      progress_percent: progress,
      completed_resources: [],
      quiz_score: progress === 100 ? Math.floor(Math.random() * 30) + 70 : null,
      started_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: progress === 100 ? new Date().toISOString() : null,
      last_accessed: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
    });
  });
  
  return enrollments;
}

// ============================================
// SEED DATA - DELIVERIES
// ============================================

const DELIVERIES = [
  { id: 'del-001', type: 'ALIMENTOS', destination: 'Campamento El Paraíso', status: 'ENTREGADO', quantity: 200, unit: 'raciones', date: '2026-07-10', route: 'Ruta Catia La Mar' },
  { id: 'del-002', type: 'MEDICAMENTOS', destination: 'Centro de Salud Barlovento', status: 'EN_TRANSITO', quantity: 50, unit: 'kits', date: '2026-07-12', route: 'Ruta Catia Sur' },
  { id: 'del-003', type: 'EQUIPOS', destination: 'Escuela Bolivariana', status: 'PENDIENTE', quantity: 30, unit: 'laptops', date: '2026-07-14', route: 'Ruta Maiquetía' },
  { id: 'del-004', type: 'BOLSAS', destination: 'Polideportivo La Honda', status: 'ENTREGADO', quantity: 150, unit: 'bolsas', date: '2026-07-09', route: 'Ruta La Honda' },
  { id: 'del-005', type: 'RECARGAS', destination: 'Múltiples beneficiarios', status: 'COMPLETADO', quantity: 500, unit: 'recargas', date: '2026-07-11', route: 'Distribución digital' },
];

// ============================================
// SEED DATA - POINTS TRANSACTIONS
// ============================================

function generatePointsTransactions(users) {
  const transactions = [];
  const students = users.filter(u => u.role === 'STUDENT');
  
  students.slice(0, 30).forEach((student, i) => {
    const reasons = ['MODULE_COMPLETED', 'QUIZ_PASSED', 'COURSE_COMPLETED', 'DAILY_ATTENDANCE', 'REFERRAL'];
    const numTransactions = Math.floor(Math.random() * 5) + 1;
    
    for (let j = 0; j < numTransactions; j++) {
      transactions.push({
        id: `tx-${String(i * 5 + j + 1).padStart(5, '0')}`,
        user_id: student.id,
        points: [10, 25, 100, 5, 50][Math.floor(Math.random() * 5)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
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
    // Seed Users
    if (!collectionFilter || collectionFilter === 'users') {
      console.log('👤 Seeding users...');
      const users = generateUsers(100);
      await seedCollection('users', users);
      
      // Seed Enrollments (depends on users)
      if (!collectionFilter || collectionFilter === 'enrollments') {
        console.log('\n📚 Seeding enrollments...');
        const enrollments = generateEnrollments(users);
        await seedCollection('enrollments', enrollments);
      }
      
      // Seed Points Transactions
      if (!collectionFilter || collectionFilter === 'points') {
        console.log('\n⭐ Seeding points transactions...');
        const transactions = generatePointsTransactions(users);
        await seedCollection('points_transactions', transactions);
      }
    }
    
    // Seed Tracks
    if (!collectionFilter || collectionFilter === 'tracks') {
      console.log('\n🛤️  Seeding tracks...');
      await seedCollection('tracks', TRACKS);
    }
    
    // Seed Courses
    if (!collectionFilter || collectionFilter === 'courses') {
      console.log('\n📖 Seeding courses...');
      const courses = generateCourses();
      await seedCollection('courses', courses);
    }
    
    // Seed Camps
    if (!collectionFilter || collectionFilter === 'camps') {
      console.log('\n🏕️  Seeding camps...');
      await seedCollection('camps', CAMPS);
    }
    
    // Seed WiFi Nodes
    if (!collectionFilter || collectionFilter === 'wifiNodes') {
      console.log('\n📶 Seeding WiFi nodes...');
      await seedCollection('wifiNodes', WIFI_NODES);
    }
    
    // Seed Psychologists
    if (!collectionFilter || collectionFilter === 'psychologists') {
      console.log('\n🧠 Seeding psychologists...');
      await seedCollection('psychologists', PSYCHOLOGISTS);
    }
    
    // Seed Jobs
    if (!collectionFilter || collectionFilter === 'jobs') {
      console.log('\n💼 Seeding jobs...');
      await seedCollection('jobs', JOBS);
    }
    
    // Seed Sponsors
    if (!collectionFilter || collectionFilter === 'sponsors') {
      console.log('\n🏢 Seeding sponsors...');
      await seedCollection('sponsors', SPONSORS_DATA);
    }
    
    // Seed Resilience Activities
    if (!collectionFilter || collectionFilter === 'resilienceActivities') {
      console.log('\n💪 Seeding resilience activities...');
      await seedCollection('resilienceActivities', RESILIENCE_ACTIVITIES);
    }
    
    // Seed Deliveries
    if (!collectionFilter || collectionFilter === 'deliveries') {
      console.log('\n🚚 Seeding deliveries...');
      await seedCollection('deliveries', DELIVERIES);
    }
    
    console.log('\n✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - users: ~100 (10 admin/trainer/coord, 85 students, 5 sponsors)');
    console.log('  - tracks: 3');
    console.log('  - courses: 19 (8 + 6 + 5)');
    console.log('  - enrollments: ~50');
    console.log('  - camps: 15 (5 Catia La Mar, 4 Maiquetía, 3 Macuto, 3 Caraballeda)');
    console.log('  - wifiNodes: 10');
    console.log('  - psychologists: 8');
    console.log('  - jobs: 5');
    console.log('  - sponsors: 5');
    console.log('  - resilienceActivities: 6');
    console.log('  - deliveries: 5');
    console.log('  - points_transactions: ~150');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
