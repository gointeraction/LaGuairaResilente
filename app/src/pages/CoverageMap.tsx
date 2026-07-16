import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface MunicipalityData {
  name: string;
  users: number;
  courses_completed: number;
  avg_points: number;
  color: string;
  coordinates: { x: number; y: number };
}

const MUNICIPALITIES: MunicipalityData[] = [
  { name: 'Catia La Mar', users: 0, courses_completed: 0, avg_points: 0, color: '#3B82F6', coordinates: { x: 20, y: 40 } },
  { name: 'Maiquetía', users: 0, courses_completed: 0, avg_points: 0, color: '#10B981', coordinates: { x: 35, y: 30 } },
  { name: 'Macuto', users: 0, courses_completed: 0, avg_points: 0, color: '#8B5CF6', coordinates: { x: 55, y: 35 } },
  { name: 'Caraballeda', users: 0, courses_completed: 0, avg_points: 0, color: '#F59E0B', coordinates: { x: 75, y: 45 } }
];

export default function CoverageMap() {
  const [municipalities, setMunicipalities] = useState(MUNICIPALITIES);
  const [loading, setLoading] = useState(true);
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityData | null>(null);

  useEffect(() => {
    loadCoverageData();
  }, []);

  const loadCoverageData = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const enrollmentsSnap = await getDocs(collection(db, 'enrollments'));
      
      const municipalityStats: Record<string, { users: number; courses: number; totalPoints: number }> = {};
      
      MUNICIPALITIES.forEach(m => {
        municipalityStats[m.name] = { users: 0, courses: 0, totalPoints: 0 };
      });

      usersSnap.docs.forEach(doc => {
        const data = doc.data();
        const m = data.municipality;
        if (m && municipalityStats[m]) {
          municipalityStats[m].users++;
          municipalityStats[m].totalPoints += data.points || 0;
        }
      });

      enrollmentsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.completed && data.municipality && municipalityStats[data.municipality]) {
          municipalityStats[data.municipality].courses++;
        }
      });

      const updatedMunicipalities = MUNICIPALITIES.map(m => ({
        ...m,
        users: municipalityStats[m.name].users,
        courses_completed: municipalityStats[m.name].courses,
        avg_points: municipalityStats[m.name].users > 0 
          ? Math.round(municipalityStats[m.name].totalPoints / municipalityStats[m.name].users)
          : 0
      }));

      setMunicipalities(updatedMunicipalities);
    } catch (error) {
      console.error('Error loading coverage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalStats = () => {
    return municipalities.reduce((acc, m) => ({
      users: acc.users + m.users,
      courses: acc.courses + m.courses_completed,
      avg_points: 0
    }), { users: 0, courses: 0, avg_points: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totals = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🗺️ Mapa de Cobertura
          </h1>
          <p className="text-gray-600">Estado La Guaira - Programa de Recuperación Post-Sísmica</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-primary-600">{totals.users}</div>
            <div className="text-sm text-gray-600">Ciudadanos Registrados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-green-600">{totals.courses}</div>
            <div className="text-sm text-gray-600">Cursos Completados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">🏘️</div>
            <div className="text-2xl font-bold text-purple-600">4</div>
            <div className="text-sm text-gray-600">Municipios</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">📍</div>
            <div className="text-2xl font-bold text-orange-600">100K+</div>
            <div className="text-sm text-gray-600">Población Objetivo</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Mapa de Municipios</h3>
              <div className="relative bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl p-8 min-h-[400px]">
                <svg viewBox="0 0 100 80" className="w-full h-full">
                  <defs>
                    <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  
                  <rect x="0" y="0" width="100" height="80" fill="url(#seaGradient)" rx="4"/>
                  
                  <text x="50" y="15" textAnchor="middle" fill="#1E40AF" fontSize="4" fontWeight="bold">
                    Océano Atlántico
                  </text>
                  
                  <path 
                    d="M 10 60 Q 20 40 35 35 Q 50 25 65 30 Q 80 35 90 45 L 90 80 L 10 80 Z" 
                    fill="#9CA3AF" 
                    opacity="0.3"
                  />
                  
                  {municipalities.map((m) => {
                    const size = 5 + (m.users / 10) * 3;
                    return (
                      <g 
                        key={m.name}
                        className="cursor-pointer"
                        onClick={() => setSelectedMunicipality(m)}
                      >
                        <circle
                          cx={m.coordinates.x}
                          cy={m.coordinates.y}
                          r={size}
                          fill={m.color}
                          filter="url(#shadow)"
                          opacity="0.9"
                          className="transition-all duration-300 hover:opacity-100"
                        />
                        <circle
                          cx={m.coordinates.x}
                          cy={m.coordinates.y}
                          r={size + 2}
                          fill="none"
                          stroke={m.color}
                          strokeWidth="0.5"
                          opacity="0.5"
                        />
                        <text
                          x={m.coordinates.x}
                          y={m.coordinates.y + 1}
                          textAnchor="middle"
                          fill="white"
                          fontSize="2"
                          fontWeight="bold"
                        >
                          {m.users}
                        </text>
                        <text
                          x={m.coordinates.x}
                          y={m.coordinates.y + 4}
                          textAnchor="middle"
                          fill="#1F2937"
                          fontSize="1.8"
                          fontWeight="bold"
                        >
                          {m.name}
                        </text>
                      </g>
                    );
                  })}
                  
                  <text x="15" y="75" fill="#1E40AF" fontSize="2">🏔️ Montañas</text>
                  <text x="75" y="75" fill="#1E40AF" fontSize="2">🌊 Costa</text>
                </svg>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {selectedMunicipality && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6 border-2" style={{ borderColor: selectedMunicipality.color }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: selectedMunicipality.color }}>
                    {selectedMunicipality.name}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ciudadanos:</span>
                      <span className="font-bold">{selectedMunicipality.users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cursos completados:</span>
                      <span className="font-bold">{selectedMunicipality.courses_completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Promedio puntos:</span>
                      <span className="font-bold">{selectedMunicipality.avg_points}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Detalle por Municipio</h3>
              <div className="space-y-4">
                {municipalities.map(m => (
                  <div 
                    key={m.name} 
                    className="p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedMunicipality(m)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="font-medium text-sm">{m.name}</span>
                      </div>
                      <span className="text-sm font-bold">{m.users}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${totals.users > 0 ? (m.users / totals.users) * 100 : 0}%`,
                          backgroundColor: m.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Leyenda</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary-500" />
                  <span>Catia La Mar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span>Maiquetía</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <span>Macuto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  <span>Caraballeda</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}