import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useResilienceStore } from '../../stores/resilienceStore';
import { BookOpen, Check, Smile, Frown, Meh, Star, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const DAILY_PROMPTS = [
  "¿Qué te hizo sonreír hoy?",
  "¿Cuál fue el mayor desafío que enfrentaste y cómo lo superaste?",
  "¿Qué algo bueno pasó hoy que a veces pasas por alto?",
  "¿Quién te ayudó hoy y cómo puedes agradecerle?",
  "¿Qué aprendiste de una situación difícil reciente?",
  "¿Qué hiciste hoy que te enorgullece?",
  "¿Cómo cuidaste de ti mismo hoy?",
  "¿Qué persona o situación te dio esperanza hoy?",
  "¿Qué pequeño acto de bondad realizaste o recibiste?",
  "¿Qué cambiarías de hoy si pudieras? ¿Qué aprendiste de ello?"
];

const MOOD_OPTIONS = [
  { value: 1, label: 'Muy Mal', icon: <Frown className="w-6 h-6" />, color: 'text-red-500' },
  { value: 2, label: 'Mal', icon: <Meh className="w-6 h-6" />, color: 'text-orange-500' },
  { value: 3, label: 'Normal', icon: <Meh className="w-6 h-6" />, color: 'text-yellow-500' },
  { value: 4, label: 'Bien', icon: <Smile className="w-6 h-6" />, color: 'text-green-500' },
  { value: 5, label: 'Muy Bien', icon: <Smile className="w-6 h-6" />, color: 'text-emerald-500' }
];

const GRATITUDE_PROMPTS = [
  "Una persona",
  "Un lugar",
  "Una experiencia",
  "Un objeto",
  "Una habilidad",
  "Un recuerdo"
];

export default function DailyJournal() {
  const { user } = useAuthStore();
  const { saveJournalEntry, todayJournal } = useResilienceStore();
  const [prompt] = useState(DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)]);
  const [response, setResponse] = useState('');
  const [moodBefore, setMoodBefore] = useState<number>(3);
  const [moodAfter, setMoodAfter] = useState<number>(3);
  const [gratitude, setGratitude] = useState<string[]>(['', '', '']);
  const [step, setStep] = useState<'mood' | 'journal' | 'gratitude' | 'complete'>('mood');
  const [saving, setSaving] = useState(false);

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitude = [...gratitude];
    newGratitude[index] = value;
    setGratitude(newGratitude);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!response.trim()) {
      toast.error('Escribe tu respuesta');
      return;
    }

    setSaving(true);
    try {
      await saveJournalEntry({
        user_id: user.uid,
        prompt,
        response: response.trim(),
        mood_before: moodBefore,
        mood_after: moodAfter,
        gratitude: gratitude.filter(g => g.trim())
      });
      
      setStep('complete');
      toast.success('¡Diario guardado! +10 puntos');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (todayJournal) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">¡Ya escribiste hoy!</h3>
              <p className="text-sm text-gray-500">Vuelve mañana para una nueva entrada</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Tu prompt de hoy:</p>
            <p className="font-medium text-gray-800 mb-3">{todayJournal.prompt}</p>
            <p className="text-gray-600">{todayJournal.response}</p>
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Ánimo antes</p>
              <div className={`text-lg font-bold ${MOOD_OPTIONS[todayJournal.mood_before - 1].color}`}>
                {MOOD_OPTIONS[todayJournal.mood_before - 1].label}
              </div>
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-400 to-green-400"
                style={{ width: `${((todayJournal.mood_after - 1) / 4) * 100}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Ánimo después</p>
              <div className={`text-lg font-bold ${MOOD_OPTIONS[todayJournal.mood_after - 1].color}`}>
                {MOOD_OPTIONS[todayJournal.mood_after - 1].label}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-success-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Diario Completado!</h3>
        <p className="text-gray-600 mb-4">Has ganado 10 puntos de resiliencia</p>
        
        <div className="card max-w-md mx-auto text-left">
          <p className="text-sm text-gray-500 mb-2">Tu entrada:</p>
          <p className="font-medium text-gray-800 mb-2">{prompt}</p>
          <p className="text-gray-600">{response}</p>
          
          {gratitude.filter(g => g.trim()).length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Cosas por las que estás agradecido:</p>
              <ul className="space-y-1">
                {gratitude.filter(g => g.trim()).map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <Heart className="w-4 h-4 text-pink-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          <BookOpen className="w-6 h-6 inline-block mr-2" />
          Diario de Reflexión
        </h3>
        <p className="text-gray-600">
          Un momento para reflexionar sobre tu día y cultivar la gratitud.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          {['mood', 'journal', 'gratitude'].map((s, index) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? 'bg-primary-600 text-white' : 
                ['mood', 'journal', 'gratitude'].indexOf(step) > index ? 'bg-success-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {['mood', 'journal', 'gratitude'].indexOf(step) > index ? '✓' : index + 1}
              </div>
              {index < 2 && <div className="w-8 h-1 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Mood Before */}
      {step === 'mood' && (
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-4">¿Cómo te sientes ahora?</h4>
          <p className="text-sm text-gray-500 mb-6">Selecciona el estado de ánimo que mejor te represente:</p>
          
          <div className="flex justify-center gap-4 mb-8">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setMoodBefore(option.value)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  moodBefore === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={option.color}>{option.icon}</div>
                <span className="text-sm mt-2">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button onClick={() => setStep('journal')} className="btn-primary">
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Journal Entry */}
      {step === 'journal' && (
        <div className="card">
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary-600 font-medium">Prompt del día:</p>
            <p className="text-lg text-primary-800 font-semibold mt-1">{prompt}</p>
          </div>
          
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Escribe tu respuesta aquí... No hay respuestas correctas o incorrectas."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-40 resize-none"
          />
          
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep('mood')} className="text-gray-600 hover:text-gray-800">
              ← Volver
            </button>
            <button 
              onClick={() => setStep('gratitude')} 
              disabled={!response.trim()}
              className="btn-primary"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Gratitude & Mood After */}
      {step === 'gratitude' && (
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-4">
            <Star className="w-5 h-5 inline-block text-yellow-500 mr-2" />
            ¿Por qué estás agradecido hoy?
          </h4>
          <p className="text-sm text-gray-500 mb-6">Escribe 1-3 cosas (opcional pero recomendado):</p>
          
          <div className="space-y-3 mb-6">
            {gratitude.map((item, index) => (
              <div key={index}>
                <label className="text-xs text-gray-500">{GRATITUDE_PROMPTS[index]}</label>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleGratitudeChange(index, e.target.value)}
                  placeholder={`Ej: ${GRATITUDE_PROMPTS[index]}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mt-1"
                />
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-4">¿Cómo te sientes ahora?</h4>
            <div className="flex justify-center gap-4">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMoodAfter(option.value)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    moodAfter === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={option.color}>{option.icon}</div>
                  <span className="text-xs mt-1">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep('journal')} className="text-gray-600 hover:text-gray-800">
              ← Volver
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? 'Guardando...' : 'Guardar (+10 puntos)'}
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
