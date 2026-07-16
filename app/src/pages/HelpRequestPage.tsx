import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { helpRequestService } from '../services/helpRequest';
import { 
  ArrowLeft, 
  Heart, 
  Check, 
  FileText, 
  Phone, 
  AlertCircle,
  Lock,
  MapPin,
  MessageSquare,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const VENEZUELA_STATES = [
  'La Guaira','Distrito Capital','Miranda','Amazonas','Anzoátegui',
  'Apure','Aragua','Barinas','Bolívar','Carabobo','Cojedes','Delta Amacuro',
  'Falcón','Guárico','Lara','Mérida','Monagas','Nueva Esparta','Portuguesa',
  'Sucre','Táchira','Trujillo','Yaracuy','Zulia'
];

const HELP_TYPES = [
  'Apoyo emocional / Primeros auxilios psicológicos',
  'Terapia individual',
  'Apoyo a niños y adolescentes',
  'Acompañamiento en duelo',
  'Manejo de estrés y ansiedad',
  'Orientación familiar o de pareja',
  'Otros'
];

const URGENCY_LEVELS = [
  { value: 'LOW',    label: 'Bajo',    sub: 'Orientación preventiva',                       color: '#22c55e' },
  { value: 'MEDIUM', label: 'Medio',   sub: 'Malestar significativo, requiere atención',     color: '#f59e0b' },
  { value: 'HIGH',   label: 'Alto',    sub: 'Crisis activa, requiere atención prioritaria',  color: '#CF142B' },
];

const MODALITIES = [
  { value: 'IN_PERSON', label: 'Presencial' },
  { value: 'REMOTE',    label: 'Remoto' },
  { value: 'BOTH',      label: 'Ambas' },
];

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e6edf8' }}>
        <Icon className="w-4 h-4" style={{ color: '#003893' }} />
      </div>
      <h2 className="text-base font-bold text-gray-800">{title}</h2>
    </div>
  );
}

const inputCls = `w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800
  placeholder:text-gray-400 bg-white focus:outline-none focus:border-transparent transition-all`;
const inputFocus = { '--tw-ring-color': '#CF142B', '--tw-ring-shadow': '0 0 0 2px #CF142B40' } as React.CSSProperties;

