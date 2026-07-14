# Data Model: La Guaira Resiliente Digital

**Feature**: 001-guaira-resiliente
**Date**: 2026-07-13
**Database**: Cloud Firestore (NoSQL)

---

## Overview

El modelo de datos está diseñado para Cloud Firestore, optimizado para:
- Lecturas frecuentes sobre escrituras
- Consultas por subconjuntos pequeños de datos
- Seguridad basada en roles
- Offline-first con sincronización

---

## Collections

### users

Colección principal de usuarios del sistema.

```typescript
{
  uid: string;                    // ID de Firebase Auth
  email: string;                  // Email único
  role: 'ADMIN' | 'TRAINER' | 'STUDENT' | 'SPONSOR' | 'COORDINATOR';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
  profile: {
    first_name: string;
    last_name: string;
    phone: string | null;
    cedula: string;               // Cédula venezolana (7-10 dígitos)
    municipality: 'CATIA_LA_MAR' | 'MAIQUETIA' | 'MACUTO' | 'CARABALLEDA';
    digital_literacy_level: 'NONE' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
    is_affected: boolean;         // Damnificado por el sismo
    camp_id: string | null;       // Referencia al campamento
  };
  created_at: string;             // ISO timestamp
  updated_at: string;
  last_login: string | null;
}
```

**Índices compuestos**:
- `role` ASC + `status` ASC
- `profile.municipality` ASC + `role` ASC

---

### census_surveys

Encuestas sociotécnicas realizadas en campo.

```typescript
{
  id: string;                     // Auto-generado
  surveyor_id: string;            // Referencia a users (coordinador)
  respondent_name: string;
  respondent_cedula: string;
  municipality: string;
  camp_id: string | null;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  responses: Array<{
    question_id: string;
    answer: string | number | boolean;
    skipped: boolean;
  }>;
  status: 'DRAFT' | 'SUBMITTED' | 'VALIDATED' | 'REJECTED';
}
```

**Índices compuestos**:
- `surveyor_id` ASC + `status` ASC + `timestamp` DESC
- `municipality` ASC + `timestamp` DESC

---

### camps

Campamentos de refugios temporales.

```typescript
{
  id: string;
  name: string;                   // "Refugio Catia La Mar Norte"
  municipality: string;
  zone: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  capacity: number;
  current_occupancy: number;
  has_wifi: boolean;
  has_solar_power: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'FULL';
  created_at: string;
}
```

---

### tracks

Programas de capacitación principales.

```typescript
{
  id: string;
  name: string;                   // "Continuidad Comercial Digital"
  description: string;
  module_count: number;           // 8, 6, o 5
  duration_hours: number;         // 40, 30, o 25
  icon: string;                   // Nombre del icono
  order: number;                  // 1, 2, 3
  status: 'ACTIVE' | 'INACTIVE' | 'COMING_SOON';
}
```

**Datos iniciales**:
1. Continuidad Comercial Digital (8 módulos, 40h)
2. Micro-oficios Remotos (6 módulos, 30h)
3. Logística de Suministros (5 módulos, 25h)

---

### courses

Módulos individuales dentro de cada track.

```typescript
{
  id: string;
  track_id: string;               // Referencia a tracks
  title: string;                  // "Migración a Tienda en Línea"
  description: string;
  module_number: number;          // 1, 2, 3...
  total_modules: number;          // Total del track
  duration_minutes: number;       // 30-60 minutos
  content_type: 'VIDEO' | 'INTERACTIVE' | 'MIXED';
  video_url: string | null;       // URL del video
  document_url: string | null;    // URL del documento
  thumbnail_url: string | null;   // URL de la miniatura
  quiz: {
    id: string;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correct_answer: number;     // Índice 0-3
      explanation: string;
    }>;
    passing_score: number;        // 80 por defecto
    time_limit_minutes: number | null;
  } | null;
  created_at: string;
  order: number;
}
```

---

### enrollments

Inscripciones de estudiantes en cursos.

