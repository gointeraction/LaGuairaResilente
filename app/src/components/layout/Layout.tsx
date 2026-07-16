import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { TutorialProvider } from './TutorialProvider';
import TutorialButton from './TutorialButton';
import { useAuthStore } from '../../stores/authStore';

export default function Layout() {
  const { user } = useAuthStore();

  return (
    <TutorialProvider>
      <div className="min-h-screen bg-gray-50">
        {user && <Navigation />}
        <main className={`${user ? 'lg:pl-64' : ''} min-h-[calc(100vh-4rem)]`}>
          <Outlet />
        </main>
        {user && <TutorialButton />}
      </div>
    </TutorialProvider>
  );
}
