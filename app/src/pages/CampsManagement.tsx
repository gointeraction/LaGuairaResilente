import { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Wifi, 
  Sun, 
  Droplets, 
  Heart, 
  UtensilsCrossed, 
  BookOpen,
  Plus,
  Search,
  Grid,
  List,
  Eye,
  TrendingUp,
  XCircle
} from 'lucide-react';
import { 
  campService, 
  Camp, 
  CampStats, 
  CampStatus 
} from '../services/camps';

type ViewMode = 'grid' | 'list';
type FilterStatus = 'ALL' | CampStatus;

export default function CampsManagement() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [filteredCamps, setFilteredCamps] = useState<Camp[]>([]);
  const [stats, setStats] = useState<CampStats | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCamps();
  }, []);

  useEffect(() => {
    filterCamps();
  }, [camps, filterStatus, searchQuery]);

  const loadCamps = async () => {
    setLoading(true);
    try {
      const data = await campService.getCamps();
      setCamps(data);
      const statsData = await campService.getCampStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading camps:', error);
      setCamps([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCamps = () => {
    let filtered = [...camps];
    
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.municipality.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
      );
    }
    
    setFilteredCamps(filtered);
  };

  const getStatusColor = (status: CampStatus) => {
    switch (status) {
      case 'ACTIVO': return 'bg-green-100 text-green-800';
      case 'INACTIVO': return 'bg-gray-100 text-gray-800';
      case 'MANTENIMIENTO': return 'bg-yellow-100 text-yellow-800';
      case 'EVACUADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
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

  const handleViewDetails = (camp: Camp) => {
    setSelectedCamp(camp);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando campamentos...</p>
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
                <Building2 className="w-8 h-8 text-blue-600" />
                Campamentos Transitorios
              </h1>
              <p className="text-gray-600 mt-1">Gestión de 15 campamentos en 4 municipios</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-5 h-5" />
                Nuevo Campamento
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
                <p className="text-sm text-gray-600">Total Campamentos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_camps || camps.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Capacidad Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_capacity?.toLocaleString() || '4,530'}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ocupación Actual</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_occupancy?.toLocaleString() || '3,200'}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Con WiFi</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.camps_with_wifi || 15}</p>
              </div>
              <Wifi className="w-8 h-8 text-cyan-500" />
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
                  placeholder="Buscar campamento..."
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
                <option value="EVACUADO">Evacuados</option>
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

        {/* Camps Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCamps.map((camp) => (
              <div key={camp.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-mono text-gray-500">{camp.code}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{camp.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(camp.status)}`}>
                      {camp.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{camp.municipality}</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Ocupación</span>
                      <span className={`font-medium ${getOccupancyColor(camp.current_occupancy, camp.capacity)}`}>
                        {Math.round((camp.current_occupancy / camp.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(camp.current_occupancy / camp.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{camp.current_occupancy} personas</span>
                      <span>Cap: {camp.capacity}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {camp.wifi_available && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs">
                        <Wifi className="w-3 h-3" /> WiFi
                      </span>
                    )}
                    {camp.solar_power && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        <Sun className="w-3 h-3" /> Solar
                      </span>
                    )}
                    {camp.water_available && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        <Droplets className="w-3 h-3" /> Agua
                      </span>
                    )}
                    {camp.medical_post && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        <Heart className="w-3 h-3" /> Médico
                      </span>
                    )}
                    {camp.food_distribution && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        <UtensilsCrossed className="w-3 h-3" /> Comedor
                      </span>
                    )}
                    {camp.education_area && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        <BookOpen className="w-3 h-3" /> Educación
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{camp.contact_name}</span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(camp)}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ocupación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicios</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCamps.map((camp) => (
                  <tr key={camp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{camp.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{camp.name}</div>
                      <div className="text-sm text-gray-500">{camp.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMunicipalityColor(camp.municipality)}`}>
                        {camp.municipality}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{camp.current_occupancy}/{camp.capacity}</div>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(camp.current_occupancy / camp.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {camp.wifi_available && <Wifi className="w-4 h-4 text-cyan-500" />}
                        {camp.solar_power && <Sun className="w-4 h-4 text-yellow-500" />}
                        {camp.medical_post && <Heart className="w-4 h-4 text-red-500" />}
                        {camp.food_distribution && <UtensilsCrossed className="w-4 h-4 text-green-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(camp.status)}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(camp)}
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
      {showDetails && selectedCamp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm font-mono text-gray-500">{selectedCamp.code}</span>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCamp.name}</h2>
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
                    <label className="text-sm text-gray-600">Municipio</label>
                    <p className="font-medium">{selectedCamp.municipality}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Dirección</label>
                    <p className="font-medium">{selectedCamp.address}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Capacidad</label>
                    <p className="font-medium">{selectedCamp.capacity} personas</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ocupación Actual</label>
                    <p className="font-medium">{selectedCamp.current_occupancy} personas</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Contacto</label>
                    <p className="font-medium">{selectedCamp.contact_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Teléfono</label>
                    <p className="font-medium">{selectedCamp.contact_phone}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Servicios Disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCamp.wifi_available && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                        <Wifi className="w-4 h-4" /> WiFi
                      </span>
                    )}
                    {selectedCamp.solar_power && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        <Sun className="w-4 h-4" /> Energía Solar
                      </span>
                    )}
                    {selectedCamp.water_available && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        <Droplets className="w-4 h-4" /> Agua
                      </span>
                    )}
                    {selectedCamp.medical_post && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        <Heart className="w-4 h-4" /> Puesto Médico
                      </span>
                    )}
                    {selectedCamp.food_distribution && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        <UtensilsCrossed className="w-4 h-4" /> Distribución de Alimentos
                      </span>
                    )}
                    {selectedCamp.education_area && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        <BookOpen className="w-4 h-4" /> Área Educativa
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Amenidades</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCamp.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
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
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
