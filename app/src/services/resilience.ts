import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ============================================
// TYPES
// ============================================

export interface ResilienceActivity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  data: any;
  points_earned: number;
  completed_at: string;
  created_at: string;
}

export type ActivityType = 
  | 'EMOTIONAL_CANVAS'
  | 'MY_GIFTS_QUIZ'
  | 'DAILY_JOURNAL'
  | 'MINDFULNESS_SESSION'
  | 'ACTION_PLAN'
  | 'APA_ASSESSMENT'
  | 'RESILIENCE_COURSE';

export interface EmotionalCanvasEntry {
  id: string;
  user_id: string;
  colors: string[];
  emotions: string[];
  reflection: string;
  mandala_pattern: string;
  points_earned: number;
  created_at: string;
}

export interface MyGiftsEntry {
  id: string;
  user_id: string;
  selected_gifts: string[];
  custom_gifts: string[];
  reflection: string;
  points_earned: number;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  prompt: string;
  response: string;
  mood_before: number;
  mood_after: number;
  gratitude: string[];
  points_earned: number;
  created_at: string;
}

export interface MindfulnessSession {
  id: string;
  user_id: string;
  session_type: 'BREATHING' | 'BODY_SCAN' | 'GUIDED_VISUALIZATION' | 'MEDITATION';
  duration_minutes: number;
  completed: boolean;
  points_earned: number;
  created_at: string;
}

export interface ActionPlan {
  id: string;
  user_id: string;
  goal: string;
  steps: { step: string; completed: boolean }[];
  target_date: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  points_earned: number;
  created_at: string;
}

export interface APAAssessment {
  id: string;
  user_id: string;
  scores: {
    connections: number;
    perspective: number;
    acceptance: number;
    goals: number;
    action: number;
    self_discovery: number;
    self_view: number;
    context: number;
    hope: number;
    self_care: number;
  };
  total_score: number;
  feedback: string;
  created_at: string;
}

// ============================================
// RESILIENCE ACTIVITIES SERVICE
// ============================================

