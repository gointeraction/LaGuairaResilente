import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface LeaderboardUser {
  id: string;
  full_name: string;
  municipality?: string;
  points: number;
  courses_completed: number;
  current_streak: number;
  rank?: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMunicipality, setFilterMunicipality] = useState<string>('all');
  const [timeFrame, setTimeFrame] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('points', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const leadersData = snapshot.docs.map((doc, idx) => ({
        id: doc.id,
        ...doc.data(),
        rank: idx + 1
      })) as LeaderboardUser[];
      setLeaders(leadersData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaders = leaders.filter(l => {
    return filterMunicipality === 'all' || l.municipality === filterMunicipality;
  });

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getMunicipalityColor = (municipality?: string) => {
    const colors: Record<string, string> = {
      'Catia La Mar': 'bg-blue-100 text-blue-800',
      'Maiquetía': 'bg-green-100 text-green-800',
      'Macuto': 'bg-purple-100 text-purple-800',
      'Caraballeda': 'bg-orange-100 text-orange-800'
    };
    return colors[municipality || ''] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏆 Tabla de Líderes
          </h1>
          <p className="text-gray-600">Los ciudadanos más resilientes de La Guaira</p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <select
            value={filterMunicipality}
            onChange={(e) => setFilterMunicipality(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm"
          >
            <option value="all">Todos los municipios</option>
            <option value="Catia La Mar">Catia La Mar</option>
            <option value="Maiquetía">Maiquetía</option>
            <option value="Macuto">Macuto</option>
            <option value="Caraballeda">Caraballeda</option>
          </select>

          <div className="flex bg-white rounded-lg shadow-sm border">
            {(['all', 'month', 'week'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeFrame === tf
                    ? 'bg-blue-600 text-white rounded-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tf === 'all' ? 'Todo el tiempo' : tf === 'month' ? 'Este mes' : 'Esta semana'}
              </button>
            ))}
          </div>
        </div>

        {filteredLeaders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-tutorial-id="leaderboard-podium">
            {filteredLeaders.slice(0, 3).map((leader, idx) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`p-6 text-center ${
                  idx === 0 ? 'ring-4 ring-yellow-400 bg-gradient-to-b from-yellow-50 to-white' :
                  idx === 1 ? 'ring-2 ring-gray-300 bg-gradient-to-b from-gray-50 to-white' :
                  'ring-2 ring-orange-300 bg-gradient-to-b from-orange-50 to-white'
                }`}>
                  <div className="text-5xl mb-3">{getMedalEmoji(idx + 1)}</div>
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {leader.full_name?.charAt(0) || '?'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{leader.full_name}</h3>
                  {leader.municipality && (
                    <Badge className={`mt-2 ${getMunicipalityColor(leader.municipality)}`}>
                      {leader.municipality}
                    </Badge>
                  )}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Puntos</span>
                      <span className="font-bold text-blue-600">{leader.points}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cursos</span>
                      <span className="font-bold text-green-600">{leader.courses_completed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Racha</span>
                      <span className="font-bold text-orange-600">{leader.current_streak} días</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Card className="overflow-hidden" data-tutorial-id="leaderboard-ranking">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Posición</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Ciudadano</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Municipio</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Puntos</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Cursos</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Racha</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaders.map((leader, idx) => (
                  <motion.tr
                    key={leader.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`border-t hover:bg-gray-50 transition-colors ${
                      idx < 3 ? 'bg-gradient-to-r from-blue-50 to-transparent' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span className={`text-lg font-bold ${
                        idx === 0 ? 'text-yellow-500' :
                        idx === 1 ? 'text-gray-400' :
                        idx === 2 ? 'text-orange-400' :
                        'text-gray-600'
                      }`}>
                        {getMedalEmoji(idx + 1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {leader.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{leader.full_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {leader.municipality && (
                        <Badge className={getMunicipalityColor(leader.municipality)}>
                          {leader.municipality}
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min((leader.points / 500) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="font-bold text-blue-600">{leader.points}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-green-600">{leader.courses_completed}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <span className="text-orange-500">🔥</span>
                        <span className="font-medium text-orange-600">{leader.current_streak} días</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredLeaders.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay datos disponibles</h3>
            <p className="text-gray-600">Aún no se han registrado ciudadanos en esta categoría</p>
          </Card>
        )}
      </div>
    </div>
  );
}