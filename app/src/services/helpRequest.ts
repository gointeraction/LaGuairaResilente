import { 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface HelpRequest {
  id: string;
  help_type: string;
  urgency_level: string;
  state: string;
  municipality: string;
  modality: 'IN_PERSON' | 'REMOTE' | 'BOTH';
  description: string;
  requester_name: string;
  contact_whatsapp?: string;
  contact_landline?: string;
  contact_email?: string;
  data_consent: boolean;
  sharing_consent: boolean;
  status: 'PENDING' | 'ASSIGNED' | 'RESOLVED';
  created_at: string;
}

export const helpRequestService = {
  // Submit a new help request (Public)
  async submitHelpRequest(data: Omit<HelpRequest, 'id' | 'status' | 'created_at'>): Promise<HelpRequest> {
    const requestData = {
      ...data,
      status: 'PENDING' as const,
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'help_requests'), requestData);
    return { id: docRef.id, ...requestData } as HelpRequest;
  },

  // Get all help requests (Admin/Coordinator)
  async getHelpRequests(): Promise<HelpRequest[]> {
    const q = query(
      collection(db, 'help_requests'),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HelpRequest));
  },

  // Update status of help request
  async updateRequestStatus(requestId: string, status: HelpRequest['status']): Promise<void> {
    await updateDoc(doc(db, 'help_requests', requestId), {
      status,
      updated_at: new Date().toISOString()
    });
  }
};