```typescript
{
  id: string;
  student_id: string;             // Referencia a users
  course_id: string;              // Referencia a courses
  track_id: string;               // Referencia a tracks
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress_percent: number;       // 0-100
  completed_resources: string[];  // IDs de recursos completados
  quiz_score: number | null;      // Score final del quiz
  started_at: string;
  completed_at: string | null;
  last_accessed: string;
}
```

**Índices compuestos**:
- `student_id` ASC + `status` ASC + `last_accessed` DESC
- `course_id` ASC + `status` ASC

---

### quiz_submissions

Envíos de quizzes por estudiantes.

```typescript
{
  id: string;
  student_id: string;
  course_id: string;
  enrollment_id: string;
  answers: Array<{
    question_id: string;
    selected_answer: number;
    is_correct: boolean;
  }>;
  score: number;                  // 0-100
  passed: boolean;                // score >= passing_score
  submitted_at: string;
}
```

**Índices compuestos**:
- `student_id` ASC + `course_id` ASC + `submitted_at` DESC

---

### resilience_points

Transacciones de puntos de gamificación.

```typescript
{
  id: string;
  student_id: string;
  points: number;                 // Positivo = ganado, Negativo = canjeado
  reason: 'MODULE_COMPLETED' | 'QUIZ_PASSED' | 'COURSE_COMPLETED' 
        | 'TRACK_COMPLETED' | 'DAILY_ATTENDANCE' | 'REFERRAL' 
        | 'MANUAL_ADJUSTMENT' | 'REDEMPTION';
  reference_id: string | null;    // ID del curso, quiz, etc.
  created_at: string;
}
```

**Índices compuestos**:
- `student_id` ASC + `created_at` DESC

**Tabla de puntos**:
| Acción | Puntos |
|--------|--------|
| MODULE_COMPLETED | +10 |
| QUIZ_PASSED | +25 |
| COURSE_COMPLETED | +100 |
| TRACK_COMPLETED | +300 |
| DAILY_ATTENDANCE | +5 |
| REFERRAL | +50 |
| REDEMPTION | -N (variable) |

---

### sponsors

Perfiles de empresas patrocinantes.

```typescript
{
  uid: string;                    // Mismo ID que users
  company_name: string;
  rif: string;                    // RIF venezolano
  company_type: 'NATIONAL' | 'MULTINATIONAL' | 'SME' | 'STARTUP';
  sector: string;                 // "Tecnología", "Retail", etc.
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  logo_url: string | null;
  total_contribution: number;     // Monto total donado
  active_sponsorships: number;    // Patrocinios activos
  certification_status: 'NONE' | 'PENDING' | 'CERTIFIED' | 'EXPIRED';
  created_at: string;
}
```

---

### sponsorships

Patrocinios activos entre empresas y beneficiarios.

```typescript
{
  id: string;
  sponsor_id: string;             // Referencia a sponsors
  type: 'COMMERCIAL' | 'CONNECTIVITY_TALENT' | 'INFRASTRUCTURE';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  beneficiary_id: string;         // Referencia a beneficiaries
  beneficiary_type: 'INDIVIDUAL' | 'COMMUNITY' | 'BUSINESS';
  financial_contribution: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
}
```

**Índices compuestos**:
- `sponsor_id` ASC + `status` ASC + `created_at` DESC
- `beneficiary_id` ASC + `status` ASC
- `type` ASC + `status` ASC

---

### beneficiaries

Perfiles anónimos para el portal de patrocinadores.

```typescript
{
  id: string;
  anonymous_code: string;         // "Familia 024"
  location: string;               // "Catia La Mar"
  profile_type: string;           // "Comerciante textil damnificado"
  digital_level: string;
  track_interest: string[];       // IDs de tracks de interés
  needs: Array<{
    type: string;
    description: string;
    estimated_cost: number;
  }>;
  priority_score: number;         // 0-100, mayor = mayor prioridad
  enrollment_status: string | null;
  total_resilience_points: number;
  created_at: string;
}
```

---

### job_opportunities

Oportunidades de empleo publicadas por empresas.

