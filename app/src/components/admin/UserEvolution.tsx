import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

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

interface UserEvolutionProps {
  users: UserRecord[];
  onSelectUser: (user: UserRecord) => void;
}

interface EvolutionData {
  user_id: string;
  month: string;
  points: number;
  courses: number;
  activities: number;
}

export default function UserEvolution({ users, onSelectUser }: UserEvolutionProps) {
  const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    loadEvolutionData();
  }, []);

  const loadEvolutionData = async () => {
    try {
      const snapshots = await Promise.all([
        getDocs(collection(db, 'user_progress')),
        getDocs(collection(db, 'resilience_activities'))
      ]);

      const progressData = snapshots[0].docs.map(d => d.data());
      const resilienceData = snapshots[1].docs.map(d => d.data());

      const evolutionMap = new Map<string, EvolutionData>();

      progressData.forEach(p => {
        const key = `${p.user_id}-${p.month || 'current'}`;
        if (!evolutionMap.has(key)) {
          evolutionMap.set(key, {
            user_id: p.user_id,
            month: p.month || 'current',
            points: 0,
            courses: 0,
            activities: 0
          });
        }
        const data = evolutionMap.get(key)!;
        data.courses += p.courses_completed || 0;
        data.points += p.points_earned || 0;
      });

      resilienceData.forEach(r => {
        const key = `${r.user_id}-${r.month || 'current'}`;
        if (!evolutionMap.has(key)) {
          evolutionMap.set(key, {
            user_id: r.user_id,
            month: r.month || 'current',
            points: 0,
            courses: 0,
            activities: 0
          });
        }
        const data = evolutionMap.get(key)!;
        data.activities += 1;
        data.points += r.points_earned || 0;
      });

      setEvolutionData(Array.from(evolutionMap.values()));
    } catch (error) {
      console.error('Error loading evolution data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserEvolution = (userId: string) => {
    return evolutionData.filter(e => e.user_id === userId);
  };

  const getGrowthRate = (userId: string) => {
    const userEvo = getUserEvolution(userId);
    if (userEvo.length < 2) return 0;
    const current = userEvo[userEvo.length - 1].points;
    const previous = userEvo[userEvo.length - 2].points;
    return previous > 0 ? Math.round(((current - previous) / previous) * 100) : 100;
  };

  const getTopMovers = () => {
    return [...users]
      .map(u => ({
        ...u,
        growth: getGrowthRate(u.id)
      }))
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 5);
  };

  const getConsistentLearners = () => {
    return [...users]
      .sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0))
      .slice(0, 5);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Evolución de Usuarios</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="week">Última Semana</option>
          <option value="month">Último Mes</option>
          <option value="quarter">Último Trimestre</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movers */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">🚀 Mayor Crecimiento</h3>
          <div className="space-y-3">
            {getTopMovers().map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.full_name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.municipality}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold">+{user.growth}%</div>
                  <div className="text-xs text-gray-500">{user.points} pts</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Consistent Learners */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">🔥 Más Constantes</h3>
          <div className="space-y-3">
            {getConsistentLearners().map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.full_name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.municipality}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-orange-600 font-bold flex items-center gap-1">
                    🔥 {user.current_streak || 0} días
                  </div>
                  <div className="text-xs text-gray-500">{user.courses_completed} cursos</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* All Users Grid */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Todos los Usuarios ({users.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.slice(0, 12).map(user => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => onSelectUser(user)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.full_name?.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{user.full_name}</div>
                  <div className="text-sm text-gray-500">{user.municipality}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 rounded p-2 text-center">
                  <div className="font-bold text-blue-600">{user.points || 0}</div>
                  <div className="text-xs text-gray-600">Puntos</div>
                </div>
                <div className="bg-green-50 rounded p-2 text-center">
                  <div className="font-bold text-green-600">{user.courses_completed || 0}</div>
                  <div className="text-xs text-gray-600">Cursos</div>
                </div>
                <div className="bg-orange-50 rounded p-2 text-center">
                  <div className="font-bold text-orange-600">{user.current_streak || 0}</div>
                  <div className="text-xs text-gray-600">Racha</div>
                </div>
                <div className="bg-purple-50 rounded p-2 text-center">
                  <div className="font-bold text-purple-600">{user.total_hours || 0}h</div>
                  <div className="text-xs text-gray-600">Horas</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}