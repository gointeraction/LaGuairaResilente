import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboard';
import { censusService } from '../services/census';
import { ArrowLeft, Users, BookOpen, Award, TrendingUp, Map, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalGraduates: number;
  totalCourses: number;
  totalSponsors: number;
  totalEmployments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalResiliencePoints: number;
  completionRate: number;
}

interface CensusStats {
  total: number;
  byMunicipality: Record<string, number>;
  byDigitalLevel: Record<string, number>;
}

export default function Reports() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [censusStats, setCensusStats] = useState<CensusStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, censusData] = await Promise.all([
        dashboardService.getStats(),
        censusService.getSurveyStats()
      ]);
      setStats(statsData);
      setCensusStats(censusData);
    } catch (error) {
      toast.error('Error cargando reportes');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportUsers = () => {
    if (!stats) return;
    exportToCSV([
      { metrica: 'Total Usuarios', valor: stats.totalUsers },
      { metrica: 'Estudiantes', valor: stats.totalStudents },
      { metrica: 'Graduados', valor: stats.totalGraduates }
    ], 'usuarios_resumen');
    toast.success('Reporte exportado');
  };

  const handleExportCourses = () => {
    if (!stats) return;
    exportToCSV([
      { metrica: 'Total Cursos', valor: stats.totalCourses },
      { metrica: 'Inscripciones Activas', valor: stats.activeEnrollments },
      { metrica: 'Inscripciones Completadas', valor: stats.completedEnrollments },
      { metrica: 'Tasa de Finalización', valor: `${stats.completionRate}%` }
    ], 'cursos_resumen');
    toast.success('Reporte exportado');
  };

  const handleExportCensus = () => {
    if (!censusStats) return;
    
    const data = Object.entries(censusStats.byMunicipality).map(([municipality, count]) => ({
      municipio: municipality.replace('_', ' '),
      encuestas: count
    }));
    
    exportToCSV(data, 'censo_por_municipio');
    toast.success('Reporte exportado');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-primary-900">Reportes</h1>
            </div>
            
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mes</option>
              <option value="year">Último Año</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Estudiantes Activos</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalStudents || 0}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Graduados</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalGraduates || 0}</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tasa de Finalización</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.completionRate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-info-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Users Report */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Usuarios</h2>
              <button 
                onClick={handleExportUsers}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Registrados</span>
                <span className="font-semibold">{stats?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Estudiantes</span>
                <span className="font-semibold">{stats?.totalStudents || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Graduados</span>
                <span className="font-semibold">{stats?.totalGraduates || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Empresas Patrocinadoras</span>
                <span className="font-semibold">{stats?.totalSponsors || 0}</span>
              </div>
            </div>
          </div>

          {/* Courses Report */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Educación</h2>
              <button 
                onClick={handleExportCourses}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Cursos</span>
                <span className="font-semibold">{stats?.totalCourses || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Inscripciones Activas</span>
                <span className="font-semibold">{stats?.activeEnrollments || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Completados</span>
                <span className="font-semibold">{stats?.completedEnrollments || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tasa de Finalización</span>
                <span className="font-semibold text-success-600">{stats?.completionRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Census Report */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Map className="w-5 h-5" />
              Censo Digital
            </h2>
            <button 
              onClick={handleExportCensus}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By Municipality */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Por Municipio</h3>
              <div className="space-y-2">
                {censusStats && Object.entries(censusStats.byMunicipality).map(([municipality, count]) => (
                  <div key={municipality} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{municipality.replace('_', ' ')}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-primary-500 rounded-full" 
                          style={{ width: `${(count / (censusStats.total || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Digital Level */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Por Nivel Digital</h3>
              <div className="space-y-2">
                {censusStats && Object.entries(censusStats.byDigitalLevel).map(([level, count]) => {
                  const levelLabels: Record<string, string> = {
                    'NONE': 'Sin experiencia',
                    'BASIC': 'Básico',
                    'INTERMEDIATE': 'Intermedio',
                    'ADVANCED': 'Avanzado'
                  };
                  return (
                    <div key={level} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{levelLabels[level] || level}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-success-500 rounded-full" 
                            style={{ width: `${(count / (censusStats.total || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h2 className="text-xl font-bold mb-4">Resumen de Impacto</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-primary-100">Beneficiarios Totales</p>
              <p className="text-3xl font-bold">{stats?.totalStudents || 0}</p>
            </div>
            <div>
              <p className="text-primary-100">Horas de Capacitación</p>
              <p className="text-3xl font-bold">{(stats?.completedEnrollments || 0) * 5}</p>
            </div>
            <div>
              <p className="text-primary-100">Empleos Generados</p>
              <p className="text-3xl font-bold">{stats?.totalEmployments || 0}</p>
            </div>
            <div>
              <p className="text-primary-100">Puntos Totales</p>
              <p className="text-3xl font-bold">{stats?.totalResiliencePoints || 0}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
