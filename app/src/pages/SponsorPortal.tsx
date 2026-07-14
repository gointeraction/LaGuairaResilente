import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { sponsorshipService } from '../services/sponsorship';
import { ArrowLeft, Award, Users, TrendingUp, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function SponsorPortal() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (user) {
        const statsData = await sponsorshipService.getSponsorDashboard(user.uid);
        setStats(statsData);
      }
    } catch (error) {
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-primary-900">Portal de Patrocinio</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats?.total_sponsorships || 0}</p>
            <p className="text-sm text-gray-500">Patrocinios Totales</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-success-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats?.active_sponsorships || 0}</p>
            <p className="text-sm text-gray-500">Patrocinios Activos</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-warning-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats?.total_graduates_hired || 0}</p>
            <p className="text-sm text-gray-500">Graduados Contratados</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-info-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-info-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(stats?.total_contribution || 0)}
            </p>
            <p className="text-sm text-gray-500">Total Invertido</p>
          </div>
        </div>

        {/* Info */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Información del Portal</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Bienvenido al Portal de Patrocinio de La Guaira Resiliente Digital. 
              Desde aquí puedes gestionar tus patrocinios y ver el impacto de tu inversión.
            </p>
            <p>
              <strong>Tu contribución ayuda a:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Financiar la educación digital de ciudadanos afectados</li>
              <li>Proporcionar conectividad a zonas afectadas</li>
              <li>Crear empleo para graduados del programa</li>
              <li>Infraestructura tecnológica para centros de capacitación</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
