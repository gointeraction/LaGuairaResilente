import { useState, useEffect } from 'react';
import { 
  Gift, 
  Smartphone, 
  ShoppingBag, 
  CreditCard, 
  Award,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  RefreshCw
} from 'lucide-react';
import { 
  redemptionService, 
  RedemptionItem, 
  UserRedemption, 
  RedemptionType,
  RedemptionStatus,
  REDEMPTION_CATALOG,
  USER_REDEMPTIONS_DATA
} from '../services/redemption';
import toast from 'react-hot-toast';

type TabType = 'catalog' | 'redemptions' | 'history';

export default function PointsRedemptionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('catalog');
  const [catalog, setCatalog] = useState<RedemptionItem[]>([]);
  const [redemptions, setRedemptions] = useState<UserRedemption[]>([]);
  const [filterType, setFilterType] = useState<RedemptionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [userPoints, setUserPoints] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catalogData, redemptionsData] = await Promise.all([
        redemptionService.getCatalog(),
        redemptionService.getUserRedemptions('USR-001')
      ]);
      
      setCatalog(catalogData.length > 0 ? catalogData : REDEMPTION_CATALOG as RedemptionItem[]);
      setRedemptions(redemptionsData.length > 0 ? redemptionsData : USER_REDEMPTIONS_DATA as UserRedemption[]);
    } catch (error) {
      console.error('Error loading redemption data:', error);
      setCatalog(REDEMPTION_CATALOG as RedemptionItem[]);
      setRedemptions(USER_REDEMPTIONS_DATA as UserRedemption[]);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (item: RedemptionItem) => {
    if (userPoints < item.points_cost) {
      toast.error('Puntos insuficientes');
      return;
    }
    
    toast.success(`Canjeando ${item.name}...`);
    // In production, this would call the service
    setUserPoints(prev => prev - item.points_cost);
    toast.success('Canje registrado exitosamente');
  };

  const getTypeIcon = (type: RedemptionType) => {
    switch (type) {
      case 'RECARGA_MOVIL': return <Smartphone className="w-5 h-5 text-cyan-500" />;
      case 'BOLSA_ALIMENTOS': return <ShoppingBag className="w-5 h-5 text-green-500" />;
      case 'CAPITAL_SEMILLA': return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'DISPOSITIVO': return <Gift className="w-5 h-5 text-purple-500" />;
      case 'CURSO_EXTRA': return <Award className="w-5 h-5 text-yellow-500" />;
      case 'CERTIFICADO': return <Award className="w-5 h-5 text-orange-500" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: RedemptionType) => {
    switch (type) {
      case 'RECARGA_MOVIL': return 'bg-cyan-100 text-cyan-800';
      case 'BOLSA_ALIMENTOS': return 'bg-green-100 text-green-800';
      case 'CAPITAL_SEMILLA': return 'bg-blue-100 text-blue-800';
      case 'DISPOSITIVO': return 'bg-purple-100 text-purple-800';
      case 'CURSO_EXTRA': return 'bg-yellow-100 text-yellow-800';
      case 'CERTIFICADO': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: RedemptionStatus) => {
    switch (status) {
      case 'PENDIENTE': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'PROCESADO': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'ENTREGADO': return <Truck className="w-5 h-5 text-green-500" />;
      case 'CANCELADO': return <Truck className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: RedemptionStatus) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESADO': return 'bg-blue-100 text-blue-800';
      case 'ENTREGADO': return 'bg-green-100 text-green-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCatalog = catalog.filter(item => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando catálogo...</p>
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
                <Gift className="w-8 h-8 text-blue-600" />
                Canje de Puntos de Resiliencia
              </h1>
              <p className="text-gray-600 mt-1">Intercambia tus puntos por beneficios reales</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 rounded-lg px-4 py-2">
                <div className="text-sm text-gray-600">Tus Puntos</div>
                <div className="text-2xl font-bold text-blue-600">{userPoints}</div>
              </div>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-5 h-5" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'catalog'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Catálogo
                </div>
              </button>
              <button
                onClick={() => setActiveTab('redemptions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'redemptions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Mis Canjes
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Historial
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'catalog' && (
              <>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as RedemptionType | 'ALL')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ALL">Todos</option>
                    <option value="RECARGA_MOVIL">Recargas Móvil</option>
                    <option value="BOLSA_ALIMENTOS">Bolsas Alimentos</option>
                    <option value="CAPITAL_SEMILLA">Capital Semilla</option>
                    <option value="DISPOSITIVO">Dispositivos</option>
                    <option value="CURSO_EXTRA">Cursos Extra</option>
                    <option value="CERTIFICADO">Certificados</option>
                  </select>
                </div>

                {/* Catalog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCatalog.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{item.points_cost}</div>
                          <div className="text-xs text-gray-500">puntos</div>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-600">Valor: Bs. {item.value_bs.toLocaleString()}</span>
                        <span className="text-gray-600">Stock: {item.stock}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.requirements.map((req, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                            {req}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handleRedeem(item)}
                        disabled={userPoints < item.points_cost || !item.available}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {userPoints < item.points_cost ? 'Puntos Insuficientes' : 'Canjear'}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'redemptions' && (
              <div className="space-y-4">
                {redemptions.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sin Canjes</h3>
                    <p className="text-gray-600">Aún no has canjeado tus puntos</p>
                  </div>
                ) : (
                  redemptions.map((redemption) => (
                    <div key={redemption.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(redemption.item_type)}
                          <div>
                            <h4 className="font-medium text-gray-900">{redemption.item_name}</h4>
                            <p className="text-sm text-gray-600">{redemption.item_type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(redemption.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(redemption.status)}`}>
                            {redemption.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Puntos:</span>
                          <span className="ml-2 font-medium">{redemption.points_used}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Valor:</span>
                          <span className="ml-2 font-medium">Bs. {redemption.value_bs}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Ubicación:</span>
                          <span className="ml-2 font-medium">{redemption.camp_name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tracking:</span>
                          <span className="ml-2 font-medium font-mono">{redemption.tracking_code}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Historial de Puntos</h3>
                <p className="text-gray-600 mb-4">Registro de actividad de puntos</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">+450</div>
                    <div className="text-xs text-gray-600">Ganados</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-600">-50</div>
                    <div className="text-xs text-gray-600">Canjeados</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">+25</div>
                    <div className="text-xs text-gray-600">Bonus</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">500</div>
                    <div className="text-xs text-gray-600">Balance</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
