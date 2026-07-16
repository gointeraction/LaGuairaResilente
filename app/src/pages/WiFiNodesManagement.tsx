import { useState, useEffect } from 'react';
import { 
  Wifi, 
  Signal, 
  SignalHigh,
  SignalMedium,
  SignalLow,
  Users, 
  Activity,
  RefreshCw,
  Plus,
  Search,
  Grid,
  List,
  Eye,
  Zap,
  Battery,
  Server,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  wifiService, 
  WiFiNode, 
  WiFiStats, 
  WiFiStatus,
  WiFiType
} from '../services/wifiNodes';

type ViewMode = 'grid' | 'list';
type FilterStatus = 'ALL' | WiFiStatus;
type FilterType = 'ALL' | WiFiType;

export default function WiFiNodesManagement() {
  const [nodes, setNodes] = useState<WiFiNode[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<WiFiNode[]>([]);
  const [stats, setStats] = useState<WiFiStats | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<WiFiNode | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNodes();
  }, []);

  useEffect(() => {
    filterNodes();
  }, [nodes, filterStatus, filterType, searchQuery]);

  const loadNodes = async () => {
    setLoading(true);
    try {
      const data = await wifiService.getNodes();
      setNodes(data);
      const statsData = await wifiService.getWiFiStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading WiFi nodes:', error);
      setNodes([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNodes = () => {
    let filtered = [...nodes];
    
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(n => n.status === filterStatus);
    }
    
    if (filterType !== 'ALL') {
      filtered = filtered.filter(n => n.type === filterType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.name.toLowerCase().includes(query) ||
        n.camp_name.toLowerCase().includes(query) ||
        n.municipality.toLowerCase().includes(query) ||
        n.code.toLowerCase().includes(query)
      );
    }
    
    setFilteredNodes(filtered);
  };

  const getStatusColor = (status: WiFiStatus) => {
    switch (status) {
      case 'ACTIVO': return 'bg-green-100 text-green-800';
      case 'INACTIVO': return 'bg-gray-100 text-gray-800';
      case 'MANTENIMIENTO': return 'bg-yellow-100 text-yellow-800';
      case 'DAÑADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: WiFiType) => {
    switch (type) {
      case 'FIBRA_OPTICA': return <Server className="w-5 h-5 text-blue-500" />;
      case 'SATELITAL': return <Activity className="w-5 h-5 text-purple-500" />;
      case '4G_LTE': return <Signal className="w-5 h-5 text-cyan-500" />;
      case 'MESH': return <Wifi className="w-5 h-5 text-green-500" />;
      default: return <Wifi className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: WiFiType) => {
    switch (type) {
      case 'FIBRA_OPTICA': return 'bg-blue-100 text-blue-800';
      case 'SATELITAL': return 'bg-purple-100 text-purple-800';
      case '4G_LTE': return 'bg-cyan-100 text-cyan-800';
      case 'MESH': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSignalIcon = (strength: number) => {
    if (strength >= 80) return <SignalHigh className="w-5 h-5 text-green-500" />;
    if (strength >= 50) return <SignalMedium className="w-5 h-5 text-yellow-500" />;
    return <SignalLow className="w-5 h-5 text-red-500" />;
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMunicipalityColor = (municipality: string) => {
    switch (municipality) {
      case 'Catia La Mar': return 'bg-blue-100 text-blue-800';
      case 'Maiquetía': return 'bg-green-100 text-green-800';
      case 'Macuto': return 'bg-purple-100 text-purple-800';
      case 'Caraballeda': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (node: WiFiNode) => {
    setSelectedNode(node);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando nodos WiFi...</p>
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
                <Wifi className="w-8 h-8 text-blue-600" />
                Nodos de Conectividad WiFi
              </h1>
              <p className="text-gray-600 mt-1">Gestión de infraestructura de conectividad</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadNodes}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-5 h-5" />
                Actualizar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-5 h-5" />
                Nuevo Nodo
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
                <p className="text-sm text-gray-600">Total Nodos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_nodes || nodes.length}</p>
              </div>
              <Wifi className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nodos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.active_nodes || nodes.filter(n => n.status === 'ACTIVO').length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ancho de Banda</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_bandwidth || 730} Mbps</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios Conectados</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_connected || 1380}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar nodo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todos</option>
                <option value="ACTIVO">Activos</option>
                <option value="INACTIVO">Inactivos</option>
                <option value="MANTENIMIENTO">Mantenimiento</option>
                <option value="DAÑADO">Dañados</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todos los tipos</option>
                <option value="FIBRA_OPTICA">Fibra Óptica</option>
                <option value="SATELITAL">Satelital</option>
                <option value="4G_LTE">4G LTE</option>
                <option value="MESH">MESH</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nodes Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNodes.map((node) => (
              <div key={node.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-mono text-gray-500">{node.code}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{node.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                      {node.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    {getTypeIcon(node.type)}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(node.type)}`}>
                      {node.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="font-medium">{node.camp_name}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        {getSignalIcon(node.signal_strength)}
                        <span className={`text-sm font-medium ${getSignalColor(node.signal_strength)}`}>
                          {node.signal_strength}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Señal</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{node.bandwidth_mbps} Mbps</span>
                      </div>
                      <span className="text-xs text-gray-500">Ancho Banda</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">{node.connected_users}/{node.max_users}</span>
                      </div>
                      <span className="text-xs text-gray-500">Usuarios</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{node.provider}</span>
                      </div>
                      <span className="text-xs text-gray-500">Proveedor</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {node.solar_powered && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        <Zap className="w-3 h-3" /> Solar
                      </span>
                    )}
                    {node.backup_battery && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        <Battery className="w-3 h-3" /> Batería
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMunicipalityColor(node.municipality)}`}>
                      {node.municipality}
                    </span>
                    <button
                      onClick={() => handleViewDetails(node)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Señal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuarios</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNodes.map((node) => (
                  <tr key={node.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{node.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{node.name}</div>
                      <div className="text-sm text-gray-500">{node.camp_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(node.type)}`}>
                        {node.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getSignalIcon(node.signal_strength)}
                        <span className={`text-sm font-medium ${getSignalColor(node.signal_strength)}`}>
                          {node.signal_strength}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{node.connected_users}/{node.max_users}</div>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(node.connected_users / node.max_users) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMunicipalityColor(node.municipality)}`}>
                        {node.municipality}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                        {node.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(node)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm font-mono text-gray-500">{selectedNode.code}</span>
                  <h2 className="text-xl font-bold text-gray-900">{selectedNode.name}</h2>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Tipo</label>
                    <p className="font-medium">{selectedNode.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Proveedor</label>
                    <p className="font-medium">{selectedNode.provider}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Municipio</label>
                    <p className="font-medium">{selectedNode.municipality}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Campamento</label>
                    <p className="font-medium">{selectedNode.camp_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Señal</label>
                    <p className="font-medium">{selectedNode.signal_strength}%</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ancho de Banda</label>
                    <p className="font-medium">{selectedNode.bandwidth_mbps} Mbps</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Usuarios</label>
                    <p className="font-medium">{selectedNode.connected_users}/{selectedNode.max_users}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">IP Address</label>
                    <p className="font-medium font-mono">{selectedNode.ip_address}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">MAC Address</label>
                    <p className="font-medium font-mono">{selectedNode.mac_address}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Firmware</label>
                    <p className="font-medium">{selectedNode.firmware_version}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Características</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.solar_powered && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        <Zap className="w-4 h-4" /> Energía Solar
                      </span>
                    )}
                    {selectedNode.backup_battery && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        <Battery className="w-4 h-4" /> Batería de Respaldo
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cerrar
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
