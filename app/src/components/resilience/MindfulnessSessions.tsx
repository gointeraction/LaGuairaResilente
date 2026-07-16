import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useResilienceStore } from '../../stores/resilienceStore';
import { Play, Pause, RotateCcw, Check, Wind, Brain, Eye, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const SESSIONS = [
  {
    id: 'breathing-5',
    type: 'BREATHING' as const,
    title: 'Respiración Profunda',
    description: '5 minutos para calmar la mente',
    duration: 5,
    icon: <Wind className="w-6 h-6" />,
    color: 'bg-primary-100 text-primary-600',
    steps: [
      { time: 0, instruction: 'Cierra los ojos y relaja los hombros' },
      { time: 10, instruction: 'Inhala por la nariz contando hasta 4' },
      { time: 14, instruction: 'Retén la respiración contando hasta 4' },
      { time: 18, instruction: 'Exhala lentamente contando hasta 6' },
      { time: 24, instruction: 'Repite el ciclo...' },
      { time: 60, instruction: 'Mantén un ritmo constante y suave' },
      { time: 120, instruction: 'Siente cómo el cuerpo se relaja' },
      { time: 180, instruction: 'Continúa con calma...' },
      { time: 240, instruction: 'Últimos 30 segundos, mantén la paz' },
      { time: 280, instruction: 'Abre los ojos lentamente' },
      { time: 300, instruction: '¡Sesión completada!' }
    ]
  },
  {
    id: 'body-scan-10',
    type: 'BODY_SCAN' as const,
    title: 'Escaneo Corporal',
    description: '10 minutos de relajación profunda',
    duration: 10,
    icon: <Body className="w-6 h-6" />,
    color: 'bg-green-100 text-green-600',
    steps: [
      { time: 0, instruction: 'Acuéstate o siéntate cómodamente' },
      { time: 15, instruction: 'Comienza por los pies, nota las sensaciones' },
      { time: 60, instruction: 'Sube a las pantorrillas y rodillas' },
      { time: 120, instruction: 'Relaja los muslos y caderas' },
      { time: 180, instruction: 'Siente el abdomen y el pecho' },
      { time: 240, instruction: 'Relaja los hombros y brazos' },
      { time: 300, instruction: 'Suelta la tensión del cuello' },
      { time: 360, instruction: 'Relaja la mandíbula y mejillas' },
      { time: 420, instruction: 'Siente la calma en toda la cabeza' },
      { time: 480, instruction: 'Mantén esta sensación de paz' },
      { time: 540, instruction: 'Vuelve a respirar normalmente' },
      { time: 600, instruction: '¡Sesión completada!' }
    ]
  },
  {
    id: 'visualization-7',
    type: 'GUIDED_VISUALIZATION' as const,
    title: 'Visualización Guiada',
    description: '7 minutos para encontrar paz interior',
    duration: 7,
    icon: <Eye className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-600',
    steps: [
      { time: 0, instruction: 'Cierra los ojos y respira profundamente' },
      { time: 20, instruction: 'Imagina un lugar seguro y tranquilo...' },
      { time: 60, instruction: 'Puede ser una playa, un bosque o un jardín' },
      { time: 120, instruction: 'Observa los colores y formas a tu alrededor' },
      { time: 180, instruction: 'Escucha los sonidos de la naturaleza' },
      { time: 240, instruction: 'Siente la brisa en tu piel' },
      { time: 300, instruction: 'Respira el aire fresco y puro' },
      { time: 360, instruction: 'Este lugar es solo tuyo, siempre disponible' },
      { time: 420, instruction: 'Absorbe toda la paz y tranquilidad' },
      { time: 400, instruction: 'Cuando estés listo, regresa lentamente' },
      { time: 420, instruction: '¡Sesión completada!' }
    ]
  },
  {
    id: 'gratitude-5',
    type: 'MEDITATION' as const,
    title: 'Meditación de Gratitud',
    description: '5 minutos para cultivar la gratitud',
    duration: 5,
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-pink-100 text-pink-600',
    steps: [
      { time: 0, instruction: 'Cierra los ojos y coloca una mano en el pecho' },
      { time: 15, instruction: 'Piensa en algo por lo que estés agradecido' },
      { time: 45, instruction: 'Siente la calidez de la gratitud en tu corazón' },
      { time: 90, instruction: 'Piensa en alguien que te haya ayudado' },
      { time: 135, instruction: 'Envía un agradecimiento silencioso' },
      { time: 180, instruction: 'Piensa en una挑战 que te hizo crecer' },
      { time: 225, instruction: 'Agradece la fortaleza que encontraste' },
      { time: 270, instruction: 'Mantén esta sensación de gratitud' },
      { time: 300, instruction: '¡Sesión completada!' }
    ]
  }
];

function Body(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v6M8 10h8M9 17l-2 5M15 17l2 5M12 13v4" />
    </svg>
  );
}