export default function HelpRequestPage() {
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [formData, setFormData] = useState({
    help_type:         '',
    urgency_level:     '',
    state:             '',
    municipality:      '',
    modality:          'BOTH' as 'IN_PERSON' | 'REMOTE' | 'BOTH',
    description:       '',
    requester_name:    '',
    contact_whatsapp:  '',
    contact_landline:  '',
    contact_email:     '',
    data_consent:      false,
    sharing_consent:   false,
  });

  const handleInputChange = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.help_type)                                        return toast.error('Debes seleccionar el tipo de ayuda');
    if (!formData.urgency_level)                                    return toast.error('Debes seleccionar el nivel de urgencia');
    if (!formData.state)                                            return toast.error('Debes seleccionar el estado de Venezuela');
    if (!formData.municipality.trim())                              return toast.error('Debes ingresar el municipio, ciudad o sector');
    if (!formData.description.trim() || formData.description.length < 20)
      return toast.error('La descripción debe tener al menos 20 caracteres');
    if (!formData.requester_name.trim())                            return toast.error('Debes ingresar tu nombre y apellido');

    if (!formData.contact_whatsapp.trim() && !formData.contact_landline.trim() && !formData.contact_email.trim())
      return toast.error('Por favor, proporciona al menos un medio de contacto');

    if (!formData.data_consent)    return toast.error('Debes autorizar el tratamiento de datos (Obligatorio)');
    if (!formData.sharing_consent) return toast.error('Debes autorizar compartir el caso con el voluntario asignado (Obligatorio)');

    setSaving(true);
    try {
      await helpRequestService.submitHelpRequest({
        help_type:        formData.help_type,
        urgency_level:    formData.urgency_level,
        state:            formData.state,
        municipality:     formData.municipality,
        modality:         formData.modality,
        description:      formData.description,
        requester_name:   formData.requester_name,
        contact_whatsapp: formData.contact_whatsapp  || undefined,
        contact_landline: formData.contact_landline  || undefined,
        contact_email:    formData.contact_email     || undefined,
        data_consent:     formData.data_consent,
        sharing_consent:  formData.sharing_consent,
      });
      setCompleted(true);
      toast.success('¡Solicitud enviada con éxito! Un coordinador se comunicará contigo.');
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar la solicitud de ayuda');
    } finally {
      setSaving(false);
    }
  };

  /* ── Success screen ──────────────────────────────────── */
  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(160deg, #fde8eb 0%, #f8fafc 60%, #e6edf8 100%)' }}>
        <div className="max-w-md w-full">
          <div className="vzla-stripe rounded-t-2xl" />
          <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 p-8 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #CF142B, #9a0a1d)' }}>
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Solicitud recibida</h2>
            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
              Tu información ha sido registrada de forma segura. Un coordinador revisará los detalles
              y te contactará a través de los medios que proporcionaste.
            </p>

            <div className="rounded-xl p-4 mb-8 text-left" style={{ background: '#fde8eb', border: '1px solid #f59eaa' }}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: '#CF142B' }}>
                <AlertCircle className="w-4 h-4" />
                ¿Qué pasará ahora?
              </h3>
              <ul className="text-xs space-y-1.5 list-disc pl-4" style={{ color: '#9a0a1d' }}>
                <li>El equipo de coordinación analizará tu solicitud.</li>
                <li>Te contactaremos para validar detalles si es necesario.</li>
                <li>Te asignaremos un voluntario verificado de la red.</li>
              </ul>
            </div>

            <Link
              to="/directory"
              className="w-full inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #CF142B, #9a0a1d)' }}
            >
              Volver al Directorio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(160deg, #fde8eb 0%, #f8fafc 50%, #e6edf8 100%)' }}>
      <div className="max-w-3xl mx-auto">

        {/* ── Back link ─────────────────────────────────── */}
        <div className="mb-6">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-vzla-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Directorio
          </Link>
        </div>

        {/* ── Hero banner — Venezuelan Red ──────────────── */}
        <div className="relative overflow-hidden rounded-2xl text-white shadow-lg mb-8"
          style={{ background: 'linear-gradient(135deg, #CF142B 0%, #9a0a1d 100%)' }}>
          {/* Gold shimmer */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 -translate-x-8 translate-y-8"
            style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 mb-4">
              <Heart className="w-3.5 h-3.5" style={{ color: '#FCD116' }} />
              Solicitar apoyo
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">Solicitar ayuda</h1>
            <p className="text-red-200 text-sm max-w-xl leading-relaxed">
              Cuéntanos los datos de tu caso. Tu información llega directo al equipo de coordinación,
              sin procesarse con inteligencia artificial. Un coordinador te contactará pronto.
            </p>
          </div>
        </div>

        {/* ── Línea de Soporte Emocional — Info Card ─────── */}
        <div className="relative overflow-hidden rounded-2xl shadow-md mb-8 animate-fade-in"
          style={{ background: 'linear-gradient(135deg, #003893 0%, #0a38a0 100%)' }}>
          {/* Decorative gold glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />

          <div className="relative z-10 p-6 sm:p-8 text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-5"
              style={{ background: 'rgba(252,209,22,0.20)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.35)' }}>
              <Phone className="w-3.5 h-3.5" />
              Línea de Soporte Emocional
            </div>

            {/* Main text */}
            <p className="text-primary-100 text-sm leading-relaxed mb-5 max-w-2xl">
              La salud mental y el bienestar emocional de nuestra gente es prioridad. Por eso, nos unimos en solidaridad
              para tender un puente de apoyo a quienes más lo necesitan en este momento.
            </p>
            <p className="text-primary-100 text-sm leading-relaxed mb-6 max-w-2xl">
              El <strong className="text-white">Colegio de Psicólogos del Distrito Capital</strong> pone a tu disposición
              la <strong className="text-white">Línea de Soporte Emocional</strong>, un servicio de atención psicológica
              telefónica completamente <span className="font-bold" style={{ color: '#FCD116' }}>GRATUITO</span> y confidencial.
            </p>

            {/* How it works */}
            <div className="rounded-xl p-4 mb-6"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#FCD116' }}>
                💻 Tecnología al servicio de la gente
              </h3>
              <p className="text-xs text-primary-200 leading-relaxed">
                CAVECOM-e ha facilitado una plataforma en la nube y un sistema de redireccionamiento para conectar de forma
                segura y confidencial a las personas con más de{' '}
                <strong className="text-white">50 psicólogos voluntarios</strong> listos para escuchar y orientar.
              </p>
            </div>

            {/* Contact details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { emoji: '📆', label: 'Disponibilidad', value: 'Lunes a domingo · 30 días continuos desde el 13 de julio' },
                { emoji: '⏰', label: 'Horario',         value: '7:00 am – 7:00 pm' },
                { emoji: '📞', label: 'Teléfono',        value: '0212-771.9379' },
              ].map(({ emoji, label, value }) => (
                <div key={label}
                  className="flex flex-col gap-1 rounded-xl p-3.5"
                  style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <span className="text-lg leading-none">{emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-300">{label}</span>
                  <span className="text-sm font-semibold text-white leading-snug">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Form ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Section 1: Información de la solicitud */}
          <div className="card border border-gray-100 shadow-sm">
            <SectionTitle icon={FileText} title="Información de la solicitud" />

            {/* Help type & urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tipo de ayuda <span style={{ color: '#CF142B' }}>*</span>
                </label>
                <select required value={formData.help_type}
                  onChange={(e) => handleInputChange('help_type', e.target.value)}
                  className={inputCls + ' focus:ring-2'} style={inputFocus}>
                  <option value="">Selecciona…</option>
                  {HELP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Estado de Venezuela <span style={{ color: '#CF142B' }}>*</span>
                </label>
                <select required value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={inputCls + ' focus:ring-2'} style={inputFocus}>
                  <option value="">Selecciona…</option>
                  {VENEZUELA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Urgency selector — card style */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                Nivel de urgencia <span style={{ color: '#CF142B' }}>*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {URGENCY_LEVELS.map(({ value, label, sub, color }) => {
                  const active = formData.urgency_level === value;
                  return (
                    <label key={value}
                      className="relative flex flex-col gap-1 p-3.5 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: active ? color : '#e2e8f0',
                        background: active ? `${color}12` : 'white',
                      }}>
                      <input type="radio" name="urgency_level" value={value}
                        checked={active}
                        onChange={() => handleInputChange('urgency_level', value)}
                        className="sr-only" />
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                        <span className="font-bold text-sm" style={{ color: active ? color : '#334155' }}>{label}</span>
                      </div>
                      <span className="text-xs text-gray-500 pl-4 leading-relaxed">{sub}</span>
                      {active && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: color }}>
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Municipality */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                Municipio, ciudad o sector <span style={{ color: '#CF142B' }}>*</span>
              </label>
              <input type="text" required value={formData.municipality}
                onChange={(e) => handleInputChange('municipality', e.target.value)}
                className={inputCls + ' focus:ring-2'} style={inputFocus}
                placeholder="Ej.: Valencia, sector La Isabelica" />
            </div>

            {/* Modality */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                Modalidad de atención <span style={{ color: '#CF142B' }}>*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {MODALITIES.map(({ value, label }) => {
                  const active = formData.modality === value;
                  return (
                    <label key={value}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all"
                      style={{
                        borderColor: active ? '#CF142B' : '#e2e8f0',
                        color: active ? '#CF142B' : '#64748b',
                        background: active ? '#fde8eb' : 'white',
                      }}>
                      <input type="radio" name="modality" value={value}
                        checked={active}
                        onChange={() => handleInputChange('modality', value as typeof formData.modality)}
                        className="sr-only" />
                      {label}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                  Descripción de la situación <span style={{ color: '#CF142B' }}>*</span>
                </label>
                <span className={`text-xs font-medium ${formData.description.length < 20 ? 'text-red-400' : 'text-green-500'}`}>
                  {formData.description.length} / mín. 20 caracteres
                </span>
              </div>
              <textarea required rows={4} value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={inputCls + ' focus:ring-2 resize-none'} style={inputFocus}
                placeholder="Cuéntanos con tus palabras qué está pasando y qué tipo de ayuda necesitas…" />
            </div>
          </div>

          {/* Section 2: Datos de contacto */}
          <div className="card border border-gray-100 shadow-sm">
            <SectionTitle icon={Phone} title="Datos de contacto" />

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nombre de quien solicita <span style={{ color: '#CF142B' }}>*</span>
              </label>
              <input type="text" required value={formData.requester_name}
                onChange={(e) => handleInputChange('requester_name', e.target.value)}
                className={inputCls + ' focus:ring-2'} style={inputFocus}
                placeholder="Nombre y apellido" />
            </div>

            <div className="p-3 rounded-xl mb-4 flex items-start gap-2"
              style={{ background: '#e6edf8', border: '1px solid #c0d0ee' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#003893' }} />
              <p className="text-xs font-medium" style={{ color: '#1a4ab5' }}>
                Indica al menos un medio de contacto para que podamos comunicarnos contigo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Celular / WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">+58</span>
                  <input type="tel" value={formData.contact_whatsapp}
                    onChange={(e) => handleInputChange('contact_whatsapp', e.target.value)}
                    className={inputCls.replace('px-4', 'pl-11 pr-4') + ' focus:ring-2'} style={inputFocus}
                    placeholder="4121234567" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono fijo</label>
                <input type="tel" value={formData.contact_landline}
                  onChange={(e) => handleInputChange('contact_landline', e.target.value)}
                  className={inputCls + ' focus:ring-2'} style={inputFocus}
                  placeholder="02125551234" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
                <input type="email" value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className={inputCls + ' focus:ring-2'} style={inputFocus}
                  placeholder="tucorreo@ejemplo.com" />
              </div>
            </div>
          </div>

          {/* Section 3: Consentimiento */}
          <div className="card border border-gray-100 shadow-sm">
            <SectionTitle icon={Shield} title="Consentimiento" />
            <p className="text-xs text-gray-500 -mt-2 mb-5">
              Como tu caso puede incluir información sensible, necesitamos tu autorización para tratarlo. Lee cómo{' '}
              <button
                type="button"
                onClick={() => toast('Cómo manejamos tus datos según la ley de protección de datos.')}
                className="font-semibold hover:underline"
                style={{ color: '#CF142B' }}
              >
                manejamos tus datos
              </button>.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: 'data_consent',
                  field: 'data_consent',
                  title: 'Tratamiento de datos para gestionar el caso',
                  desc: 'Autorizo que Voluntariado por Venezuela trate los datos que proporcione —incluida información de salud, ubicación y contacto— con la única finalidad de registrar y gestionar mi solicitud de ayuda.',
                },
                {
                  id: 'sharing_consent',
                  field: 'sharing_consent',
                  title: 'Compartir el caso con el voluntario asignado',
                  desc: 'Autorizo que, una vez asignado mi caso, un voluntario verificado de VxV acceda a los datos necesarios para brindarme la ayuda.',
                },
              ].map(({ id, field, title, desc }) => {
                const checked = Boolean(formData[field as keyof typeof formData]);
                return (
                  <label key={id} htmlFor={id}
                    className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: checked ? '#CF142B' : '#e2e8f0',
                      background: checked ? '#fde8eb' : '#f8fafc',
                    }}>
                    <input type="checkbox" id={id} checked={checked}
                      onChange={(e) => handleInputChange(field, e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded cursor-pointer accent-[#CF142B]" />
                    <div>
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        {title}
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded"
                          style={{ background: '#fde8eb', color: '#CF142B' }}>
                          Obligatorio
                        </span>
                      </span>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Actions footer ────────────────────────────── */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-5 flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Tus datos están protegidos
            </span>
            <button
              type="submit"
              id="submit-help-request"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              style={{ background: 'linear-gradient(135deg, #CF142B, #9a0a1d)' }}
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Solicitud
                  <Heart className="w-4 h-4 fill-white" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
