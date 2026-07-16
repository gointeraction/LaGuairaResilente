import { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Search,
  Plus,
  Target,
  Award,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { 
  matchingService, 
  Sponsor, 
  Beneficiary, 
  SponsorMatch, 
  MatchingStats,
  MatchStatus
} from '../services/matching';
import toast from 'react-hot-toast';

type TabType = 'matches' | 'sponsors' | 'beneficiaries' | 'auto';

export default function MatchingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('matches');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [matches, setMatches] = useState<SponsorMatch[]>([]);
  const [stats, setStats] = useState<MatchingStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [autoMatching, setAutoMatching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sponsorsData, beneficiariesData, matchesData, statsData] = await Promise.all([
        matchingService.getSponsors(),
        matchingService.getBeneficiaries(),
        matchingService.getMatches(),
        matchingService.getMatchingStats()
      ]);
      
      setSponsors(sponsorsData);
      setBeneficiaries(beneficiariesData);
      setMatches(matchesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading matching data:', error);
      setSponsors([]);
      setBeneficiaries([]);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoMatch = async () => {
    setAutoMatching(true);
    try {
      const newMatches = await matchingService.autoMatch();
      toast.success(`${newMatches.length} matches generados automáticamente`);
      loadData();
    } catch (error) {
      toast.error('Error al generar matches automáticos');
    } finally {
      setAutoMatching(false);
    }
  };

  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ASIGNADO': return 'bg-primary-100 text-primary-800';
      case 'EN_PROCESO': return 'bg-green-100 text-green-800';
      case 'COMPLETADO': return 'bg-purple-100 text-purple-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'COMERCIAL': return 'bg-primary-100 text-primary-800';
      case 'CONECTIVIDAD': return 'bg-cyan-100 text-cyan-800';
      case 'INFRAESTRUCTURA': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-primary-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredMatches = matches.filter(m => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        m.sponsor_name.toLowerCase().includes(query) ||
        m.beneficiary_name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando matching...</p>
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
                <Users className="w-8 h-8 text-primary-600" />
                Matching Empresa-Beneficiario
              </h1>
              <p className="text-gray-600 mt-1">Asignación automática de patrocinadores</p>
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
                onClick={handleAutoMatch}
                disabled={autoMatching}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Target className="w-5 h-5" />
                {autoMatching ? 'Procesando...' : 'Auto-Match'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Plus className="w-5 h-5" />
                Nuevo Match
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_matches || matches.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Patrocinadores</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_sponsors || sponsors.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Beneficiarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_beneficiaries || beneficiaries.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.average_match_score?.toFixed(1) || '88.3'}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('matches')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'matches'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Matches
                </div>
              </button>
              <button
                onClick={() => setActiveTab('sponsors')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'sponsors'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Patrocinadores
                </div>
              </button>
              <button
                onClick={() => setActiveTab('beneficiaries')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'beneficiaries'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Beneficiarios
                </div>
              </button>
              <button
                onClick={() => setActiveTab('auto')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'auto'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Auto-Match
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'matches' && (
              <>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar match..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredMatches.map((match) => (
                    <div key={match.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary-500" />
                            <span className="font-medium text-gray-900">{match.sponsor_name}</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-500" />
                            <span className="font-medium text-gray-900">{match.beneficiary_name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchTypeColor(match.match_type)}`}>
                            {match.match_type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                            {match.status}
                          </span>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getScoreColor(match.match_score)}`}>
                              {match.match_score}
                            </div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">{match.assistance_details}</p>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Bs. {match.total_assistance_bs.toLocaleString()}
                        </span>
                        <span className="text-gray-600">
                          ${match.total_assistance_usd.toLocaleString()}
                        </span>
                        <span className="text-gray-600">
                          Progreso: {match.progress_percentage}%
                        </span>
                        <span className="text-gray-600">
                          Módulos: {match.modules_completed}/{match.modules_total}
                        </span>
                      </div>
                      
                      {match.progress_percentage > 0 && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${match.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'sponsors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{sponsor.company_name}</h4>
                        <p className="text-sm text-gray-600">{sponsor.company_type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sponsor.status === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sponsor.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Presupuesto:</span>
                        <span className="font-medium">Bs. {sponsor.total_budget_bs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Asignado:</span>
                        <span className="font-medium">Bs. {sponsor.allocated_bs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Beneficiarios:</span>
                        <span className="font-medium">{sponsor.beneficiaries_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Municipio:</span>
                        <span className="font-medium">{sponsor.preferred_municipality}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {sponsor.sponsorship_types.map((type, index) => (
                        <span key={index} className={`px-2 py-1 rounded text-xs font-medium ${getMatchTypeColor(type)}`}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'beneficiaries' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{beneficiary.full_name}</h4>
                        <p className="text-sm text-gray-600">{beneficiary.beneficiary_type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        beneficiary.status === 'ELEGIBLE' ? 'bg-green-100 text-green-800' :
                        beneficiary.status === 'EN_CAPACITACION' ? 'bg-primary-100 text-primary-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {beneficiary.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Municipio:</span>
                        <span className="font-medium">{beneficiary.municipality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alfabetización:</span>
                        <span className="font-medium">{beneficiary.digital_literacy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Puntos:</span>
                        <span className="font-medium">{beneficiary.points_balance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cursos:</span>
                        <span className="font-medium">{beneficiary.courses_completed}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-600">Necesidades:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {beneficiary.needs.map((need, index) => (
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

            {activeTab === 'auto' && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Matching Automático</h3>
                <p className="text-gray-600 mb-4">
                  El sistema asigna automáticamente patrocinadores a beneficiarios basado en:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
                  <div className="bg-primary-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary-600">25</div>
                    <div className="text-xs text-gray-600">Tipo Beneficiario</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">20</div>
                    <div className="text-xs text-gray-600">Municipio</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">20</div>
                    <div className="text-xs text-gray-600">Necesidades</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">15</div>
                    <div className="text-xs text-gray-600">Alfabetización</div>
                  </div>
                </div>
                <button
                  onClick={handleAutoMatch}
                  disabled={autoMatching}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {autoMatching ? 'Procesando...' : 'Ejecutar Auto-Match'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
