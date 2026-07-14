import { motion } from 'framer-motion';
import Card from '../ui/Card';

interface ModuleStats {
  education: {
    enrolled: number;
    completed: number;
    in_progress: number;
    avg_progress: number;
  };
  resilience: {
    active_users: number;
    total_activities: number;
    avg_points: number;
    emotional_canvas: number;
    journal: number;
    mindfulness: number;
    action_plans: number;
    apa_assessment: number;
  };
  employment: {
    total_jobs: number;
    applied: number;
    hired: number;
    avg_salary: number;
  };
  census: {
    completed: number;
    pending: number;
    completion_rate: number;
  };
  psychologists: {
    registered: number;
    approved: number;
    pending: number;
    consultations: number;
  };
}

interface ModuleProgressProps {
  stats: ModuleStats | null;
}

export default function ModuleProgress({ stats }: ModuleProgressProps) {
  if (!stats) return null;

  const modules = [
    {
      name: 'Educación',
      icon: '📚',
      color: 'blue',
      stats: [
        { label: 'Inscritos', value: stats.education.enrolled },
        { label: 'Completados', value: stats.education.completed },
        { label: 'En Progreso', value: stats.education.in_progress },
        { label: 'Progreso Promedio', value: `${stats.education.avg_progress}%` }
      ],
      progress: stats.education.avg_progress,
      details: [
        { label: 'Tasa de Completación', value: stats.education.enrolled > 0 ? Math.round((stats.education.completed / stats.education.enrolled) * 100) : 0, suffix: '%' },
        { label: 'Tasa de Abandono', value: stats.education.enrolled > 0 ? Math.round(((stats.education.enrolled - stats.education.completed - stats.education.in_progress) / stats.education.enrolled) * 100) : 0, suffix: '%' }
      ]
    },
    {
      name: 'Resiliencia',
      icon: '🧠',
      color: 'purple',
      stats: [
        { label: 'Usuarios Activos', value: stats.resilience.active_users },
        { label: 'Total Actividades', value: stats.resilience.total_activities },
        { label: 'Puntos Promedio', value: stats.resilience.avg_points },
        { label: 'Actividades/Usuario', value: stats.resilience.active_users > 0 ? Math.round(stats.resilience.total_activities / stats.resilience.active_users) : 0 }
      ],
      progress: Math.min((stats.resilience.avg_points / 50) * 100, 100),
      details: [
        { label: 'Emotional Canvas', value: stats.resilience.emotional_canvas, suffix: ' usos' },
        { label: 'Diario', value: stats.resilience.journal, suffix: ' entradas' },
        { label: 'Mindfulness', value: stats.resilience.mindfulness, suffix: ' sesiones' },
        { label: 'Planes Acción', value: stats.resilience.action_plans, suffix: ' creados' },
        { label: 'Evaluación APA', value: stats.resilience.apa_assessment, suffix: ' completadas' }
      ]
    },
    {
      name: 'Empleo',
      icon: '💼',
      color: 'green',
      stats: [
        { label: 'Ofertas Totales', value: stats.employment.total_jobs },
        { label: 'Postulaciones', value: stats.employment.applied },
        { label: 'Contratados', value: stats.employment.hired },
        { label: 'Salario Promedio', value: `$${stats.employment.avg_salary}` }
      ],
      progress: stats.employment.total_jobs > 0 ? Math.round((stats.employment.hired / stats.employment.applied) * 100) : 0,
      details: [
        { label: 'Tasa de Contratación', value: stats.employment.applied > 0 ? Math.round((stats.employment.hired / stats.employment.applied) * 100) : 0, suffix: '%' },
        { label: 'Postulaciones/Oferta', value: stats.employment.total_jobs > 0 ? Math.round(stats.employment.applied / stats.employment.total_jobs) : 0, suffix: '' }
      ]
    },
    {
      name: 'Censo',
      icon: '📋',
      color: 'orange',
      stats: [
        { label: 'Completados', value: stats.census.completed },
        { label: 'Pendientes', value: stats.census.pending },
        { label: 'Tasa Completado', value: `${stats.census.completion_rate}%` },
        { label: 'Total Objetivo', value: 1000 }
      ],
      progress: stats.census.completion_rate,
      details: [
        { label: 'Avance', value: stats.census.completion_rate, suffix: '%' },
        { label: 'Restante', value: stats.census.pending, suffix: ' encuestas' }
      ]
    },
    {
      name: 'Psicólogos',
      icon: '👨‍⚕️',
      color: 'teal',
      stats: [
        { label: 'Registrados', value: stats.psychologists.registered },
        { label: 'Aprobados', value: stats.psychologists.approved },
        { label: 'Pendientes', value: stats.psychologists.pending },
        { label: 'Consultas', value: stats.psychologists.consultations }
      ],
      progress: stats.psychologists.registered > 0 ? Math.round((stats.psychologists.approved / stats.psychologists.registered) * 100) : 0,
      details: [
        { label: 'Tasa Aprobación', value: stats.psychologists.registered > 0 ? Math.round((stats.psychologists.approved / stats.psychologists.registered) * 100) : 0, suffix: '%' },
        { label: 'Consultas/Psicólogo', value: stats.psychologists.approved > 0 ? Math.round(stats.psychologists.consultations / stats.psychologists.approved) : 0, suffix: '' }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; bar: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', bar: 'bg-blue-500' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', bar: 'bg-purple-500' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', bar: 'bg-green-500' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', bar: 'bg-orange-500' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', bar: 'bg-teal-500' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Progreso por Módulo</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module, idx) => {
          const colorClasses = getColorClasses(module.color);
          
          return (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`p-6 border-2 ${colorClasses.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{module.icon}</span>
                    <h3 className={`text-xl font-bold ${colorClasses.text}`}>{module.name}</h3>
                  </div>
                  <div className={`text-2xl font-bold ${colorClasses.text}`}>
                    {module.progress}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${module.progress}%` }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                    className={`h-4 rounded-full ${colorClasses.bar}`}
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {module.stats.map(stat => (
                    <div key={stat.label} className={`${colorClasses.bg} rounded-lg p-3 text-center`}>
                      <div className={`text-lg font-bold ${colorClasses.text}`}>{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Detalle:</h4>
                  <div className="space-y-2">
                    {module.details.map(detail => (
                      <div key={detail.label} className="flex justify-between text-sm">
                        <span className="text-gray-600">{detail.label}</span>
                        <span className="font-medium">{detail.value}{detail.suffix}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h3 className="text-xl font-bold mb-4">Resumen General de Módulos</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.education.enrolled}</div>
            <div className="text-blue-100">En Educación</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.resilience.active_users}</div>
            <div className="text-blue-100">En Resiliencia</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.employment.applied}</div>
            <div className="text-blue-100">En Empleo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.census.completed}</div>
            <div className="text-blue-100">Censos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.psychologists.approved}</div>
            <div className="text-blue-100">Psicólogos</div>
          </div>
        </div>
      </Card>
    </div>
  );
}