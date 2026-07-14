import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { psychologistService } from '../services/psychologist';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Heart, 
  Filter,
  Users,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Psychologist } from '../services/psychologist';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Directory() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    modality: '',
    specialty: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPsychologists();
  }, []);

  const loadPsychologists = async () => {
    try {
      const data = await psychologistService.getPsychologists();
      setPsychologists(data);
    } catch (error) {
      toast.error('Error cargando directorio');
    } finally {
      setLoading(false);
    }
  };

  const filteredPsychologists = psychologists.filter(p => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(search) && 
          !p.specialty.toLowerCase().includes(search) &&
          !p.location.toLowerCase().includes(search)) {
        return false;
      }
    }
    if (filters.country && p.country !== filters.country) return false;
    if (filters.modality && p.modality !== filters.modality) return false;
    return true;
  });

  const countries = psychologistService.getCountries();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary-900">Directorio de Especialistas</h1>
              <p className="text-sm text-gray-500">Red de apoyo solidario para la comunidad</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Call to Action */}
        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">¿Eres especialista en salud mental?</h2>
                <p className="text-primary-100">
                  Únete a nuestra Red de Apoyo Solidario y ayuda a la comunidad
                </p>
              </div>
            </div>
            <Link
              to="/support-network-register"
              className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              <Heart className="w-5 h-5" />
              QUIERO FORMAR PARTE
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Buscar por nombre, especialidad o ubicación..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <select
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todos</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                <select
                  value={filters.modality}
                  onChange={(e) => setFilters({ ...filters, modality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todas</option>
                  <option value="ONLINE">Online</option>
                  <option value="IN_PERSON">Presencial</option>
                  <option value="BOTH">Ambas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                <select
                  value={filters.specialty}
                  onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todas</option>
                  {psychologistService.getSpecialties().map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredPsychologists.length} especialista{filteredPsychologists.length !== 1 ? 's' : ''} encontrado{filteredPsychologists.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Psychologists Grid */}
        {filteredPsychologists.length === 0 ? (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No se encontraron especialistas</h3>
            <p className="text-gray-500">Intenta con otros filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPsychologists.map((psych) => (
              <div key={psych.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary-700">
                      {psych.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{psych.name}</h3>
                    <p className="text-sm text-primary-600 truncate">{psych.specialty}</p>
                  </div>
                  {psych.is_solidarity_network && (
                    <span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Red Solidaria
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{psych.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{psych.location}, {psych.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-success-500" />
                    <span>{psych.verification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="capitalize">
                      {psych.modality === 'ONLINE' ? 'Online' : 
                       psych.modality === 'IN_PERSON' ? 'Presencial' : 'Online y Presencial'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                  <a
                    href={`https://api.whatsapp.com/send/?phone=${psych.phone.replace(/[^0-9+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-success-100 text-success-700 rounded-lg text-sm hover:bg-success-200 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${psych.email}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm hover:bg-primary-200 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>

                <p className="mt-3 text-xs text-gray-500 italic">
                  Universidad: {psych.university}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 card bg-warning-50 border border-warning-200">
          <p className="text-sm text-warning-800">
            <strong>Nota importante:</strong> Por favor verifique con el profesional que esté inscrito en su Colegio de Psicólogos o Federación correspondiente. La plataforma solo ofrece información de contacto de los profesionales registrados.
          </p>
        </div>
      </main>
    </div>
  );
}
