import { create } from 'zustand';
import { educationService } from '../services/education';
import type { Track, Course, Enrollment } from '../types';

interface EducationState {
  tracks: Track[];
  courses: Course[];
  enrollments: Enrollment[];
  selectedTrack: Track | null;
  selectedCourse: Course | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadTracks: () => Promise<void>;
  loadCourses: (trackId: string) => Promise<void>;
  loadEnrollments: (studentId: string) => Promise<void>;
  selectTrack: (track: Track | null) => void;
  selectCourse: (course: Course | null) => void;
  enrollInCourse: (studentId: string, courseId: string, trackId: string) => Promise<void>;
  updateProgress: (enrollmentId: string, resourceId: string) => Promise<void>;
  clearError: () => void;
}

export const useEducationStore = create<EducationState>((set) => ({
  tracks: [],
  courses: [],
  enrollments: [],
  selectedTrack: null,
  selectedCourse: null,
  loading: false,
  error: null,

  loadTracks: async () => {
    set({ loading: true, error: null });
    try {
      const tracks = await educationService.getTracks();
      set({ tracks, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error cargando tracks';
      set({ error: message, loading: false });
    }
  },

  loadCourses: async (trackId: string) => {
    set({ loading: true, error: null });
    try {
      const courses = await educationService.getCoursesByTrack(trackId);
      set({ courses, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error cargando cursos';
      set({ error: message, loading: false });
    }
  },

  loadEnrollments: async (studentId: string) => {
    set({ loading: true, error: null });
    try {
      const enrollments = await educationService.getStudentEnrollments(studentId);
      set({ enrollments, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error cargando inscripciones';
      set({ error: message, loading: false });
    }
  },

  selectTrack: (track) => {
    set({ selectedTrack: track, courses: [] });
  },

  selectCourse: (course) => {
    set({ selectedCourse: course });
  },

  enrollInCourse: async (studentId, courseId, trackId) => {
    set({ loading: true, error: null });
    try {
      const enrollment = await educationService.enrollStudent(studentId, courseId, trackId);
      set((state) => ({
        enrollments: [...state.enrollments, enrollment],
        loading: false
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al inscribirse';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateProgress: async (enrollmentId, resourceId) => {
    try {
      await educationService.markResourceCompleted(enrollmentId, resourceId);
      // Update local state
      set((state) => ({
        enrollments: state.enrollments.map(e => {
          if (e.id === enrollmentId) {
            const completedResources = [...new Set([...e.completed_resources, resourceId])];
            return {
              ...e,
              completed_resources: completedResources,
              progress_percent: Math.min(100, Math.round((completedResources.length / (e.completed_resources.length + 1)) * 100))
            };
          }
          return e;
        })
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error actualizando progreso';
      set({ error: message });
    }
  },

  clearError: () => set({ error: null })
}));
