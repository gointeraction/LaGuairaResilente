import { create } from 'zustand';
import { resilienceService } from '../services/resilience';
import type { 
  EmotionalCanvasEntry, 
  MyGiftsEntry, 
  JournalEntry, 
  MindfulnessSession, 
  ActionPlan, 
  APAAssessment,
  ActivityType 
} from '../services/resilience';

interface ResilienceState {
  // Data
  totalPoints: number;
  currentStreak: number;
  weeklyStats: { totalPoints: number; activityCount: number };
  pointsByActivity: Record<ActivityType, number>;
  
  // Activity data
  emotionalCanvasHistory: EmotionalCanvasEntry[];
  myGiftsHistory: MyGiftsEntry[];
  journalEntries: JournalEntry[];
  todayJournal: JournalEntry | null;
  mindfulnessHistory: MindfulnessSession[];
  totalMindfulnessMinutes: number;
  actionPlans: ActionPlan[];
  apaAssessments: APAAssessment[];
  latestAPAAssessment: APAAssessment | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Actions
  loadAllData: (userId: string) => Promise<void>;
  saveEmotionalCanvas: (data: Omit<EmotionalCanvasEntry, 'id' | 'points_earned' | 'created_at'>) => Promise<void>;
  saveMyGiftsQuiz: (data: Omit<MyGiftsEntry, 'id' | 'points_earned' | 'created_at'>) => Promise<void>;
  saveJournalEntry: (data: Omit<JournalEntry, 'id' | 'points_earned' | 'created_at'>) => Promise<void>;
  saveMindfulnessSession: (data: Omit<MindfulnessSession, 'id' | 'points_earned' | 'created_at'>) => Promise<void>;
  saveActionPlan: (data: Omit<ActionPlan, 'id' | 'points_earned' | 'created_at'>) => Promise<void>;
  updateActionPlan: (planId: string, updates: Partial<ActionPlan>) => Promise<void>;
  saveAPAAssessment: (data: Omit<APAAssessment, 'id' | 'total_score' | 'feedback' | 'created_at'>) => Promise<void>;
  clearError: () => void;
}

export const useResilienceStore = create<ResilienceState>((set) => ({
  // Initial state
  totalPoints: 0,
  currentStreak: 0,
  weeklyStats: { totalPoints: 0, activityCount: 0 },
  pointsByActivity: {} as Record<ActivityType, number>,
  emotionalCanvasHistory: [],
  myGiftsHistory: [],
  journalEntries: [],
  todayJournal: null,
  mindfulnessHistory: [],
  totalMindfulnessMinutes: 0,
  actionPlans: [],
  apaAssessments: [],
  latestAPAAssessment: null,
  loading: false,
  error: null,

  loadAllData: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const [
        totalPoints,
        currentStreak,
        weeklyStats,
        pointsByActivity,
        emotionalCanvasHistory,
        myGiftsHistory,
        journalEntries,
        todayJournal,
        mindfulnessHistory,
        totalMindfulnessMinutes,
        actionPlans,
        apaAssessments,
        latestAPAAssessment
      ] = await Promise.all([
        resilienceService.getTotalPoints(userId),
        resilienceService.getCurrentStreak(userId),
        resilienceService.getWeeklyStats(userId),
        resilienceService.getPointsByActivity(userId),
        resilienceService.getEmotionalCanvasHistory(userId),
        resilienceService.getMyGiftsHistory(userId),
        resilienceService.getJournalEntries(userId),
        resilienceService.getTodayJournal(userId),
        resilienceService.getMindfulnessHistory(userId),
        resilienceService.getTotalMindfulnessMinutes(userId),
        resilienceService.getActionPlans(userId),
        resilienceService.getAPAAssessments(userId),
        resilienceService.getLatestAPAAssessment(userId)
      ]);

      set({
        totalPoints,
        currentStreak,
        weeklyStats,
        pointsByActivity,
        emotionalCanvasHistory,
        myGiftsHistory,
        journalEntries,
        todayJournal,
        mindfulnessHistory,
        totalMindfulnessMinutes,
        actionPlans,
        apaAssessments,
        latestAPAAssessment,
        loading: false
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error cargando datos';
      set({ error: message, loading: false });
    }
  },

  saveEmotionalCanvas: async (data) => {
    set({ loading: true, error: null });
    try {
      await resilienceService.saveEmotionalCanvas(data);
      // Reload data
      const [totalPoints, emotionalCanvasHistory] = await Promise.all([
        resilienceService.getTotalPoints(data.user_id),
        resilienceService.getEmotionalCanvasHistory(data.user_id)
      ]);
      set({ totalPoints, emotionalCanvasHistory, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error guardando';
      set({ error: message, loading: false });
    }
  },

  saveMyGiftsQuiz: async (data) => {
    set({ loading: true, error: null });
    try {
      await resilienceService.saveMyGiftsQuiz(data);
      const [totalPoints, myGiftsHistory] = await Promise.all([
        resilienceService.getTotalPoints(data.user_id),
        resilienceService.getMyGiftsHistory(data.user_id)
      ]);
      set({ totalPoints, myGiftsHistory, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error guardando';
      set({ error: message, loading: false });
    }
  },

  saveJournalEntry: async (data) => {
    set({ loading: true, error: null });
    try {
      await resilienceService.saveJournalEntry(data);
      const [totalPoints, journalEntries, todayJournal] = await Promise.all([
        resilienceService.getTotalPoints(data.user_id),
        resilienceService.getJournalEntries(data.user_id),
        resilienceService.getTodayJournal(data.user_id)
      ]);
      set({ totalPoints, journalEntries, todayJournal, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error guardando';
      set({ error: message, loading: false });
    }
  },

  saveMindfulnessSession: async (data) => {
    set({ loading: true, error: null });
    try {
      await resilienceService.saveMindfulnessSession(data);
      const [totalPoints, mindfulnessHistory, totalMindfulnessMinutes] = await Promise.all([
        resilienceService.getTotalPoints(data.user_id),
        resilienceService.getMindfulnessHistory(data.user_id),
        resilienceService.getTotalMindfulnessMinutes(data.user_id)
      ]);
      set({ totalPoints, mindfulnessHistory, totalMindfulnessMinutes, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error guardando';
      set({ error: message, loading: false });
    }
  },

  saveActionPlan: async (data) => {
    set({ loading: true, error: null });
    try {
      await resilienceService.saveActionPlan(data);
      const [totalPoints, actionPlans] = await Promise.all([
        resilienceService.getTotalPoints(data.user_id),
        resilienceService.getActionPlans(data.user_id)
      ]);
      set({ totalPoints, actionPlans, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error guardando';
      set({ error: message, loading: false });
    }
  },

  updateActionPlan: async (planId, updates) => {
    try {
      await resilienceService.updateActionPlan(planId, updates);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error actualizando';
      set({ error: message });
    }
  },

  saveAPAAssessment: async (data) => {
    set({ loading: true, error: null });
    try {
      await resilienceService.saveAPAAssessment(data);
      const [totalPoints, apaAssessments, latestAPAAssessment] = await Promise.all([
        resilienceService.getTotalPoints(data.user_id),
        resilienceService.getAPAAssessments(data.user_id),
        resilienceService.getLatestAPAAssessment(data.user_id)
      ]);
      set({ totalPoints, apaAssessments, latestAPAAssessment, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error guardando';
      set({ error: message, loading: false });
    }
  },

  clearError: () => set({ error: null })
}));
