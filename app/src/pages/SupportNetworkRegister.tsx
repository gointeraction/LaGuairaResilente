import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { psychologistService } from '../services/psychologist';
import { 
  ArrowLeft, 
  Heart, 
  Check, 
  User, 
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';

const VERIFICATION_ENTITIES = [
  { value: 'FPV', label: 'Federación de Psicólogos de Venezuela (FPV)' },
  { value: 'MPPS', label: 'Ministerio del Poder Popular para la Salud (MPPS)' },
  { value: 'COP', label: 'Colegio Oficial de Psicólogos (COP)' },
  { value: 'OPQ', label: 'Organismo Profesional de Quebec (OPQ)' },
  { value: 'OTHER', label: 'Otro' }
];

const LANGUAGES = [
  'Español',
  'Inglés',
  'Portugués',
  'Francés',
  'Italiano',
  'Otros'
];

const AVAILABILITY_OPTIONS = [
  'Mañanas (8am - 12pm)',
  'Tardes (12pm - 6pm)',
  'Noches (6pm - 10pm)',
  'Fines de semana',
  'Flexible',
  'A convenir'
];

export default function SupportNetworkRegister() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: user ? `${user.profile.first_name} ${user.profile.last_name}` : '',
    cedula: user?.profile.cedula || '',
    specialty: '',
    sub_specialty: '',
    university: '',
    verification_number: '',
    verification_entity: 'FPV',
    phone: user?.profile.phone || '',
    whatsapp: '',
    email: user?.email || '',
    country: 'Venezuela',
    city: '',
    modality: 'BOTH' as 'ONLINE' | 'IN_PERSON' | 'BOTH',
    availability: '',
    description: '',
    languages: ['Español'] as string[],
    approach: '',
    experience_years: 0,
    accepts_solidarity: true
  });
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLanguageToggle = (language: string) => {
    if (formData.languages.includes(language)) {
      setFormData({
        ...formData,
        languages: formData.languages.filter(l => l !== language)
      });
    } else {
      setFormData({
        ...formData,
        languages: [...formData.languages, language]
      });
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.full_name || !formData.cedula || !formData.specialty || 
        !formData.university || !formData.verification_number || 
        !formData.phone || !formData.email || !formData.city || 
        !formData.description) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setSaving(true);
    try {
      await psychologistService.registerForSupportNetwork({
        user_id: user?.uid,
        ...formData,
        verification_entity: formData.verification_entity as 'FPV' | 'MPPS' | 'COP' | 'OPQ' | 'OTHER'
      });
      
      setCompleted(true);
      toast.success('¡Registro exitoso! Tu solicitud será revisada por un administrador.');
    } catch (error) {
      toast.error('Error al registrar');
    } finally {
      setSaving(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link to="/directory" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-primary-900">Red de Apoyo Solidario</h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card text-center">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Gracias por unirte!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu solicitud ha sido enviada exitosamente. Un administrador revisará tu información 
              y te contactará pronto para confirmar tu inclusión en la Red de Apoyo Solidario.
            </p>
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-primary-800">
                <strong>¿Qué sigue?</strong><br />
                1. Verificaremos tu registro profesional<br />
                2. Recibirás un email de confirmación<br />
                3. Aparecerás en el directorio de especialistas
              </p>
            </div>
            <Link
              to="/directory"
              className="btn-primary inline-flex items-center gap-2"
            >
              Volver al Directorio
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/directory" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary-900">Únete a la Red de Apoyo</h1>
              <p className="text-sm text-gray-500">Comparte tu experiencia y ayuda a la comunidad</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[
              { num: 1, label: 'Datos Personales' },
              { num: 2, label: 'Formación' },
              { num: 3, label: 'Disponibilidad' }
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-2 ${step === s.num ? 'text-primary-600' : step > s.num ? 'text-success-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s.num ? 'bg-primary-600 text-white' : 
                    step > s.num ? 'bg-success-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{s.label}</span>
                </div>
                {index < 2 && <div className="w-8 h-1 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Personal Data */}
        {step === 1 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Datos Personales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Nombre y apellido"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula / ID *
                </label>
                <input
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => handleInputChange('cedula', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="V-12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {psychologistService.getCountries().map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ciudad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+58 412 1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp (opcional)
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+58 412 1234567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={() => setStep(2)} className="btn-primary">
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Training */}
        {step === 2 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Formación Profesional
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad Principal *
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Seleccionar especialidad</option>
                  {psychologistService.getSpecialties().map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-especialidad (opcional)
                </label>
                <input
                  type="text"
                  value={formData.sub_specialty}
                  onChange={(e) => handleInputChange('sub_specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ej: Terapia de trauma, Duelo, etc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Universidad / Institución *
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Universidad donde te formaste"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entidad de Verificación *
                </label>
                <select
                  value={formData.verification_entity}
                  onChange={(e) => handleInputChange('verification_entity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {VERIFICATION_ENTITIES.map(entity => (
                    <option key={entity.value} value={entity.value}>{entity.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Registro *
                </label>
                <input
                  type="text"
                  value={formData.verification_number}
                  onChange={(e) => handleInputChange('verification_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ej: 12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Años de Experiencia
                </label>
                <input
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidad de Atención *
                </label>
                <select
                  value={formData.modality}
                  onChange={(e) => handleInputChange('modality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="ONLINE">Solo Online</option>
                  <option value="IN_PERSON">Solo Presencial</option>
                  <option value="BOTH">Ambas modalidades</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idiomas
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(language => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageToggle(language)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        formData.languages.includes(language)
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-800">
                ← Anterior
              </button>
              <button onClick={() => setStep(3)} className="btn-primary">
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Availability */}
        {step === 3 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Disponibilidad y Perfil
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponibilidad Horaria
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Seleccionar disponibilidad</option>
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de tu práctica *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  placeholder="Describe tu enfoque terapéutico y cómo puedes ayudar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enfoque Terapéutico (opcional)
                </label>
                <textarea
                  value={formData.approach}
                  onChange={(e) => handleInputChange('approach', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  placeholder="Describe tu enfoque específico..."
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-success-50 rounded-lg">
                <input
                  type="checkbox"
                  id="accepts_solidarity"
                  checked={formData.accepts_solidarity}
                  onChange={(e) => handleInputChange('accepts_solidarity', e.target.checked)}
                  className="mt-1 w-4 h-4 text-success-600 border-gray-300 rounded focus:ring-success-500"
                />
                <label htmlFor="accepts_solidarity" className="text-sm text-success-800">
                  <strong>Red de Apoyo Solidario:</strong> Acepto ofrecer atención gratuita o a precio reducido 
                  a personas afectadas por el terremoto en Venezuela.
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(2)} className="text-gray-600 hover:text-gray-800">
                ← Anterior
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? 'Enviando...' : 'Enviar Registro'}
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
