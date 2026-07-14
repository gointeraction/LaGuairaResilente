import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ResiliencePoint } from '../types';

interface UseResiliencePointsResult {
  points: ResiliencePoint[];
  totalPoints: number;
  loading: boolean;
  error: string | null;
}

export function useResiliencePoints(studentId: string | undefined): UseResiliencePointsResult {
  const [points, setPoints] = useState<ResiliencePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'resilience_points'),
      where('student_id', '==', studentId),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const pointsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ResiliencePoint[];
        
        setPoints(pointsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching resilience points:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [studentId]);

  const totalPoints = points.reduce((sum, p) => sum + p.points, 0);

  return { points, totalPoints, loading, error };
}
