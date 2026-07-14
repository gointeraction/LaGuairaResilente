import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Notification } from '../types';

export const notificationService = {
  async getNotifications(userId: string, limitCount = 20): Promise<Notification[]> {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Notification));
  },

  async getUnreadCount(userId: string): Promise<number> {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
      read_at: new Date().toISOString()
    });
  },

  async markAllAsRead(userId: string): Promise<void> {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { 
        read: true, 
        read_at: new Date().toISOString() 
      });
    });
    
    await batch.commit();
  },

  async createNotification(data: {
    user_id: string;
    title: string;
    body: string;
    type: Notification['type'];
    data?: Record<string, any>;
  }): Promise<void> {
    await addDoc(collection(db, 'notifications'), {
      ...data,
      data: data.data || {},
      read: false,
      created_at: new Date().toISOString()
    });
  },

  // Real-time listener for notifications
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as unknown as Notification));
      callback(notifications);
    });
  },

  // Real-time listener for unread count
  subscribeToUnreadCount(userId: string, callback: (count: number) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      where('read', '==', false)
    );
    
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    });
  },

  // Batch create notifications for multiple users
  async createBulkNotifications(userIds: string[], data: {
    title: string;
    body: string;
    type: Notification['type'];
    data?: Record<string, any>;
  }): Promise<void> {
    const batch = writeBatch(db);
    
    userIds.forEach(userId => {
      const docRef = doc(collection(db, 'notifications'));
      batch.set(docRef, {
        user_id: userId,
        ...data,
        data: data.data || {},
        read: false,
        created_at: new Date().toISOString()
      });
    });
    
    await batch.commit();
  },

  // Delete old notifications (cleanup)
  async deleteOldNotifications(userId: string, daysOld = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      where('created_at', '<', cutoffDate.toISOString()),
      where('read', '==', true)
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }
};
