import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Users, 
  Plus, 
  Search,
  Play,
  Trophy,
  Clock,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface GameInfo {
  id: string;
  name: string;
  description: string;
  emoji: string;
  ageRange: string;
  skill: string;
  players: string;
  duration: string;
}

const GAMES_LIST: GameInfo[] = [
  {
    id: 'glosario',
    name: 'El Glosario de las Emociones',
    description: 'Explora escenarios y descubre palabras para expresar emociones',
    emoji: '📖',
    ageRange: '6-12 años',
    skill: 'Vocabulario emocional',
    players: '2-8',
    duration: '15-20 min'
  },
  {
    id: 'palitos',
    name: 'Los Palitos de las Emociones',
    description: 'Extrae palitos del montón sin mover los demás',
    emoji: '🥢',
    ageRange: '5-12 años',
    skill: 'Identificación emocional',
    players: '2-6',
    duration: '10-15 min'
  },
  {
    id: 'única',
    name: 'Soy una Persona Única',
    description: 'Descubre tus fortalezas y recibe reconocimiento',
    emoji: '🪞',
    ageRange: '6-12 años',
    skill: 'Autoconocimiento',
    players: '3-8',
    duration: '20-25 min'
  },
  {
    id: 'emojis',
    name: 'Jugando con Emojis',
    description: 'Recrea patrones de emojis para gestionar emociones',
    emoji: '😊',
    ageRange: '4-10 años',
    skill: 'Expresión emocional',
    players: '2-8',
    duration: '10-15 min'
  },
  {
    id: 'parejas',
    name: 'Las Parejas de las Emociones',
    description: 'Encuentra las parejas de emociones y estrategias',
    emoji: '🧩',
    ageRange: '5-10 años',
    skill: 'Memoria emocional',
    players: '2-6',
    duration: '10-15 min'
  },
  {
    id: 'antifaz',
    name: 'El Antifaz de los Superhéroes',
    description: 'Crea tu alter-ego resiliente con poderes especiales',
    emoji: '🦸‍♂️',
    ageRange: '4-9 años',
    skill: 'Autoeficacia',
    players: '1-8',
    duration: '15-20 min'
  },
  {
    id: 'rompecabezas',
    name: 'Rompecabezas con Frases',
    description: 'Forma frases motivacionales arrastrando palabras',
    emoji: '🧩',
    ageRange: '6-12 años',
    skill: 'Pensamiento positivo',
    players: '2-8',
    duration: '10-15 min'
  },
  {
    id: 'control',
    name: 'Yo Tengo el Control',
    description: 'Toma decisiones importantes en situaciones difíciles',
    emoji: '🎮',
    ageRange: '7-12 años',
    skill: 'Toma de decisiones',
    players: '3-8',
    duration: '20-30 min'
  },
  {
    id: 'guardianes',
    name: 'Guardianes de la Fortaleza',
    description: 'Defiende la fortaleza contra obstáculos emocionales',
    emoji: '🏰',
    ageRange: '4-12 años',
    skill: 'Resiliencia',
    players: '2-8',
    duration: '45-60 min'
  }
];

export default function GameLobby() {
  const [selectedGame, setSelectedGame] = useState<GameInfo | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [activeRooms, setActiveRooms] = useState<number>(0);

  useEffect(() => {
    // Simulate active rooms count
    setActiveRooms(Math.floor(Math.random() * 10) + 5);
  }, []);

  const handleCreateRoom = (game: GameInfo) => {
    if (!username.trim()) {
      toast.error('Ingresa tu nombre primero');
      return;
    }
    setSelectedGame(game);
    setShowCreateRoom(true);
  };

  const handleJoinRoom = () => {
    if (!username.trim()) {
      toast.error('Ingresa tu nombre primero');
      return;
    }
    if (!roomCode.trim()) {
      toast.error('Ingresa el código de la sala');
      return;
    }
    toast.success(`Uniéndose a sala ${roomCode}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Gamepad2 className="w-8 h-8 text-purple-600" />
                Juegos de Resiliencia
              </h1>
              <p className="text-gray-600 mt-1">9 juegos interactivos para aprender sobre emociones</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Salas activas</div>
                <div className="text-2xl font-bold text-purple-600">{activeRooms}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* User Input */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu nombre..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => setShowJoinRoom(true)}
                className="flex items-center gap-2 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50"
              >
                <Search className="w-5 h-5" />
                Unirse a Sala
              </button>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES_LIST.map((game) => (
            <div 
              key={game.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{game.emoji}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    {game.ageRange}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    <Users className="w-3 h-3" /> {game.players} jugadores
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    <Clock className="w-3 h-3" /> {game.duration}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    <Star className="w-3 h-3" /> {game.skill}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCreateRoom(game)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus className="w-5 h-5" />
                    Crear Sala
                  </button>
                  <button
                    onClick={() => setSelectedGame(game)}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Trophy className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Crear Sala</h2>
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedGame.emoji}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedGame.name}</h3>
                    <p className="text-sm text-gray-600">{selectedGame.players} jugadores</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <button
                  onClick={() => {
                    toast.success('¡Sala creada! Comparte el código con tus amigos.');
                    setShowCreateRoom(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Play className="w-5 h-5" />
                  Crear Sala de Juego
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Unirse a Sala</h2>
                <button
                  onClick={() => setShowJoinRoom(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Sala</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Ej: ABC123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 uppercase"
                  />
                </div>
                
                <button
                  onClick={handleJoinRoom}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Users className="w-5 h-5" />
                  Unirse a Sala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
