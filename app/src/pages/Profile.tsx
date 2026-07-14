import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useResiliencePoints } from '../hooks/useResiliencePoints';
import { ArrowLeft, Award, BookOpen, Mail, Phone, MapPin, Edit2 } from 'lucide-react';
import { MUNICIPALITIES } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const { totalPoints, loading: pointsLoading } = useResiliencePoints(user?.uid);
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-primary-900">Mi Perfil</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-700">
                  {user.profile.first_name[0]}{user.profile.last_name[0]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.profile.first_name} {user.profile.last_name}
                </h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{user.email}</span>
            </div>
            {user.profile.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{user.profile.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{MUNICIPALITIES[user.profile.municipality]}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <span className="text-gray-400">Cédula:</span>
              <span>{user.profile.cedula}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {pointsLoading ? '...' : totalPoints}
            </p>
            <p className="text-sm text-gray-500">Puntos de Resiliencia</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-success-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-500">Cursos Completados</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-warning-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">-</p>
            <p className="text-sm text-gray-500">Nivel Actual</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Acciones</h3>
          <div className="space-y-3">
            <Link 
              to="/courses" 
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <span>Continuar Aprendiendo</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full p-3 rounded-lg hover:bg-danger-50 text-danger-600 transition-colors text-left"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
