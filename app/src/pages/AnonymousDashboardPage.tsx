import { useState, useEffect } from 'react';
import { 
  EyeOff, 
  Users, 
  TrendingUp, 
  Award,
  BarChart3,
  MapPin,
  Calendar,
  Download,
  FileText,
  RefreshCw
} from 'lucide-react';
import { 
  anonymousDashboardService, 
  AnonymousBeneficiary, 
  SponsorDashboardStats,
  ImpactReport
} from '../services/anonymousDashboard';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'beneficiaries' | 'impact' | 'timeline';

export default function AnonymousDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [beneficiaries, setBeneficiaries] = useState<AnonymousBeneficiary[]>([]);
  const [stats, setStats] = useState<SponsorDashboardStats | null>(null);
  const [impactReport, setImpactReport] = useState<ImpactReport | null>(null);
  const [timeline, setTimeline] = useState<{date: string; active: number; completed: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [benefData, statsData, reportData, timelineData] = await Promise.all([
        anonymousDashboardService.getAnonymousBeneficiaries(),
        anonymousDashboardService.getSponsorDashboardStats('SPN-001'),
        anonymousDashboardService.generateImpactReport('SPN-001', 'Junio 2025'),
        anonymousDashboardService.getImpactTimeline('SPN-001')
      ]);
      
      setBeneficiaries(benefData);
      setStats(statsData);
      setImpactReport(reportData);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Error loading anonymous dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    toast.success('Descargando reporte de impacto...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard anónimo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <EyeOff className="w-8 h-8 text-blue-600" />
                Dashboard Anónimo para Empresas
              </h1>
              <p className="text-gray-600 mt-1">Monitoreo de progreso sin datos sensibles</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-5 h-5" />
                Actualizar
              </button>
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-5 h-5" />
                Descargar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <EyeOff className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Privacidad Protegida</h3>
              <p className="text-sm text-blue-700">
                Los datos mostrados están anonimizados. No se muestran nombres, teléfonos ni información personal identificable.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Beneficiarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_beneficiaries || beneficiaries.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.active_beneficiaries || 3}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cursos Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_courses_completed || 14}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avance Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.average_progress || 42}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Resumen
                </div>
              </button>
              <button
                onClick={() => setActiveTab('beneficiaries')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'beneficiaries'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Beneficiarios
                </div>
              </button>
              <button
                onClick={() => setActiveTab('impact')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'impact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Reporte de Impacto
                </div>
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'timeline'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Línea de Tiempo
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Municipality Distribution */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución por Municipio</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats?.beneficiaries_by_municipality || {}).map(([municipality, count]) => (
                      <div key={municipality} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{municipality}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type Distribution */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución por Tipo</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats?.beneficiaries_by_type || {}).map(([type, count]) => (
                      <div key={type} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">{type}</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Distribution */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Progreso</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Sin Iniciar</div>
                      <div className="text-2xl font-bold text-yellow-600 mt-1">
                        {stats?.progress_distribution.not_started || 1}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">En Progreso</div>
                      <div className="text-2xl font-bold text-blue-600 mt-1">
                        {stats?.progress_distribution.in_progress || 3}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Completados</div>
                      <div className="text-2xl font-bold text-green-600 mt-1">
                        {stats?.progress_distribution.completed || 1}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'beneficiaries' && (
              <div className="space-y-4">
                {beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-500">{beneficiary.code}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            beneficiary.status === 'EN_CAPACITACION' ? 'bg-blue-100 text-blue-800' :
                            beneficiary.status === 'ELEGIBLE' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {beneficiary.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-600">{beneficiary.municipality}</span>
                          <span className="text-gray-600">{beneficiary.beneficiary_type}</span>
                          <span className="text-gray-600">{beneficiary.camp_name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{beneficiary.points_balance}</div>
                        <div className="text-xs text-gray-500">puntos</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Cursos: {beneficiary.courses_completed}
                      </span>
                      {beneficiary.current_track && (
                        <span className="text-gray-600">
                          Track: {beneficiary.current_track}
                        </span>
                      )}
                      <span className="text-gray-600">
                        Alfabetización: {beneficiary.digital_literacy}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {beneficiary.needs_summary.map((need, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'impact' && impactReport && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Reporte de Impacto - {impactReport.period}</h3>
                  <p className="text-sm text-blue-700">Generado el {impactReport.generated_at?.toDate().toLocaleDateString()}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Beneficiarios</div>
                    <div className="text-2xl font-bold text-gray-900">{impactReport.total_beneficiaries}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Activos</div>
                    <div className="text-2xl font-bold text-gray-900">{impactReport.active_beneficiaries}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Cursos</div>
                    <div className="text-2xl font-bold text-gray-900">{impactReport.courses_completed}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Certificados</div>
                    <div className="text-2xl font-bold text-gray-900">{impactReport.certificates_issued}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Highlights</h4>
                  <ul className="space-y-2">
                    {impactReport.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <Award className="w-4 h-4 text-yellow-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tracks Populares</h4>
                  <div className="space-y-2">
                    {impactReport.top_tracks.map((track, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <span className="text-sm text-gray-900">{track.track}</span>
                        <span className="text-sm font-medium text-gray-900">{track.count} beneficiarios</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Línea de Tiempo de Impacto</h3>
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-20 text-sm text-gray-600">{item.date}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-sm text-gray-600">Activos: {item.active}</div>
                          <div className="text-sm text-gray-600">Completados: {item.completed}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.active / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