```typescript
{
  id: string;
  company_id: string;             // Referencia a sponsors
  title: string;
  description: string;
  type: 'REMOTE' | 'ONSITE' | 'HYBRID';
  modality: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  requirements: string[];
  salary_min: number;
  salary_max: number;
  status: 'OPEN' | 'FILLED' | 'CLOSED';
  created_at: string;
}
```

**Índices compuestos**:
- `status` ASC + `type` ASC + `created_at` DESC
- `company_id` ASC + `status` ASC

---

### employments

Contrataciones de egresados.

```typescript
{
  id: string;
  graduate_id: string;            // Referencia a users
  company_id: string;             // Referencia a sponsors
  opportunity_id: string;         // Referencia a job_opportunities
  start_date: string;
  status: 'HIRED' | 'PROBATION' | 'CONFIRMED' | 'TERMINATED';
  bnpl_eligible: boolean;
  created_at: string;
}
```

**Índices compuestos**:
- `graduate_id` ASC + `status` ASC
- `company_id` ASC + `status` ASC

---

### milestones

Hitos de progreso en patrocinios.

```typescript
{
  id: string;
  sponsorship_id: string;         // Referencia a sponsorships
  title: string;
  description: string;
  target_date: string;
  completed_date: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
}
```

**Índices compuestos**:
- `sponsorship_id` ASC + `status` ASC

---

### notifications

Notificaciones para usuarios.

```typescript
{
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'ENROLLMENT' | 'QUIZ_RESULT' | 'MILESTONE' | 'SPONSORSHIP' 
      | 'EMPLOYMENT' | 'SYSTEM';
  data: Record<string, string>;   // Datos adicionales
  read: boolean;
  created_at: string;
}
```

**Índices compuestos**:
- `user_id` ASC + `read` ASC + `created_at` DESC

---

### impact_metrics

Métricas de impacto del programa (actualizadas por Cloud Functions).

```typescript
{
  id: string;                     // "current"
  total_beneficiaries: number;
  total_users: number;
  courses_completed: number;
  total_sponsorships_active: number;
  total_funds_raised: number;
  by_municipality: Record<string, {
    beneficiaries: number;
    sponsorships: number;
    funds: number;
  }>;
  by_track: Record<string, {
    enrolled: number;
    completed: number;
    employed: number;
  }>;
  updated_at: string;
}
```

---

## Relationships

```
users (1) ──────── (N) enrollments
users (1) ──────── (N) resilience_points
users (1) ──────── (N) quiz_submissions
users (1) ──────── (N) notifications
users (1) ──────── (1) sponsors
users (1) ──────── (N) employments (as graduate)

sponsors (1) ────── (N) sponsorships
sponsors (1) ────── (N) job_opportunities
sponsors (1) ────── (N) employments (as company)

tracks (1) ──────── (N) courses
tracks (1) ──────── (N) enrollments

courses (1) ─────── (N) enrollments
courses (1) ─────── (N) quiz_submissions

enrollments (1) ─── (N) quiz_submissions

sponsorships (1) ── (N) milestones
sponsorships (1) ── (N) beneficiaries (via beneficiary_id)

beneficiaries (N) ─ (1) users (anonymous reference)
```

---

## Offline Strategy

### IndexedDB Schema (PWA)

Para soporte offline, se utiliza IndexedDB con las siguientes tablas:

```typescript
// Tablas IndexedDB
interface OfflineDB {
  pending_sync: {
    key: string;
    collection: string;
    data: any;
    timestamp: string;
    type: 'create' | 'update' | 'delete';
  };
  cached_content: {
    key: string;                  // course_id
    data: any;
    downloaded_at: string;
    expires_at: string;
  };
  local_progress: {
    key: string;                  // enrollment_id
    completed_resources: string[];
    last_updated: string;
  };
}
```

### Sync Strategy

1. **Write-through**: escrituras van a IndexedDB + intento de sincronización
2. **Queue failed**: si falla, se encola para retry
3. **Background sync**: cuando hay conexión, procesar cola
4. **Conflict resolution**: último write wins (con timestamp)
