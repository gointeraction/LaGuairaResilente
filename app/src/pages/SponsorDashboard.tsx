import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  publicSponsorService,
  type PublicSponsorRegistration,
  type PublicSponsorStatus,
  type SponsorType,
} from '../services/sponsorship';
import {
  ArrowLeft,
  Search,
  Filter,
  DollarSign,
  Monitor,
  Building2,
  Megaphone,
  GraduationCap,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
  BarChart3,
  ChevronRight,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Config maps ───────────────────────────────────────────────
const TYPE_CONFIG: Record<SponsorType, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  ECONOMIC:  { icon: DollarSign,   label: 'Económico',     color: '#22c55e', bg: '#f0fdf4' },
  TECH:      { icon: Monitor,      label: 'Tecnológico',   color: '#003893', bg: '#e6edf8' },
  SPACE:     { icon: Building2,    label: 'Espacios',      color: '#f59e0b', bg: '#fffbeb' },
  MEDIA:     { icon: Megaphone,    label: 'Comunicación',  color: '#CF142B', bg: '#fde8eb' },
  TRAINING:  { icon: GraduationCap,label: 'Formación',     color: '#7c3aed', bg: '#f5f3ff' },
  MATERIALS: { icon: Package,      label: 'Materiales',    color: '#0891b2', bg: '#ecfeff' },
};

const STATUS_CONFIG: Record<PublicSponsorStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:   { label: 'Pendiente',      color: '#f59e0b', bg: '#fffbeb', icon: Clock },
  IN_REVIEW: { label: 'En revisión',    color: '#003893', bg: '#e6edf8', icon: Eye },
  APPROVED:  { label: 'Aprobado',       color: '#22c55e', bg: '#f0fdf4', icon: CheckCircle },
  REJECTED:  { label: 'Rechazado',      color: '#CF142B', bg: '#fde8eb', icon: XCircle },
};

// ─── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: PublicSponsorStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ color: cfg.color, background: cfg.bg }}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Type badge ────────────────────────────────────────────────
function TypeBadge({ type }: { type: SponsorType }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Detail panel row ──────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value || value === '') return null;
  return (
    <div className="py-2 border-b border-gray-50 last:border-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 leading-relaxed">{value}</p>
    </div>
  );
}

