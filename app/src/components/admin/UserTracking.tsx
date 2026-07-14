import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';

interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  municipality?: string;
  points: number;
  courses_completed: number;
  current_streak: number;
  total_hours: number;
  role: string;
}

interface UserTrackingProps {
  user: UserRecord;
}

interface ActivityLog {
  id: string;
  action: string;
  module: string;
  details: string;
  points_earned: number;
  timestamp: any;
}

interface CourseProgress {
  id: string;
  course_name: string;
  track: string;
  progress: number;
  status: string;
  started_at: any;
  completed_at: any;
}

interface ResilienceActivity {
  id: string;
  activity_type: string;
  points_earned: number;
  completed_at: any;
  duration_minutes: number;
}

export default function UserTracking({ user }: UserTrackingProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'resilience' | 'activity'>('overview');
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [resilienceActivities, setResilienceActivities] = useState<ResilienceActivity[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user.id]);

  const loadUserData = async () => {
    try {
      const [coursesSnap, resilienceSnap, logsSnap] = await Promise.all([
        getDocs(query(collection(db, 'enrollments'), where('user_id', '==', user.id))),
        getDocs(query(collection(db, 'resilience_activities'), where('user_id', '==', user.id))),
        getDocs(query(collection(db, 'activity_logs'), where('user_id', '==', user.id), orderBy('timestamp', 'desc')))
      ]);

      setCourses(coursesSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as CourseProgress[]);

      setResilienceActivities(resilienceSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as ResilienceActivity[]);

      setActivityLogs(logsSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as ActivityLog[]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModuleName = (module: string) => {
    const modules: Record<string, string> = {
      'EDUCATION': '📚 Educación',
      'RESILIENCE': '🧠 Resiliencia',
      'EMPLOYMENT': '💼 Empleo',
      'CENSUS': '📋 Censo'
    };
    return modules[module] || module;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'COMPLETED': 'bg-green-100 text-green-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'NOT_STARTED': 'bg-gray-100 text-gray-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* User Header */}
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.full_name?.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.full_name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge className="bg-blue-100 text-blue-800">{user.role}</Badge>
              <Badge className="bg-gray-100 text-gray-800">{user.municipality}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-600">{user.points || 0}</div>
              <div className="text-xs text-gray-600">Puntos</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{user.courses_completed || 0}</div>
              <div className="text-xs text-gray-600">Cursos</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-orange-600">{user.current_streak || 0}</div>
              <div className="text-xs text-gray-600">Racha</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">{user.total_hours || 0}h</div>
              <div className="text-xs text-gray-600">Horas</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {([
          { id: 'overview', label: '📊 Resumen', icon: '📊' },
          { id: 'courses', label: '📚 Cursos', icon: '📚' },
          { id: 'resilience', label: '🧠 Resiliencia', icon: '🧠' },
          { id: 'activity', label: '📋 Actividad', icon: '📋' }
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Progress by Module */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Progreso por Módulo</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>📚 Educación</span>
                  <span className="font-medium">{courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${courses.length > 0 ? courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>🧠 Resiliencia</span>
                  <span className="font-medium">{resilienceActivities.length} actividades</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${Math.min(resilienceActivities.length * 10, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>💼 Empleo</span>
                  <span className="font-medium">Activo</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>📋 Censo</span>
                  <span className="font-medium">Completado</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-500 h-3 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              {activityLogs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    log.module === 'EDUCATION' ? 'bg-blue-500' :
                    log.module === 'RESILIENCE' ? 'bg-purple-500' :
                    log.module === 'EMPLOYMENT' ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                    {log.module === 'EDUCATION' ? '📚' :
                     log.module === 'RESILIENCE' ? '🧠' :
                     log.module === 'EMPLOYMENT' ? '💼' : '📋'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{log.action}</div>
                    <div className="text-xs text-gray-600">{log.details}</div>
                    <div className="text-xs text-gray-400">+{log.points_earned} puntos</div>
                  </div>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay actividad registrada</p>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'courses' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Cursos Inscritos ({courses.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Curso</th>
                    <th className="text-left py-3 px-4">Track</th>
                    <th className="text-left py-3 px-4">Progreso</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Inicio</th>
                    <th className="text-left py-3 px-4">Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{course.course_name}</td>
                      <td className="py-3 px-4 text-gray-600">{course.track}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${course.progress || 0}%` }} />
                          </div>
                          <span className="text-sm font-medium">{course.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {course.started_at?.toDate?.().toLocaleDateString() || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {course.completed_at?.toDate?.().toLocaleDateString() || '-'}
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No hay cursos inscritos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'resilience' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Actividades de Resiliencia ({resilienceActivities.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resilienceActivities.map(activity => (
                <div key={activity.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">
                      {activity.activity_type === 'EMOTIONAL_CANVAS' ? '🎨' :
                       activity.activity_type === 'DAILY_JOURNAL' ? '📔' :
                       activity.activity_type === 'MINDFULNESS' ? '🧘' :
                       activity.activity_type === 'ACTION_PLAN' ? '📋' :
                       activity.activity_type === 'APA_ASSESSMENT' ? '📊' : '🎁'}
                    </span>
                    <Badge className="bg-green-100 text-green-800">+{activity.points_earned} pts</Badge>
                  </div>
                  <div className="font-medium text-sm">{activity.activity_type.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.completed_at?.toDate?.().toLocaleDateString() || '-'}
                    {activity.duration_minutes && ` | ${activity.duration_minutes} min`}
                  </div>
                </div>
              ))}
              {resilienceActivities.length === 0 && (
                <div className="col-span-3 py-8 text-center text-gray-500">
                  No hay actividades de resiliencia registradas
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'activity' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Historial de Actividad ({activityLogs.length})</h3>
            <div className="space-y-3">
              {activityLogs.map(log => (
                <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    log.module === 'EDUCATION' ? 'bg-blue-500' :
                    log.module === 'RESILIENCE' ? 'bg-purple-500' :
                    log.module === 'EMPLOYMENT' ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                    {log.module === 'EDUCATION' ? '📚' :
                     log.module === 'RESILIENCE' ? '🧠' :
                     log.module === 'EMPLOYMENT' ? '💼' : '📋'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.action}</span>
                      <Badge className={getStatusColor(log.module)}>{getModuleName(log.module)}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{log.details}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{log.timestamp?.toDate?.().toLocaleString() || '-'}</span>
                      <span className="text-green-600 font-medium">+{log.points_earned} puntos</span>
                    </div>
                  </div>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No hay actividad registrada
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}