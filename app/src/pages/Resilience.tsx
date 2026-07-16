import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useResilienceStore } from '../stores/resilienceStore';
import { 
  ArrowLeft, 
  Palette, 
  Gift, 
  BookOpen, 
  Brain, 
  Target, 
  ClipboardCheck,
  Award,
  TrendingUp,
  Flame,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmotionalCanvas from '../components/resilience/EmotionalCanvas';
import MyGiftsQuiz from '../components/resilience/MyGiftsQuiz';
import DailyJournal from '../components/resilience/DailyJournal';
import MindfulnessSessions from '../components/resilience/MindfulnessSessions';
import ActionPlanBuilder from '../components/resilience/ActionPlanBuilder';
import APAAssessment from '../components/resilience/APAAssessment';

type ActivityView = 'menu' | 'emotional-canvas' | 'my-gifts' | 'journal' | 'mindfulness' | 'action-plan' | 'apa-assessment';

const ACTIVITIES = [
  {
    id: 'emotional-canvas' as const,
    title: 'Claridad Emocional',
    description: 'Explora tus sentimientos a través del color y las formas',
    icon: <Palette className="w-6 h-6" />,
    color: 'bg-pink-100 text-pink-600',
    points: 15
  },
  {
    id: 'my-gifts' as const,
    title: 'Mis Dones y Talentos',
    description: 'Descubre y celebra tus cualidades positivas',
    icon: <Gift className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-600',
    points: 20
  },
  {
    id: 'journal' as const,
    title: 'Diario de Reflexión',
    description: 'Reflexiona sobre tu día y cultiva la gratitud',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-primary-100 text-primary-600',
    points: 10
  },
  {
    id: 'mindfulness' as const,
    title: 'Sesiones de Mindfulness',
    description: 'Practica la atención plena con sesiones guiadas',
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-green-100 text-green-600',
    points: 10
  },
  {
    id: 'action-plan' as const,
    title: 'Plan de Acción',
    description: 'Define metas alcanzables y divide en pasos',
    icon: <Target className="w-6 h-6" />,
    color: 'bg-orange-100 text-orange-600',
    points: 5
  },
  {
    id: 'apa-assessment' as const,
    title: 'Evaluación APA',
    description: 'Mide tu resiliencia según los 10 principios',
    icon: <ClipboardCheck className="w-6 h-6" />,
    color: 'bg-cyan-100 text-cyan-600',
    points: 25
  }
];

export default function Resilience() {
  const { user } = useAuthStore();
  const { 
    totalPoints, 
    currentStreak, 
    weeklyStats, 
    loadAllData, 
    loading 
  } = useResilienceStore();
  const [currentView, setCurrentView] = useState<ActivityView>('menu');

  useEffect(() => {
    if (user) {
      loadAllData(user.uid);
    }
  }, [user, loadAllData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderActivity = () => {
    switch (currentView) {
      case 'emotional-canvas':
        return <EmotionalCanvas />;
      case 'my-gifts':
        return <MyGiftsQuiz />;
      case 'journal':
        return <DailyJournal />;
      case 'mindfulness':
        return <MindfulnessSessions />;
      case 'action-plan':
        return <ActionPlanBuilder />;
      case 'apa-assessment':
        return <APAAssessment />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {currentView !== 'menu' ? (
              <button 
                onClick={() => setCurrentView('menu')}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <h1 className="text-2xl font-bold text-primary-900">
              {currentView === 'menu' ? 'Centro de Resiliencia' : ACTIVITIES.find(a => a.id === currentView)?.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'menu' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-tutorial-id="resilience-points">
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{totalPoints}</p>
                    <p className="text-sm text-gray-500">Puntos Totales</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                    <Flame className="w-6 h-6 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{currentStreak}</p>
                    <p className="text-sm text-gray-500">Días Seguidos</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{weeklyStats.activityCount}</p>
                    <p className="text-sm text-gray-500">Actividades/Semana</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-info-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-info-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{weeklyStats.totalPoints}</p>
                    <p className="text-sm text-gray-500">Puntos/Semana</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities Grid */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Actividades de Resiliencia</h2>
              <p className="text-gray-600 mb-6">
                Completa estas actividades para fortalecer tu resiliencia y ganar puntos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-tutorial-id="resilience-activities">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => setCurrentView(activity.id)}
                    className="card text-left hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 ${activity.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                        <div className="mt-3">
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                            +{activity.points} puntos
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <h3 className="font-bold text-lg mb-3">💡 Consejos de Resiliencia</h3>
              <ul className="space-y-2 text-primary-100">
                <li>• La resiliencia es una habilidad que se puede aprender y desarrollar</li>
                <li>• No se trata de no sentir dificultades, sino de poder superarlas</li>
                <li>• Cada pequeño paso cuenta para construir tu fortaleza interior</li>
                <li>• La práctica regular es la clave del éxito</li>
              </ul>
            </div>
          </>
        ) : (
          renderActivity()
        )}
      </main>
    </div>
  );
}