export const resilienceService = {
  // ============================================
  // EMOTIONAL CANVAS
  // ============================================
  
  async saveEmotionalCanvas(data: Omit<EmotionalCanvasEntry, 'id' | 'points_earned' | 'created_at'>): Promise<EmotionalCanvasEntry> {
    const entry = {
      ...data,
      points_earned: 15,
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'resilience_emotional_canvas'), entry);
    
    // Award points
    await this.awardPoints(data.user_id, 15, 'EMOTIONAL_CANVAS', docRef.id);
    
    return { id: docRef.id, ...entry } as EmotionalCanvasEntry;
  },

  async getEmotionalCanvasHistory(userId: string): Promise<EmotionalCanvasEntry[]> {
    const q = query(
      collection(db, 'resilience_emotional_canvas'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmotionalCanvasEntry));
  },

  // ============================================
  // MY GIFTS QUIZ
  // ============================================
  
  async saveMyGiftsQuiz(data: Omit<MyGiftsEntry, 'id' | 'points_earned' | 'created_at'>): Promise<MyGiftsEntry> {
    const entry = {
      ...data,
      points_earned: 20,
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'resilience_my_gifts'), entry);
    await this.awardPoints(data.user_id, 20, 'MY_GIFTS_QUIZ', docRef.id);
    
    return { id: docRef.id, ...entry } as MyGiftsEntry;
  },

  async getMyGiftsHistory(userId: string): Promise<MyGiftsEntry[]> {
    const q = query(
      collection(db, 'resilience_my_gifts'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MyGiftsEntry));
  },

  // ============================================
  // DAILY JOURNAL
  // ============================================
  
  async saveJournalEntry(data: Omit<JournalEntry, 'id' | 'points_earned' | 'created_at'>): Promise<JournalEntry> {
    const entry = {
      ...data,
      points_earned: 10,
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'resilience_journal'), entry);
    await this.awardPoints(data.user_id, 10, 'DAILY_JOURNAL', docRef.id);
    
    return { id: docRef.id, ...entry } as JournalEntry;
  },

  async getJournalEntries(userId: string, limitCount = 30): Promise<JournalEntry[]> {
    const q = query(
      collection(db, 'resilience_journal'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limitCount).map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
  },

  async getTodayJournal(userId: string): Promise<JournalEntry | null> {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'resilience_journal'),
      where('user_id', '==', userId),
      where('created_at', '>=', today)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as JournalEntry;
  },

  // ============================================
  // MINDFULNESS SESSIONS
  // ============================================
  
  async saveMindfulnessSession(data: Omit<MindfulnessSession, 'id' | 'points_earned' | 'created_at'>): Promise<MindfulnessSession> {
    const points = data.duration_minutes >= 10 ? 15 : 10;
    const entry = {
      ...data,
      points_earned: points,
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'resilience_mindfulness'), entry);
    await this.awardPoints(data.user_id, points, 'MINDFULNESS_SESSION', docRef.id);
    
    return { id: docRef.id, ...entry } as MindfulnessSession;
  },

  async getMindfulnessHistory(userId: string): Promise<MindfulnessSession[]> {
    const q = query(
      collection(db, 'resilience_mindfulness'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MindfulnessSession));
  },

  async getTotalMindfulnessMinutes(userId: string): Promise<number> {
    const sessions = await this.getMindfulnessHistory(userId);
    return sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  },

  // ============================================
  // ACTION PLAN
  // ============================================
  
  async saveActionPlan(data: Omit<ActionPlan, 'id' | 'points_earned' | 'created_at'>): Promise<ActionPlan> {
    const completedSteps = data.steps.filter(s => s.completed).length;
    const points = completedSteps * 5;
    
    const entry = {
      ...data,
      points_earned: points,
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'resilience_action_plans'), entry);
    if (points > 0) {
      await this.awardPoints(data.user_id, points, 'ACTION_PLAN', docRef.id);
    }
    
    return { id: docRef.id, ...entry } as ActionPlan;
  },

  async updateActionPlan(planId: string, updates: Partial<ActionPlan>): Promise<void> {
    await updateDoc(doc(db, 'resilience_action_plans', planId), updates);
  },

  async getActionPlans(userId: string): Promise<ActionPlan[]> {
    const q = query(
      collection(db, 'resilience_action_plans'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActionPlan));
  },

  // ============================================
  // APA ASSESSMENT
  // ============================================
  
  async saveAPAAssessment(data: Omit<APAAssessment, 'id' | 'total_score' | 'feedback' | 'created_at'>): Promise<APAAssessment> {
    const totalScore = Object.values(data.scores).reduce((sum, score) => sum + score, 0);
    const maxScore = 100;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    let feedback = '';
    if (percentage >= 80) {
      feedback = '¡Excelente! Tienes una resiliencia muy alta. Continúa cultivando estas habilidades.';
    } else if (percentage >= 60) {
      feedback = 'Buen nivel de resiliencia. Hay áreas donde puedes seguir creciendo.';
    } else if (percentage >= 40) {
      feedback = 'Nivel moderado. Te recomendamos practicar más actividades de resiliencia.';
    } else {
      feedback = 'Estás comenzando tu camino. Cada paso cuenta. ¡Sigue adelante!';
    }
    
    const entry = {
      ...data,
      total_score: totalScore,
      feedback,
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'resilience_apa_assessments'), entry);
    
    // Award points based on score
    const points = Math.min(50, Math.round(percentage / 2));
    await this.awardPoints(data.user_id, points, 'APA_ASSESSMENT', docRef.id);
    
    return { id: docRef.id, ...entry } as APAAssessment;
  },

  async getAPAAssessments(userId: string): Promise<APAAssessment[]> {
    const q = query(
      collection(db, 'resilience_apa_assessments'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as APAAssessment));
  },

  async getLatestAPAAssessment(userId: string): Promise<APAAssessment | null> {
    const assessments = await this.getAPAAssessments(userId);
    return assessments.length > 0 ? assessments[0] : null;
  },

  // ============================================
  // POINTS SYSTEM
  // ============================================
  
  async awardPoints(userId: string, points: number, reason: string, referenceId: string): Promise<void> {
    await addDoc(collection(db, 'resilience_points'), {
      student_id: userId,
      points,
      reason,
      reference_id: referenceId,
      created_at: new Date().toISOString()
    });
  },

  async getTotalPoints(userId: string): Promise<number> {
    const q = query(
      collection(db, 'resilience_points'),
      where('student_id', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.reduce((sum, doc) => sum + doc.data().points, 0);
  },

  async getPointsByActivity(userId: string): Promise<Record<ActivityType, number>> {
    const q = query(
      collection(db, 'resilience_points'),
      where('student_id', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    const pointsByActivity: Record<string, number> = {};
    snapshot.docs.forEach(doc => {
      const reason = doc.data().reason;
      pointsByActivity[reason] = (pointsByActivity[reason] || 0) + doc.data().points;
    });
    
    return pointsByActivity as Record<ActivityType, number>;
  },

  // ============================================
  // STREAKS & STATS
  // ============================================
  
  async getCurrentStreak(userId: string): Promise<number> {
    const journalEntries = await this.getJournalEntries(userId, 60);
    
    if (journalEntries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasEntry = journalEntries.some(entry => 
        entry.created_at.startsWith(dateStr)
      );
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  },

  async getWeeklyStats(userId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const q = query(
      collection(db, 'resilience_points'),
      where('student_id', '==', userId),
      where('created_at', '>=', oneWeekAgo.toISOString())
    );
    const snapshot = await getDocs(q);
    
    let totalPoints = 0;
    let activityCount = 0;
    
    snapshot.docs.forEach(doc => {
      totalPoints += doc.data().points;
      activityCount++;
    });
    
    return { totalPoints, activityCount };
  }
};
