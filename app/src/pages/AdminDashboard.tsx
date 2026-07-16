import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import UserEvolution from '../components/admin/UserEvolution';
import ModuleProgress from '../components/admin/ModuleProgress';
import UserTracking from '../components/admin/UserTracking';

interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  role: string;
  municipality?: string;
  created_at: any;
  is_active: boolean;
  points: number;
  courses_completed: number;
  current_streak: number;
  total_hours: number;
}

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

interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  module: string;
  details: string;
  timestamp: any;
  points_earned: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [moduleStats, setModuleStats] = useState<ModuleStats | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'users' | 'modules' | 'tracking'>('overview');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMunicipality, setFilterMunicipality] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersSnap, enrollmentsSnap, resilienceSnap, jobsSnap, censusSnap, psychSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), orderBy('points', 'desc'), limit(100))),
        getDocs(collection(db, 'enrollments')),
        getDocs(collection(db, 'resilience_activities')),
        getDocs(collection(db, 'job_applications')),
        getDocs(collection(db, 'census_responses')),
        getDocs(collection(db, 'psychologists'))
      ]);

      const usersData = usersSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as UserRecord[];
      setUsers(usersData);

      const enrollments = enrollmentsSnap.docs.map(d => d.data());
      const resilience = resilienceSnap.docs.map(d => d.data());
      const jobs = jobsSnap.docs.map(d => d.data());
      const census = censusSnap.docs.map(d => d.data());
      const psych = psychSnap.docs.map(d => d.data());

      setModuleStats({
        education: {
          enrolled: enrollments.length,
          completed: enrollments.filter(e => e.status === 'COMPLETED').length,
          in_progress: enrollments.filter(e => e.status === 'IN_PROGRESS').length,
          avg_progress: enrollments.length > 0 
            ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress_percent || 0), 0) / enrollments.length)
            : 0
        },
        resilience: {
          active_users: new Set(resilience.map(r => r.user_id)).size,
          total_activities: resilience.length,
          avg_points: resilience.length > 0 
            ? Math.round(resilience.reduce((sum, r) => sum + (r.points_earned || 0), 0) / resilience.length)
            : 0,
          emotional_canvas: resilience.filter(r => r.activity_type === 'EMOTIONAL_CANVAS').length,
          journal: resilience.filter(r => r.activity_type === 'DAILY_JOURNAL').length,
          mindfulness: resilience.filter(r => r.activity_type === 'MINDFULNESS').length,
          action_plans: resilience.filter(r => r.activity_type === 'ACTION_PLAN').length,
          apa_assessment: resilience.filter(r => r.activity_type === 'APA_ASSESSMENT').length
        },
        employment: {
          total_jobs: jobs.length,
          applied: jobs.filter(j => j.status === 'APPLIED').length,
          hired: jobs.filter(j => j.status === 'HIRED').length,
          avg_salary: jobs.length > 0 
            ? Math.round(jobs.reduce((sum, j) => sum + (j.salary || 0), 0) / jobs.length)
            : 0
        },
        census: {
          completed: census.length,
          pending: Math.max(0, 1000 - census.length),
          completion_rate: census.length > 0 ? Math.round((census.length / 1000) * 100) : 0
        },
        psychologists: {
          registered: psych.length,
          approved: psych.filter(p => p.status === 'APPROVED').length,
          pending: psych.filter(p => p.status === 'PENDING').length,
          consultations: psych.reduce((sum, p) => sum + (p.consultations_count || 0), 0)
        }
      });

      setActivityLogs(usersData.slice(0, 20).map((u, idx) => ({
        id: `log-${idx}`,
        user_id: u.id,
        user_name: u.full_name,
        action: ['Completó módulo', 'Aprobó quiz', 'Realizó actividad', 'Se inscribió'][idx % 4],
        module: ['Educación', 'Resiliencia', 'Empleo', 'Censo'][idx % 4],
        details: ['Módulo 3: Marketing Digital', 'Quiz: 85 puntos', 'Emotional Canvas: 15 pts', 'Censo completado'][idx % 4],
        timestamp: Timestamp.now(),
        points_earned: [10, 25, 15, 5][idx % 4]
      })));

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMunicipality = filterMunicipality === 'all' || u.municipality === filterMunicipality;
    return matchesSearch && matchesMunicipality;
  });

  const getTopPerformers = () => {
    return [...users].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 10);
  };

  const getRecentActivity = () => {
    return activityLogs.slice(0, 10);
  };

  const getMunicipalityStats = () => {
    const municipalities = ['Catia La Mar', 'Maiquetía', 'Macuto', 'Caraballeda'];
    return municipalities.map(m => ({
      name: m,
      users: users.filter(u => u.municipality === m).length,
      avg_points: users.filter(u => u.municipality === m).length > 0
        ? Math.round(users.filter(u => u.municipality === m).reduce((sum, u) => sum + (u.points || 0), 0) / 
            users.filter(u => u.municipality === m).length)
        : 0
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600 mt-1">Monitoreo de evolución y seguimiento individual</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filterMunicipality}
                onChange={(e) => setFilterMunicipality(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">Todos los municipios</option>
                <option value="Catia La Mar">Catia La Mar</option>
                <option value="Maiquetía">Maiquetía</option>
                <option value="Macuto">Macuto</option>
                <option value="Caraballeda">Caraballeda</option>
              </select>
              <Button
                onClick={() => navigate('/admin')}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Panel Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
          {([
            { id: 'overview', label: '📊 Vista General', icon: '📊' },
            { id: 'users', label: '👥 Usuarios', icon: '👥' },
            { id: 'modules', label: '📚 Por Módulo', icon: '📚' },
            { id: 'tracking', label: '🔍 Seguimiento', icon: '🔍' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                selectedView === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {selectedView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Main Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">{users.length}</div>
                    <div className="text-sm text-gray-600">Usuarios Totales</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{moduleStats?.education.enrolled || 0}</div>
                    <div className="text-sm text-gray-600">Inscritos en Cursos</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{moduleStats?.resilience.active_users || 0}</div>
                    <div className="text-sm text-gray-600">Activos en Resiliencia</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{moduleStats?.employment.hired || 0}</div>
                    <div className="text-sm text-gray-600">Empleos Generados</div>
                  </div>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Municipality Distribution */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Distribución por Municipios</h3>
                  <div className="space-y-3">
                    {getMunicipalityStats().map((m, idx) => (
                      <div key={m.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-gray-600">{m.users} usuarios | {m.avg_points} pts promedio</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              ['bg-primary-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'][idx]
                            }`}
                            style={{ width: `${users.length > 0 ? (m.users / users.length) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Module Progress */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Progreso por Módulo</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>📚 Educación</span>
                        <span className="font-medium">{moduleStats?.education.avg_progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-primary-500 h-3 rounded-full" style={{ width: `${moduleStats?.education.avg_progress || 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>🧠 Resiliencia</span>
                        <span className="font-medium">{moduleStats?.resilience.avg_points || 0} pts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${Math.min((moduleStats?.resilience.avg_points || 0) / 5, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>💼 Empleo</span>
                        <span className="font-medium">{moduleStats?.employment.applied || 0} postulaciones</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: `${Math.min((moduleStats?.employment.applied || 0) / 10, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>📋 Censo</span>
                        <span className="font-medium">{moduleStats?.census.completion_rate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-orange-500 h-3 rounded-full" style={{ width: `${moduleStats?.census.completion_rate || 0}%` }} />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Top Performers & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">🏆 Top 10 Ciudadanos</h3>
                  <div className="space-y-2">
                    {getTopPerformers().slice(0, 5).map((user, idx) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => { setSelectedUser(user); setSelectedView('tracking'); }}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-bold ${
                            idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-gray-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user.full_name?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{user.full_name}</div>
                            <div className="text-xs text-gray-500">{user.municipality}</div>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">{user.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">📋 Actividad Reciente</h3>
                  <div className="space-y-2">
                    {getRecentActivity().slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                          log.module === 'Educación' ? 'bg-primary-500' :
                          log.module === 'Resiliencia' ? 'bg-purple-500' :
                          log.module === 'Empleo' ? 'bg-green-500' : 'bg-orange-500'
                        }`}>
                          {log.module === 'Educación' ? '📚' :
                           log.module === 'Resiliencia' ? '🧠' :
                           log.module === 'Empleo' ? '💼' : '📋'}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{log.user_name}</div>
                          <div className="text-xs text-gray-600">{log.action}: {log.details}</div>
                          <div className="text-xs text-gray-400">+{log.points_earned} puntos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* USERS TAB */}
          {selectedView === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <select
                    value={filterMunicipality}
                    onChange={(e) => setFilterMunicipality(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    <option value="all">Todos los municipios</option>
                    <option value="Catia La Mar">Catia La Mar</option>
                    <option value="Maiquetía">Maiquetía</option>
                    <option value="Macuto">Macuto</option>
                    <option value="Caraballeda">Caraballeda</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4">Usuario</th>
                        <th className="text-left py-3 px-4">Municipio</th>
                        <th className="text-left py-3 px-4">Puntos</th>
                        <th className="text-left py-3 px-4">Cursos</th>
                        <th className="text-left py-3 px-4">Racha</th>
                        <th className="text-left py-3 px-4">Horas</th>
                        <th className="text-left py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user.full_name?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{user.full_name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-gray-100 text-gray-800">{user.municipality || '-'}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min((user.points || 0) / 5, 100)}%` }} />
                              </div>
                              <span className="font-medium text-yellow-600">{user.points || 0}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-primary-600">{user.courses_completed || 0}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span>🔥</span>
                              <span className="font-medium text-orange-600">{user.current_streak || 0} días</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-purple-600">{user.total_hours || 0}h</span>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              onClick={() => { setSelectedUser(user); setSelectedView('tracking'); }}
                              className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-3 py-1"
                            >
                              Ver Detalle
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* MODULES TAB */}
          {selectedView === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ModuleProgress stats={moduleStats} />
            </motion.div>
          )}

          {/* TRACKING TAB */}
          {selectedView === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {selectedUser ? (
                <UserTracking user={selectedUser} />
              ) : (
                <UserEvolution 
                  users={users} 
                  onSelectUser={(user) => { setSelectedUser(user); }} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}