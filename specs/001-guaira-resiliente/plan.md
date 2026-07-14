# Implementation Plan: La Guaira Resiliente Digital

**Branch**: `001-guaira-resiliente` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-guaira-resiliente/spec.md`

---

## Summary

Plataforma digital integral para el programa "La Guaira Resiliente Digital" que integra capacitación Offline-First, apadrinamiento corporativo B2B, sistema de empleo y dashboard de impacto, construida sobre arquitectura Firebase.

---

## Technical Context

**Language/Version**: TypeScript 5.3+
**Primary Dependencies**: React 18, Firebase SDK 10.x, Zustand, Vite, Tailwind CSS
**Storage**: Cloud Firestore (NoSQL), Firebase Storage
**Testing**: Vitest, Testing Library, Cypress (E2E)
**Target Platform**: Web (PWA), Mobile responsive
**Project Type**: Web Application (Frontend + Cloud Functions)
**Performance Goals**: <200ms API response, <3s initial load, offline capability 72h
**Constraints**: Operación en zonas con conectividad limitada, dispositivos de gama baja
**Scale/Scope**: 5,000 usuarios simultáneos, 15 campamentos, 3 tracks de capacitación

---

## Constitution Check

### Simplicity Gate (Article VII)
- [x] Usando ≤3 proyectos: app/ + functions/ + firestore/
- [x] Sin future-proofing
- [x] Usando Firebase nativo sin wrappers innecesarios

### Anti-Abstraction Gate (Article VIII)
- [x] Usando Firebase SDK directamente
- [x] Modelo de datos Firestore directo
- [x] Componentes React funcionales

### Integration-First Gate (Article IX)
- [x] Contratos definidos (contracts/)
- [x] Emuladores Firebase para testing
- [x] Pruebas de integración con servicios reales

---

## Project Structure

### Documentation (this feature)

```text
specs/001-guaira-resiliente/
├── spec.md              # Especificación de feature
├── plan.md              # Este archivo
├── data-model.md        # Modelo de datos
├── quickstart.md        # Guía de validación
├── contracts/           # Contratos API
│   ├── auth-api.json
│   ├── education-api.json
│   ├── sponsorship-api.json
│   └── employment-api.json
└── tasks.md             # Lista de tareas
```

### Source Code (repository root)

```text
resilente/
├── app/                          # Frontend React + Vite
│   ├── src/
│   │   ├── lib/
│   │   │   └── firebase.ts       # Configuración Firebase
│   │   ├── services/
│   │   │   ├── auth.ts           # Servicio autenticación
│   │   │   ├── education.ts      # Servicio educación
│   │   │   ├── census.ts         # Servicio censo
│   │   │   ├── sponsorship.ts    # Servicio apadrinamiento
│   │   │   ├── employment.ts     # Servicio empleo
│   │   │   └── dashboard.ts      # Servicio dashboard
│   │   ├── stores/
│   │   │   ├── authStore.ts      # Estado autenticación
│   │   │   ├── educationStore.ts # Estado educación
│   │   │   └── uiStore.ts        # Estado UI
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useOffline.ts
│   │   │   └── useResiliencePoints.ts
│   │   ├── components/
│   │   │   ├── ui/               # Componentes UI genéricos
│   │   │   ├── auth/             # Componentes autenticación
│   │   │   ├── education/        # Componentes educación
│   │   │   ├── census/           # Componentes censo
│   │   │   ├── sponsorship/      # Componentes apadrinamiento
│   │   │   └── dashboard/        # Componentes dashboard
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   ├── Census.tsx
│   │   │   ├── SponsorPortal.tsx
│   │   │   └── AdminPanel.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── offline.ts
│   │       └── points.ts
│   ├── public/
│   │   └── icons/
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── functions/                    # Cloud Functions
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── triggers/             # Firestore triggers
│   │   │   ├── users.ts
│   │   │   ├── enrollments.ts
│   │   │   ├── sponsorships.ts
│   │   │   └── milestones.ts
│   │   ├── callable/             # Callable functions
│   │   │   ├── quiz.ts
│   │   │   ├── points.ts
│   │   │   └── census.ts
│   │   └── jobs/                 # Scheduled functions
│   │       ├── metrics.ts
│   │       └── milestones.ts
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   └── package.json
├── firestore/
│   ├── firestore.rules
│   └── firestore.indexes.json
├── storage/
│   └── storage.rules
├── firebase.json
├── .firebaserc
└── SPECIFICATIONS.md
```

**Structure Decision**: Se selecciona la estructura de 2 proyectos (app/ + functions/) separando el frontend React de las Cloud Functions Firebase. Esto permite despliegue independiente y escalabilidad separada.

---

## Technical Architecture

### Frontend (app/)

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| UI Framework | React 18 + TypeScript | Interfaz de usuario |
| Build Tool | Vite 5 | Bundling y HMR |
| Styling | Tailwind CSS | CSS utility-first |
| State Management | Zustand | Estado global ligero |
| Routing | React Router v6 | Navegación SPA |
| PWA | Vite Plugin PWA | Offline-first |
| Forms | React Hook Form + Zod | Validación |

### Backend (functions/)

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| Runtime | Node.js 20 | Ejecución Cloud Functions |
| Framework | Firebase Functions v4 | Serverless backend |
| Auth | Firebase Authentication | Gestión de usuarios |
| Database | Cloud Firestore | Base de datos NoSQL |
| Storage | Firebase Storage | Almacenamiento archivos |
| Messaging | Firebase Cloud Messaging | Notificaciones push |

### Data Flow

```
Usuario → React App → Firebase SDK → Cloud Firestore
                         ↓
                   Cloud Functions → Firestore Triggers
                         ↓
                   Notificaciones → Firebase Messaging
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Objective**: Setup proyecto y autenticación

