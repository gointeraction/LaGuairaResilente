import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import {
  startTour,
  stopTour,
  hasSeenTutorial,
  markTutorialSeen,
  type TutorialTour,
} from '../../services/tutorial';

interface TutorialContextType {
  isTourActive: boolean;
  hasSeen: boolean;
  start: (tour: TutorialTour) => void;
  stop: () => void;
  reset: () => void;
  markSeen: () => void;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

const TOUR_BY_PATH: Record<string, TutorialTour> = {
  '/dashboard': 'dashboard',
  '/courses': 'courses',
  '/resilience': 'resilience',
  '/leaderboard': 'leaderboard',
  '/coordination': 'coordination',
  '/admin': 'admin',
};

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [hasSeen, setHasSeen] = useState(hasSeenTutorial());

  useEffect(() => {
    setHasSeen(hasSeenTutorial());
  }, []);

  const handleStart = useCallback((tour: TutorialTour) => {
    setIsTourActive(true);
    startTour(tour);

    const interval = setInterval(() => {
      if (!document.querySelector('.driver-active')) {
        clearInterval(interval);
        setIsTourActive(false);
      }
    }, 500);
  }, []);

  const handleStop = useCallback(() => {
    stopTour();
    setIsTourActive(false);
  }, []);

  const handleReset = useCallback(() => {
    stopTour();
    setIsTourActive(false);
    setHasSeen(false);
    markTutorialSeen();
  }, []);

  const handleMarkSeen = useCallback(() => {
    markTutorialSeen();
    setHasSeen(true);
  }, []);

  useEffect(() => {
    if (!hasSeen) {
      const timer = setTimeout(() => {
        handleStart('welcome');
        handleMarkSeen();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSeen, handleStart, handleMarkSeen]);

  return (
    <TutorialContext.Provider
      value={{
        isTourActive,
        hasSeen,
        start: handleStart,
        stop: handleStop,
        reset: handleReset,
        markSeen: handleMarkSeen,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
}

export function usePageTutorial() {
  const { start } = useTutorial();
  const location = useLocation();

  const startPageTour = useCallback(() => {
    const tour = TOUR_BY_PATH[location.pathname];
    if (tour) {
      start(tour);
    }
  }, [location.pathname, start]);

  const availableTour = TOUR_BY_PATH[location.pathname] || null;

  return { startPageTour, availableTour };
}
