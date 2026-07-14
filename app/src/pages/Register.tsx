import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { Municipality } from '../types';
import toast from 'react-hot-toast';

const MUNICIPALITIES: { value: Municipality; label: string }[] = [
  { value: 'CATIA_LA_MAR', label: 'Catia La Mar' },
  { value: 'MAIQUETIA', label: 'Maiquetía' },
  { value: 'MACUTO', label: 'Macuto' },
  { value: 'CARABALLEDA', label: 'Caraballeda' }
];

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    cedula: '',
    phone: '',
    municipality: '' as Municipality | ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!formData.municipality) {
      toast.error('Selecciona un municipio');
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        cedula: formData.cedula,
        phone: formData.phone || undefined,
        municipality: formData.municipality as Municipality,
        role: 'STUDENT'
      });
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900">La Guaira Resiliente</h1>
          <p className="text-gray-600 mt-2">Crea tu cuenta para comenzar</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registro</h2>

          {error && (
            <div className="bg-danger-50 text-danger-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="label">Nombre</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="label">Apellido</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="cedula" className="label">Cédula</label>
              <input
                id="cedula"
                name="cedula"
                type="text"
                value={formData.cedula}
                onChange={handleChange}
                className="input-field"
                placeholder="12345678"
                pattern="[0-9]{7,10}"
                required
              />
            </div>

            <div>
              <label htmlFor="municipality" className="label">Municipio</label>
              <select
                id="municipality"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Selecciona tu municipio</option>
                {MUNICIPALITIES.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="label">Teléfono (opcional)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="0412-1234567"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Repite tu contraseña"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm">
            <span className="text-gray-600">¿Ya tienes cuenta? </span>
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
