import { useState } from 'react';
import { HelpCircle, X, Play, RotateCcw } from 'lucide-react';
import { useTutorial, usePageTutorial } from './TutorialProvider';
import type { TutorialTour } from '../../services/tutorial';

const TOUR_LIST: { tour: TutorialTour; label: string; description: string; icon: string }[] = [
  { tour: 'welcome', label: 'Bienvenida General', description: 'Conoce la plataforma completa', icon: '👋' },
  { tour: 'dashboard', label: 'Dashboard', description: 'Tu panel de control', icon: '📊' },
  { tour: 'courses', label: 'Aula Resiliente', description: 'Cursos y tracks', icon: '📚' },
  { tour: 'resilience', label: 'Centro de Resiliencia', description: 'Actividades emocionales', icon: '🧠' },
  { tour: 'leaderboard', label: 'Tabla de Líderes', description: 'Ranking y competencia', icon: '🏆' },
  { tour: 'coordination', label: 'Coordinación', description: 'Campamentos y logística', icon: '🤝' },
  { tour: 'admin', label: 'Administración', description: 'Panel admin', icon: '⚙️' },
];

export default function TutorialButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { start, reset, hasSeen } = useTutorial();
  const { startPageTour, availableTour } = usePageTutorial();

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        title="Ayuda y Tutoriales"
      >
        <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] overflow-hidden animate-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Centro de Ayuda</h3>
                  <p className="text-primary-100 text-sm">Tutoriales de la plataforma</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Page tour shortcut */}
            {availableTour && (
              <div className="px-6 py-3 bg-primary-50 border-b border-primary-100">
                <button
                  onClick={() => {
                    startPageTour();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 text-left hover:bg-primary-100 rounded-lg p-2 transition-colors"
                >
                  <Play className="w-4 h-4 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-primary-800">Tutorial de esta página</p>
                    <p className="text-xs text-primary-600">Ver guía de la sección actual</p>
                  </div>
                </button>
              </div>
            )}

            {/* Tour list */}
            <div className="overflow-y-auto max-h-[50vh] p-4 space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-3">
                Todos los tutoriales
              </p>
              {TOUR_LIST.map(({ tour, label, description, icon }) => (
                <button
                  key={tour}
                  onClick={() => {
                    start(tour);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                >
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-primary-700 transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{description}</p>
                  </div>
                  <Play className="w-4 h-4 text-gray-400 group-hover:text-primary-600 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-3">
              <button
                onClick={() => {
                  reset();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors py-2"
              >
                <RotateCcw className="w-4 h-4" />
                {hasSeen ? 'Ver tutorial de bienvenida de nuevo' : 'Reiniciar tutoriales'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
