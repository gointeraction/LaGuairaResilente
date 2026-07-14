import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Map, 
  Award, 
  Briefcase, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ChevronDown,
  User,
  Shield,
  Trophy,
  MapPin,
  BarChart3,
  Home,
  Mic,
  Users as UsersIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Cursos', path: '/courses', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Centro de Resiliencia', path: '/resilience', icon: <Award className="w-5 h-5" /> },
  { label: 'Directorio', path: '/directory', icon: <Users className="w-5 h-5" /> },
  { label: 'Ofertas de Empleo', path: '/jobs', icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Tabla de Líderes', path: '/leaderboard', icon: <Trophy className="w-5 h-5" /> },
  { label: 'Mapa de Cobertura', path: '/coverage-map', icon: <MapPin className="w-5 h-5" /> },
  { label: 'Censo Digital', path: '/census', icon: <Map className="w-5 h-5" /> },
  { label: 'Portal de Patrocinio', path: '/sponsor-portal', icon: <Users className="w-5 h-5" />, roles: ['SPONSOR', 'ADMIN'] },
  { label: 'Reportes', path: '/reports', icon: <Settings className="w-5 h-5" />, roles: ['ADMIN', 'COORDINATOR'] },
  { label: 'Coordinación', path: '/coordination', icon: <Home className="w-5 h-5" />, roles: ['ADMIN', 'COORDINATOR'] },
  { label: 'Charlas & Eventos', path: '/coordination/events', icon: <Mic className="w-5 h-5" />, roles: ['ADMIN', 'COORDINATOR'] },
  { label: 'Reuniones', path: '/coordination/meetings', icon: <UsersIcon className="w-5 h-5" />, roles: ['ADMIN', 'COORDINATOR'] },
  { label: 'Admin Panel', path: '/admin', icon: <Shield className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <BarChart3 className="w-5 h-5" />, roles: ['ADMIN'] },
];

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada');
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const initials = user ? `${user.profile.first_name[0]}${user.profile.last_name[0]}` : '';
  const fullName = user ? `${user.profile.first_name} ${user.profile.last_name}` : '';
  const roleName = user?.role?.replace('_', ' ') || '';

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LR</span>
            </div>
            <span className="font-bold text-primary-900 hidden sm:block">La Guaira Resiliente</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === item.path 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{roleName}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">Notificaciones</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm text-gray-800">¡Bienvenido a La Guaira Resiliente Digital!</p>
                      <p className="text-xs text-gray-500 mt-1">Hace 2 horas</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm text-gray-800">Nuevo curso disponible: Continuidad Comercial Digital</p>
                      <p className="text-xs text-gray-500 mt-1">Hace 1 día</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-primary-600 hover:text-primary-700">
                      Ver todas
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button 
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-sm">{initials}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-medium text-gray-800">{fullName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close menus */}
      {(userMenuOpen || notificationsOpen) && (
        <div 
          className="fixed inset-0 z-20"
          onClick={() => {
            setUserMenuOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}
    </>
  );
}
