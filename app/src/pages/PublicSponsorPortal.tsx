import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  DollarSign,
  Monitor,
  Building2,
  Megaphone,
  GraduationCap,
  Package,
  Check,
  ChevronRight,
  Heart,
  Lock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  publicSponsorService,
  type SponsorType,
  type EconomicData,
  type TechData,
  type SpaceData,
  type MediaData,
  type TrainingData,
  type MaterialsData,
  type PublicSponsorCommon,
} from '../services/sponsorship';

// ─── Phone prefixes ───────────────────────────────────────────
const PHONE_PREFIXES = [
  { value: '+58',  label: 'Venezuela (+58)' },
  { value: '+1',   label: 'EE.UU. / Canadá (+1)' },
  { value: '+34',  label: 'España (+34)' },
  { value: '+57',  label: 'Colombia (+57)' },
  { value: '+54',  label: 'Argentina (+54)' },
  { value: '+56',  label: 'Chile (+56)' },
  { value: '+51',  label: 'Perú (+51)' },
  { value: '+598', label: 'Uruguay (+598)' },
  { value: '+52',  label: 'México (+52)' },
];

// ─── Sponsorship type definitions ─────────────────────────────
type SponsorTypeConfig = {
  value: SponsorType;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

const SPONSOR_TYPES: SponsorTypeConfig[] = [
  {
    value: 'ECONOMIC',
    icon: DollarSign,
    label: 'Económico / Financiero',
    description: 'Aporte dinerario puntual, mensual o recurrente para financiar el programa.',
    color: '#22c55e',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  {
    value: 'TECH',
    icon: Monitor,
    label: 'Tecnológico',
    description: 'Hardware, software, licencias, servidores o conectividad para la red.',
    color: '#003893',
    bgColor: '#e6edf8',
    borderColor: '#c0d0ee',
  },
  {
    value: 'SPACE',
    icon: Building2,
    label: 'Espacios físicos',
    description: 'Cesión de local o sala para sesiones, talleres y atención presencial.',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  {
    value: 'MEDIA',
    icon: Megaphone,
    label: 'Comunicación / Difusión',
    description: 'Apoyo con redes sociales, medios, prensa o visibilidad de campaña.',
    color: '#CF142B',
    bgColor: '#fde8eb',
    borderColor: '#fca5b0',
  },
  {
    value: 'TRAINING',
    icon: GraduationCap,
    label: 'Formación / Capacitación',
    description: 'Talleres, charlas, mentoría o formación para voluntarios y coordinadores.',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
  },
  {
    value: 'MATERIALS',
    icon: Package,
    label: 'Materiales / Insumos',
    description: 'Donación de equipos, útiles, insumos u otros recursos materiales.',
    color: '#0891b2',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
  },
];

// ─── Field label ───────────────────────────────────────────────
function FL({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}{required && <span className="ml-1" style={{ color: '#CF142B' }}>*</span>}
    </label>
  );
}

const inputCls = `w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800
  placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#003893]/30
  focus:border-[#003893] transition-all`;

const selectCls = `${inputCls} cursor-pointer`;

// ─── Section title inside form ─────────────────────────────────
function SectionHeader({ color, title }: { color: string; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
      <span className="w-1.5 h-5 rounded-full" style={{ background: color }} />
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</span>
    </div>
  );
}

// ─── Type-specific sub-forms ───────────────────────────────────
function EconomicForm({ data, onChange }: { data: EconomicData; onChange: (d: EconomicData) => void }) {
  const upd = (k: keyof EconomicData, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <SectionHeader color="#22c55e" title="Detalles del aporte económico" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FL required>Monto estimado</FL>
          <input type="text" className={inputCls} placeholder="Ej.: 500" value={data.amount_estimate}
            onChange={(e) => upd('amount_estimate', e.target.value)} />
        </div>
        <div>
          <FL required>Moneda</FL>
          <select className={selectCls} value={data.currency} onChange={(e) => upd('currency', e.target.value as EconomicData['currency'])}>
            <option value="USD">USD – Dólar</option>
            <option value="EUR">EUR – Euro</option>
            <option value="VES">VES – Bolívar</option>
            <option value="OTRO">Otra</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <FL required>Frecuencia del aporte</FL>
          <div className="flex flex-wrap gap-3">
            {[
              { v: 'ONE_TIME', l: 'Único' },
              { v: 'MONTHLY',  l: 'Mensual' },
              { v: 'QUARTERLY',l: 'Trimestral' },
              { v: 'ANNUAL',   l: 'Anual' },
            ].map(({ v, l }) => {
              const active = data.frequency === v;
              return (
                <label key={v} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all"
                  style={{ borderColor: active ? '#22c55e' : '#e2e8f0', color: active ? '#16a34a' : '#64748b', background: active ? '#f0fdf4' : 'white' }}>
                  <input type="radio" name="frequency" value={v} checked={active}
                    onChange={() => upd('frequency', v as EconomicData['frequency'])} className="sr-only" />
                  {l}
                </label>
              );
            })}
          </div>
        </div>
        <div className="md:col-span-3">
          <FL>Método de contacto preferido para coordinar la transferencia</FL>
          <input type="text" className={inputCls} placeholder="Ej.: WhatsApp, email, Zoom..." value={data.contact_method}
            onChange={(e) => upd('contact_method', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function TechForm({ data, onChange }: { data: TechData; onChange: (d: TechData) => void }) {
  const upd = (k: keyof TechData, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <SectionHeader color="#003893" title="Detalles del recurso tecnológico" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FL required>Tipo de recurso</FL>
          <select className={selectCls} value={data.resource_type} onChange={(e) => upd('resource_type', e.target.value)}>
            <option value="HARDWARE">Hardware (equipos, dispositivos)</option>
            <option value="SOFTWARE">Software / Licencias</option>
            <option value="SERVER_CLOUD">Servidores / Cloud</option>
            <option value="CONNECTIVITY">Conectividad / Internet</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>
        <div>
          <FL required>Cantidad / Capacidad</FL>
          <input type="text" className={inputCls} placeholder="Ej.: 10 laptops, 500 GB..." value={data.quantity}
            onChange={(e) => upd('quantity', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <FL required>Descripción del recurso</FL>
          <textarea rows={3} className={inputCls + ' resize-none'} placeholder="Detalla el recurso tecnológico que ofreces..." value={data.description}
            onChange={(e) => upd('description', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <FL>¿Está disponible de inmediato?</FL>
          <div className="flex gap-3">
            {[{ v: true, l: 'Sí, disponible ahora' }, { v: false, l: 'No, fecha estimada:' }].map(({ v, l }) => {
              const active = data.available_now === v;
              return (
                <label key={String(v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-all"
                  style={{ borderColor: active ? '#003893' : '#e2e8f0', color: active ? '#003893' : '#64748b', background: active ? '#e6edf8' : 'white' }}>
                  <input type="radio" checked={active} onChange={() => upd('available_now', v)} className="sr-only" />
                  {l}
                </label>
              );
            })}
            {!data.available_now && (
              <input type="date" className={inputCls + ' max-w-[200px]'} value={data.available_date}
                onChange={(e) => upd('available_date', e.target.value)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpaceForm({ data, onChange }: { data: SpaceData; onChange: (d: SpaceData) => void }) {
  const upd = (k: keyof SpaceData, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <SectionHeader color="#f59e0b" title="Detalles del espacio físico" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FL required>Dirección completa del espacio</FL>
          <input type="text" className={inputCls} placeholder="Calle, urb., edificio, municipio, estado..." value={data.address}
            onChange={(e) => upd('address', e.target.value)} />
        </div>
        <div>
          <FL required>Capacidad (personas)</FL>
          <input type="number" min="1" className={inputCls} placeholder="Ej.: 30" value={data.capacity}
            onChange={(e) => upd('capacity', e.target.value)} />
        </div>
        <div>
          <FL required>Duración de la cesión</FL>
          <input type="text" className={inputCls} placeholder="Ej.: 3 meses, indefinido..." value={data.duration}
            onChange={(e) => upd('duration', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <FL required>Disponibilidad (días y horario)</FL>
          <input type="text" className={inputCls} placeholder="Ej.: Lunes a viernes, 8am-5pm" value={data.availability}
            onChange={(e) => upd('availability', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <FL>¿El espacio cuenta con equipamiento (sillas, proyector, etc.)?</FL>
          <div className="flex gap-3 mb-2">
            {[{ v: true, l: 'Sí' }, { v: false, l: 'No' }].map(({ v, l }) => {
              const active = data.has_equipment === v;
              return (
                <label key={String(v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-all"
                  style={{ borderColor: active ? '#f59e0b' : '#e2e8f0', color: active ? '#b45309' : '#64748b', background: active ? '#fffbeb' : 'white' }}>
                  <input type="radio" checked={active} onChange={() => upd('has_equipment', v)} className="sr-only" />
                  {l}
                </label>
              );
            })}
          </div>
          {data.has_equipment && (
            <input type="text" className={inputCls} placeholder="Describe el equipamiento disponible..." value={data.equipment_detail}
              onChange={(e) => upd('equipment_detail', e.target.value)} />
          )}
        </div>
      </div>
    </div>
  );
}

function MediaForm({ data, onChange }: { data: MediaData; onChange: (d: MediaData) => void }) {
  const upd = (k: keyof MediaData, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <SectionHeader color="#CF142B" title="Detalles del apoyo en comunicación" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FL required>Tipo de canal</FL>
          <select className={selectCls} value={data.channel_type} onChange={(e) => upd('channel_type', e.target.value)}>
            <option value="SOCIAL_MEDIA">Redes Sociales</option>
            <option value="TRADITIONAL">Medios Tradicionales (TV/Radio)</option>
            <option value="PRESS">Prensa Escrita / Digital</option>
            <option value="PODCAST">Podcast</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>
        <div>
          <FL required>Nombre de la plataforma / medio</FL>
          <input type="text" className={inputCls} placeholder="Ej.: @micanal, El Nacional, Canal 8..." value={data.platform_name}
            onChange={(e) => upd('platform_name', e.target.value)} />
        </div>
        <div>
          <FL required>Alcance estimado</FL>
          <input type="text" className={inputCls} placeholder="Ej.: 50.000 seguidores, 10.000 lectores..." value={data.estimated_reach}
            onChange={(e) => upd('estimated_reach', e.target.value)} />
        </div>
        <div>
          <FL required>Tipo de apoyo que ofreces</FL>
          <input type="text" className={inputCls} placeholder="Ej.: publicaciones, spot, nota de prensa..." value={data.support_type}
            onChange={(e) => upd('support_type', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function TrainingForm({ data, onChange }: { data: TrainingData; onChange: (d: TrainingData) => void }) {
  const upd = (k: keyof TrainingData, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <SectionHeader color="#7c3aed" title="Detalles de la formación" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FL required>Área de conocimiento / especialidad</FL>
          <input type="text" className={inputCls} placeholder="Ej.: Psicología clínica, Liderazgo..." value={data.specialty}
            onChange={(e) => upd('specialty', e.target.value)} />
        </div>
        <div>
          <FL required>Formato</FL>
          <select className={selectCls} value={data.format} onChange={(e) => upd('format', e.target.value as TrainingData['format'])}>
            <option value="WORKSHOP">Taller presencial / virtual</option>
            <option value="TALK">Charla / Conferencia</option>
            <option value="MENTORING">Mentoría individual</option>
            <option value="WEBINAR">Webinar</option>
          </select>
        </div>
        <div>
          <FL required>Duración estimada (horas)</FL>
          <input type="number" min="1" className={inputCls} placeholder="Ej.: 4" value={data.duration_hours}
            onChange={(e) => upd('duration_hours', e.target.value)} />
        </div>
        <div>
          <FL required>Audiencia objetivo</FL>
          <input type="text" className={inputCls} placeholder="Ej.: voluntarios, coordinadores, comunidad..." value={data.target_audience}
            onChange={(e) => upd('target_audience', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <FL required>Disponibilidad (fechas / frecuencia)</FL>
          <input type="text" className={inputCls} placeholder="Ej.: Sábados a partir de agosto, 3 sesiones..." value={data.availability}
            onChange={(e) => upd('availability', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function MaterialsForm({ data, onChange }: { data: MaterialsData; onChange: (d: MaterialsData) => void }) {
  const upd = (k: keyof MaterialsData, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <SectionHeader color="#0891b2" title="Detalles de los materiales / insumos" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FL required>Tipo de material</FL>
          <input type="text" className={inputCls} placeholder="Ej.: Útiles de oficina, botiquín..." value={data.material_type}
            onChange={(e) => upd('material_type', e.target.value)} />
        </div>
        <div>
          <FL required>Cantidad</FL>
          <input type="text" className={inputCls} placeholder="Ej.: 100 unidades, 5 cajas..." value={data.quantity}
            onChange={(e) => upd('quantity', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <FL required>Descripción detallada</FL>
          <textarea rows={3} className={inputCls + ' resize-none'} placeholder="Describe los materiales que vas a donar..." value={data.description}
            onChange={(e) => upd('description', e.target.value)} />
        </div>
        <div>
          <FL required>¿Puedes cubrir el envío / entrega?</FL>
          <div className="flex gap-3">
            {[{ v: 'YES', l: 'Sí' }, { v: 'NO', l: 'No' }, { v: 'PARTIAL', l: 'Parcialmente' }].map(({ v, l }) => {
              const active = data.covers_delivery === v;
              return (
                <label key={v} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-all"
                  style={{ borderColor: active ? '#0891b2' : '#e2e8f0', color: active ? '#0e7490' : '#64748b', background: active ? '#ecfeff' : 'white' }}>
                  <input type="radio" checked={active} onChange={() => upd('covers_delivery', v as MaterialsData['covers_delivery'])} className="sr-only" />
                  {l}
                </label>
              );
            })}
          </div>
        </div>
        <div>
          <FL required>Ubicación actual del material</FL>
          <input type="text" className={inputCls} placeholder="Ciudad y país donde está el material" value={data.current_location}
            onChange={(e) => upd('current_location', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

// ─── Default type data ─────────────────────────────────────────
const defaultTypeData: Record<SponsorType, unknown> = {
  ECONOMIC:  { amount_estimate: '', currency: 'USD', frequency: 'ONE_TIME', contact_method: '' },
  TECH:      { resource_type: 'HARDWARE', description: '', quantity: '', available_now: true, available_date: '' },
  SPACE:     { address: '', capacity: '', availability: '', duration: '', has_equipment: false, equipment_detail: '' },
  MEDIA:     { channel_type: 'SOCIAL_MEDIA', platform_name: '', estimated_reach: '', support_type: '' },
  TRAINING:  { specialty: '', format: 'WORKSHOP', duration_hours: '', target_audience: '', availability: '' },
  MATERIALS: { material_type: '', description: '', quantity: '', covers_delivery: 'YES', current_location: '' },
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function PublicSponsorPortal() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<SponsorType | null>(null);
  const [saving, setSaving] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const [common, setCommon] = useState<PublicSponsorCommon>({
    org_name: '', contact_name: '', email: '',
    phone_prefix: '+58', phone: '', country: 'Venezuela', city: '', message: '',
  });

  const [typeData, setTypeData] = useState<Record<SponsorType, unknown>>({ ...defaultTypeData });

  const selectedConfig = SPONSOR_TYPES.find(t => t.value === selectedType);

  const handleSelectType = (type: SponsorType) => {
    setSelectedType(type);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    if (!common.org_name.trim())    return toast.error('El nombre del patrocinador es requerido');
    if (!common.contact_name.trim()) return toast.error('La persona de contacto es requerida');
    if (!common.email.trim())        return toast.error('El email de contacto es requerido');
    if (!common.phone.trim())        return toast.error('El teléfono es requerido');
    if (!common.country.trim())      return toast.error('El país es requerido');
    if (!common.city.trim())         return toast.error('La ciudad es requerida');

    setSaving(true);
    try {
      const { tracking_code } = await publicSponsorService.submitPublicSponsor({
        ...common,
        sponsor_type: selectedType,
        type_data: typeData[selectedType] as EconomicData,
      });
      setTrackingCode(tracking_code);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      toast.error('Error al enviar el formulario. Por favor intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────
  if (trackingCode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(160deg, #e6edf8 0%, #f8fafc 60%, #fffbeb 100%)' }}>
        <div className="max-w-lg w-full">
          <div className="vzla-stripe rounded-t-2xl" />
          <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 p-8 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #003893, #0a38a0)' }}>
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4"
              style={{ background: '#e6edf8', color: '#003893' }}>
              <Sparkles className="w-3.5 h-3.5" />
              ¡Registro recibido!
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              ¡Gracias por tu generosidad!
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Tu oferta de patrocinio ha sido registrada. El equipo de coordinación
              revisará los detalles y se pondrá en contacto contigo pronto.
            </p>

            {/* Tracking code */}
            <div className="rounded-2xl p-5 mb-6"
              style={{ background: 'linear-gradient(135deg, #003893, #0a38a0)' }}>
              <p className="text-primary-200 text-xs mb-1 font-medium">Código de seguimiento</p>
              <p className="text-3xl font-black text-white tracking-widest">{trackingCode}</p>
              <p className="text-primary-300 text-xs mt-1">Guarda este código para hacer seguimiento a tu registro</p>
            </div>

            <div className="rounded-xl p-4 mb-8 text-left"
              style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: '#b45309' }}>
                <AlertCircle className="w-4 h-4" />
                ¿Qué sigue?
              </h3>
              <ul className="text-xs space-y-1.5 list-disc pl-4" style={{ color: '#92400e' }}>
                <li>Un coordinador revisará tu oferta en las próximas 48 horas.</li>
                <li>Te contactarán al email y teléfono proporcionados.</li>
                <li>Si tienes preguntas, menciona tu código de seguimiento.</li>
              </ul>
            </div>

            <Link to="/directory"
              className="w-full inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #003893, #0a38a0)' }}>
              Volver al Directorio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(160deg, #e6edf8 0%, #f8fafc 55%, #fffbeb 100%)' }}>
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <div className="mb-6">
          <Link to="/directory"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al Directorio
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
            {[
              { n: 1, label: 'Tipo de patrocinio' },
              { n: 2, label: 'Introduce tus datos' },
            ].map(({ n, label }, idx) => (
              <React.Fragment key={n}>
                {idx > 0 && (
                  <div className="w-10 h-0.5 rounded-full"
                    style={{ background: step > n - 1 ? '#003893' : '#e2e8f0' }} />
                )}
                <div className={`flex items-center gap-2 ${step >= n ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
                    style={{ background: step > n ? '#22c55e' : step === n ? '#003893' : '#e2e8f0',
                      color: step >= n ? 'white' : '#94a3b8' }}>
                    {step > n ? <Check className="w-4 h-4" strokeWidth={3} /> : n}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden sm:block">{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STEP 1 — Type selection
            ══════════════════════════════════════════ */}
        {step === 1 && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl text-white shadow-lg mb-8"
              style={{ background: 'linear-gradient(135deg, #003893 0%, #0a38a0 100%)' }}>
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 -translate-x-8 translate-y-8"
                style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
              <div className="relative z-10 p-6 sm:p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 mb-4"
                  style={{ color: '#FCD116' }}>
                  <Heart className="w-3.5 h-3.5" fill="#FCD116" />
                  Patrocinadores
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                  Sé Patrocinador Solidario
                </h1>
                <p className="text-primary-200 text-sm max-w-xl leading-relaxed">
                  Tu apoyo transforma vidas. Elige cómo quieres contribuir con la
                  red de acompañamiento profesional gratuito para la comunidad venezolana.
                  Todos los tipos de aporte son bienvenidos.
                </p>
              </div>
            </div>

            {/* Type cards */}
            <p className="text-center text-sm font-semibold text-gray-500 mb-5 uppercase tracking-wider">
              ¿Cómo deseas patrocinar?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SPONSOR_TYPES.map(({ value, icon: Icon, label, description, color, bgColor, borderColor }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelectType(value)}
                  className="group text-left p-5 rounded-2xl border-2 bg-white shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                  style={{ borderColor }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors"
                    style={{ background: bgColor }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm leading-tight">{label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{description}</p>
                  <div className="flex items-center gap-1 text-xs font-bold transition-colors"
                    style={{ color }}>
                    Registrarme <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            STEP 2 — Registration form
            ══════════════════════════════════════════ */}
        {step === 2 && selectedConfig && (
          <form onSubmit={handleSubmit} className="animate-fade-in">

            {/* Form hero */}
            <div className="relative overflow-hidden rounded-2xl text-white shadow-md mb-6"
              style={{ background: `linear-gradient(135deg, ${selectedConfig.color}ee, ${selectedConfig.color}bb)` }}>
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />
              <div className="relative z-10 p-5 sm:p-7 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <selectedConfig.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-0.5">Tipo seleccionado</p>
                  <h2 className="text-xl font-bold">{selectedConfig.label}</h2>
                </div>
              </div>
            </div>

            <div className="space-y-5">

              {/* Common info card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <SectionHeader color="#003893" title="Información del patrocinador" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FL required>Nombre de la organización o persona</FL>
                    <input type="text" className={inputCls} required placeholder="Nombre completo o razón social"
                      value={common.org_name} onChange={(e) => setCommon({ ...common, org_name: e.target.value })} />
                  </div>
                  <div>
                    <FL required>Persona de contacto</FL>
                    <input type="text" className={inputCls} required placeholder="Nombre y apellido"
                      value={common.contact_name} onChange={(e) => setCommon({ ...common, contact_name: e.target.value })} />
                  </div>
                  <div>
                    <FL required>Email de contacto</FL>
                    <input type="email" className={inputCls} required placeholder="correo@ejemplo.com"
                      value={common.email} onChange={(e) => setCommon({ ...common, email: e.target.value })} />
                  </div>
                  <div>
                    <FL required>Prefijo telefónico</FL>
                    <select className={selectCls} value={common.phone_prefix}
                      onChange={(e) => setCommon({ ...common, phone_prefix: e.target.value })}>
                      {PHONE_PREFIXES.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FL required>Teléfono</FL>
                    <input type="tel" className={inputCls} required placeholder="Número sin prefijo"
                      value={common.phone} onChange={(e) => setCommon({ ...common, phone: e.target.value })} />
                  </div>
                  <div>
                    <FL required>País</FL>
                    <input type="text" className={inputCls} required placeholder="País de residencia"
                      value={common.country} onChange={(e) => setCommon({ ...common, country: e.target.value })} />
                  </div>
                  <div>
                    <FL required>Ciudad</FL>
                    <input type="text" className={inputCls} required placeholder="Ciudad o localidad"
                      value={common.city} onChange={(e) => setCommon({ ...common, city: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <FL>Mensaje / Motivación (opcional)</FL>
                    <textarea rows={3} className={inputCls + ' resize-none'}
                      placeholder="Cuéntanos por qué quieres ser patrocinador..."
                      value={common.message} onChange={(e) => setCommon({ ...common, message: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Type-specific card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                {selectedType === 'ECONOMIC' && (
                  <EconomicForm data={typeData.ECONOMIC as EconomicData}
                    onChange={(d) => setTypeData({ ...typeData, ECONOMIC: d })} />
                )}
                {selectedType === 'TECH' && (
                  <TechForm data={typeData.TECH as TechData}
                    onChange={(d) => setTypeData({ ...typeData, TECH: d })} />
                )}
                {selectedType === 'SPACE' && (
                  <SpaceForm data={typeData.SPACE as SpaceData}
                    onChange={(d) => setTypeData({ ...typeData, SPACE: d })} />
                )}
                {selectedType === 'MEDIA' && (
                  <MediaForm data={typeData.MEDIA as MediaData}
                    onChange={(d) => setTypeData({ ...typeData, MEDIA: d })} />
                )}
                {selectedType === 'TRAINING' && (
                  <TrainingForm data={typeData.TRAINING as TrainingData}
                    onChange={(d) => setTypeData({ ...typeData, TRAINING: d })} />
                )}
                {selectedType === 'MATERIALS' && (
                  <MaterialsForm data={typeData.MATERIALS as MaterialsData}
                    onChange={(d) => setTypeData({ ...typeData, MATERIALS: d })} />
                )}
              </div>

              {/* Footer actions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center justify-between">
                <button type="button" onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Cambiar tipo
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 hidden sm:flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Tus datos están protegidos
                  </span>
                  <button type="submit" disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    style={{ background: `linear-gradient(135deg, ${selectedConfig.color}, ${selectedConfig.color}cc)` }}>
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
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
