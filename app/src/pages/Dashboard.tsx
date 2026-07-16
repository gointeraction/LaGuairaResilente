import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { BookOpen, Award, Users, Building2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-lg p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-tutorial-id="dashboard-welcome">
        <div>
          <span className="inline-block px-3 py-1 bg-primary-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            Plataforma Digital de Reconstrucción
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {getGreeting()}, {user?.profile?.first_name || 'Bienvenido'} 👋
          </h1>
          <p className="text-primary-100 mt-2 max-w-2xl text-sm sm:text-base">
            Esta plataforma está diseñada para apoyar la reactivación económica y resiliencia de La Guaira mediante capacitación digital y apadrinamiento corporativo.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/courses"
            className="px-5 py-2.5 bg-white text-primary-700 font-semibold rounded-xl shadow hover:bg-primary-50 transition-colors text-sm whitespace-nowrap"
          >
            Ver Aula Resiliente
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-tutorial-id="dashboard-stats">
        <div className="card bg-white border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cursos Inscritos</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="card bg-white border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-success-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Puntos de Resiliencia</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="card bg-white border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-warning-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completados</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="card bg-white border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Patrocinador</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-tutorial-id="dashboard-actions">
          <Link to="/courses" className="card bg-white border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Aula Resiliente</h3>
                <p className="text-sm text-gray-500">Accede a cursos de capacitación</p>
              </div>
            </div>
          </Link>

          <Link to="/sponsor-portal" className="card bg-white border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-success-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Portal de Apadrinamiento</h3>
                <p className="text-sm text-gray-500">Conecta con patrocinadores</p>
              </div>
            </div>
          </Link>

          <Link to="/profile" className="card bg-white border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-warning-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mi Perfil</h3>
                <p className="text-sm text-gray-500">Gestiona tu información</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
