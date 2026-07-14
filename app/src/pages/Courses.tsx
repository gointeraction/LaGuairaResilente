import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { educationService } from '../services/education';
import type { Track, Course } from '../types';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Courses() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    loadTracks();
  }, []);

  useEffect(() => {
    if (selectedTrack) {
      loadCourses(selectedTrack.id);
    }
  }, [selectedTrack]);

  const loadTracks = async () => {
    try {
      const data = await educationService.getTracks();
      setTracks(data);
      if (data.length > 0) {
        setSelectedTrack(data[0]);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async (trackId: string) => {
    setLoadingCourses(true);
    try {
      const data = await educationService.getCoursesByTrack(trackId);
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Volver
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary-900">Aula Resiliente</h1>
              <p className="text-gray-600">Capacitación digital para la reconstrucción</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Track Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Selecciona un Programa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`card text-left transition-all ${
                  selectedTrack?.id === track.id
                    ? 'ring-2 ring-primary-500 bg-primary-50'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{track.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{track.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {track.module_count} módulos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {track.duration_hours}h
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Courses List */}
        {selectedTrack && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Módulos de {selectedTrack.name}
            </h2>
            
            {loadingCourses ? (
              <LoadingSpinner />
            ) : courses.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-500">No hay módulos disponibles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="card hover:shadow-md transition-shadow block"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="font-semibold text-gray-600">
                            {course.module_number}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{course.title}</h3>
                          <p className="text-sm text-gray-500">{course.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {course.duration_minutes} min
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