export default function MindfulnessSessions() {
  const { user } = useAuthStore();
  const { saveMindfulnessSession, mindfulnessHistory, totalMindfulnessMinutes } = useResilienceStore();
  const [selectedSession, setSelectedSession] = useState<typeof SESSIONS[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedSession) {
      const instruction = selectedSession.steps
        .filter(s => s.time <= currentTime)
        .pop()?.instruction || '';
      setCurrentInstruction(instruction);
    }
  }, [currentTime, selectedSession]);

  const handlePlay = () => {
    if (!selectedSession) return;
    
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= selectedSession.duration * 60) {
          handleComplete();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleReset = () => {
    handlePause();
    setCurrentTime(0);
    setCurrentInstruction('');
    setCompleted(false);
  };

  const handleComplete = async () => {
    handlePause();
    setCompleted(true);
    
    if (user && selectedSession) {
      try {
        await saveMindfulnessSession({
          user_id: user.uid,
          session_type: selectedSession.type,
          duration_minutes: selectedSession.duration,
          completed: true
        });
        toast.success(`¡Sesión completada! +${selectedSession.duration >= 10 ? 15 : 10} puntos`);
      } catch (error) {
        toast.error('Error al guardar');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!selectedSession) return 0;
    return (currentTime / (selectedSession.duration * 60)) * 100;
  };

  if (selectedSession) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${selectedSession.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {selectedSession.icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{selectedSession.title}</h3>
          <p className="text-gray-600">{selectedSession.description}</p>
        </div>

        {/* Timer */}
        <div className="card text-center py-8">
          <div className="text-6xl font-mono text-gray-800 mb-4">
            {formatTime(currentTime)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full mb-6">
            <div 
              className="h-3 bg-primary-500 rounded-full transition-all duration-1000"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Instruction */}
          <div className="bg-primary-50 rounded-lg p-4 mb-6 min-h-[80px]">
            <p className="text-lg text-primary-800">{currentInstruction}</p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            
            {!completed ? (
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="p-4 rounded-full bg-primary-600 hover:bg-primary-700 text-white"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedSession(null);
                  handleReset();
                }}
                className="p-4 rounded-full bg-success-600 hover:bg-success-700 text-white"
              >
                <Check className="w-8 h-8" />
              </button>
            )}
          </div>

          {completed && (
            <p className="mt-4 text-success-600 font-semibold">
              ¡Sesión completada! Has ganado puntos de resiliencia.
            </p>
          )}
        </div>

        <button
          onClick={() => {
            handleReset();
            setSelectedSession(null);
          }}
          className="w-full mt-4 text-center text-gray-600 hover:text-gray-800"
        >
          ← Volver a sesiones
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          <Brain className="w-6 h-6 inline-block mr-2" />
          Sesiones de Mindfulness
        </h3>
        <p className="text-gray-600">
          Practica la atención plena para fortalecer tu resiliencia.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{mindfulnessHistory.length}</p>
          <p className="text-sm text-gray-500">Sesiones Completadas</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-success-600">{totalMindfulnessMinutes}</p>
          <p className="text-sm text-gray-500">Minutos Totales</p>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SESSIONS.map((session) => (
          <button
            key={session.id}
            onClick={() => setSelectedSession(session)}
            className="card text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${session.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                {session.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{session.title}</h4>
                <p className="text-sm text-gray-500">{session.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {session.duration} min
                  </span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    +{session.duration >= 10 ? 15 : 10} pts
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Sessions */}
      {mindfulnessHistory.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-gray-800 mb-4">Sesiones Recientes</h4>
          <div className="space-y-2">
            {mindfulnessHistory.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success-500" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {SESSIONS.find(s => s.type === session.session_type)?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-primary-600 font-medium">+{session.points_earned} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
