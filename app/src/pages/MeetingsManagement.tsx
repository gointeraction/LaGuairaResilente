import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  Meeting,
  meetingService,
  shelterService,
  Shelter
} from '../services/coordination';

type ViewMode = 'list' | 'board';
type MeetingTypeFilter = 'ALL' | 'ORDINARIA' | 'EXTRAORDINARIA' | 'SEGUIMIENTO' | 'EMERGENCIA';

export default function MeetingsManagement() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [filterType, setFilterType] = useState<MeetingTypeFilter>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meetingsData, sheltersData] = await Promise.all([
        meetingService.getMeetings(),
        shelterService.getShelters()
      ]);
      setMeetings(meetingsData);
      setShelters(sheltersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMeetingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'ORDINARIA': '📋 Ordinaria',
      'EXTRAORDINARIA': '⚡ Extraordinaria',
      'SEGUIMIENTO': '🔄 Seguimiento',
      'EMERGENCIA': '🚨 Emergencia'
    };
    return labels[type] || type;
  };

  const getMeetingTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'ORDINARIA': 'bg-blue-100 text-blue-800',
      'EXTRAORDINARIA': 'bg-orange-100 text-orange-800',
      'SEGUIMIENTO': 'bg-green-100 text-green-800',
      'EMERGENCIA': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PROGRAMADO': 'bg-blue-100 text-blue-800',
      'EN_CURSO': 'bg-green-100 text-green-800',
      'FINALIZADO': 'bg-gray-100 text-gray-800',
      'CANCELADO': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'BAJA': 'bg-gray-100 text-gray-800',
      'MEDIA': 'bg-yellow-100 text-yellow-800',
      'ALTA': 'bg-orange-100 text-orange-800',
      'CRITICA': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesType = filterType === 'ALL' || meeting.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || meeting.status === filterStatus;
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const openMeetingDetail = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowDetailModal(true);
  };

  const getActionItemsStats = (meeting: Meeting) => {
    if (!meeting.action_items) return { total: 0, completed: 0, pending: 0 };
    const total = meeting.action_items.length;
    const completed = meeting.action_items.filter(a => a.status === 'COMPLETADO').length;
    return { total, completed, pending: total - completed };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reuniones de Coordinación</h1>
              <p className="text-purple-100 mt-1">Gestiona reuniones, temas y compromisos</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              + Nueva Reunión
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar reuniones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as MeetingTypeFilter)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="ORDINARIA">📋 Ordinarias</option>
              <option value="EXTRAORDINARIA">⚡ Extraordinarias</option>
              <option value="SEGUIMIENTO">🔄 Seguimiento</option>
              <option value="EMERGENCIA">🚨 Emergencia</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="ALL">Todos los estados</option>
              <option value="PROGRAMADO">Programadas</option>
              <option value="EN_CURSO">En Curso</option>
              <option value="FINALIZADO">Finalizadas</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1 rounded ${viewMode === 'board' ? 'bg-white shadow' : ''}`}
              >
                📊
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                📋
              </button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{meetings.length}</div>
            <div className="text-sm text-gray-600">Total Reuniones</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {meetings.filter(m => m.status === 'PROGRAMADO').length}
            </div>
            <div className="text-sm text-gray-600">Programadas</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {meetings.filter(m => m.status === 'EN_CURSO').length}
            </div>
            <div className="text-sm text-gray-600">En Curso</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {meetings.reduce((sum, m) => sum + (m.action_items?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Acciones Pendientes</div>
          </Card>
        </div>

        {/* Board View */}
        {viewMode === 'board' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Programadas */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <h3 className="font-bold text-gray-700">Programadas ({filteredMeetings.filter(m => m.status === 'PROGRAMADO').length})</h3>
              </div>
              <div className="space-y-3">
                {filteredMeetings.filter(m => m.status === 'PROGRAMADO').map(meeting => (
                  <motion.div
                    key={meeting.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border rounded-xl p-4 hover:shadow-md cursor-pointer"
                    onClick={() => openMeetingDetail(meeting)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getMeetingTypeColor(meeting.type)}>
                        {getMeetingTypeLabel(meeting.type)}
                      </Badge>
                    </div>
                    <h4 className="font-bold mb-2">{meeting.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meeting.description}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>🏠</span>
                        <span className="truncate">{meeting.shelter_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{meeting.date?.toDate?.().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>{meeting.start_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👥</span>
                        <span>{meeting.participants?.length || 0} participantes</span>
                      </div>
                    </div>
                    {meeting.topics && meeting.topics.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-gray-500 mb-1">Temas:</div>
                        <div className="flex flex-wrap gap-1">
                          {meeting.topics.slice(0, 2).map((topic, idx) => (
                            <Badge key={idx} className="bg-gray-100 text-gray-700 text-xs">
                              {topic.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* En Curso */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <h3 className="font-bold text-gray-700">En Curso ({filteredMeetings.filter(m => m.status === 'EN_CURSO').length})</h3>
              </div>
              <div className="space-y-3">
                {filteredMeetings.filter(m => m.status === 'EN_CURSO').map(meeting => (
                  <motion.div
                    key={meeting.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border-2 border-green-200 rounded-xl p-4 hover:shadow-md cursor-pointer"
                    onClick={() => openMeetingDetail(meeting)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getMeetingTypeColor(meeting.type)}>
                        {getMeetingTypeLabel(meeting.type)}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 animate-pulse">EN VIVO</Badge>
                    </div>
                    <h4 className="font-bold mb-2">{meeting.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>🏠</span>
                        <span>{meeting.shelter_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👥</span>
                        <span>{meeting.participants?.filter(p => p.attended).length || 0}/{meeting.participants?.length || 0} presentes</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Finalizadas */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <h3 className="font-bold text-gray-700">Finalizadas ({filteredMeetings.filter(m => m.status === 'FINALIZADO').length})</h3>
              </div>
              <div className="space-y-3">
                {filteredMeetings.filter(m => m.status === 'FINALIZADO').slice(0, 5).map(meeting => {
                  const stats = getActionItemsStats(meeting);
                  return (
                    <motion.div
                      key={meeting.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border rounded-xl p-4 hover:shadow-md cursor-pointer opacity-80"
                      onClick={() => openMeetingDetail(meeting)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getMeetingTypeColor(meeting.type)}>
                          {getMeetingTypeLabel(meeting.type)}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800">Finalizada</Badge>
                      </div>
                      <h4 className="font-bold mb-2">{meeting.title}</h4>
                      <div className="text-sm text-gray-600 mb-2">
                        {meeting.date?.toDate?.().toLocaleDateString()}
                      </div>
                      {stats.total > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Acciones:</span>
                          <span className="text-green-600 font-medium">{stats.completed}/{stats.total}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4">Reunión</th>
                    <th className="text-left py-3 px-4">Tipo</th>
                    <th className="text-left py-3 px-4">Albergue</th>
                    <th className="text-left py-3 px-4">Fecha</th>
                    <th className="text-left py-3 px-4">Participantes</th>
                    <th className="text-left py-3 px-4">Temas</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMeetings.map(meeting => {
                    const stats = getActionItemsStats(meeting);
                    return (
                      <tr key={meeting.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{meeting.description}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getMeetingTypeColor(meeting.type)}>
                            {getMeetingTypeLabel(meeting.type)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{meeting.shelter_name}</td>
                        <td className="py-3 px-4 text-sm">
                          {meeting.date?.toDate?.().toLocaleDateString() || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {meeting.participants?.length || 0}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {meeting.topics?.length || 0}
                        </td>
                        <td className="py-3 px-4">
                          {stats.total > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{stats.completed}/{stats.total}</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => openMeetingDetail(meeting)}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              Ver
                            </button>
                            <button className="text-green-600 hover:text-green-700 text-sm">Editar</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filteredMeetings.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay reuniones</h3>
            <p className="text-gray-600">No se encontraron reuniones con los filtros seleccionados</p>
          </Card>
        )}
      </div>

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Crear Nueva Reunión</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Reunión *</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Ej: Reunión de Coordinación Semanal" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option value="ORDINARIA">📋 Ordinaria</option>
                    <option value="EXTRAORDINARIA">⚡ Extraordinaria</option>
                    <option value="SEGUIMIENTO">🔄 Seguimiento</option>
                    <option value="EMERGENCIA">🚨 Emergencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Albergue *</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    {shelters.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                  <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio *</label>
                  <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin *</label>
                  <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea className="w-full px-4 py-2 border rounded-lg h-24" placeholder="Describe el propósito de la reunión..."></textarea>
              </div>

              {/* Participants Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Participantes</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input type="text" className="flex-1 px-3 py-2 border rounded-lg" placeholder="Nombre del participante" />
                    <select className="px-3 py-2 border rounded-lg">
                      <option value="COORDINADOR">Coordinador</option>
                      <option value="PSICOLOGO">Psicólogo</option>
                      <option value="VOLUNTARIO">Voluntario</option>
                      <option value="ADMINISTRADOR">Administrador</option>
                    </select>
                    <Button className="bg-purple-600 text-white">+</Button>
                  </div>
                </div>
              </div>

              {/* Topics Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Temas a Tratar</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" className="px-3 py-2 border rounded-lg" placeholder="Tema" />
                    <input type="text" className="px-3 py-2 border rounded-lg" placeholder="Presentador" />
                    <input type="number" className="px-3 py-2 border rounded-lg" placeholder="Min" />
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-700">+ Agregar otro tema</button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowCreateModal(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
                Cancelar
              </Button>
              <Button className="flex-1 bg-purple-600 text-white hover:bg-purple-700">
                Crear Reunión
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Meeting Detail Modal */}
      {showDetailModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedMeeting.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getMeetingTypeColor(selectedMeeting.type)}>
                    {getMeetingTypeLabel(selectedMeeting.type)}
                  </Badge>
                  <Badge className={getStatusColor(selectedMeeting.status)}>
                    {selectedMeeting.status}
                  </Badge>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Información General</h4>
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <span>🏠</span>
                    <span>{selectedMeeting.shelter_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{selectedMeeting.date?.toDate?.().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>{selectedMeeting.start_time} - {selectedMeeting.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👤</span>
                    <span>Organiza: {selectedMeeting.organizer_name}</span>
                  </div>
                </div>

                <h4 className="font-medium text-gray-700 mb-2">Descripción</h4>
                <p className="text-sm text-gray-600 mb-6">{selectedMeeting.description}</p>

                {/* Participants */}
                <h4 className="font-medium text-gray-700 mb-2">
                  Participantes ({selectedMeeting.participants?.length || 0})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedMeeting.participants?.map((participant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${participant.attended ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm">{participant.name}</span>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700 text-xs">{participant.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Topics */}
                <h4 className="font-medium text-gray-700 mb-2">Temas a Tratar</h4>
                <div className="space-y-2 mb-6">
                  {selectedMeeting.topics?.map((topic, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{topic.title}</span>
                        <Badge className={
                          topic.status === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
                          topic.status === 'EN_CURSO' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {topic.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {topic.presenter} | {topic.duration_minutes} min
                      </div>
                    </div>
                  ))}
                  {(!selectedMeeting.topics || selectedMeeting.topics.length === 0) && (
                    <p className="text-sm text-gray-500">No hay temas definidos</p>
                  )}
                </div>

                {/* Action Items */}
                <h4 className="font-medium text-gray-700 mb-2">Compromisos y Acciones</h4>
                <div className="space-y-2">
                  {selectedMeeting.action_items?.map((action, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{action.description}</span>
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Asignado: {action.assigned_name}</span>
                        <span>Fecha límite: {action.due_date?.toDate?.().toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">
                        <Badge className={
                          action.status === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
                          action.status === 'EN_PROGRESO' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {action.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {(!selectedMeeting.action_items || selectedMeeting.action_items.length === 0) && (
                    <p className="text-sm text-gray-500">No hay compromisos registrados</p>
                  )}
                </div>

                {/* Decisions */}
                {selectedMeeting.decisions && selectedMeeting.decisions.length > 0 && (
                  <>
                    <h4 className="font-medium text-gray-700 mt-6 mb-2">Decisiones Tomadas</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedMeeting.decisions.map((decision, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{decision}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button onClick={() => setShowDetailModal(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
                Cerrar
              </Button>
              {selectedMeeting.status === 'PROGRAMADO' && (
                <>
                  <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                    Editar
                  </Button>
                  <Button className="flex-1 bg-green-600 text-white hover:bg-green-700">
                    Iniciar Reunión
                  </Button>
                </>
              )}
              {selectedMeeting.status === 'EN_CURSO' && (
                <Button className="flex-1 bg-purple-600 text-white hover:bg-purple-700">
                  Finalizar y Guardar Acta
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}