// ─── Type data renderer ────────────────────────────────────────
function TypeDataDetails({ type, data }: { type: SponsorType; data: Record<string, unknown> }) {
  const fieldLabels: Record<string, Record<string, string>> = {
    ECONOMIC:  { amount_estimate: 'Monto estimado', currency: 'Moneda', frequency: 'Frecuencia', contact_method: 'Método de contacto preferido' },
    TECH:      { resource_type: 'Tipo de recurso', description: 'Descripción', quantity: 'Cantidad', available_now: 'Disponible ahora', available_date: 'Fecha estimada' },
    SPACE:     { address: 'Dirección', capacity: 'Capacidad (personas)', availability: 'Disponibilidad', duration: 'Duración cesión', has_equipment: '¿Tiene equipamiento?', equipment_detail: 'Detalle de equipamiento' },
    MEDIA:     { channel_type: 'Tipo de canal', platform_name: 'Plataforma / Medio', estimated_reach: 'Alcance estimado', support_type: 'Tipo de apoyo' },
    TRAINING:  { specialty: 'Especialidad', format: 'Formato', duration_hours: 'Duración (horas)', target_audience: 'Audiencia objetivo', availability: 'Disponibilidad' },
    MATERIALS: { material_type: 'Tipo de material', description: 'Descripción', quantity: 'Cantidad', covers_delivery: 'Cubre entrega', current_location: 'Ubicación actual' },
  };

  const labels = fieldLabels[type] || {};
  return (
    <div className="space-y-0">
      {Object.entries(data).map(([key, val]) => {
        if (val === null || val === undefined || val === '') return null;
        const displayVal = typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val);
        return <DetailRow key={key} label={labels[key] || key} value={displayVal} />;
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function SponsorDashboard() {
  const [records, setRecords] = useState<PublicSponsorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<PublicSponsorStatus | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<SponsorType | 'ALL'>('ALL');
  const [selected, setSelected] = useState<PublicSponsorRegistration | null>(null);
  const [editNote, setEditNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await publicSponsorService.getAllRegistrations();
      setRecords(data);
    } catch (err) {
      console.error(err);
      toast.error('Error cargando los registros de patrocinadores');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecord = (r: PublicSponsorRegistration) => {
    setSelected(r);
    setEditNote(r.coordinator_notes || '');
  };

  const handleStatusChange = async (newStatus: PublicSponsorStatus) => {
    if (!selected) return;
    setUpdatingStatus(true);
    try {
      await publicSponsorService.updateStatus(selected.id, newStatus);
      const updated = { ...selected, status: newStatus, updated_at: new Date().toISOString() };
      setSelected(updated);
      setRecords(prev => prev.map(r => r.id === selected.id ? updated : r));
      toast.success(`Estado actualizado a "${STATUS_CONFIG[newStatus].label}"`);
    } catch (err) {
      toast.error('Error actualizando el estado');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selected) return;
    setSavingNote(true);
    try {
      await publicSponsorService.addNote(selected.id, editNote);
      const updated = { ...selected, coordinator_notes: editNote };
      setSelected(updated);
      setRecords(prev => prev.map(r => r.id === selected.id ? updated : r));
      toast.success('Nota guardada');
    } catch (err) {
      toast.error('Error guardando la nota');
    } finally {
      setSavingNote(false);
    }
  };

  // ── Filtering ──────────────────────────────────────────────
  const filtered = records.filter((r) => {
    const matchSearch = !search || [r.org_name, r.contact_name, r.email, r.tracking_code]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchType   = filterType   === 'ALL' || r.sponsor_type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  // ── Stats ──────────────────────────────────────────────────
  const stats = {
    total:    records.length,
    pending:  records.filter(r => r.status === 'PENDING').length,
    approved: records.filter(r => r.status === 'APPROVED').length,
    byType:   Object.fromEntries(
      Object.keys(TYPE_CONFIG).map(t => [t, records.filter(r => r.sponsor_type === t).length])
    ),
  };

  const inputCls = `px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800
    placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#003893]/30
    focus:border-[#003893] transition-all`;

  return (
    <div className="min-h-screen bg-gray-50/80">

      {/* ── Top header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link to="/coordination"
            className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-0.5 h-6 bg-gray-200 rounded-full" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#e6edf8' }}>
              <BarChart3 className="w-4 h-4" style={{ color: '#003893' }} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Portal de Patrocinio</h1>
              <p className="text-xs text-gray-400">Coordinación de registros públicos</p>
            </div>
          </div>
          <div className="ml-auto">
            <Link to="/patrocinadores" target="_blank"
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
              style={{ background: '#e6edf8', color: '#003893' }}>
              Ver portal público <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">

        {/* ── Stats strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total registros',  value: stats.total,    color: '#003893', bg: '#e6edf8' },
            { label: 'Pendientes',       value: stats.pending,  color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Aprobados',        value: stats.approved, color: '#22c55e', bg: '#f0fdf4' },
            { label: 'Tipos activos',
              value: Object.values(stats.byType).filter(v => v > 0).length,
              color: '#7c3aed', bg: '#f5f3ff' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black"
                style={{ background: bg, color }}>
                {value}
              </div>
              <span className="text-xs font-semibold text-gray-500 leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Type breakdown ────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
            const count = stats.byType[type] || 0;
            return (
              <button key={type} type="button"
                onClick={() => setFilterType(prev => prev === type as SponsorType ? 'ALL' : type as SponsorType)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                style={{
                  borderColor: filterType === type ? cfg.color : '#e2e8f0',
                  color: filterType === type ? cfg.color : '#64748b',
                  background: filterType === type ? cfg.bg : 'white',
                }}>
                <cfg.icon className="w-3.5 h-3.5" />
                {cfg.label} ({count})
              </button>
            );
          })}
        </div>

        {/* ── Search + status filter ────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por nombre, email o código..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className={inputCls + ' w-full pl-10'} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select className={inputCls} value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as PublicSponsorStatus | 'ALL')}>
              <option value="ALL">Todos los estados</option>
              {Object.entries(STATUS_CONFIG).map(([v, cfg]) => (
                <option key={v} value={v}>{cfg.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Main layout: table + detail panel ────────────── */}
        <div className="flex gap-4 min-h-[60vh]">

          {/* Table */}
          <div className={`flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${selected ? 'hidden lg:block' : 'block'}`}>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-gray-100 border-t-[#003893] rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <AlertCircle className="w-10 h-10 mb-3" />
                <p className="font-semibold text-sm">No se encontraron registros</p>
                <p className="text-xs mt-1">Ajusta los filtros o busca otro término</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Código', 'Organización', 'Tipo', 'Estado', 'Fecha', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id}
                        onClick={() => handleSelectRecord(r)}
                        className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selected?.id === r.id ? 'bg-blue-50/50' : ''}`}>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold text-gray-600">{r.tracking_code}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-sm text-gray-900 truncate max-w-[150px]">{r.org_name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">{r.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <TypeBadge type={r.sponsor_type} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(r.submitted_at).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-full lg:w-[420px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <TypeBadge type={selected.sponsor_type} />
                  <StatusBadge status={selected.status} />
                </div>
                <button onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-700 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">

                {/* Tracking */}
                <div className="rounded-xl p-3 text-center" style={{ background: '#e6edf8' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#003893' }}>
                    Código de seguimiento
                  </p>
                  <p className="font-mono text-lg font-black" style={{ color: '#003893' }}>
                    {selected.tracking_code}
                  </p>
                </div>

                {/* Basic info */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Información general</p>
                  <div className="space-y-0">
                    <DetailRow label="Organización / Persona" value={selected.org_name} />
                    <DetailRow label="Contacto" value={selected.contact_name} />
                    <DetailRow label="Email" value={selected.email} />
                    <DetailRow label="Teléfono" value={`${selected.phone_prefix} ${selected.phone}`} />
                    <DetailRow label="Ubicación" value={`${selected.city}, ${selected.country}`} />
                    {selected.message && <DetailRow label="Mensaje" value={selected.message} />}
                  </div>
                </div>

                {/* Type-specific */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Detalles del patrocinio
                  </p>
                  <TypeDataDetails type={selected.sponsor_type}
                    data={selected.type_data as unknown as Record<string, unknown>} />
                </div>

                {/* Coordinator notes */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Notas del coordinador</p>
                  </div>
                  <textarea rows={3} value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#003893]/30 focus:border-[#003893] transition-all resize-none"
                    placeholder="Añade notas internas sobre este patrocinador..." />
                  <button onClick={handleSaveNote} disabled={savingNote}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                    style={{ background: '#e6edf8', color: '#003893' }}>
                    {savingNote ? (
                      <span className="w-3.5 h-3.5 border-2 border-[#003893]/30 border-t-[#003893] rounded-full animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Guardar nota
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/60 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Cambiar estado</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(STATUS_CONFIG) as [PublicSponsorStatus, typeof STATUS_CONFIG[PublicSponsorStatus]][]).map(([status, cfg]) => {
                    const isActive = selected.status === status;
                    return (
                      <button key={status} type="button"
                        disabled={isActive || updatingStatus}
                        onClick={() => handleStatusChange(status)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          borderColor: isActive ? cfg.color : '#e2e8f0',
                          color: isActive ? cfg.color : '#64748b',
                          background: isActive ? cfg.bg : 'white',
                        }}>
                        <cfg.icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
