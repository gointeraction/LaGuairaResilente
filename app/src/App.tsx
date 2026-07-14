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
        <Route path="/directory" element={<Directory />} />
        <Route path="/support-network-register" element={<SupportNetworkRegister />} />
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
        <Route path="/sponsor-portal/anonymous" element={<AnonymousDashboardPage />} />
        <Route path="/redemption" element={<PointsRedemptionPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
      </Route>
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
