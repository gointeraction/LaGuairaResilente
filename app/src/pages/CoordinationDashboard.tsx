import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  CoordinationEvent,
  Meeting,
  Shelter,
  CoordinationStats,
  shelterService,
  eventService,
  meetingService
} from '../services/coordination';

type TabId = 'overview' | 'shelters' | 'events' | 'meetings' | 'calendar';

export default function CoordinationDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [stats, setStats] = useState<CoordinationStats | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [events, setEvents] = useState<CoordinationEvent[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, sheltersData, eventsData, meetingsData] = await Promise.all([
        shelterService.getShelterStats(),
        shelterService.getShelters(),
        eventService.getEvents(),
        meetingService.getMeetings()
      ]);

      setStats(statsData);
      setShelters(sheltersData);
      setEvents(eventsData.slice(0, 20));
      setMeetings(meetingsData.slice(0, 20));
    } catch (error) {
      console.error('Error loading coordination data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'CHARLA': '🎤 Charla',
      'REUNION': '👥 Reunión',
      'TALLER': '🛠️ Taller',
      'CAPACITACION': '📚 Capacitación',
      'EMERGENCIA': '🚨 Emergencia',
      'SOCIAL': '🎉 Social'
    };
    return labels[type] || type;
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

  const getOccupancyColor = (percent: number) => {
    if (percent >= 90) return 'text-red-600';
    if (percent >= 70) return 'text-orange-600';
    if (percent >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUpcomingEvents = () => {
    return events
      .filter(e => e.status === 'PROGRAMADO')
      .sort((a, b) => {
        const dateA = a.date?.toDate?.() || new Date(a.date);
        const dateB = b.date?.toDate?.() || new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  };

  const getUpcomingMeetings = () => {
    return meetings
      .filter(m => m.status === 'PROGRAMADO')
      .sort((a, b) => {
        const dateA = a.date?.toDate?.() || new Date(a.date);
        const dateB = b.date?.toDate?.() || new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Centro de Coordinación</h1>
              <p className="text-blue-100 mt-1">Gestión táctica de albergues, charlas y eventos</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateEvent(true)}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                + Nuevo Evento
              </Button>
              <Button
                onClick={() => setShowCreateMeeting(true)}
                className="bg-blue-500 text-white hover:bg-blue-400 border border-blue-400"
              >
                + Nueva Reunión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats?.active_shelters || 0}</div>
              <div className="text-sm text-gray-600">Albergues Activos</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats?.total_occupancy || 0}</div>
              <div className="text-sm text-gray-600">Personas Albergadas</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats?.upcoming_events || 0}</div>
              <div className="text-sm text-gray-600">Próximos Eventos</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats?.pending_meetings || 0}</div>
              <div className="text-sm text-gray-600">Reuniones Pendientes</div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b overflow-x-auto" data-tutorial-id="coordination-camps">
          {([
            { id: 'overview', label: '📊 Vista General' },
            { id: 'shelters', label: '🏠 Albergues' },
            { id: 'events', label: '🎤 Charlas & Eventos' },
            { id: 'meetings', label: '👥 Reuniones' },
            { id: 'calendar', label: '📅 Calendario' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Shelter Occupancy */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Ocupación de Albergues</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {shelters.slice(0, 4).map(shelter => {
                    const occupancyPercent = Math.round((shelter.current_occupancy / shelter.capacity) * 100);
                    return (
                      <div 
                        key={shelter.id} 
                        className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-shadow"
                        onClick={() => setActiveTab('shelters')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{shelter.name}</span>
                          <span className={`text-sm font-bold ${getOccupancyColor(occupancyPercent)}`}>
                            {occupancyPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className={`h-3 rounded-full ${
                              occupancyPercent >= 90 ? 'bg-red-500' :
                              occupancyPercent >= 70 ? 'bg-orange-500' :
                              occupancyPercent >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${occupancyPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{shelter.current_occupancy}/{shelter.capacity} personas</span>
                          <span>{shelter.municipality}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Events */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Próximos Eventos</h3>
                    <button 
                      onClick={() => setActiveTab('events')}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Ver todos →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {getUpcomingEvents().map(event => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                          {event.type === 'CHARLA' ? '🎤' :
                           event.type === 'TALLER' ? '🛠️' :
                           event.type === 'CAPACITACION' ? '📚' : '📅'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-600">{event.shelter_name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {event.date?.toDate?.().toLocaleDateString()} | {event.start_time} - {event.end_time}
                          </div>
                        </div>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </div>
                    ))}
                    {getUpcomingEvents().length === 0 && (
                      <p className="text-gray-500 text-center py-4">No hay eventos programados</p>
                    )}
                  </div>
                </Card>

                {/* Upcoming Meetings */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Próximas Reuniones</h3>
                    <button 
                      onClick={() => setActiveTab('meetings')}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Ver todas →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {getUpcomingMeetings().map(meeting => (
                      <div key={meeting.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                          {meeting.type === 'ORDINARIA' ? '📋' :
                           meeting.type === 'EXTRAORDINARIA' ? '⚡' :
                           meeting.type === 'EMERGENCIA' ? '🚨' : '👥'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-sm text-gray-600">{meeting.shelter_name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {meeting.date?.toDate?.().toLocaleDateString()} | {meeting.start_time} - {meeting.end_time}
                          </div>
                        </div>
                        <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                      </div>
                    ))}
                    {getUpcomingMeetings().length === 0 && (
                      <p className="text-gray-500 text-center py-4">No hay reuniones programadas</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white">
                <h3 className="text-lg font-bold mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => navigate('/coordination/shelters')}
                    className="p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">🏠</div>
                    <div className="text-sm font-medium">Gestionar Albergues</div>
                  </button>
                  <button 
                    onClick={() => navigate('/coordination/events')}
                    className="p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">🎤</div>
                    <div className="text-sm font-medium">Crear Charla</div>
                  </button>
                  <button 
                    onClick={() => navigate('/coordination/meetings')}
                    className="p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm font-medium">Programar Reunión</div>
                  </button>
                  <button 
                    onClick={() => navigate('/coordination/reports')}
                    className="p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium">Ver Reportes</div>
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* SHELTERS TAB */}
          {activeTab === 'shelters' && (
            <motion.div
              key="shelters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Albergues de La Guaira</h3>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    + Agregar Albergue
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shelters.map(shelter => {
                    const occupancyPercent = Math.round((shelter.current_occupancy / shelter.capacity) * 100);
                    return (
                      <motion.div
                        key={shelter.id}
                        whileHover={{ scale: 1.02 }}
                        className="border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                            🏠
                          </div>
                          <Badge className={shelter.status === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {shelter.status}
                          </Badge>
                        </div>

                        <h4 className="text-lg font-bold mb-2">{shelter.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{shelter.address}</p>
                        <p className="text-sm text-gray-500 mb-4">{shelter.municipality}</p>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Ocupación</span>
                            <span className={`font-bold ${getOccupancyColor(occupancyPercent)}`}>
                              {occupancyPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${
                                occupancyPercent >= 90 ? 'bg-red-500' :
                                occupancyPercent >= 70 ? 'bg-orange-500' :
                                occupancyPercent >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{shelter.current_occupancy} personas</span>
                            <span>Capacidad: {shelter.capacity}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>👤</span>
                          <span>Coordinador: {shelter.coordinator_name}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {shelter.amenities?.slice(0, 3).map((amenity, idx) => (
                            <Badge key={idx} className="bg-gray-100 text-gray-700 text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {shelter.amenities?.length > 3 && (
                            <Badge className="bg-gray-100 text-gray-700 text-xs">
                              +{shelter.amenities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Charlas y Eventos</h3>
                  <Button 
                    onClick={() => setShowCreateEvent(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    + Crear Evento
                  </Button>
                </div>

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
                        <th className="text-left py-3 px-4">Estado</th>
                        <th className="text-left py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(event => (
                        <tr key={event.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-blue-100 text-blue-800">{getEventTypeLabel(event.type)}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">{event.shelter_name}</td>
                          <td className="py-3 px-4 text-sm">
                            {event.date?.toDate?.().toLocaleDateString() || '-'}
                          </td>
                          <td className="py-3 px-4 text-sm">{event.start_time} - {event.end_time}</td>
                          <td className="py-3 px-4 text-sm">
                            {event.attendees_count}/{event.max_attendees}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-700 text-sm">Editar</button>
                              <button className="text-green-600 hover:text-green-700 text-sm">Iniciar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* MEETINGS TAB */}
          {activeTab === 'meetings' && (
            <motion.div
              key="meetings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Reuniones de Coordinación</h3>
                  <Button 
                    onClick={() => setShowCreateMeeting(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    + Nueva Reunión
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {meetings.map(meeting => (
                    <motion.div
                      key={meeting.id}
                      whileHover={{ scale: 1.01 }}
                      className="border rounded-xl p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={
                          meeting.type === 'ORDINARIA' ? 'bg-blue-100 text-blue-800' :
                          meeting.type === 'EXTRAORDINARIA' ? 'bg-orange-100 text-orange-800' :
                          meeting.type === 'EMERGENCIA' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }>
                          {meeting.type}
                        </Badge>
                        <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                      </div>

                      <h4 className="text-lg font-bold mb-2">{meeting.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <span>🏠</span>
                          <span>{meeting.shelter_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{meeting.date?.toDate?.().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🕐</span>
                          <span>{meeting.start_time} - {meeting.end_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{meeting.participants?.length || 0} participantes</span>
                        </div>
                      </div>

                      {meeting.topics && meeting.topics.length > 0 && (
                        <div className="border-t pt-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">Temas:</div>
                          <div className="flex flex-wrap gap-1">
                            {meeting.topics.slice(0, 3).map((topic, idx) => (
                              <Badge key={idx} className="bg-gray-100 text-gray-700 text-xs">
                                {topic.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                          Ver Detalles
                        </Button>
                        {meeting.status === 'PROGRAMADO' && (
                          <Button className="bg-green-600 hover:bg-green-700 text-white text-sm">
                            Iniciar
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Calendario de Coordinación</h3>
                
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date();
                    date.setDate(1);
                    date.setDate(date.getDate() + i - date.getDay());
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayEvents = events.filter(e => {
                      const eventDate = e.date?.toDate?.();
                      return eventDate?.toDateString() === date.toDateString();
                    });
                    
                    return (
                      <div 
                        key={i} 
                        className={`min-h-[80px] p-2 border rounded ${
                          isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                          {date.getDate()}
                        </div>
                        {dayEvents.slice(0, 2).map(event => (
                          <div 
                            key={event.id} 
                            className="text-xs bg-blue-100 text-blue-700 rounded px-1 py-0.5 mt-1 truncate"
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 mt-1">+{dayEvents.length - 2} más</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Crear Nuevo Evento</h3>
              <button onClick={() => setShowCreateEvent(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Evento</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Ej: Charla sobre Seguridad" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option value="CHARLA">🎤 Charla</option>
                    <option value="TALLER">🛠️ Taller</option>
                    <option value="CAPACITACION">📚 Capacitación</option>
                    <option value="SOCIAL">🎉 Social</option>
                    <option value="EMERGENCIA">🚨 Emergencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Albergue</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    {shelters.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
                  <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
                  <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea className="w-full px-4 py-2 border rounded-lg h-24" placeholder="Describe el evento..."></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Máximo Asistentes</label>
                  <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Salón principal" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowCreateEvent(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
                Cancelar
              </Button>
              <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                Crear Evento
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Meeting Modal */}
      {showCreateMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Crear Nueva Reunión</h3>
              <button onClick={() => setShowCreateMeeting(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Reunión</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Ej: Reunión de Coordinación Semanal" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option value="ORDINARIA">📋 Ordinaria</option>
                    <option value="EXTRAORDINARIA">⚡ Extraordinaria</option>
                    <option value="SEGUIMIENTO">🔄 Seguimiento</option>
                    <option value="EMERGENCIA">🚨 Emergencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Albergue</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    {shelters.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
                  <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
                  <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea className="w-full px-4 py-2 border rounded-lg h-24" placeholder="Describe el propósito de la reunión..."></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participantes</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Agregar participantes..." />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowCreateMeeting(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
                Cancelar
              </Button>
              <Button className="flex-1 bg-purple-600 text-white hover:bg-purple-700">
                Crear Reunión
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}