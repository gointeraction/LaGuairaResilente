import { Municipality } from '../types';

export const MUNICIPALITIES: Record<Municipality, string> = {
  CATIA_LA_MAR: 'Catia La Mar',
  MAIQUETIA: 'Maiquetía',
  MACUTO: 'Macuto',
  CARABALLEDA: 'Caraballeda'
};

export const POINTS_TABLE = {
  MODULE_COMPLETED: 10,
  QUIZ_PASSED: 25,
  COURSE_COMPLETED: 100,
  TRACK_COMPLETED: 300,
  DAILY_ATTENDANCE: 5,
  REFERRAL: 50
} as const;

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return formatDate(dateString);
}

export function validateCedula(cedula: string): boolean {
  return /^\d{7,10}$/.test(cedula);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

interface CensusQuestion {
  id: string;
  question: string;
  category: string;
  type: 'single_choice' | 'text' | 'number';
  options?: { value: string; label: string }[];
}

export const CENSUS_QUESTIONS: CensusQuestion[] = [
  {
    id: 'Q1',
    question: '¿Cuál es tu nivel de experiencia con tecnología?',
    category: 'Nivel Digital',
    type: 'single_choice',
    options: [
      { value: 'NONE', label: 'Sin experiencia' },
      { value: 'BASIC', label: 'Básico (uso celular)' },
      { value: 'INTERMEDIATE', label: 'Intermediento (uso computadora)' },
      { value: 'ADVANCED', label: 'Avanzado (programación)' }
    ]
  },
  {
    id: 'Q2',
    question: '¿Tienes acceso a internet en tu hogar?',
    category: 'Conectividad',
    type: 'single_choice',
    options: [
      { value: 'YES', label: 'Sí, siempre' },
      { value: 'SOMETIMES', label: 'A veces' },
      { value: 'NO', label: 'No' }
    ]
  },
  {
    id: 'Q3',
    question: '¿Qué tipo de dispositivo utilizas principalmentepuedes?',
    category: 'Dispositivos',
    type: 'single_choice',
    options: [
      { value: 'SMARTPHONE', label: 'Smartphone' },
      { value: 'COMPUTER', label: 'Computadora' },
      { value: 'TABLET', label: 'Tablet' },
      { value: 'NONE', label: 'No tengo dispositivo' }
    ]
  },
  {
    id: 'Q4',
    question: '¿Te gustaría aprender habilidades digitales?',
    category: 'Interés',
    type: 'single_choice',
    options: [
      { value: 'YES', label: 'Sí, mucho' },
      { value: 'MAYBE', label: 'Tal vez' },
      { value: 'NO', label: 'No' }
    ]
  },
  {
    id: 'Q5',
    question: '¿Cuál es tu situación laboral actual?',
    category: 'Empleo',
    type: 'single_choice',
    options: [
      { value: 'EMPLOYED', label: 'Empleado/a' },
      { value: 'UNEMPLOYED', label: 'Desempleado/a' },
      { value: 'SELF_EMPLOYED', label: 'Autónomo/a' },
      { value: 'STUDENT', label: 'Estudiante' }
    ]
  },
  {
    id: 'Q6',
    question: '¿Tienes hijos menores de 18 años?',
    category: 'Familia',
    type: 'single_choice',
    options: [
      { value: 'YES', label: 'Sí' },
      { value: 'NO', label: 'No' }
    ]
  },
  {
    id: 'Q7',
    question: '¿Cuántas personas viven en tu hogar?',
    category: 'Hogar',
    type: 'number'
  },
  {
    id: 'Q8',
    question: '¿Cuál es tu principal necesidad actual?',
    category: 'Necesidades',
    type: 'single_choice',
    options: [
      { value: 'EMPLOYMENT', label: 'Empleo' },
      { value: 'EDUCATION', label: 'Educación' },
      { value: 'HEALTH', label: 'Salud' },
      { value: 'HOUSING', label: 'Vivienda' },
      { value: 'FOOD', label: 'Alimentación' }
    ]
  }
];
