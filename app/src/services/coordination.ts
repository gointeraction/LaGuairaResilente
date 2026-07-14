import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';

// ============================================
// TYPES
// ============================================

export type EventType = 'CHARLA' | 'REUNION' | 'TALLER' | 'CAPACITACION' | 'EMERGENCIA' | 'SOCIAL';
export type EventStatus = 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO' | 'POSPUESTO';
export type ShelterZone = 'CATIA_LA_MAR' | 'MAIQUETIA' | 'MACUTO' | 'CARABALLEDA';

export interface Shelter {
  id: string;
  name: string;
  municipality: string;
  address: string;
  capacity: number;
  current_occupancy: number;
  zone: ShelterZone;
  coordinator_id: string;
  coordinator_name: string;
  contact_phone: string;
  amenities: string[];
  status: 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO';
  created_at: any;
  updated_at: any;
}

export interface CoordinationEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  shelter_id: string;
  shelter_name: string;
  date: any;
  start_time: string;
  end_time: string;
  location: string;
  organizer_id: string;
  organizer_name: string;
  attendees_count: number;
  max_attendees: number;
  speakers: EventSpeaker[];
  agenda: AgendaItem[];
  materials: string[];
  notes: string;
  created_at: any;
  updated_at: any;
}

export interface EventSpeaker {
  name: string;
  topic: string;
  bio: string;
  contact: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  description: string;
  duration_minutes: number;
  speaker: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  type: 'ORDINARIA' | 'EXTRAORDINARIA' | 'SEGUIMIENTO' | 'EMERGENCIA';
  status: EventStatus;
  shelter_id: string;
  shelter_name: string;
  date: any;
  start_time: string;
  end_time: string;
  organizer_id: string;
  organizer_name: string;
  participants: MeetingParticipant[];
  topics: MeetingTopic[];
  decisions: string[];
  action_items: ActionItem[];
  minutes_url: string | null;
  created_at: any;
  updated_at: any;
}

export interface MeetingParticipant {
  user_id: string;
  name: string;
  role: string;
  attended: boolean;
}

export interface MeetingTopic {
  title: string;
  description: string;
  presenter: string;
  duration_minutes: number;
  status: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
}

export interface ActionItem {
  id: string;
  description: string;
  assigned_to: string;
  assigned_name: string;
  due_date: any;
  status: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADO';
  priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
}

export interface CoordinationStats {
  total_shelters: number;
  active_shelters: number;
  total_occupancy: number;
  total_capacity: number;
  upcoming_events: number;
  ongoing_events: number;
  completed_events: number;
  pending_meetings: number;
  total_beneficiaries: number;
}

// ============================================
// SHELTERS SERVICE
// ============================================

