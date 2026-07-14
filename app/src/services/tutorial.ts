import { driver, type DriveStep, type Config } from 'driver.js';
import 'driver.js/dist/driver.css';

export type TutorialTour = 
  | 'welcome' 
  | 'dashboard' 
  | 'courses' 
  | 'resilience' 
  | 'leaderboard' 
  | 'coordination' 
  | 'admin';

interface TourConfig {
  title: string;
  description: string;
  steps: DriveStep[];
}

export const TOUR_DEFINITIONS: Record<TutorialTour, TourConfig> = {
  welcome: {
    title: 'Bienvenido a La Guaira Resiliente',
    description: 'Te presentamos las funcionalidades principales de la plataforma',
    steps: [
      {
        element: '[data-tutorial-id="sidebar-logo"]',
        popover: {
          title: '🏠 Logo de la Plataforma',
          description: 'Haz clic aquí para volver al dashboard en cualquier momento.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '[data-tutorial-id="nav-dashboard"]',
        popover: {
          title: '📊 Panel Principal',
          description: 'Tu centro de control. Aquí ves tus estadísticas, cursos inscritos y puntos de resiliencia.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="nav-courses"]',
        popover: {
          title: '📚 Aula Resiliente',
          description: 'Accede a los cursos de capacitación digital: Continuidad Comercial, Micro-oficios y Logística.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="nav-resilience"]',
        popover: {
          title: '🧠 Centro de Resiliencia',
          description: 'Actividades de bienestar emocional: lienzos, diarios, mindfulness y planes de acción.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="nav-leaderboard"]',
        popover: {
          title: '🏆 Tabla de Líderes',
          description: 'Compite con otros participantes y gana puntos de resiliencia.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="nav-coverage-map"]',
        popover: {
          title: '📍 Mapa de Cobertura',
          description: 'Explora la infraestructura de conectividad en las 4 municipalities.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="header-notifications"]',
        popover: {
          title: '🔔 Notificaciones',
          description: 'Mantente informado sobre nuevas actividades, cursos y eventos.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '[data-tutorial-id="header-user-menu"]',
        popover: {
          title: '👤 Tu Cuenta',
          description: 'Gestiona tu perfil, ajustes y cerrar sesión.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        popover: {
          title: '🎉 ¡Listo para comenzar!',
          description: 'Explora la plataforma y acumula puntos de resiliencia. ¡Tú puedes!',
        },
      },
    ],
  },
  dashboard: {
    title: 'Tu Dashboard',
    description: 'Conoce tu panel de control personalizado',
    steps: [
      {
        element: '[data-tutorial-id="dashboard-stats"]',
        popover: {
          title: '📈 Tus Estadísticas',
          description: 'Aquí ves tu progreso: cursos inscritos, puntos de resiliencia y actividades completadas.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="dashboard-actions"]',
        popover: {
          title: '⚡ Acciones Rápidas',
          description: 'Accede directamente a las secciones más importantes: cursos, patrocinio y perfil.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="dashboard-welcome"]',
        popover: {
          title: '💚 Mensaje de Bienvenida',
          description: 'Lee las novedades y consejos para aprovechar al máximo la plataforma.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },
  courses: {
    title: 'Aula Resiliente',
    description: 'Explora los cursos de capacitación digital',
    steps: [
      {
        element: '[data-tutorial-id="courses-tracks"]',
        popover: {
          title: '🛤️ Tracks de Aprendizaje',
          description: 'Elige entre 3 rutas: Continuidad Comercial Digital, Micro-oficios Remotos o Logística de Suministros.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="courses-list"]',
        popover: {
          title: '📖 Cursos Disponibles',
          description: 'Cada track contiene módulos con lecciones, videos y evaluaciones.',
          side: 'left',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="courses-progress"]',
        popover: {
          title: '📊 Progreso del Curso',
          description: 'Sigue tu avance con barra de progreso y puntos acumulados.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },
  resilience: {
    title: 'Centro de Resiliencia',
    description: 'Actividades para tu bienestar emocional',
    steps: [
      {
        element: '[data-tutorial-id="resilience-points"]',
        popover: {
          title: '⭐ Puntos de Resiliencia',
          description: 'Acumula puntos completando actividades. ¡Cada actividad vale!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="resilience-activities"]',
        popover: {
          title: '🎨 Actividades Disponibles',
          description: 'Explora 6 actividades: Lienzo Emocional, Mis Dones, Diario, Mindfulness, Plan de Acción y Evaluación APA.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },
  leaderboard: {
    title: 'Tabla de Líderes',
    description: 'Compite y escala en el ranking',
    steps: [
      {
        element: '[data-tutorial-id="leaderboard-podium"]',
        popover: {
          title: '🥇🥈🥉 Podio',
          description: 'Los 3 participantes con más puntos aparecen destacados.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="leaderboard-ranking"]',
        popover: {
          title: '📋 Ranking Completo',
          description: 'Tu posición en la tabla general. ¡Sigue acumulando puntos para subir!',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },
  coordination: {
    title: 'Coordinación',
    description: 'Gestión de campamentos, WiFi, logística y matching',
    steps: [
      {
        element: '[data-tutorial-id="coordination-camps"]',
        popover: {
          title: '🏕️ Campamentos',
          description: 'Administra los 15 campamentos en 4 municipalities con su capacidad y servicios.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="coordination-wifi"]',
        popover: {
          title: '📶 Nodos WiFi',
          description: 'Monitorea los 10 nodos de conectividad: fibra, satelital, 4G y MESH.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="coordination-logistics"]',
        popover: {
          title: '🚚 Logística',
          description: 'Gestiona entregas, distribución de alimentos y recargas móviles.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="coordination-matching"]',
        popover: {
          title: '🤝 Matching',
          description: 'Asigna automáticamente patrocinadores a beneficiarios con algoritmo de puntuación.',
          side: 'right',
          align: 'center',
        },
      },
    ],
  },
  admin: {
    title: 'Panel de Administración',
    description: 'Gestión avanzada de la plataforma',
    steps: [
      {
        element: '[data-tutorial-id="admin-users"]',
        popover: {
          title: '👥 Gestión de Usuarios',
          description: 'Administra roles, aprueba registros y gestiona las cuentas de la plataforma.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '[data-tutorial-id="admin-stats"]',
        popover: {
          title: '📊 Métricas Globales',
          description: 'Visualiza el rendimiento de la plataforma con gráficos y KPIs.',
          side: 'left',
          align: 'center',
        },
      },
    ],
  },
};

let driverInstance: ReturnType<typeof driver> | null = null;

export function getDriverConfig(tour: TutorialTour): Config {
  const tourConfig = TOUR_DEFINITIONS[tour];
  
  return {
    showProgress: true,
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.6)',
    smoothScroll: true,
    allowClose: true,
    stagePadding: 8,
    stageRadius: 8,
    popoverOffset: 12,
    popoverClass: 'driver-popover',
    progressText: 'Paso {{current}} de {{total}}',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Finalizar',
    allowKeyboardControl: true,
    steps: tourConfig.steps,
  };
}

export function startTour(tour: TutorialTour): void {
  stopTour();
  
  const config = getDriverConfig(tour);
  driverInstance = driver(config);
  driverInstance.drive();
}

export function highlightElement(selector: string, title: string, description: string): void {
  stopTour();
  
  driverInstance = driver({
    showProgress: false,
    overlayColor: 'rgba(0, 0, 0, 0.4)',
    animate: true,
    steps: [
      {
        element: selector,
        popover: {
          title,
          description,
          side: 'bottom',
          align: 'center',
        },
      },
    ],
  });
  
  driverInstance.drive();
}

export function stopTour(): void {
  if (driverInstance) {
    driverInstance.destroy();
    driverInstance = null;
  }
}

export function isTourActive(): boolean {
  return driverInstance !== null;
}

export const TUTORIAL_STORAGE_KEY = 'lgresiliente-tutorial-seen';

export function hasSeenTutorial(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markTutorialSeen(): void {
  try {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  } catch {
    // localStorage not available
  }
}

export function resetTutorial(): void {
  try {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}
