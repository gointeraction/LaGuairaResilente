// ============================================
// TYPES
// ============================================

export type ReportModule = 'EDUCATION' | 'RESILIENCE' | 'PSYCHOLOGISTS' | 'EMPLOYMENT' | 'SPONSORSHIP' | 'CENSUS' | 'GAMIFICATION' | 'IMPACT';
export type ReportFrequency = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
export type ExportFormat = 'CSV' | 'EXCEL' | 'PDF';

export interface Report {
  id: string;
  name: string;
  module: ReportModule;
  description: string;
  frequency: ReportFrequency;
  metrics: string[];
  filters: string[];
  formats: ExportFormat[];
  last_generated?: any;
}

export interface ReportData {
  headers: string[];
  rows: (string | number)[][];
  summary?: Record<string, string | number>;
}

// ============================================
// REPORTS CATALOG
// ============================================

export const REPORTS_CATALOG: Report[] = [
  // EDUCATION REPORTS (RPT-001 to RPT-008)
  {
    id: 'RPT-001',
    name: 'Inscripciones por Curso',
    module: 'EDUCATION',
    description: 'Lista de inscripciones agrupadas por curso con estado y progreso',
    frequency: 'DAILY',
    metrics: ['Total inscripciones', 'Inscripciones activas', 'Completadas', 'Tasa de éxito'],
    filters: ['Track', 'Curso', 'Rango de fechas', 'Municipio'],
    formats: ['CSV', 'EXCEL', 'PDF']
  },
  {
    id: 'RPT-002',
    name: 'Progreso Individual de Estudiantes',
    module: 'EDUCATION',
    description: 'Detalle del avance de cada estudiante en sus cursos',
    frequency: 'WEEKLY',
    metrics: ['Módulos completados', 'Tiempo invertido', 'Calificaciones quiz'],
    filters: ['Estudiante', 'Curso', 'Track', 'Estado'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-003',
    name: 'Análisis de Deserción',
    module: 'EDUCATION',
    description: 'Estudiantes que abandonaron cursos y motivos',
    frequency: 'BIWEEKLY',
    metrics: ['Tasa de deserción', 'Puntos de abandono', 'Municipios afectados'],
    filters: ['Curso', 'Track', 'Municipio', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },
  {
    id: 'RPT-004',
    name: 'Calificaciones de Evaluaciones',
    module: 'EDUCATION',
    description: 'Resultados de todos los quizzes por curso y estudiante',
    frequency: 'WEEKLY',
    metrics: ['Promedio calificaciones', 'Tasa aprobación', 'Intentos'],
    filters: ['Curso', 'Estudiante', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },
  {
    id: 'RPT-005',
    name: 'Horas de Capacitación',
    module: 'EDUCATION',
    description: 'Acumulado de horas de estudio por estudiante',
    frequency: 'MONTHLY',
    metrics: ['Horas totales', 'Promedio diario', 'Tiempo por módulo'],
    filters: ['Estudiante', 'Track', 'Municipio', 'Rango de fechas'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-006',
    name: 'Popularidad de Tracks',
    module: 'EDUCATION',
    description: 'Distribución de inscripciones y completación por track',
    frequency: 'MONTHLY',
    metrics: ['Inscripciones por track', 'Tasa completación', 'Tiempo promedio'],
    filters: ['Track', 'Rango de fechas'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-007',
    name: 'Rendimiento de Instructores',
    module: 'EDUCATION',
    description: 'Métricas de desempeño por instructor',
    frequency: 'MONTHLY',
    metrics: ['Cursos asignados', 'Estudiantes promedio', 'Calificación instructor'],
    filters: ['Instructor', 'Curso', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },
  {
    id: 'RPT-008',
    name: 'Consumo de Contenido',
    module: 'EDUCATION',
    description: 'Análisis de qué contenido es más consumido',
    frequency: 'BIWEEKLY',
    metrics: ['Views por módulo', 'Tiempo promedio', 'Tasa completado'],
    filters: ['Curso', 'Tipo contenido', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },

  // RESILIENCE REPORTS (RPT-009 to RPT-015)
  {
    id: 'RPT-009',
    name: 'Uso de Centro de Resiliencia',
    module: 'RESILIENCE',
    description: 'Estadísticas de uso de cada actividad de resiliencia',
    frequency: 'WEEKLY',
    metrics: ['Usos por actividad', 'Tiempo promedio', 'Completación'],
    filters: ['Actividad', 'Municipio', 'Rango de fechas'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-010',
    name: 'Evolución del Bienestar Emocional',
    module: 'RESILIENCE',
    description: 'Seguimiento del estado emocional de los beneficiarios',
    frequency: 'WEEKLY',
    metrics: ['Ánimo promedio', 'Tendencia emocional', 'Días con registro'],
    filters: ['Estudiante', 'Municipio', 'Rango de fechas'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-011',
    name: 'Diarios Personales',
    module: 'RESILIENCE',
    description: 'Registro de entradas de diario y gratitud',
    frequency: 'MONTHLY',
    metrics: ['Total entradas', 'Palabras promedio', 'Gratitud registrada'],
    filters: ['Estudiante', 'Rango de fechas'],
    formats: ['CSV']
  },
  {
    id: 'RPT-012',
    name: 'Sesiones de Mindfulness',
    module: 'RESILIENCE',
    description: 'Uso de sesiones guiadas de relajación',
    frequency: 'WEEKLY',
    metrics: ['Sesiones completadas', 'Duración promedio', 'Horarios preferidos'],
    filters: ['Sesión', 'Municipio', 'Rango de fechas'],
    formats: ['CSV']
  },
  {
    id: 'RPT-013',
    name: 'Evaluación APA',
    module: 'RESILIENCE',
    description: 'Resultados de la evaluación de 10 principios APA',
    frequency: 'MONTHLY',
    metrics: ['Puntuación promedio', 'Principios débiles', 'Mejora por principio'],
    filters: ['Estudiante', 'Principio', 'Rango de fechas'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-014',
    name: 'Planes de Acción',
    module: 'RESILIENCE',
    description: 'Seguimiento de planes de acción personales',
    frequency: 'BIWEEKLY',
    metrics: ['Planes creados', 'Pasos completados', 'Tasa finalización'],
    filters: ['Estudiante', 'Estado', 'Rango de fechas'],
    formats: ['CSV']
  },
  {
    id: 'RPT-015',
    name: 'Talentos Identificados',
    module: 'RESILIENCE',
    description: 'Distribución de talentos descubiertos',
    frequency: 'MONTHLY',
    metrics: ['Talentos más comunes', 'Gifts personalizados', 'Por municipio'],
    filters: ['Talent', 'Municipio'],
    formats: ['CSV', 'PDF']
  },

  // PSYCHOLOGISTS REPORTS (RPT-016 to RPT-019)
  {
    id: 'RPT-016',
    name: 'Directorio de Especialistas',
    module: 'PSYCHOLOGISTS',
    description: 'Lista completa de psicólogos registrados y su estado',
    frequency: 'BIWEEKLY',
    metrics: ['Total psicólogos', 'Aprobados', 'Pendientes', 'Por municipio'],
    filters: ['Estado', 'Municipio', 'Especialidad'],
    formats: ['CSV', 'EXCEL']
  },
  {
    id: 'RPT-017',
    name: 'Solicitudes de Registro',
    module: 'PSYCHOLOGISTS',
    description: 'Flujo de solicitudes y tiempos de aprobación',
    frequency: 'MONTHLY',
    metrics: ['Solicitudes recibidas', 'Aprobadas', 'Rechazadas', 'Tiempo promedio'],
    filters: ['Estado', 'Verificación', 'Rango de fechas'],
    formats: ['CSV']
  },
  {
    id: 'RPT-018',
    name: 'Uso de Psicólogos',
    module: 'PSYCHOLOGISTS',
    description: 'Demanda de servicios psicológicos',
    frequency: 'MONTHLY',
    metrics: ['Consultas por psicólogo', 'Especialidad más demandada'],
    filters: ['Psicólogo', 'Especialidad', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },
  {
    id: 'RPT-019',
    name: 'Estado de Verificación',
    module: 'PSYCHOLOGISTS',
    description: 'Verificación de credenciales profesionales',
    frequency: 'MONTHLY',
    metrics: ['Verificados', 'Pendientes', 'Rechazados por tipo'],
    filters: ['Tipo verificación', 'Estado'],
    formats: ['CSV']
  },

  // EMPLOYMENT REPORTS (RPT-020 to RPT-023)
  {
    id: 'RPT-020',
    name: 'Ofertas de Empleo',
    module: 'EMPLOYMENT',
    description: 'Catálogo de ofertas laborales disponibles',
    frequency: 'DAILY',
    metrics: ['Total ofertas', 'Por modalidad', 'Salario promedio', 'Municipalidad'],
    filters: ['Modalidad', 'Salario', 'Municipio', 'Categoría'],
    formats: ['CSV', 'EXCEL']
  },
  {
    id: 'RPT-021',
    name: 'Postulaciones por Oferta',
    module: 'EMPLOYMENT',
    description: 'Seguimiento de postulaciones laborales',
    frequency: 'DAILY',
    metrics: ['Postulaciones totales', 'Postulantes por oferta', 'Tasa éxito'],
    filters: ['Oferta', 'Postulante', 'Estado', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },
  {
    id: 'RPT-022',
    name: 'Empleos Generados',
    module: 'EMPLOYMENT',
    description: 'Beneficiarios que consiguieron empleo',
    frequency: 'MONTHLY',
    metrics: ['Empleos totales', 'Por municipio', 'Salario promedio', 'Modalidad'],
    filters: ['Municipio', 'Rango de fechas', 'Modalidad'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-023',
    name: 'Empleabilidad por Track',
    module: 'EMPLOYMENT',
    description: 'Relación entre tracks completados y empleos',
    frequency: 'MONTHLY',
    metrics: ['Empleados por track', 'Tasa empleabilidad', 'Tiempo hasta empleo'],
    filters: ['Track', 'Municipio', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },

  // SPONSORSHIP REPORTS (RPT-024 to RPT-027)
  {
    id: 'RPT-024',
    name: 'Patrocinadores Activos',
    module: 'SPONSORSHIP',
    description: 'Empresas patrocinadoras y su colaboración',
    frequency: 'MONTHLY',
    metrics: ['Total patrocinadores', 'Activos', 'Beneficiarios apadrinados'],
    filters: ['Estado', 'Industria', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },
  {
    id: 'RPT-025',
    name: 'Hitos de Patrocinio',
    module: 'SPONSORSHIP',
    description: 'Seguimiento de milestones y desembolsos',
    frequency: 'BIWEEKLY',
    metrics: ['Milestones completados', 'Monto desembolsado', 'Próximos hitos'],
    filters: ['Patrocinador', 'Estado', 'Rango de fechas'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-026',
    name: 'ROI de Patrocinio',
    module: 'SPONSORSHIP',
    description: 'Retorno de inversión por patrocinador',
    frequency: 'QUARTERLY',
    metrics: ['Beneficiarios impactados', 'Empleos generados', 'Cursos completados'],
    filters: ['Patrocinador', 'Rango de fechas'],
    formats: ['PDF', 'EXCEL']
  },
  {
    id: 'RPT-027',
    name: 'Financiamiento BNPL',
    module: 'SPONSORSHIP',
    description: 'Estado de préstamos y pagos aplazados',
    frequency: 'MONTHLY',
    metrics: ['Préstamos activos', 'Monto total', 'Pagos recibidos', 'Mora'],
    filters: ['Estado', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },

  // CENSUS REPORTS (RPT-028 to RPT-030)
  {
    id: 'RPT-028',
    name: 'Respuestas del Censo',
    module: 'CENSUS',
    description: 'Distribución geográfica de respuestas',
    frequency: 'WEEKLY',
    metrics: ['Respuestas por municipio', 'Tasa completado', 'Tiempo promedio'],
    filters: ['Municipio', 'Rango de fechas'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-029',
    name: 'Perfil Digital',
    module: 'CENSUS',
    description: 'Distribución de niveles de alfabetización digital',
    frequency: 'MONTHLY',
    metrics: ['Por nivel', 'Por municipio'],
    filters: ['Nivel', 'Municipio'],
    formats: ['CSV', 'PDF']
  },
  {
    id: 'RPT-030',
    name: 'Necesidades de la Comunidad',
    module: 'CENSUS',
    description: 'Análisis de necesidades reportadas',
    frequency: 'MONTHLY',
    metrics: ['Necesidades más comunes', 'Urgencia', 'Por zona'],
    filters: ['Categoría', 'Municipio'],
    formats: ['CSV', 'PDF']
  },

  // GAMIFICATION REPORTS (RPT-031 to RPT-033)
  {
    id: 'RPT-031',
    name: 'Puntos de Resiliencia',
    module: 'GAMIFICATION',
    description: 'Distribución de puntos entre beneficiarios',
    frequency: 'MONTHLY',
    metrics: ['Puntos promedio', 'Top 10', 'Distribución por municipio'],
    filters: ['Municipio', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  },
  {
    id: 'RPT-032',
    name: 'Rachas de Actividad',
    module: 'GAMIFICATION',
    description: 'Usuarios con rachas consecutivas',
    frequency: 'WEEKLY',
    metrics: ['Rachas activas', 'Promedio', 'Máximo histórico'],
    filters: ['Rango de racha', 'Municipio'],
    formats: ['CSV']
  },
  {
    id: 'RPT-033',
    name: 'Sistema de Referidos',
    module: 'GAMIFICATION',
    description: 'Análisis de referidos y su impacto',
    frequency: 'MONTHLY',
    metrics: ['Total referidos', 'Referidos por usuario', 'Conversión'],
    filters: ['Usuario', 'Rango de fechas'],
    formats: ['CSV']
  },

  // IMPACT REPORTS (RPT-034 to RPT-035)
  {
    id: 'RPT-034',
    name: 'Dashboard de Impacto Social',
    module: 'IMPACT',
    description: 'Resumen ejecutivo del impacto del programa',
    frequency: 'QUARTERLY',
    metrics: ['Beneficiarios', 'Empleos', 'Horas capacitación', 'Inversión', 'ROI social'],
    filters: ['Rango de fechas', 'Municipio'],
    formats: ['PDF']
  },
  {
    id: 'RPT-035',
    name: 'Auditoría de Actividad',
    module: 'IMPACT',
    description: 'Logs de actividad y uso del sistema',
    frequency: 'DAILY',
    metrics: ['Logins', 'Acciones por usuario', 'Horas pico', 'Errores'],
    filters: ['Usuario', 'Acción', 'Rango de fechas'],
    formats: ['CSV', 'EXCEL']
  }
];

// ============================================
// REPORTS SERVICE
// ============================================

export const reportsService = {
  async getReportsByModule(module: ReportModule): Promise<Report[]> {
    return REPORTS_CATALOG.filter(r => r.module === module);
  },

  async getAllReports(): Promise<Report[]> {
    return REPORTS_CATALOG;
  },

  async generateReport(reportId: string, _filters: Record<string, any>): Promise<ReportData> {
    // Mock data generation - in production, this would query Firestore
    const report = REPORTS_CATALOG.find(r => r.id === reportId);
    if (!report) throw new Error('Report not found');

    // Generate mock data based on report type
    return this.getMockData(reportId);
  },

  async getMockData(reportId: string): Promise<ReportData> {
    // Mock data for demonstration
    const mockData: Record<string, ReportData> = {
      'RPT-001': {
        headers: ['Curso', 'Inscritos', 'Activos', 'Completados', 'Tasa Éxito'],
        rows: [
          ['Continuidad Comercial Digital - Módulo 1', 150, 120, 85, '56.7%'],
          ['Continuidad Comercial Digital - Módulo 2', 140, 110, 75, '53.6%'],
          ['Micro-oficios Remotos - Módulo 1', 95, 80, 60, '63.2%'],
          ['Logística de Suministros - Módulo 1', 75, 65, 45, '60.0%'],
        ],
        summary: { total: 460, activos: 375, completados: 265 }
      },
      'RPT-002': {
        headers: ['Estudiante', 'Municipio', 'Cursos Inscritos', 'Completados', 'Progreso'],
        rows: [
          ['María García', 'Catia La Mar', 3, 2, '66.7%'],
          ['Juan Pérez', 'Maiquetía', 2, 1, '50.0%'],
          ['Ana López', 'Macuto', 4, 3, '75.0%'],
          ['Carlos Ruiz', 'Caraballeda', 1, 1, '100%'],
        ],
        summary: { total_estudiantes: 4, promedio_progreso: 72.9 }
      },
      'RPT-009': {
        headers: ['Actividad', 'Usos', 'Tiempo Promedio', 'Completación'],
        rows: [
          ['Emotional Canvas', 250, '15 min', '85%'],
          ['My Gifts Quiz', 180, '20 min', '90%'],
          ['Daily Journal', 320, '10 min', '75%'],
          ['Mindfulness', 200, '25 min', '80%'],
          ['Action Plan', 150, '30 min', '70%'],
          ['APA Assessment', 120, '15 min', '88%'],
        ],
        summary: { total_usos: 1220, tiempo_promedio: '19 min' }
      },
      'RPT-022': {
        headers: ['Municipio', 'Empleos', 'Salario Promedio', 'Modalidad'],
        rows: [
          ['Catia La Mar', 25, '$450', 'Presencial'],
          ['Maiquetía', 18, '$520', 'Híbrido'],
          ['Macuto', 15, '$480', 'Remoto'],
          ['Caraballeda', 12, '$550', 'Presencial'],
        ],
        summary: { total_empleos: 70, salario_promedio: '$500' }
      },
      'RPT-034': {
        headers: ['Métrica', 'Valor', 'Meta', 'Cumplimiento'],
        rows: [
          ['Beneficiarios Registrados', 1250, 100000, '1.25%'],
          ['Cursos Completados', 265, '-', '-'],
          ['Empleos Generados', 70, '-', '-'],
          ['Horas Capacitación', 5300, '-', '-'],
          ['Inversión Total', '$50,000', '-', '-'],
          ['ROI Social', '2.8x', '3x', '93.3%'],
        ],
        summary: { beneficiarios: 1250, empleos: 70, horas: 5300 }
      }
    };

    return mockData[reportId] || {
      headers: ['Dato', 'Valor'],
      rows: [['Sin datos disponibles', '-']],
      summary: {}
    };
  },

  async exportToCSV(data: ReportData, filename: string): Promise<void> {
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  },

  async exportToExcel(data: ReportData, filename: string): Promise<void> {
    // For Excel export, we'd use a library like xlsx
    // For now, use CSV format
    return this.exportToCSV(data, filename);
  },

  async exportToPDF(data: ReportData, filename: string): Promise<void> {
    // For PDF export, we'd use a library like jsPDF
    // For now, log to console
    console.log('PDF Export:', filename, data);
  },

  getModuleLabel(module: ReportModule): string {
    const labels: Record<ReportModule, string> = {
      'EDUCATION': '📚 Educación',
      'RESILIENCE': '🧠 Resiliencia',
      'PSYCHOLOGISTS': '👨‍⚕️ Psicólogos',
      'EMPLOYMENT': '💼 Empleo',
      'SPONSORSHIP': '🤝 Patrocinio',
      'CENSUS': '📋 Censo',
      'GAMIFICATION': '🏆 Gamificación',
      'IMPACT': '📈 Impacto'
    };
    return labels[module];
  },

  getFrequencyLabel(frequency: ReportFrequency): string {
    const labels: Record<ReportFrequency, string> = {
      'DAILY': 'Diario',
      'WEEKLY': 'Semanal',
      'BIWEEKLY': 'Quincenal',
      'MONTHLY': 'Mensual',
      'QUARTERLY': 'Trimestral'
    };
    return labels[frequency];
  },

  getModuleColor(module: ReportModule): string {
    const colors: Record<ReportModule, string> = {
      'EDUCATION': 'bg-blue-100 text-blue-800',
      'RESILIENCE': 'bg-purple-100 text-purple-800',
      'PSYCHOLOGISTS': 'bg-teal-100 text-teal-800',
      'EMPLOYMENT': 'bg-green-100 text-green-800',
      'SPONSORSHIP': 'bg-orange-100 text-orange-800',
      'CENSUS': 'bg-yellow-100 text-yellow-800',
      'GAMIFICATION': 'bg-red-100 text-red-800',
      'IMPACT': 'bg-indigo-100 text-indigo-800'
    };
    return colors[module];
  }
};
