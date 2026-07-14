import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useResilienceStore } from '../../stores/resilienceStore';
import { Target, Check, Plus, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const GOAL_SUGGESTIONS = [
  'Mejorar mi salud física y mental',
  'Desarrollar nuevas habilidades digitales',
  'Construir relaciones más positivas',
  'Encontrar un empleo estable',
  'Iniciar un negocio propio',
  'Aprender a manejar el estrés',
  'Mejorar mi comunicación',
  'Ser más organizado/a',
  'Desarrollar mi creatividad',
  'Contribuir a mi comunidad'
];

interface PlanStep {
  step: string;
  completed: boolean;
}

export default function ActionPlanBuilder() {
  const { user } = useAuthStore();
  const { saveActionPlan, actionPlans, updateActionPlan } = useResilienceStore();
  const [showForm, setShowForm] = useState(false);
  const [goal, setGoal] = useState('');
  const [steps, setSteps] = useState<PlanStep[]>([{ step: '', completed: false }]);
  const [targetDate, setTargetDate] = useState('');
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAddStep = () => {
    setSteps([...steps, { step: '', completed: false }]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].step = value;
    setSteps(newSteps);
  };

  const handleToggleStep = (planId: string, stepIndex: number) => {
    const plan = actionPlans.find(p => p.id === planId);
    if (!plan) return;

    const newSteps = [...plan.steps];
    newSteps[stepIndex].completed = !newSteps[stepIndex].completed;
    
    updateActionPlan(planId, { steps: newSteps });
    
    if (newSteps[stepIndex].completed) {
      toast.success('¡Paso completado! +5 puntos');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!goal.trim()) {
      toast.error('Define tu objetivo');
      return;
    }
    if (steps.filter(s => s.step.trim()).length === 0) {
      toast.error('Agrega al menos un paso');
      return;
    }

    setSaving(true);
    try {
      await saveActionPlan({
        user_id: user.uid,
        goal: goal.trim(),
        steps: steps.filter(s => s.step.trim()),
        target_date: targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'IN_PROGRESS'
      });
      
      setShowForm(false);
      setGoal('');
      setSteps([{ step: '', completed: false }]);
      setTargetDate('');
      toast.success('¡Plan creado! +5 puntos por cada paso completado');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const getCompletedCount = (steps: PlanStep[]) => {
    return steps.filter(s => s.completed).length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          <Target className="w-6 h-6 inline-block mr-2" />
          Plan de Acción Personal
        </h3>
        <p className="text-gray-600">
          Define metas alcanzables y divide en pasos manejables.
        </p>
      </div>

      {/* Create New Plan Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full card border-2 border-dashed border-gray-300 hover:border-primary-400 text-center py-8 mb-8"
        >
          <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Crear nuevo plan de acción</p>
        </button>
      )}

      {/* Create Plan Form */}
      {showForm && (
        <div className="card mb-8">
          <h4 className="font-semibold text-gray-800 mb-4">Nuevo Plan de Acción</h4>
          
          {/* Goal */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuál es tu objetivo?
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ej: Mejorar mi salud física..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            
            {/* Suggestions */}
            <div className="mt-2 flex flex-wrap gap-2">
              {GOAL_SUGGESTIONS.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setGoal(suggestion)}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pasos para lograrlo:
            </label>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <span className="flex-shrink-0 w-6 h-10 flex items-center justify-center text-sm text-gray-500">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={step.step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder={`Paso ${index + 1}...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={() => handleRemoveStep(index)}
                    disabled={steps.length === 1}
                    className="p-2 text-gray-400 hover:text-danger-500 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddStep}
              className="mt-2 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="w-4 h-4" />
              Agregar paso
            </button>
          </div>

          {/* Target Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline-block mr-1" />
              Fecha objetivo (opcional):
            </label>
            <input
              type="date"
              value={targetDate ? new Date(targetDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setTargetDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !goal.trim()}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? 'Guardando...' : 'Crear Plan'}
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Existing Plans */}
      {actionPlans.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Mis Planes</h4>
          
          {actionPlans.map((plan) => {
            const completedCount = getCompletedCount(plan.steps);
            const totalCount = plan.steps.length;
            const progress = (completedCount / totalCount) * 100;
            const isExpanded = expandedPlan === plan.id;
            
            return (
              <div key={plan.id} className="card">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        plan.status === 'COMPLETED' ? 'bg-success-500' :
                        plan.status === 'ABANDONED' ? 'bg-gray-400' : 'bg-primary-500'
                      }`} />
                      <h5 className="font-medium text-gray-800">{plan.goal}</h5>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span>{completedCount}/{totalCount} pasos</span>
                      <span>•</span>
                      <span>{Math.round(progress)}% completado</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-2">
                      {plan.steps.map((step, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            step.completed ? 'bg-success-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <button
                            onClick={() => handleToggleStep(plan.id, index)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              step.completed 
                                ? 'bg-success-500 border-success-500 text-white' 
                                : 'border-gray-300 hover:border-primary-400'
                            }`}
                          >
                            {step.completed && <Check className="w-3 h-3" />}
                          </button>
                          <span className={`flex-1 ${step.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {step.step}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {plan.status !== 'COMPLETED' && (
                      <button
                        onClick={() => {
                          updateActionPlan(plan.id, { status: 'COMPLETED' });
                          toast.success('¡Plan completado! +50 puntos bonus');
                        }}
                        disabled={completedCount < totalCount}
                        className="mt-4 w-full py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Marcar como Completado
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {actionPlans.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-500">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Aún no tienes planes de acción.</p>
          <p className="text-sm">¡Crea tu primer plan para empezar a crecer!</p>
        </div>
      )}
    </div>
  );
}
