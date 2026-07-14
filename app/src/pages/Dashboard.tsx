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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-900">La Guaira Resiliente</h1>
              <p className="text-gray-600">{getGreeting()}, {user?.profile?.first_name}</p>
            </div>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {user?.profile?.first_name?.[0]}{user?.profile?.last_name?.[0]}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cursos Inscritos</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-success-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Puntos de Resiliencia</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-warning-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completados</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Patrocinador</p>
                <p className="text-2xl font-bold text-gray-800">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/courses" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Aula Resiliente</h3>
                <p className="text-sm text-gray-500">Accede a cursos de capacitación</p>
              </div>
            </div>
          </Link>

          <Link to="/sponsor-portal" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-success-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Portal de Apadrinamiento</h3>
                <p className="text-sm text-gray-500">Conecta con patrocinadores</p>
              </div>
            </div>
          </Link>

          <Link to="/profile" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-warning-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Mi Perfil</h3>
                <p className="text-sm text-gray-500">Gestiona tu información</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 card bg-gradient-to-r from-primary-500 to-primary-700 text-white">
          <h2 className="text-xl font-semibold mb-2">¡Bienvenido a la plataforma!</h2>
          <p className="text-primary-100">
            Esta plataforma está diseñada para apoyar la reconstrucción económica de La Guaira 
            mediante capacitación digital y apadrinamiento corporativo. Comienza explorando 
            los cursos disponibles en el Aula Resiliente.
          </p>
        </div>
      </main>
    </div>
  );
}
