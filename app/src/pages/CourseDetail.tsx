import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { educationService } from '../services/education';
import { useAuthStore } from '../stores/authStore';
import type { Course, Enrollment } from '../types';
import { ArrowLeft, Play, CheckCircle, Clock } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (courseId && user) {
      loadCourseAndEnrollment();
    }
  }, [courseId, user]);

  const loadCourseAndEnrollment = async () => {
    if (!courseId || !user) return;
    
    try {
      const courseData = await educationService.getCourse(courseId);
      setCourse(courseData);
      
      const enrollmentData = await educationService.getStudentEnrollment(user.uid, courseId);
      setEnrollment(enrollmentData);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course || !user) return;
    
    setEnrolling(true);
    try {
      const newEnrollment = await educationService.enrollStudent(user.uid, course.id, course.track_id);
      setEnrollment(newEnrollment);
      toast.success('¡Inscrito exitosamente!');
    } catch (error) {
      toast.error('Error al inscribirse');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Curso no encontrado</h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/courses" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary-900">{course.title}</h1>
              <p className="text-gray-600">Módulo {course.module_number} de {course.total_modules}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Info */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration_minutes} minutos
                </span>
                <span className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  {course.content_type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Status */}
        {enrollment ? (
          <div className="card mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Tu Progreso</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progreso</span>
                <span className="font-medium">{enrollment.progress_percent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${enrollment.progress_percent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {enrollment.status === 'COMPLETED' ? (
                <span className="flex items-center gap-1 text-success-600">
                  <CheckCircle className="w-4 h-4" />
                  Completado
                </span>
              ) : (
                <span className="text-gray-600">
                  En progreso - Último acceso: {new Date(enrollment.last_accessed).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="card mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Inscríbete en este curso</h3>
            <p className="text-gray-600 mb-4">
              Comienza a aprender habilidades digitales para la reconstrucción económica.
            </p>
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="btn-primary"
            >
              {enrolling ? 'Inscribiendo...' : 'Inscribirse Ahora'}
            </button>
          </div>
        )}

        {/* Course Content */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Contenido del Curso</h3>
          
          {course.video_url && (
            <div className="mb-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Play className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          )}

          {course.quiz && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Evaluación</h4>
              <p className="text-sm text-gray-600">
                {course.quiz.questions.length} preguntas - Score mínimo: {course.quiz.passing_score}%
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
