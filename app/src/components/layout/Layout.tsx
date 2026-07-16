import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { TutorialProvider } from './TutorialProvider';
import TutorialButton from './TutorialButton';
import { useAuthStore } from '../../stores/authStore';

export default function Layout() {
  const { user } = useAuthStore();

  // Public pages: render without tutorial system
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    );
  }

  // Authenticated pages: full layout with navigation + tutorials
  return (
    <TutorialProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="lg:pl-64 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
        <TutorialButton />
      </div>
    </TutorialProvider>
  );
}