export const shelterService = {
  async getShelters(): Promise<Shelter[]> {
    const snapshot = await getDocs(collection(db, 'shelters'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Shelter[];
  },

  async getShelterById(id: string): Promise<Shelter | null> {
    const docSnap = await getDocs(query(collection(db, 'shelters'), where('__id__', '==', id)));
    if (docSnap.empty) return null;
    return { id: docSnap.docs[0].id, ...docSnap.docs[0].data() } as Shelter;
  },

  async getSheltersByMunicipality(municipality: string): Promise<Shelter[]> {
    const q = query(collection(db, 'shelters'), where('municipality', '==', municipality));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Shelter[];
  },

  async createShelter(shelter: Omit<Shelter, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'shelters'), {
      ...shelter,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async updateShelter(id: string, data: Partial<Shelter>): Promise<void> {
    const docRef = doc(db, 'shelters', id);
    await updateDoc(docRef, {
      ...data,
      updated_at: Timestamp.now()
    });
  },

  async deleteShelter(id: string): Promise<void> {
    const docRef = doc(db, 'shelters', id);
    await deleteDoc(docRef);
  },

  async getShelterStats(): Promise<CoordinationStats> {
    const shelters = await this.getShelters();
    const events = await eventService.getEvents();
    const meetings = await meetingService.getMeetings();

    const activeShelters = shelters.filter(s => s.status === 'ACTIVO');
    const totalOccupancy = shelters.reduce((sum, s) => sum + s.current_occupancy, 0);
    const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);

    return {
      total_shelters: shelters.length,
      active_shelters: activeShelters.length,
      total_occupancy: totalOccupancy,
      total_capacity: totalCapacity,
      upcoming_events: events.filter(e => e.status === 'PROGRAMADO').length,
      ongoing_events: events.filter(e => e.status === 'EN_CURSO').length,
      completed_events: events.filter(e => e.status === 'FINALIZADO').length,
      pending_meetings: meetings.filter(m => m.status === 'PROGRAMADO').length,
      total_beneficiaries: totalOccupancy
    };
  }
};

// ============================================
// EVENTS SERVICE (CHARLAS, TALLERES, etc.)
// ============================================

export const eventService = {
  async getEvents(): Promise<CoordinationEvent[]> {
    const snapshot = await getDocs(query(collection(db, 'coordination_events'), orderBy('date', 'desc')));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CoordinationEvent[];
  },

  async getEventsByShelter(shelterId: string): Promise<CoordinationEvent[]> {
    const q = query(
      collection(db, 'coordination_events'),
      where('shelter_id', '==', shelterId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CoordinationEvent[];
  },

  async getEventsByType(type: EventType): Promise<CoordinationEvent[]> {
    const q = query(
      collection(db, 'coordination_events'),
      where('type', '==', type),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CoordinationEvent[];
  },

  async getUpcomingEvents(): Promise<CoordinationEvent[]> {
    const now = Timestamp.now();
    const q = query(
      collection(db, 'coordination_events'),
      where('date', '>=', now),
      where('status', '==', 'PROGRAMADO'),
      orderBy('date', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CoordinationEvent[];
  },

  async createEvent(event: Omit<CoordinationEvent, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'coordination_events'), {
      ...event,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async updateEvent(id: string, data: Partial<CoordinationEvent>): Promise<void> {
    const docRef = doc(db, 'coordination_events', id);
    await updateDoc(docRef, {
      ...data,
      updated_at: Timestamp.now()
    });
  },

  async deleteEvent(id: string): Promise<void> {
    const docRef = doc(db, 'coordination_events', id);
    await deleteDoc(docRef);
  },

  async updateEventStatus(id: string, status: EventStatus): Promise<void> {
    const docRef = doc(db, 'coordination_events', id);
    await updateDoc(docRef, {
      status,
      updated_at: Timestamp.now()
    });
  }
};

// ============================================
// MEETINGS SERVICE
// ============================================

export const meetingService = {
  async getMeetings(): Promise<Meeting[]> {
    const snapshot = await getDocs(query(collection(db, 'coordination_meetings'), orderBy('date', 'desc')));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Meeting[];
  },

  async getMeetingsByShelter(shelterId: string): Promise<Meeting[]> {
    const q = query(
      collection(db, 'coordination_meetings'),
      where('shelter_id', '==', shelterId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Meeting[];
  },

  async getUpcomingMeetings(): Promise<Meeting[]> {
    const now = Timestamp.now();
    const q = query(
      collection(db, 'coordination_meetings'),
      where('date', '>=', now),
      where('status', '==', 'PROGRAMADO'),
      orderBy('date', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Meeting[];
  },

  async createMeeting(meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'coordination_meetings'), {
      ...meeting,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async updateMeeting(id: string, data: Partial<Meeting>): Promise<void> {
    const docRef = doc(db, 'coordination_meetings', id);
    await updateDoc(docRef, {
      ...data,
      updated_at: Timestamp.now()
    });
  },

  async deleteMeeting(id: string): Promise<void> {
    const docRef = doc(db, 'coordination_meetings', id);
    await deleteDoc(docRef);
  },

  async updateMeetingStatus(id: string, status: EventStatus): Promise<void> {
    const docRef = doc(db, 'coordination_meetings', id);
    await updateDoc(docRef, {
      status,
      updated_at: Timestamp.now()
    });
  },

  async addMinutes(meetingId: string, minutesUrl: string): Promise<void> {
    const docRef = doc(db, 'coordination_meetings', meetingId);
    await updateDoc(docRef, {
      minutes_url: minutesUrl,
      updated_at: Timestamp.now()
    });
  },

  async addActionItem(meetingId: string, actionItem: Omit<ActionItem, 'id'>): Promise<void> {
    const meetingRef = doc(db, 'coordination_meetings', meetingId);
    const meetingSnap = await getDocs(query(collection(db, 'coordination_meetings'), where('__id__', '==', meetingId)));
    
    if (!meetingSnap.empty) {
      const meetingData = meetingSnap.docs[0].data() as Meeting;
      const newActionItem = {
        ...actionItem,
        id: `action-${Date.now()}`
      };
      
      await updateDoc(meetingRef, {
        action_items: [...(meetingData.action_items || []), newActionItem],
        updated_at: Timestamp.now()
      });
    }
  }
};

// ============================================
// COORDINATION DASHBOARD SERVICE
// ============================================

export const coordinationDashboardService = {
  async getDashboardStats(): Promise<CoordinationStats> {
    return shelterService.getShelterStats();
  },

  async getSheltersWithAvailability(): Promise<(Shelter & { availability_percent: number })[]> {
    const shelters = await shelterService.getShelters();
    return shelters.map(s => ({
      ...s,
      availability_percent: Math.round(((s.capacity - s.current_occupancy) / s.capacity) * 100)
    }));
  },

  async getEventsTimeline(days: number = 7): Promise<CoordinationEvent[]> {
    const events = await eventService.getEvents();
    const now = new Date();
    const limit = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return events.filter(e => {
      const eventDate = e.date?.toDate?.() || new Date(e.date);
      return eventDate >= now && eventDate <= limit;
    });
  },

  async getMeetingAgenda(meetingId: string): Promise<Meeting | null> {
    const meetings = await meetingService.getMeetings();
    return meetings.find(m => m.id === meetingId) || null;
  }
};
