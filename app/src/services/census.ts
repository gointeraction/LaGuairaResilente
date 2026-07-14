import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  GeoPoint 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CensusSurvey, Municipality } from '../types';

interface CensusResponse {
  question_id: string;
  answer: string | number | boolean;
  skipped: boolean;
}

export const censusService = {
  async createSurvey(data: {
    surveyor_id: string;
    respondent_name: string;
    respondent_cedula: string;
    municipality: Municipality;
    camp_id?: string;
    coordinates: { latitude: number; longitude: number };
    responses: CensusResponse[];
  }): Promise<CensusSurvey> {
    const surveyData = {
      ...data,
      coordinates: new GeoPoint(data.coordinates.latitude, data.coordinates.longitude),
      timestamp: new Date().toISOString(),
      status: 'SUBMITTED'
    };

    const docRef = await addDoc(collection(db, 'census_surveys'), surveyData);
    
    // Update user's digital literacy level based on response Q1
    const digitalLevelResponse = data.responses.find(r => r.question_id === 'Q1');
    if (digitalLevelResponse && !digitalLevelResponse.skipped) {
      // Find user by cedula and update their level
      const usersQuery = query(
        collection(db, 'users'),
        where('profile.cedula', '==', data.respondent_cedula)
      );
      const usersSnapshot = await getDocs(usersQuery);
      
      if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), {
          'profile.digital_literacy_level': digitalLevelResponse.answer,
          'profile.is_affected': true,
          updated_at: new Date().toISOString()
        });
      }
    }

    return { id: docRef.id, ...surveyData } as unknown as CensusSurvey;
  },

  async getSurveys(surveyorId?: string): Promise<CensusSurvey[]> {
    let q;
    if (surveyorId) {
      q = query(
        collection(db, 'census_surveys'),
        where('surveyor_id', '==', surveyorId),
        orderBy('timestamp', 'desc')
      );
    } else {
      q = query(
        collection(db, 'census_surveys'),
        orderBy('timestamp', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as CensusSurvey));
  },

  async getSurveysByMunicipality(municipality: Municipality): Promise<CensusSurvey[]> {
    const q = query(
      collection(db, 'census_surveys'),
      where('municipality', '==', municipality),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as CensusSurvey));
  },

  async updateSurveyStatus(surveyId: string, status: CensusSurvey['status']): Promise<void> {
    await updateDoc(doc(db, 'census_surveys', surveyId), {
      status,
      updated_at: new Date().toISOString()
    });
  },

  async getSurveyStats() {
    const snapshot = await getDocs(collection(db, 'census_surveys'));
    const surveys = snapshot.docs.map(doc => doc.data());
    
    const byMunicipality = {
      CATIA_LA_MAR: 0,
      MAIQUETIA: 0,
      MACUTO: 0,
      CARABALLEDA: 0
    };
    
    const byDigitalLevel = {
      NONE: 0,
      BASIC: 0,
      INTERMEDIATE: 0,
      ADVANCED: 0
    };

    surveys.forEach(survey => {
      const municipality = survey.municipality as Municipality;
      if (municipality in byMunicipality) {
        byMunicipality[municipality]++;
      }

      const digitalResponse = survey.responses?.find((r: any) => r.question_id === 'Q1');
      if (digitalResponse && !digitalResponse.skipped) {
        const level = digitalResponse.answer as keyof typeof byDigitalLevel;
        if (level in byDigitalLevel) {
          byDigitalLevel[level]++;
        }
      }
    });

    return {
      total: surveys.length,
      byMunicipality,
      byDigitalLevel
    };
  }
};
