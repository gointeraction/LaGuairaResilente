import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { psychologistService } from '../services/psychologist';
import { 
  ArrowLeft, 
  Check, 
  User, 
  GraduationCap, 
  CheckSquare, 
  Lock, 
  AlertCircle,
  BookOpen,
  ClipboardList,
  ChevronRight,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

const PHONE_PREFIXES = [
  { value: '+58',  label: 'Venezuela (+58)' },
  { value: '+1',   label: 'Estados Unidos (+1)' },
  { value: '+34',  label: 'España (+34)' },
  { value: '+57',  label: 'Colombia (+57)' },
  { value: '+54',  label: 'Argentina (+54)' },
  { value: '+56',  label: 'Chile (+56)' },
  { value: '+51',  label: 'Perú (+51)' },
  { value: '+598', label: 'Uruguay (+598)' },
  { value: '+507', label: 'Panamá (+507)' },
  { value: '+52',  label: 'México (+52)' },
];

const COMMITMENTS = [
  {
    num: '01',
    title: 'Mayoría de edad e información verídica',
    desc: 'Soy mayor de 18 años y la información que voy a proporcionar es verídica. Sé que dar información falsa implica la baja inmediata de la red. Ten en cuenta que ciertos perfiles profesionales —en especial los de atención clínica directa— requieren una edad mínima de 25 años.'
  },
  {
    num: '02',
    title: 'Verificación de identidad y credenciales',
    desc: 'Acepto que Voluntariado por Venezuela verifique mi identidad y mis credenciales profesionales (colegiatura o licencia cuando corresponda, más una verificación adicional) antes de activar mi perfil.'
  },
  {
    num: '03',
    title: 'Acompañamiento solo desde mi especialidad',
    desc: 'Acompañaré únicamente desde mi área de especialidad. Si un caso requiere otra disciplina, lo derivaré internamente a través de la coordinación.'
  },
  {
    num: '04',
    title: 'Ayuda gratuita e incondicional',
    desc: 'Mi ayuda es gratuita e incondicional. No cobraré, no aceptaré regalos, propinas ni pagos por fuera de la plataforma, y no usaré el contacto para captar clientes. Cualquier acuerdo de pago por fuera es una falta grave.'
  },
  {
    num: '05',
    title: 'No es un servicio de emergencia',
    desc: 'Entiendo que Voluntariado por Venezuela no es un servicio de emergencia y no atiende rescate, urgencias ni emergencias médicas. Ante un riesgo vital, mi deber es orientar de inmediato a la persona a los canales oficiales de emergencia y avisar a la coordinación.'
  },
  {
    num: '06',
    title: 'Confidencialidad',
    desc: 'Protegeré la confidencialidad: no publicaré fotos ni detalles de los casos, no compartiré datos con terceros, recogeré solo la información indispensable y usaré únicamente los canales seguros de la plataforma.'
  },
  {
    num: '07',
    title: 'Política de salvaguarda',
    desc: 'Acepto la política de salvaguarda: está absolutamente prohibido intercambiar la ayuda por favores de cualquier tipo. Extremaré el cuidado con niñas, niños y adolescentes, y no haré proselitismo político ni religioso.'
  },
  {
    num: '08',
    title: 'Imparcialidad y respeto',
    desc: 'Trataré a todas las personas con imparcialidad y respeto, sin discriminar por raza, género, religión, orientación sexual, condición económica ni afiliación política, y sin juzgar.'
  },
  {
    num: '09',
    title: 'Primer contacto y continuidad',
    desc: 'Me comprometo a un primer contacto dentro de las 24 horas y a la continuidad del caso: si debo retirarme, avisaré a la coordinación para que reasigne el caso antes de dejarlo.'
  },
  {
    num: '10',
    title: 'Reconozco mis límites',
    desc: 'Reconozco mis límites y avisaré a tiempo si necesito una pausa, para no comprometer la calidad del acompañamiento.'
  }
];

// Flag colours for commitment num badges
const BADGE_COLORS = ['#003893', '#CF142B'];

// Reusable field label
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}{required && <span className="ml-1 text-vzla-red-500">*</span>}
    </label>
  );
}

