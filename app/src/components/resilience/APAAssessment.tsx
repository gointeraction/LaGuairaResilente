import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useResilienceStore } from '../../stores/resilienceStore';
import { ClipboardCheck, Check, ChevronRight, ChevronLeft, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const APA_PRINCIPLES = [
  {
    id: 'connections',
    title: 'Conexiones',
    description: 'Hacer conexiones y construir red de apoyo social',
    questions: [
      'Tengo personas en las que confío para pedir ayuda',
      'Participo activamente en mi comunidad',
      'Mantengo relaciones positivas con familiares y amigos'
    ]
  },
  {
    id: 'perspective',
    title: 'Perspectiva',
    description: 'Evitar ver crisis como desafíos insuperables',
    questions: [
      'Puedo ver el lado positivo de las situaciones difíciles',
      'No me quedo atrapado/a en pensamientos negativos',
      'Busco soluciones cuando enfrento problemas'
    ]
  },
  {
    id: 'acceptance',
    title: 'Aceptación',
    description: 'Aceptar que el cambio es una parte natural de la vida',
    questions: [
      'Acepto que no puedo controlar todo',
      'Me adapto a los cambios con facilidad',
      'Entiendo que los problemas son temporales'
    ]
  },
  {
    id: 'goals',
    title: 'Metas',
    description: 'Avanzar hacia metas realistas',
    questions: [
      'Establezco metas alcanzables',
      'Tengo un plan claro para lograr mis objetivos',
      'Celebro mis logros, por pequeños que sean'
    ]
  },
  {
    id: 'action',
    title: 'Acción',
    description: 'Tomar acciones decisivas para enfrentar desafíos',
    questions: [
      'Actúo en lugar de esperar pasivamente',
      'Tomo decisiones incluso cuando tengo miedo',
      'Busco activamente maneras de mejorar mi situación'
    ]
  },
  {
    id: 'self_discovery',
    title: 'Autodescubrimiento',
    description: 'Buscar oportunidades para el autodescubrimiento',
    questions: [
      'Aprendo de mis experiencias pasadas',
      'Reflexiono regularmente sobre mis acciones',
      'Estoy abierto/a a nuevas experiencias'
    ]
  },
  {
    id: 'self_view',
    title: 'Autoimagen',
    description: 'Fomentar una visión positiva de ti mismo',
    questions: [
      'Confío en mis habilidades y capacidades',
      'Me acepto como soy',
      'Reconozco mis fortalezas'
    ]
  },
  {
    id: 'context',
    title: 'Perspectiva',
    description: 'Mantener las cosas en perspectiva y contexto',
    questions: [
      'No exagero los problemas',
      'Puedo distanciarme de una situación para verla con claridad',
      'Entiendo que un mal momento no define mi vida'
    ]
  },
  {
    id: 'hope',
    title: 'Esperanza',
    description: 'Mantener una perspectiva de esperanza en la vida',
    questions: [
      'Creo que las cosas mejorarán',
      'Tengo expectativas positivas para el futuro',
      'Encuentro inspiración en historias de superación'
    ]
  },
  {
    id: 'self_care',
    title: 'Autocuidado',
    description: 'Cuidar tu salud física y mental',
    questions: [
      'Duermo lo suficiente y como bien',
      'Hago ejercicio regularmente',
      'Dedico tiempo a actividades que disfruto'
    ]
  }
];

const RESPONSE_OPTIONS = [
  { value: 0, label: 'Nunca', color: 'bg-red-100 text-red-700' },
  { value: 1, label: 'A veces', color: 'bg-yellow-100 text-yellow-700' },
  { value: 2, label: 'Frecuentemente', color: 'bg-blue-100 text-blue-700' },
  { value: 3, label: 'Siempre', color: 'bg-green-100 text-green-700' }
];

export default function APAAssessment() {
  const { user } = useAuthStore();
  const { saveAPAAssessment, latestAPAAssessment } = useResilienceStore();
  const [currentPrinciple, setCurrentPrinciple] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const principle = APA_PRINCIPLES[currentPrinciple];
  const totalQuestions = APA_PRINCIPLES.reduce((sum, p) => sum + p.questions.length, 0);
  const answeredQuestions = Object.values(answers).reduce((sum, arr) => sum + arr.length, 0);

  const handleAnswer = (questionIndex: number, value: number) => {
    const principleAnswers = answers[principle.id] || [];
    const newAnswers = [...principleAnswers];
    newAnswers[questionIndex] = value;
    
    setAnswers({
      ...answers,
      [principle.id]: newAnswers
    });
  };

  const handleNext = () => {
    if (currentPrinciple < APA_PRINCIPLES.length - 1) {
      setCurrentPrinciple(currentPrinciple + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPrinciple > 0) {
      setCurrentPrinciple(currentPrinciple - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    // Calculate scores
    const scores: Record<string, number> = {};
    let totalScore = 0;

    APA_PRINCIPLES.forEach((p) => {
      const principleAnswers = answers[p.id] || [];
      const score = principleAnswers.reduce((sum, val) => sum + val, 0);
      const maxScore = p.questions.length * 3;
      scores[p.id] = Math.round((score / maxScore) * 10);
      totalScore += score;
    });

    const maxTotalScore = totalQuestions * 3;
    const percentage = Math.round((totalScore / maxTotalScore) * 100);

    setSaving(true);
    try {
      await saveAPAAssessment({
        user_id: user.uid,
        scores: scores as any
      });

      setResult({ scores, totalScore, percentage });
      setCompleted(true);
      toast.success('¡Evaluación completada! Puntos otorgados según tu puntuación');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-primary-600';
    if (score >= 40) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bueno';
    if (score >= 40) return 'Moderado';
    return 'Necesita mejora';
  };

  if (completed && result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-success-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Resultados de tu Evaluación</h3>
          <p className="text-gray-600">Aquí está tu perfil de resiliencia según los 10 principios de la APA</p>
        </div>

        {/* Overall Score */}
        <div className="card mb-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-800 mb-2">{result.percentage}%</p>
            <p className={`text-xl font-semibold ${getScoreColor(result.percentage)}`}>
              {getScoreLabel(result.percentage)}
            </p>
            <p className="text-gray-500 mt-2">
              {latestAPAAssessment?.feedback}
            </p>
          </div>
        </div>

        {/* Individual Scores */}
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-4">Detalle por Principio</h4>
          <div className="space-y-4">
            {APA_PRINCIPLES.map((p) => {
              const score = result.scores[p.id];
              return (
                <div key={p.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{p.title}</span>
                    <span className={`text-sm font-semibold ${getScoreColor(score * 10)}`}>
                      {score}/10
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        score >= 8 ? 'bg-success-500' :
                        score >= 6 ? 'bg-primary-500' :
                        score >= 4 ? 'bg-warning-500' : 'bg-danger-500'
                      }`}
                      style={{ width: `${score * 10}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card mt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Recomendaciones</h4>
          <div className="space-y-3">
            {APA_PRINCIPLES
              .sort((a, b) => (result.scores[a.id] || 0) - (result.scores[b.id] || 0))
              .slice(0, 3)
              .map((p) => (
                <div key={p.id} className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-700 font-bold text-sm">{result.scores[p.id]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{p.title}</p>
                    <p className="text-sm text-gray-600">
                      Practica actividades relacionadas con "{p.description.toLowerCase()}" para mejorar esta área.
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <button
          onClick={() => {
            setCompleted(false);
            setResult(null);
            setAnswers({});
            setCurrentPrinciple(0);
          }}
          className="w-full mt-6 btn-primary"
        >
          Realizar nueva evaluación
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          <ClipboardCheck className="w-6 h-6 inline-block mr-2" />
          Evaluación de Resiliencia APA
        </h3>
        <p className="text-gray-600">
          Evalúa tus fortalezas según los 10 principios de la Asociación Estadounidense de Psicología.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Principio {currentPrinciple + 1} de {APA_PRINCIPLES.length}</span>
          <span>{answeredQuestions}/{totalQuestions} preguntas</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-primary-500 rounded-full transition-all"
            style={{ width: `${((currentPrinciple + 1) / APA_PRINCIPLES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Principle Card */}
      <div className="card">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-800">{principle.title}</h4>
          <p className="text-gray-600">{principle.description}</p>
        </div>

        <div className="space-y-6">
          {principle.questions.map((question, qIndex) => (
            <div key={qIndex}>
              <p className="font-medium text-gray-700 mb-3">{question}</p>
              <div className="flex flex-wrap gap-2">
                {RESPONSE_OPTIONS.map((option) => {
                  const isSelected = (answers[principle.id] || [])[qIndex] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(qIndex, option.value)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? `${option.color} border-current`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentPrinciple === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {currentPrinciple < APA_PRINCIPLES.length - 1 ? (
          <button
            onClick={handleNext}
            className="btn-primary flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={saving || answeredQuestions < totalQuestions}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? 'Guardando...' : 'Completar Evaluación'}
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
