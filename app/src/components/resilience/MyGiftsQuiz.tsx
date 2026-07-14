import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useResilienceStore } from '../../stores/resilienceStore';
import { Gift, Check, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const PRESET_GIFTS = [
  { id: 'modest', label: 'Modesto', icon: '🙏' },
  { id: 'considerate', label: 'Considerado', icon: '💝' },
  { id: 'patient', label: 'Paciente', icon: '⏳' },
  { id: 'creative', label: 'Creativo', icon: '🎨' },
  { id: 'calm', label: 'Tranquilo', icon: '😌' },
  { id: 'kind', label: 'Amable', icon: '😊' },
  { id: 'helpful', label: 'Servicial', icon: '🤝' },
  { id: 'cheerful', label: 'Alegre', icon: '🎉' },
  { id: 'friendly', label: 'Amigable', icon: '👋' },
  { id: 'honest', label: 'Honesto', icon: '✓' },
  { id: 'brave', label: 'Valiente', icon: '💪' },
  { id: 'resilient', label: 'Resiliente', icon: '🌟' },
  { id: 'empathetic', label: 'Empático', icon: '❤️' },
  { id: 'determined', label: 'Determinado', icon: '🎯' },
  { id: 'optimistic', label: 'Optimista', icon: '☀️' },
  { id: 'organized', label: 'Organizado', icon: '📋' },
  { id: 'leader', label: 'Líder natural', icon: '👑' },
  { id: 'listener', label: 'Buen oyente', icon: '👂' },
  { id: 'grateful', label: 'Agradecido', icon: '🙏' },
  { id: 'adaptable', label: 'Adaptable', icon: '🔄' }
];

export default function MyGiftsQuiz() {
  const { user } = useAuthStore();
  const { saveMyGiftsQuiz } = useResilienceStore();
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
  const [customGifts, setCustomGifts] = useState<string[]>([]);
  const [newCustomGift, setNewCustomGift] = useState('');
  const [reflection, setReflection] = useState('');
  const [step, setStep] = useState<'select' | 'describe' | 'complete'>('select');
  const [saving, setSaving] = useState(false);

  const handleToggleGift = (giftId: string) => {
    if (selectedGifts.includes(giftId)) {
      setSelectedGifts(selectedGifts.filter(g => g !== giftId));
    } else {
      setSelectedGifts([...selectedGifts, giftId]);
    }
  };

  const handleAddCustomGift = () => {
    if (newCustomGift.trim() && !customGifts.includes(newCustomGift.trim())) {
      setCustomGifts([...customGifts, newCustomGift.trim()]);
      setNewCustomGift('');
    }
  };

  const handleRemoveCustomGift = (gift: string) => {
    setCustomGifts(customGifts.filter(g => g !== gift));
  };

  const handleSave = async () => {
    if (!user) return;
    if (selectedGifts.length === 0 && customGifts.length === 0) {
      toast.error('Selecciona al menos un don o cualidad');
      return;
    }

    setSaving(true);
    try {
      await saveMyGiftsQuiz({
        user_id: user.uid,
        selected_gifts: selectedGifts,
        custom_gifts: customGifts,
        reflection
      });
      
      setStep('complete');
      toast.success('¡Actividad completada! +20 puntos');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (step === 'complete') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-success-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Regalo Creativo Completado!</h3>
        <p className="text-gray-600 mb-4">Has ganado 20 puntos de resiliencia</p>
        
        <div className="card max-w-md mx-auto">
          <h4 className="font-semibold text-gray-800 mb-3">Tus Dones y Cualidades:</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedGifts.map(giftId => {
              const gift = PRESET_GIFTS.find(g => g.id === giftId);
              return (
                <span key={giftId} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {gift?.icon} {gift?.label}
                </span>
              );
            })}
            {customGifts.map((gift, index) => (
              <span key={index} className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm">
                ✨ {gift}
              </span>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => {
            setSelectedGifts([]);
            setCustomGifts([]);
            setReflection('');
            setStep('select');
          }}
          className="mt-6 btn-primary"
        >
          Hacer otra vez
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          <Gift className="w-6 h-6 inline-block mr-2" />
          Mis Dones: Rasgos y Talentos
        </h3>
        <p className="text-gray-600">
          Descubre y celebra las cualidades positivas que te hacen único.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step === 'select' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'select' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-sm font-medium">Seleccionar</span>
          </div>
          <div className="w-12 h-1 bg-gray-200 rounded" />
          <div className={`flex items-center gap-2 ${step === 'describe' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'describe' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="text-sm font-medium">Reflexionar</span>
          </div>
        </div>
      </div>

      {step === 'select' && (
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-4">¿Cuáles de estos dones reconoces en ti?</h4>
          <p className="text-sm text-gray-500 mb-6">Selecciona todos los que apliquen. También puedes agregar los tuyos.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {PRESET_GIFTS.map((gift) => {
              const isSelected = selectedGifts.includes(gift.id);
              return (
                <button
                  key={gift.id}
                  onClick={() => handleToggleGift(gift.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{gift.icon}</span>
                  <span className="text-sm text-gray-700">{gift.label}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary-600 float-right mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Gifts */}
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-700 mb-3">Agregar cualidades propias:</h5>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newCustomGift}
                onChange={(e) => setNewCustomGift(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomGift()}
                placeholder="Escribe una cualidad..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={handleAddCustomGift}
                disabled={!newCustomGift.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {customGifts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customGifts.map((gift, index) => (
                  <span key={index} className="flex items-center gap-1 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm">
                    ✨ {gift}
                    <button onClick={() => handleRemoveCustomGift(gift)} className="hover:text-success-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setStep('describe')}
              disabled={selectedGifts.length === 0 && customGifts.length === 0}
              className="btn-primary"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {step === 'describe' && (
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-4">Reflexiona sobre tus dones</h4>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Tus dones seleccionados:</p>
            <div className="flex flex-wrap gap-2">
              {selectedGifts.map(giftId => {
                const gift = PRESET_GIFTS.find(g => g.id === giftId);
                return (
                  <span key={giftId} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {gift?.icon} {gift?.label}
                  </span>
                );
              })}
              {customGifts.map((gift, index) => (
                <span key={index} className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm">
                  ✨ {gift}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cómo usas estos dones en tu vida diaria?
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Comparte ejemplos de cómo estos dones se manifiestan en ti..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-24 resize-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep('select')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? 'Guardando...' : 'Guardar (+20 puntos)'}
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