1. Initialize Vite + React + TypeScript project
2. Configure Tailwind CSS
3. Setup Firebase SDK and configuration
4. Implement Firebase Authentication
5. Create user registration and login flows
6. Setup Firestore security rules for users
7. Create user profile management

**Deliverable**: Usuarios pueden registrarse e iniciar sesión

### Phase 2: Census & Education Core (Week 3-4)

**Objective**: Censo sociotécnico y estructura de cursos

1. Implement census survey creation and storage
2. Create track and course data models
3. Build course catalog UI
4. Implement enrollment system
5. Create progress tracking
6. Setup resilience points system

**Deliverable**: Estudiantes pueden ver cursos y inscribirse

### Phase 3: Aula Resiliente Offline (Week 5-6)

**Objective**: Capacitación offline-first

1. Implement service workers for caching
2. Setup IndexedDB for local storage
3. Create offline content download
4. Implement offline progress tracking
5. Build sync mechanism for reconnection
6. Create quiz system with offline support

**Deliverable**: Estudiantes pueden tomar cursos sin conexión

### Phase 4: Sponsorship Portal (Week 7-8)

**Objective**: Portal de apadrinamiento B2B

1. Create sponsor registration and profile
2. Implement anonymous beneficiary profiles
3. Build sponsorship creation flow
4. Create milestone tracking system
5. Implement notification system
6. Build sponsor dashboard

**Deliverable**: Empresas pueden patrocinar beneficiarios

### Phase 5: Dashboard & Employment (Week 9-10)

**Objective**: Métricas y empleo

1. Implement impact metrics collection
2. Build admin dashboard with charts
3. Create job opportunity system
4. Implement employment matching
5. Add BNPL integration scaffold
6. Create reporting and export

**Deliverable**: Dashboard funcional y sistema de empleo básico

### Phase 6: Polish & Launch (Week 11-12)

**Objective**: Refinamiento y despliegue

1. Performance optimization
2. Accessibility audit
3. Security review
4. Load testing
5. User acceptance testing
6. Production deployment

**Deliverable**: Plataforma lista para producción

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| IndexedDB para offline | Requisito de operar sin conexión | Firebase cache no soporta offline completo |
| Service Workers | PWA requiere para cache de assets | No hay alternativa para offline-first |
| Zustand sobre Redux | Necesidad de estado ligero | Redux demasiado pesado para este caso |