export default function SupportNetworkRegister() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [commitmentsAccepted, setCommitmentsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    first_name:         user?.profile.first_name || '',
    last_name:          user?.profile.last_name  || '',
    cedula:             user?.profile.cedula      || '',
    email:              user?.email               || '',
    phone_prefix:       '+58',
    phone:              user?.profile.phone ? user.profile.phone.replace(/^\+58\s?/, '') : '',
    address:            '',
    postal_code:        '',
    locality:           user?.profile.municipality || '',
    province:           'La Guaira',
    country:            'Venezuela',
    situation:          'PROFESSIONAL' as 'STUDENT' | 'PROFESSIONAL' | 'OTHER',
    hours_confirmation: false,
    policy_acceptance:  false,
  });

  const handleInputChange = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNextStep = () => {
    if (!commitmentsAccepted) {
      toast.error('Debes aceptar los compromisos de voluntariado para continuar');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim())  return toast.error('El nombre es requerido');
    if (!formData.last_name.trim())   return toast.error('El apellido es requerido');
    if (!formData.cedula.trim())      return toast.error('El documento de identidad es requerido');
    if (!formData.email.trim())       return toast.error('El correo electrónico es requerido');
    if (!formData.phone.trim())       return toast.error('El teléfono de contacto es requerido');
    if (!formData.address.trim())     return toast.error('La dirección es requerida');
    if (!formData.locality.trim())    return toast.error('La localidad es requerida');
    if (!formData.province.trim())    return toast.error('La provincia es requerida');
    if (!formData.country.trim())     return toast.error('El país es requerido');
    if (!formData.hours_confirmation) return toast.error('Debes confirmar que cuentas con al menos una hora a la semana');
    if (!formData.policy_acceptance)  return toast.error('Debes aceptar la política del servicio y protección de datos');

    setSaving(true);
    try {
      await psychologistService.registerForSupportNetwork({ user_id: user?.uid, ...formData });
      setCompleted(true);
      toast.success('¡Registro exitoso! Tu solicitud será revisada por un administrador.');
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar la solicitud de registro');
    } finally {
      setSaving(false);
    }
  };

  /* ── Success screen ─────────────────────────────── */
  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(160deg, #e6edf8 0%, #f8fafc 60%, #fde8eb 100%)' }}>
        <div className="max-w-md w-full">
          {/* Tricolor stripe */}
          <div className="vzla-stripe rounded-t-2xl" />
          <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 p-8 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg, #003893, #0a38a0)' }}>
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">¡Gracias por postularte!</h2>
            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
              Tu solicitud para formar parte de la Red de Apoyo Solidario ha sido recibida correctamente.
              Un coordinador revisará tu perfil y te contactará en la brevedad posible.
            </p>

            <div className="rounded-xl p-4 mb-8 text-left" style={{ background: '#e6edf8', border: '1px solid #c0d0ee' }}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: '#003893' }}>
                <AlertCircle className="w-4 h-4" />
                Siguientes pasos
              </h3>
              <ul className="text-xs space-y-1.5 list-disc pl-4" style={{ color: '#1a4ab5' }}>
                <li>Revisión de tu situación (estudiante o profesional).</li>
                <li>Validación del documento de identidad.</li>
                <li>Aprobación por parte del equipo administrativo.</li>
                <li>Inclusión en el directorio público de especialistas.</li>
              </ul>
            </div>

            <Link
              to="/directory"
              className="w-full inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #003893, #0a38a0)' }}
            >
              Volver al Directorio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputCls = `w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800
    placeholder:text-gray-400 bg-white
    focus:outline-none focus:ring-2 focus:border-transparent transition-all`;
  const inputFocus = { '--tw-ring-color': '#003893' } as React.CSSProperties;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(160deg, #e6edf8 0%, #f8fafc 50%, #fde8eb 100%)' }}>
      <div className="max-w-3xl mx-auto">

        {/* ── Back link ───────────────────────────────── */}
        <div className="mb-6">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Directorio
          </Link>
        </div>

        {/* ── Step Progress ────────────────────────────── */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-white/80 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 backdrop-blur-sm">
            {/* Step 1 */}
            <div className={`flex items-center gap-2 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
                style={{ background: step > 1 ? '#22c55e' : '#003893' }}
              >
                {step > 1 ? <Check className="w-4 h-4" strokeWidth={3} /> : '1'}
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">Compromisos</span>
            </div>

            {/* Connector */}
            <div className="w-10 h-0.5 rounded-full" style={{ background: step > 1 ? '#003893' : '#e2e8f0' }} />

            {/* Step 2 */}
            <div className={`flex items-center gap-2 ${step === 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                style={{
                  background: step === 2 ? '#003893' : '#e2e8f0',
                  color: step === 2 ? 'white' : '#94a3b8'
                }}
              >
                2
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">Introduce tus datos</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            STEP 1 — Commitments
            ═══════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-fade-in">

            {/* Card header — blue gradient */}
            <div className="relative overflow-hidden p-6 sm:p-8 text-white"
              style={{ background: 'linear-gradient(135deg, #003893 0%, #0a38a0 100%)' }}>
              {/* Gold shimmer */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 mb-4">
                  <BookOpen className="w-3.5 h-3.5" style={{ color: '#FCD116' }} />
                  Antes de registrarte, léelo con calma
                </div>
                <p className="text-blue-200 text-sm leading-relaxed max-w-lg">
                  Voluntariado por Venezuela es una red de acompañamiento profesional gratuito.
                  Para proteger a las personas afectadas y a ti, todo voluntario acepta estas condiciones antes de continuar.
                </p>
              </div>
            </div>

            {/* Commitments list */}
            <div className="p-5 sm:p-7 space-y-3 max-h-[52vh] overflow-y-auto">
              {COMMITMENTS.map((c, idx) => (
                <div
                  key={c.num}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-100 transition-all bg-white shadow-sm"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div
                    className="text-2xl font-black shrink-0 select-none w-10 text-center leading-none pt-0.5"
                    style={{ color: BADGE_COLORS[idx % BADGE_COLORS.length] }}
                  >
                    {c.num}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{c.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Accept + Next */}
            <div className="p-5 sm:p-7 border-t border-gray-100 bg-gray-50/60 space-y-4">
              <label
                htmlFor="commitmentsAccepted"
                className="flex items-start gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all"
                style={{ borderColor: commitmentsAccepted ? '#003893' : '#e2e8f0' }}
              >
                <input
                  type="checkbox"
                  id="commitmentsAccepted"
                  checked={commitmentsAccepted}
                  onChange={(e) => setCommitmentsAccepted(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded cursor-pointer accent-[#003893]"
                />
                <span className="text-sm text-gray-800 font-semibold leading-relaxed select-none">
                  He leído y acepto estos compromisos. Entiendo que son condiciones para formar parte de Voluntariado por Venezuela.
                </span>
              </label>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!commitmentsAccepted}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ background: commitmentsAccepted ? 'linear-gradient(135deg, #003893, #0a38a0)' : '#cbd5e1' }}
                >
                  Siguiente paso
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            STEP 2 — Registration Form
            ═══════════════════════════════════════════════ */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-fade-in">

            {/* Form header */}
            <div className="relative overflow-hidden p-6 sm:p-8 text-white"
              style={{ background: 'linear-gradient(135deg, #003893 0%, #1a4ab5 100%)' }}>
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" style={{ color: '#FCD116' }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Introduce tus datos</h2>
                  <p className="text-blue-200 text-xs mt-0.5">Los campos con * son obligatorios</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">


              {/* ─── Datos Personales ─────────────────────── */}
              <section>
                <div className="flex items-center gap-2 mb-5 pb-2 border-b border-gray-100">
                  <span className="w-1.5 h-5 rounded-full" style={{ background: '#003893' }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Datos Personales</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Nombre</FieldLabel>
                    <input type="text" required value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="Tu primer nombre" />
                  </div>
                  <div>
                    <FieldLabel required>Apellidos</FieldLabel>
                    <input type="text" required value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="Tus apellidos" />
                  </div>
                  <div>
                    <FieldLabel required>Documento de identidad</FieldLabel>
                    <input type="text" required value={formData.cedula}
                      onChange={(e) => handleInputChange('cedula', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="Cédula, Pasaporte o DNI" />
                  </div>
                  <div>
                    <FieldLabel required>Email</FieldLabel>
                    <input type="email" required value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="correo@ejemplo.com" />
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* ─── Contacto ─────────────────────────────── */}
              <section>
                <div className="flex items-center gap-2 mb-5 pb-2 border-b border-gray-100">
                  <span className="w-1.5 h-5 rounded-full" style={{ background: '#FCD116' }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Contacto</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel required>Prefijo telefónico</FieldLabel>
                    <select value={formData.phone_prefix}
                      onChange={(e) => handleInputChange('phone_prefix', e.target.value)}
                      className={inputCls} style={inputFocus}>
                      {PHONE_PREFIXES.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel required>Teléfono</FieldLabel>
                    <input type="tel" required value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="Número sin prefijo (ej: 4121234567)" />
                  </div>
                  <div className="md:col-span-3">
                    <FieldLabel required>Dirección</FieldLabel>
                    <input type="text" required value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="Calle, avenida, edificio, casa..." />
                  </div>
                  <div>
                    <FieldLabel>Dirección postal</FieldLabel>
                    <input type="text" value={formData.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="Código postal (opcional)" />
                  </div>
                  <div>
                    <FieldLabel required>Localidad</FieldLabel>
                    <input type="text" required value={formData.locality}
                      onChange={(e) => handleInputChange('locality', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="Ciudad o Municipio" />
                  </div>
                  <div>
                    <FieldLabel required>Provincia</FieldLabel>
                    <input type="text" required value={formData.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="Estado, región o provincia" />
                  </div>
                  <div className="md:col-span-3">
                    <FieldLabel required>País</FieldLabel>
                    <input type="text" required value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className={inputCls} style={inputFocus} placeholder="País de residencia" />
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* ─── Tu situación ─────────────────────────── */}
              <section>
                <div className="flex items-center gap-2 mb-5 pb-2 border-b border-gray-100">
                  <span className="w-1.5 h-5 rounded-full" style={{ background: '#CF142B' }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tu situación</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'STUDENT',      Icon: GraduationCap, label: 'Soy estudiante de psicología' },
                    { value: 'PROFESSIONAL', Icon: User,           label: 'Soy profesional de la psicología' },
                    { value: 'OTHER',        Icon: CheckSquare,    label: 'Otros' },
                  ].map(({ value, Icon, label }) => {
                    const active = formData.situation === value;
                    return (
                      <label
                        key={value}
                        className="relative flex flex-col items-center justify-center text-center cursor-pointer rounded-2xl p-5 border-2 transition-all"
                        style={{
                          borderColor: active ? '#003893' : '#e2e8f0',
                          background: active ? '#e6edf8' : 'white',
                        }}
                      >
                        <input
                          type="radio"
                          name="situation"
                          value={value}
                          checked={active}
                          onChange={() => handleInputChange('situation', value)}
                          className="sr-only"
                        />
                        <Icon className="w-8 h-8 mb-2.5" style={{ color: active ? '#003893' : '#94a3b8' }} />
                        <span className="font-semibold text-sm" style={{ color: active ? '#003893' : '#334155' }}>
                          {label}
                        </span>
                        {active && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: '#003893' }}>
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* ─── Confirmaciones ───────────────────────── */}
              <section>
                <div className="flex items-center gap-2 mb-5 pb-2 border-b border-gray-100">
                  <span className="w-1.5 h-5 rounded-full" style={{ background: '#003893' }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Confirmaciones</span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'hours_confirmation',
                      field: 'hours_confirmation',
                      text: 'Confirmo que tengo en la actualidad al menos una hora a la semana para dedicar al voluntariado',
                    },
                    {
                      id: 'policy_acceptance',
                      field: 'policy_acceptance',
                      text: null,
                      jsx: (
                        <span>
                          He leído y acepto la{' '}
                          <button
                            type="button"
                            onClick={() => toast('Política del servicio y protección de datos para voluntariado.')}
                            className="font-bold hover:underline"
                            style={{ color: '#003893' }}
                          >
                            política del servicio y protección de datos
                          </button>
                        </span>
                      ),
                    },
                  ].map(({ id, field, text, jsx }) => {
                    const checked = Boolean(formData[field as keyof typeof formData]);
                    return (
                      <label
                        key={id}
                        htmlFor={id}
                        className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                        style={{ borderColor: checked ? '#003893' : '#e2e8f0', background: checked ? '#e6edf8' : '#f8fafc' }}
                      >
                        <input
                          type="checkbox"
                          id={id}
                          checked={checked}
                          onChange={(e) => handleInputChange(field, e.target.checked)}
                          className="mt-0.5 w-5 h-5 rounded cursor-pointer accent-[#003893]"
                        />
                        <span className="text-sm text-gray-700 select-none leading-relaxed">
                          {jsx || text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Form actions footer */}
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>

              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 hidden sm:flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Tus datos están protegidos
                </span>
                <button
                  type="submit"
                  id="submit-registration"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ background: 'linear-gradient(135deg, #003893, #0a38a0)' }}
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Registro
                      <Heart className="w-4 h-4 fill-white" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
