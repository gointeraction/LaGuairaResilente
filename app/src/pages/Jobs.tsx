import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employmentService } from '../services/employment';
import { ArrowLeft, MapPin, Building2, Clock, DollarSign, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import type { JobOpportunity } from '../types';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Jobs() {
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    municipality: '',
    modality: '',
    search: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const jobsData = await employmentService.getOpenJobs();
      setJobs(jobsData);
    } catch (error) {
      toast.error('Error cargando ofertas');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.municipality && job.municipality !== filters.municipality) return false;
    if (filters.modality && job.modality !== filters.modality) return false;
    if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

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
            <h1 className="text-2xl font-bold text-primary-900">Ofertas de Empleo</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Puesto, empresa..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
              <select
                value={filters.municipality}
                onChange={(e) => setFilters({ ...filters, municipality: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos</option>
                <option value="CATIA_LA_MAR">Catia La Mar</option>
                <option value="MAIQUETIA">Maiquetía</option>
                <option value="MACUTO">Macuto</option>
                <option value="CARABALLEDA">Caraballeda</option>
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
                <option value="REMOTE">Remoto</option>
                <option value="HYBRID">Híbrido</option>
                <option value="ONSITE">Presencial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="card text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No hay ofertas disponibles</h3>
            <p className="text-gray-500">Intenta con otros filtros o vuelve más tarde.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.modality === 'REMOTE' 
                          ? 'bg-success-100 text-success-700'
                          : job.modality === 'HYBRID'
                          ? 'bg-warning-100 text-warning-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {job.modality === 'REMOTE' ? 'Remoto' : job.modality === 'HYBRID' ? 'Híbrido' : 'Presencial'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.municipality.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(job.created_at)}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{job.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 3).map((req, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{job.requirements.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end gap-2">
                    {job.salary_usd && (
                      <div className="flex items-center gap-1 text-lg font-bold text-success-600">
                        <DollarSign className="w-5 h-5" />
                        <span>{job.salary_usd.toLocaleString()}</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500">{job.employment_type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
