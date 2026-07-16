import { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus,
  Search,
  Eye,
  RefreshCw
} from 'lucide-react';
import { 
  logisticsService, 
  Delivery, 
  DeliveryStatus,
  DeliveryType,
  FoodDistribution,
  MobileTopUp,
  LogisticsStats
} from '../services/logistics';

type TabType = 'deliveries' | 'routes' | 'food' | 'topups';

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('deliveries');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [foodDistributions, setFoodDistributions] = useState<FoodDistribution[]>([]);
  const [topUps, setTopUps] = useState<MobileTopUp[]>([]);
  const [stats, setStats] = useState<LogisticsStats | null>(null);
  const [filterStatus, setFilterStatus] = useState<DeliveryStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deliveriesData, foodData, topUpsData, statsData] = await Promise.all([
        logisticsService.getDeliveries(),
        logisticsService.getFoodDistributions(),
        logisticsService.getMobileTopUps(),
        logisticsService.getLogisticsStats()
      ]);
      
      setDeliveries(deliveriesData);
      setFoodDistributions(foodData);
      setTopUps(topUpsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading logistics data:', error);
      setDeliveries([]);
      setFoodDistributions([]);
      setTopUps([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case 'PENDIENTE': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'EN_TRANSITO': return <Truck className="w-5 h-5 text-primary-500" />;
      case 'ENTREGADO': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'CANCELADO': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EN_TRANSITO': return 'bg-primary-100 text-primary-800';
      case 'ENTREGADO': return 'bg-green-100 text-green-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: DeliveryType) => {
    switch (type) {
      case 'ALIMENTOS': return <Package className="w-5 h-5 text-green-500" />;
      case 'MEDICAMENTOS': return <Package className="w-5 h-5 text-red-500" />;
      case 'EQUIPOS': return <Package className="w-5 h-5 text-primary-500" />;
      case 'BOLSAS': return <Package className="w-5 h-5 text-purple-500" />;
      case 'RECARGAS': return <Package className="w-5 h-5 text-cyan-500" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: DeliveryType) => {
    switch (type) {
      case 'ALIMENTOS': return 'bg-green-100 text-green-800';
      case 'MEDICAMENTOS': return 'bg-red-100 text-red-800';
      case 'EQUIPOS': return 'bg-primary-100 text-primary-800';
      case 'BOLSAS': return 'bg-purple-100 text-purple-800';
      case 'RECARGAS': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICA': return 'bg-red-100 text-red-800';
      case 'ALTA': return 'bg-orange-100 text-orange-800';
      case 'MEDIA': return 'bg-yellow-100 text-yellow-800';
      case 'BAJA': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDeliveries = deliveries.filter(d => {
    if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        d.code.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.destination_camp_name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando logística...</p>
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
                <Truck className="w-8 h-8 text-primary-600" />
                Red de Distribución Logística
              </h1>
              <p className="text-gray-600 mt-1">Gestión de entregas, rutas y distribución</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-5 h-5" />
                Actualizar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Plus className="w-5 h-5" />
                Nueva Entrega
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
                <p className="text-sm text-gray-600">Total Entregas</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_deliveries || deliveries.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pending_deliveries || deliveries.filter(d => d.status === 'PENDIENTE').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Tránsito</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.in_transit_deliveries || deliveries.filter(d => d.status === 'EN_TRANSITO').length}</p>
              </div>
              <Truck className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.completed_deliveries || deliveries.filter(d => d.status === 'ENTREGADO' || d.status === 'COMPLETADO').length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('deliveries')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'deliveries'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Entregas
                </div>
              </button>
              <button
                onClick={() => setActiveTab('routes')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'routes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Rutas
                </div>
              </button>
              <button
                onClick={() => setActiveTab('food')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'food'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Distribución Alimentos
                </div>
              </button>
              <button
                onClick={() => setActiveTab('topups')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'topups'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recargas Móvil
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'deliveries' && (
              <>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar entrega..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as DeliveryStatus | 'ALL')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="ALL">Todos</option>
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="EN_TRANSITO">En Tránsito</option>
                    <option value="ENTREGADO">Entregados</option>
                    <option value="CANCELADO">Cancelados</option>
                  </select>
                </div>

                {/* Deliveries Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDeliveries.map((delivery) => (
                        <tr key={delivery.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{delivery.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(delivery.type)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(delivery.type)}`}>
                                {delivery.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{delivery.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{delivery.destination_camp_name}</div>
                            <div className="text-sm text-gray-500">{delivery.destination_municipality}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {delivery.quantity} {delivery.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                              {delivery.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(delivery.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                                {delivery.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'routes' && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Rutas de Distribución</h3>
                <p className="text-gray-600 mb-4">Gestión de rutas de entrega optimizadas</p>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Plus className="w-5 h-5 inline mr-2" />
                  Crear Ruta
                </button>
              </div>
            )}

            {activeTab === 'food' && (
              <div className="space-y-4">
                {foodDistributions.map((dist) => (
                  <div key={dist.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{dist.camp_name}</h4>
                        <p className="text-sm text-gray-600">{dist.food_type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{dist.meals_served}</div>
                        <div className="text-sm text-gray-600">raciones servidas</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Familias: <strong>{dist.families_served}</strong></span>
                      <span className="text-gray-600">Proveedor: <strong>{dist.supplier}</strong></span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dist.status === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
                        dist.status === 'EN_CURSO' ? 'bg-primary-100 text-primary-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {dist.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'topups' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operador</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topUps.map((topup) => (
                      <tr key={topup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{topup.user_name}</div>
                          <div className="text-sm text-gray-500">{topup.camp_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {topup.phone_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {topup.carrier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Bs. {topup.amount_bs.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {topup.points_used} pts
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            topup.status === 'PROCESADO' ? 'bg-green-100 text-green-800' :
                            topup.status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {topup.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
