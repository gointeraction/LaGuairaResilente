import { useState } from 'react';
import { Link } from 'react-router-dom';
import { censusService } from '../services/census';
import { useAuthStore } from '../stores/authStore';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { CENSUS_QUESTIONS } from '../utils/helpers';
import toast from 'react-hot-toast';
import type { Municipality } from '../types';

interface CensusResponse {
  question_id: string;
  answer: string | number | boolean;
  skipped: boolean;
}

export default function Census() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    respondent_name: '',
    respondent_cedula: '',
    municipality: '' as Municipality | '',
    camp_id: '',
    responses: [] as CensusResponse[]
  });
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = CENSUS_QUESTIONS[step];
  const totalSteps = CENSUS_QUESTIONS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleAnswer = (answer: string | number | boolean) => {
    const newResponses = [...formData.responses];
    const existingIndex = newResponses.findIndex(r => r.question_id === currentQuestion.id);
    
    if (existingIndex >= 0) {
      newResponses[existingIndex].answer = answer;
      newResponses[existingIndex].skipped = false;
    } else {
      newResponses.push({
        question_id: currentQuestion.id,
        answer,
        skipped: false
      });
    }
    
    setFormData({ ...formData, responses: newResponses });
  };

  const handleSkip = () => {
    const newResponses = [...formData.responses];
    const existingIndex = newResponses.findIndex(r => r.question_id === currentQuestion.id);
    
    if (existingIndex >= 0) {
      newResponses[existingIndex].skipped = true;
    } else {
      newResponses.push({
        question_id: currentQuestion.id,
        answer: '',
        skipped: true
      });
    }
    
    setFormData({ ...formData, responses: newResponses });
    handleNext();
  };

  const handleSubmit = async () => {
    if (!formData.respondent_name || !formData.respondent_cedula || !formData.municipality) {
      toast.error('Por favor completa los datos básicos');
      setStep(0);
      return;
    }

    setSubmitting(true);
    try {
      // Get GPS coordinates if available
      let coordinates = { latitude: 10.6012, longitude: -66.9628 }; // Default Caracas
      
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (e) {
          console.log('GPS no disponible, usando coordenadas por defecto');
        }
      }

      await censusService.createSurvey({
        surveyor_id: user!.uid,
        respondent_name: formData.respondent_name,
        respondent_cedula: formData.respondent_cedula,
        municipality: formData.municipality as Municipality,
        camp_id: formData.camp_id || undefined,
        coordinates,
        responses: formData.responses
      });

      toast.success('Censo enviado exitosamente');
      // Reset form
      setFormData({
        respondent_name: '',
        respondent_cedula: '',
        municipality: '',
        camp_id: '',
        responses: []
      });
      setStep(0);
    } catch (error) {
      toast.error('Error al enviar censo');
    } finally {
      setSubmitting(false);
    }
  };

  const getResponseForQuestion = (questionId: string) => {
    return formData.responses.find(r => r.question_id === questionId);
  };

  const isStepComplete = (questionIndex: number) => {
    const question = CENSUS_QUESTIONS[questionIndex];
    const response = getResponseForQuestion(question.id);
    return response && (response.skipped || response.answer !== '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-primary-900">Censo Digital</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pregunta {step + 1} de {totalSteps}</span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {CENSUS_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === step
                  ? 'bg-primary-600'
                  : index < step || isStepComplete(index)
                  ? 'bg-success-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          {step === 0 ? (
            // Basic Info Form
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos del Encuestado</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.respondent_name}
                    onChange={(e) => setFormData({ ...formData, respondent_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nombre y apellido"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula *
                  </label>
                  <input
                    type="text"
                    value={formData.respondent_cedula}
                    onChange={(e) => setFormData({ ...formData, respondent_cedula: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="V-12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Municipio *
                  </label>
                  <select
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value as Municipality })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Seleccionar municipio</option>
                    <option value="CATIA_LA_MAR">Catia La Mar</option>
                    <option value="MAIQUETIA">Maiquetía</option>
                    <option value="MACUTO">Macuto</option>
                    <option value="CARABALLEDA">Caraballeda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campamento (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.camp_id}
                    onChange={(e) => setFormData({ ...formData, camp_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nombre del campamento"
                  />
                </div>
              </div>
            </div>
          ) : (
            // Question Display
            <div>
              <div className="mb-4">
                <span className="text-sm font-medium text-primary-600">{currentQuestion.category}</span>
                <h2 className="text-xl font-semibold text-gray-800 mt-1">{currentQuestion.question}</h2>
              </div>

              {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => {
                    const response = getResponseForQuestion(currentQuestion.id);
                    const isSelected = response?.answer === option.value;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className={`w-full p-3 text-left border rounded-lg transition-colors ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {isSelected && <Check className="w-5 h-5 text-primary-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  value={(getResponseForQuestion(currentQuestion.id)?.answer as string) || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tu respuesta"
                />
              )}

              {currentQuestion.type === 'number' && (
                <input
                  type="number"
                  value={(getResponseForQuestion(currentQuestion.id)?.answer as number) || ''}
                  onChange={(e) => handleAnswer(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {step < totalSteps - 1 ? (
            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Omitir
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Enviando...' : 'Enviar Censo'}
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
