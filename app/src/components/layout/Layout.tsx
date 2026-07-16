import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { TutorialProvider } from './TutorialProvider';
import TutorialButton from './TutorialButton';
import { useAuthStore } from '../../stores/authStore';

export default function Layout() {
  const { user } = useAuthStore();

  const footerContent = (
    <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200 bg-white">
      <p>elaborado por Dirección de IA de CAVECOM-E 2026</p>
    </footer>
  );

  // Public pages: render without tutorial system
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        {footerContent}
      </div>
    );
  }

  // Authenticated pages: full layout with navigation + tutorials
  return (
    <TutorialProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="lg:pl-64 flex-1">
          <Outlet />
        </main>
        <div className="lg:pl-64">
          {footerContent}
        </div>
        <TutorialButton />
      </div>
    </TutorialProvider>
  );
}
