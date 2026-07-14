import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { TutorialProvider } from './TutorialProvider';
import TutorialButton from './TutorialButton';

export default function Layout() {
  return (
    <TutorialProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="lg:pl-64">
          <Outlet />
        </main>
        <TutorialButton />
      </div>
    </TutorialProvider>
  );
}
