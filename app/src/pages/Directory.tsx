import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { psychologistService } from '../services/psychologist';
import { useAuthStore } from '../stores/authStore';
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
  CheckCircle,
  Star,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Psychologist } from '../services/psychologist';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Directory() {
  const { user } = useAuthStore();
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
    } catch {
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #e6edf8 0%, #f8fafc 50%, #fde8eb 100%)' }}>

      {/* ── Venezuelan Flag Stripe ─────────────────────────── */}
      <div className="vzla-stripe" />

      {/* ── Hero Header ───────────────────────────────────── */}
      <header className="hero-gradient text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #CF142B, transparent)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to={user ? '/dashboard' : '/login'}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            {/* Venezuelan flag accent pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full" style={{ background: '#FCD116' }} />
              Voluntariado por Venezuela
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Directorio de Especialistas
          </h1>
          <p className="text-primary-200 text-base max-w-xl leading-relaxed">
            Red gratuita de acompañamiento profesional en salud mental para la comunidad venezolana.
          </p>

          {/* Stat chips */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: `${psychologists.length} Especialistas`, color: '#FCD116' },
              { label: 'Verificados', color: '#CF142B' },
              { label: 'Gratuito', color: '#FCD116' },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-sm"
              >
                <Star className="w-3 h-3" style={{ color }} fill={color} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Call to Actions ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 -mt-2">

          {/* Volunteer CTA — Venezuelan Blue */}
          <div className="relative overflow-hidden rounded-2xl text-white shadow-lg hover-lift"
            style={{ background: 'linear-gradient(135deg, #003893 0%, #0a38a0 100%)' }}>
            {/* Gold accent circle */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/15 backdrop-blur-sm">
                  <Users className="w-6 h-6" style={{ color: '#FCD116' }} />
                </div>
                <h2 className="text-xl font-bold mb-2">¿Eres especialista en salud mental?</h2>
                <p className="text-primary-200 text-sm mb-6 leading-relaxed">
                  Únete a nuestra Red de Apoyo Solidario como profesional o estudiante y ayuda a la comunidad venezolana.
                </p>
              </div>
              <Link
                to="/support-network-register"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: '#FCD116', color: '#003893' }}
              >
                <Heart className="w-4 h-4 fill-current" />
                Quiero Formar Parte
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Help CTA — Venezuelan Red */}
          <div className="relative overflow-hidden rounded-2xl text-white shadow-lg hover-lift"
            style={{ background: 'linear-gradient(135deg, #CF142B 0%, #9a0a1d 100%)' }}>
            {/* Gold accent circle */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/15 backdrop-blur-sm">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <h2 className="text-xl font-bold mb-2">¿Necesitas apoyo emocional o psicológico?</h2>
                <p className="text-red-200 text-sm mb-6 leading-relaxed">
                  Cuéntanos tu caso de forma confidencial. Nuestro equipo te contactará de inmediato.
                </p>
              </div>
              <Link
                to="/solicitar-ayuda"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] bg-white"
                style={{ color: '#CF142B' }}
              >
                <CheckCircle className="w-4 h-4" />
                Solicitar Ayuda
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Search & Filters ────────────────────────────── */}
        <div className="card mb-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                id="directory-search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Buscar por nombre, especialidad o ubicación..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': '#003893' } as React.CSSProperties}
              />
            </div>
            <button
              id="toggle-filters"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {(filters.country || filters.modality || filters.specialty) && (
                <span className="w-2 h-2 rounded-full" style={{ background: '#CF142B' }} />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
              {[
                {
                  label: 'País', field: 'country',
                  options: [{ value: '', text: 'Todos' }, ...countries.map(c => ({ value: c, text: c }))]
                },
                {
                  label: 'Modalidad', field: 'modality',
                  options: [
                    { value: '', text: 'Todas' },
                    { value: 'ONLINE', text: 'Online' },
                    { value: 'IN_PERSON', text: 'Presencial' },
                    { value: 'BOTH', text: 'Ambas' }
                  ]
                },
                {
                  label: 'Especialidad', field: 'specialty',
                  options: [
                    { value: '', text: 'Todas' },
                    ...psychologistService.getSpecialties().map(s => ({ value: s, text: s }))
                  ]
                }
              ].map(({ label, field, options }) => (
                <div key={field}>
                  <label className="label">{label}</label>
                  <select
                    value={filters[field as keyof typeof filters]}
                    onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
                    className="input-field text-sm py-2"
                  >
                    {options.map(o => (
                      <option key={o.value} value={o.value}>{o.text}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Results Count ───────────────────────────────── */}
        <div className="mb-4 flex items-center gap-2">
          <span className="w-2 h-5 rounded-full inline-block" style={{ background: 'linear-gradient(180deg, #003893, #FCD116, #CF142B)' }} />
          <p className="text-sm font-medium text-gray-600">
            <span className="font-bold text-gray-800">{filteredPsychologists.length}</span>{' '}
            especialista{filteredPsychologists.length !== 1 ? 's' : ''} encontrado{filteredPsychologists.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ── Psychologist Cards ──────────────────────────── */}
        {filteredPsychologists.length === 0 ? (
          <div className="card text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron especialistas</h3>
            <p className="text-gray-400 text-sm">Intenta con otros filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPsychologists.map((psych, idx) => {
              const initials = psych.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              const accentColors = ['#003893', '#CF142B', '#003893'];
              const accent = accentColors[idx % accentColors.length];

              return (
                <div
                  key={psych.id}
                  className="card hover-lift border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${(idx % 6) * 50}ms` }}
                >
                  {/* Top accent bar */}
                  <div className="vzla-stripe rounded-t-xl -mx-6 -mt-6 mb-5" style={{ borderRadius: '12px 12px 0 0' }} />

                  <div className="flex items-start gap-3 mb-4">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm"
                      style={{ background: accent }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate text-sm">{psych.name}</h3>
                      <p className="text-xs font-medium truncate mt-0.5" style={{ color: accent }}>{psych.specialty}</p>
                    </div>
                    {psych.is_solidarity_network && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-100 text-success-700 whitespace-nowrap">
                        <Heart className="w-2.5 h-2.5" />
                        Red Solidaria
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{psych.description}</p>

                  <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                      <span>{psych.location}, {psych.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-success-500" />
                      <span>{psych.verification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                      <span>
                        {psych.modality === 'ONLINE' ? 'Online'
                          : psych.modality === 'IN_PERSON' ? 'Presencial'
                          : 'Online y Presencial'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex gap-2">
                    <a
                      href={`https://api.whatsapp.com/send/?phone=${psych.phone.replace(/[^0-9+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-success-50 text-success-700 hover:bg-success-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${psych.email}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{ background: '#e6edf8', color: '#003893' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#c0d0ee')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#e6edf8')}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                  </div>

                  <p className="mt-2.5 text-[10px] text-gray-400 italic truncate">{psych.university}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Disclaimer ──────────────────────────────────── */}
        <div className="mt-8 rounded-2xl border p-5 flex items-start gap-3"
          style={{ background: '#fffde6', borderColor: '#ffe640' }}>
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#c9a400' }} />
          <p className="text-sm" style={{ color: '#7a6400' }}>
            <strong>Nota importante:</strong> Por favor verifique que el profesional esté inscrito en su Colegio de Psicólogos o Federación correspondiente. La plataforma solo ofrece información de contacto de los profesionales registrados.
          </p>
        </div>
      </main>
    </div>
  );
}
