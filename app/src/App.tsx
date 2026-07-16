import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import Census from './pages/Census';
import Jobs from './pages/Jobs';
import SponsorPortal from './pages/SponsorPortal';
import Reports from './pages/Reports';
import Resilience from './pages/Resilience';
import Directory from './pages/Directory';
import SupportNetworkRegister from './pages/SupportNetworkRegister';
import HelpRequestPage from './pages/HelpRequestPage';
import PublicSponsorPortal from './pages/PublicSponsorPortal';
import SponsorDashboard from './pages/SponsorDashboard';
import LoadingSpinner from './components/ui/LoadingSpinner';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';
import CoverageMap from './pages/CoverageMap';
import CoordinationDashboard from './pages/CoordinationDashboard';
import EventsManagement from './pages/EventsManagement';
import MeetingsManagement from './pages/MeetingsManagement';
import CampsManagement from './pages/CampsManagement';
import WiFiNodesManagement from './pages/WiFiNodesManagement';
import LogisticsPage from './pages/LogisticsPage';
import MatchingPage from './pages/MatchingPage';
import AnonymousDashboardPage from './pages/AnonymousDashboardPage';
import PointsRedemptionPage from './pages/PointsRedemptionPage';
import CertificatesPage from './pages/CertificatesPage';
import GameLobby from './pages/GameLobby';
import PhaserGame from './games/PhaserGame';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Public Route component (redirect if logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Wrapper for Phaser Game
function PhaserGameWrapper() {
  const { gameType } = useParams<{ gameType: string }>();
  const navigate = useNavigate();
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const username = 'Jugador'; // In real app, get from auth store

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <PhaserGame
        gameType={gameType || 'glosario'}
        sessionId={sessionId}
        username={username}
        onBack={() => navigate('/games')}
        onGameOver={(scores) => {
          console.log('Game over:', scores);
          navigate('/games');
        }}
      />
    </div>
  );
}

function App() {
  const { initialize } = useAuthStore();
  
  useEffect(() => {
    const unsubscribe = initialize();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initialize]);
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Public routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/directory" element={<Directory />} />
        <Route path="/support-network-register" element={<SupportNetworkRegister />} />
        <Route path="/solicitar-ayuda" element={<HelpRequestPage />} />
        <Route path="/patrocinadores" element={<PublicSponsorPortal />} />
      </Route>

      {/* Protected routes with Layout */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/census" element={<Census />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/sponsor-portal" element={<SponsorPortal />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/resilience" element={<Resilience />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/coverage-map" element={<CoverageMap />} />
        <Route path="/coordination" element={<CoordinationDashboard />} />
        <Route path="/coordination/events" element={<EventsManagement />} />
        <Route path="/coordination/meetings" element={<MeetingsManagement />} />
        <Route path="/coordination/camps" element={<CampsManagement />} />
        <Route path="/coordination/wifi" element={<WiFiNodesManagement />} />
        <Route path="/coordination/logistics" element={<LogisticsPage />} />
        <Route path="/coordination/matching" element={<MatchingPage />} />
        <Route path="/coordination/patrocinadores" element={<SponsorDashboard />} />
        <Route path="/sponsor-portal/anonymous" element={<AnonymousDashboardPage />} />
        <Route path="/redemption" element={<PointsRedemptionPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/games" element={<GameLobby />} />
        <Route path="/games/play/:gameType" element={<PhaserGameWrapper />} />
      </Route>
      
      {/* Default redirect — public landing */}
      <Route path="/" element={<Navigate to="/directory" replace />} />
      <Route path="*" element={<Navigate to="/directory" replace />} />
    </Routes>
  );
}

export default App;
