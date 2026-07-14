import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  CoordinationEvent,
  eventService,
  shelterService,
  Shelter
} from '../services/coordination';

type ViewMode = 'list' | 'grid' | 'calendar';
type EventTypeFilter = 'ALL' | 'CHARLA' | 'TALLER' | 'CAPACITACION' | 'SOCIAL' | 'EMERGENCIA';

export default function EventsManagement() {
  const [events, setEvents] = useState<CoordinationEvent[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<EventTypeFilter>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CoordinationEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, sheltersData] = await Promise.all([
        eventService.getEvents(),
        shelterService.getShelters()
      ]);
      setEvents(eventsData);
      setShelters(sheltersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'CHARLA': '🎤 Charla',
      'TALLER': '🛠️ Taller',
      'CAPACITACION': '📚 Capacitación',
      'SOCIAL': '🎉 Social',
      'EMERGENCIA': '🚨 Emergencia',
      'REUNION': '👥 Reunión'
    };
    return labels[type] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'CHARLA': 'bg-blue-100 text-blue-800',
      'TALLER': 'bg-green-100 text-green-800',
      'CAPACITACION': 'bg-purple-100 text-purple-800',
      'SOCIAL': 'bg-pink-100 text-pink-800',
      'EMERGENCIA': 'bg-red-100 text-red-800',
      'REUNION': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PROGRAMADO': 'bg-blue-100 text-blue-800',
      'EN_CURSO': 'bg-green-100 text-green-800',
      'FINALIZADO': 'bg-gray-100 text-gray-800',
      'CANCELADO': 'bg-red-100 text-red-800',
      'POSPUESTO': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'ALL' || event.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || event.status === filterStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const openEventDetail = (event: CoordinationEvent) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
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
      <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión de Charlas y Eventos</h1>
              <p className="text-green-100 mt-1">Organiza y administra eventos en albergues</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-green-600 hover:bg-green-50"
            >
              + Crear Evento
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
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as EventTypeFilter)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="CHARLA">🎤 Charlas</option>
              <option value="TALLER">🛠️ Talleres</option>
              <option value="CAPACITACION">📚 Capacitaciones</option>
              <option value="SOCIAL">🎉 Sociales</option>
              <option value="EMERGENCIA">🚨 Emergencias</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="ALL">Todos los estados</option>
              <option value="PROGRAMADO">Programados</option>
              <option value="EN_CURSO">En Curso</option>
              <option value="FINALIZADO">Finalizados</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                📱
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{events.length}</div>
            <div className="text-sm text-gray-600">Total Eventos</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.type === 'CHARLA').length}
            </div>
            <div className="text-sm text-gray-600">Charlas</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {events.filter(e => e.type === 'TALLER').length}
            </div>
            <div className="text-sm text-gray-600">Talleres</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {events.filter(e => e.status === 'PROGRAMADO').length}
            </div>
            <div className="text-sm text-gray-600">Programados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.status === 'EN_CURSO').length}
            </div>
            <div className="text-sm text-gray-600">En Curso</div>
          </Card>
        </div>

        {/* Events Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => openEventDetail(event)}
              >
                <div className={`h-2 ${
                  event.type === 'CHARLA' ? 'bg-blue-500' :
                  event.type === 'TALLER' ? 'bg-green-500' :
                  event.type === 'CAPACITACION' ? 'bg-purple-500' :
                  event.type === 'SOCIAL' ? 'bg-pink-500' :
                  'bg-red-500'
                }`} />
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getEventTypeColor(event.type)}>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>🏠</span>
                      <span>{event.shelter_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{event.date?.toDate?.().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span>{event.start_time} - {event.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>{event.attendees_count || 0}/{event.max_attendees} asistentes</span>
                    </div>
                  </div>

                  {event.speakers && event.speakers.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm font-medium text-gray-700 mb-2">Ponentes:</div>
                      <div className="flex flex-wrap gap-1">
                        {event.speakers.slice(0, 2).map((speaker, idx) => (
                          <Badge key={idx} className="bg-gray-100 text-gray-700 text-xs">
                            {speaker.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                      Ver Detalles
                    </Button>
                    {event.status === 'PROGRAMADO' && (
                      <Button className="bg-green-600 hover:bg-green-700 text-white text-sm">
                        Iniciar
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4">Evento</th>
                    <th className="text-left py-3 px-4">Tipo</th>
                    <th className="text-left py-3 px-4">Albergue</th>
                    <th className="text-left py-3 px-4">Fecha</th>
                    <th className="text-left py-3 px-4">Hora</th>
                    <th className="text-left py-3 px-4">Asistentes</th>
                    <th className="text-left py-3 px-4">Ponentes</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map(event => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getEventTypeColor(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{event.shelter_name}</td>
                      <td className="py-3 px-4 text-sm">
                        {event.date?.toDate?.().toLocaleDateString() || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">{event.start_time} - {event.end_time}</td>
                      <td className="py-3 px-4 text-sm">
                        {event.attendees_count || 0}/{event.max_attendees}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {event.speakers?.slice(0, 2).map((speaker, idx) => (
                            <Badge key={idx} className="bg-gray-100 text-gray-700 text-xs">
                              {speaker.name}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEventDetail(event)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            Ver
                          </button>
                          <button className="text-green-600 hover:text-green-700 text-sm">Editar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filteredEvents.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay eventos</h3>
            <p className="text-gray-600">No se encontraron eventos con los filtros seleccionados</p>
          </Card>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Crear Nuevo Evento</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Evento *</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Ej: Charla sobre Primeros Auxilios" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento *</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option value="CHARLA">🎤 Charla</option>
                    <option value="TALLER">🛠️ Taller</option>
                    <option value="CAPACITACION">📚 Capacitación</option>
                    <option value="SOCIAL">🎉 Social</option>
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
                <textarea className="w-full px-4 py-2 border rounded-lg h-24" placeholder="Describe el evento, sus objetivos y qué aprenderán los asistentes..."></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Máximo Asistentes</label>
                  <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Salón principal, Patio, etc." />
                </div>
              </div>

              {/* Speakers Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Ponentes</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" className="px-3 py-2 border rounded-lg" placeholder="Nombre" />
                    <input type="text" className="px-3 py-2 border rounded-lg" placeholder="Tema" />
                    <input type="text" className="px-3 py-2 border rounded-lg" placeholder="Contacto" />
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">+ Agregar otro ponente</button>
                </div>
              </div>

              {/* Agenda Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Agenda</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-3">
                    <input type="time" className="px-3 py-2 border rounded-lg" />
                    <input type="text" className="col-span-2 px-3 py-2 border rounded-lg" placeholder="Actividad" />
                    <input type="number" className="px-3 py-2 border rounded-lg" placeholder="Min" />
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">+ Agregar punto a agenda</button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowCreateModal(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
                Cancelar
              </Button>
              <Button className="flex-1 bg-green-600 text-white hover:bg-green-700">
                Crear Evento
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getEventTypeColor(selectedEvent.type)}>
                    {getEventTypeLabel(selectedEvent.type)}
                  </Badge>
                  <Badge className={getStatusColor(selectedEvent.status)}>
                    {selectedEvent.status}
                  </Badge>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Información General</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>🏠</span>
                    <span>{selectedEvent.shelter_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{selectedEvent.date?.toDate?.().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>{selectedEvent.start_time} - {selectedEvent.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{selectedEvent.location || 'No especificada'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>{selectedEvent.attendees_count || 0}/{selectedEvent.max_attendees} asistentes</span>
                  </div>
                </div>

                <h4 className="font-medium text-gray-700 mt-6 mb-2">Descripción</h4>
                <p className="text-sm text-gray-600">{selectedEvent.description}</p>
              </div>

              <div>
                {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                  <>
                    <h4 className="font-medium text-gray-700 mb-2">Ponentes</h4>
                    <div className="space-y-2 mb-6">
                      {selectedEvent.speakers.map((speaker, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium">{speaker.name}</div>
                          <div className="text-sm text-gray-600">{speaker.topic}</div>
                          <div className="text-xs text-gray-400">{speaker.contact}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedEvent.agenda && selectedEvent.agenda.length > 0 && (
                  <>
                    <h4 className="font-medium text-gray-700 mb-2">Agenda</h4>
                    <div className="space-y-2">
                      {selectedEvent.agenda.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                          <div className="text-sm font-medium text-blue-600">{item.time}</div>
                          <div>
                            <div className="text-sm font-medium">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.duration_minutes} min - {item.speaker}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button onClick={() => setShowDetailModal(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
                Cerrar
              </Button>
              {selectedEvent.status === 'PROGRAMADO' && (
                <>
                  <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                    Editar
                  </Button>
                  <Button className="flex-1 bg-green-600 text-white hover:bg-green-700">
                    Iniciar Evento
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}