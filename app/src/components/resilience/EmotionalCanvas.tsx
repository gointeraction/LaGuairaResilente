import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useResilienceStore } from '../../stores/resilienceStore';
import { Palette, Check, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const EMOTIONS = [
  { name: 'Felicidad', color: '#FFD700', icon: '😊' },
  { name: 'Calma', color: '#87CEEB', icon: '😌' },
  { name: 'Esperanza', color: '#98FB98', icon: '🌱' },
  { name: 'Tristeza', color: '#4169E1', icon: '😢' },
  { name: 'Ansiedad', color: '#FF6347', icon: '😰' },
  { name: 'Enfado', color: '#DC143C', icon: '😠' },
  { name: 'Gratitud', color: '#DDA0DD', icon: '🙏' },
  { name: 'Amor', color: '#FF69B4', icon: '❤️' },
  { name: 'Frustración', color: '#8B4513', icon: '😤' },
  { name: 'Entusiasmo', color: '#FF8C00', icon: '🎉' },
  { name: 'Paz', color: '#E0FFFF', icon: '☮️' },
  { name: 'Nostalgia', color: '#DAA520', icon: '📷' }
];

const MANDALA_SEGMENTS = 12;

export default function EmotionalCanvas() {
  const { user } = useAuthStore();
  const { saveEmotionalCanvas } = useResilienceStore();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleColorSelect = (emotion: typeof EMOTIONS[0]) => {
    if (selectedColors.length >= MANDALA_SEGMENTS) return;
    
    setSelectedColors([...selectedColors, emotion.color]);
    setSelectedEmotions([...selectedEmotions, emotion.name]);
  };

  const handleReset = () => {
    setSelectedColors([]);
    setSelectedEmotions([]);
    setReflection('');
    setCompleted(false);
  };

  const handleSave = async () => {
    if (!user) return;
    if (selectedColors.length < 3) {
      toast.error('Selecciona al menos 3 colores');
      return;
    }

    setSaving(true);
    try {
      await saveEmotionalCanvas({
        user_id: user.uid,
        colors: selectedColors,
        emotions: selectedEmotions,
        reflection,
        mandala_pattern: 'custom'
      });
      
      setCompleted(true);
      toast.success('¡Actividad completada! +15 puntos');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const renderMandala = () => {
    const segments = [];
    const angleStep = 360 / MANDALA_SEGMENTS;
    const centerX = 150;
    const centerY = 150;
    const outerRadius = 130;
    const innerRadius = 40;

    for (let i = 0; i < MANDALA_SEGMENTS; i++) {
      const startAngle = (i * angleStep - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * angleStep - 90) * (Math.PI / 180);
      
      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(endAngle);
      const y2 = centerY + outerRadius * Math.sin(endAngle);
      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);

      const color = selectedColors[i] || '#E5E7EB';
      
      segments.push(
        <path
          key={i}
          d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
          fill={color}
          stroke="white"
          strokeWidth="2"
          className="transition-colors duration-300 cursor-pointer hover:opacity-80"
          onClick={() => {
            if (selectedColors.length > i) {
              const newColors = [...selectedColors];
              const newEmotions = [...selectedEmotions];
              newColors.splice(i, 1);
              newEmotions.splice(i, 1);
              setSelectedColors(newColors);
              setSelectedEmotions(newEmotions);
            }
          }}
        />
      );
    }

    return segments;
  };

  if (completed) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-success-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Actividad Completada!</h3>
        <p className="text-gray-600 mb-4">Has ganado 15 puntos de resiliencia</p>
        <div className="card max-w-md mx-auto">
          <p className="text-sm text-gray-500 mb-2">Emociones exploradas:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[...new Set(selectedEmotions)].map((emotion) => (
              <span key={emotion} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {emotion}
              </span>
            ))}
          </div>
        </div>
        <button 
          onClick={handleReset}
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
          <Palette className="w-6 h-6 inline-block mr-2" />
          Claridad Emocional a través del Color
        </h3>
        <p className="text-gray-600">
          Selecciona colores que representen cómo te sientes ahora. Cada color es una emoción.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mandala */}
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-4">Tu Mandala</h4>
          <div className="flex justify-center">
            <svg width="300" height="300" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="145" fill="white" stroke="#E5E7EB" strokeWidth="2" />
              {renderMandala()}
              <circle cx="150" cy="150" r="35" fill="white" stroke="#E5E7EB" strokeWidth="2" />
              <text x="150" y="155" textAnchor="middle" className="text-sm fill-gray-500">
                {selectedColors.length}/{MANDALA_SEGMENTS}
              </text>
            </svg>
          </div>
          
          {selectedEmotions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Emociones seleccionadas:</p>
              <div className="flex flex-wrap gap-2">
                {selectedEmotions.map((emotion, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Color Palette */}
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-4">Paleta de Emociones</h4>
          <div className="grid grid-cols-3 gap-3">
            {EMOTIONS.map((emotion) => {
              const isSelected = selectedEmotions.includes(emotion.name) && 
                selectedColors[selectedEmotions.indexOf(emotion.name)] === emotion.color;
              
              return (
                <button
                  key={emotion.name}
                  onClick={() => handleColorSelect(emotion)}
                  disabled={selectedColors.length >= MANDALA_SEGMENTS}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${selectedColors.length >= MANDALA_SEGMENTS ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: emotion.color }}
                  />
                  <span className="text-xs text-gray-700">{emotion.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div className="card mt-6">
        <h4 className="font-semibold text-gray-800 mb-4">Reflexión</h4>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="¿Qué emociones predominan? ¿Cómo te sientes al ver tu mandala? ¿Qué colores faltan?"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-24 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar
        </button>
        <button
          onClick={handleSave}
          disabled={saving || selectedColors.length < 3}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? 'Guardando...' : 'Guardar (+15 puntos)'}
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
