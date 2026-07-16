import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'TRAINER' | 'COORDINATOR' | 'STUDENT' | 'SPONSOR';
  municipality?: string;
  created_at: any;
  is_active: boolean;
  is_approved: boolean;
  points?: number;
  courses_completed?: number;
}

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  pendingApprovals: number;
  activeStudents: number;
  totalPoints: number;
}

export default function AdminPanel() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'approvals' | 'settings'>('overview');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingApprovals: 0,
    activeStudents: 0,
    totalPoints: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  const loadStats = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const coursesSnap = await getDocs(collection(db, 'courses'));
      const enrollmentsSnap = await getDocs(collection(db, 'enrollments'));
      
      let totalPoints = 0;
      let activeStudents = 0;
      let pendingApprovals = 0;

      usersSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.is_active) activeStudents++;
        if (!data.is_approved) pendingApprovals++;
        totalPoints += data.points || 0;
      });

      setStats({
        totalUsers: usersSnap.size,
        totalCourses: coursesSnap.size,
        totalEnrollments: enrollmentsSnap.size,
        pendingApprovals,
        activeStudents,
        totalPoints
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('created_at', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserRecord[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        is_approved: true,
        approved_at: Timestamp.now()
      });
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        is_active: !currentStatus
      });
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      loadUsers();
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">Solo los administradores pueden acceder a este panel.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona usuarios, cursos y configuración de la plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-tutorial-id="admin-stats">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios Totales</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estudiantes Activos</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeStudents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cursos Disponibles</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes Aprobación</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingApprovals}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2 mb-6 border-b">
          {(['overview', 'users', 'courses', 'approvals', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && '📊 Resumen'}
              {tab === 'users' && '👥 Usuarios'}
              {tab === 'courses' && '📚 Cursos'}
              {tab === 'approvals' && '✅ Aprobaciones'}
              {tab === 'settings' && '⚙️ Configuración'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Distribución por Municipios</h3>
                <div className="space-y-3">
                  {['Catia La Mar', 'Maiquetía', 'Macuto', 'Caraballeda'].map((m, i) => {
                    const count = users.filter(u => u.municipality === m).length;
                    const percentage = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0;
                    return (
                      <div key={m}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{m}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              ['bg-primary-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'][i]
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Distribución por Roles</h3>
                <div className="space-y-3">
                  {['STUDENT', 'TRAINER', 'COORDINATOR', 'SPONSOR'].map(role => {
                    const count = users.filter(u => u.role === role).length;
                    const percentage = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0;
                    return (
                      <div key={role}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{role}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Top 10 Usuarios con Más Puntos</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">#</th>
                      <th className="text-left py-3 px-4">Nombre</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Municipio</th>
                      <th className="text-left py-3 px-4">Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .sort((a, b) => (b.points || 0) - (a.points || 0))
                      .slice(0, 10)
                      .map((u, idx) => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold text-lg">{idx + 1}</td>
                          <td className="py-3 px-4">{u.full_name}</td>
                          <td className="py-3 px-4 text-gray-600">{u.email}</td>
                          <td className="py-3 px-4">{u.municipality || '-'}</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              {u.points || 0} pts
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-tutorial-id="admin-users"
          >
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="all">Todos los roles</option>
                  <option value="STUDENT">Estudiantes</option>
                  <option value="TRAINER">Instructores</option>
                  <option value="COORDINATOR">Coordinadores</option>
                  <option value="SPONSOR">Patrocinadores</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Usuario</th>
                      <th className="text-left py-3 px-4">Rol</th>
                      <th className="text-left py-3 px-4">Municipio</th>
                      <th className="text-left py-3 px-4">Puntos</th>
                      <th className="text-left py-3 px-4">Estado</th>
                      <th className="text-left py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{u.full_name}</div>
                            <div className="text-sm text-gray-500">{u.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="STUDENT">Estudiante</option>
                            <option value="TRAINER">Instructor</option>
                            <option value="COORDINATOR">Coordinador</option>
                            <option value="SPONSOR">Patrocinador</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">{u.municipality || '-'}</td>
                        <td className="py-3 px-4">{u.points || 0}</td>
                        <td className="py-3 px-4">
                          <Badge className={u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {u.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleActive(u.id, u.is_active)}
                              className={`px-3 py-1 rounded text-sm ${
                                u.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {u.is_active ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'approvals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Usuarios Pendientes de Aprobación</h3>
              <div className="space-y-4">
                {users.filter(u => !u.is_approved).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay usuarios pendientes de aprobación</p>
                ) : (
                  users.filter(u => !u.is_approved).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{u.full_name}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                        <div className="text-xs text-gray-400">Rol: {u.role} | Municipio: {u.municipality}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveUser(u.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                        >
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(u.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                        >
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Configuración de la Plataforma</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Programa
                  </label>
                  <input
                    type="text"
                    defaultValue="La Guaira Resiliente Digital"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    defaultValue="Programa integral de recuperación post-sísmica para el estado La Guaira"
                    className="w-full px-4 py-2 border rounded-lg h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puntos por Completar Módulo
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puntos por Quiz
                  </label>
                  <input
                    type="number"
                    defaultValue={25}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <Button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2">
                  Guardar Configuración
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}