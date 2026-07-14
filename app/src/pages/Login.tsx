import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await login(email, password);
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900">La Guaira Resiliente</h1>
          <p className="text-gray-600 mt-2">Plataforma de Capacitación Digital</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="bg-danger-50 text-danger-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link 
              to="/forgot-password" 
              className="text-primary-600 hover:text-primary-700"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm">
            <span className="text-gray-600">¿No tienes cuenta? </span>
            <Link 
              to="/register" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
