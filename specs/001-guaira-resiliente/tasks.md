# Tasks: La Guaira Resiliente Digital

**Input**: Design documents from `/specs/001-guaira-resiliente/`

**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/

**Tests**: Incluidos - siguiendo TDD (Article III)

---

## Phase 1: Setup (Infrastructure Compartida)

**Purpose**: Inicialización del proyecto y estructura base

- [ ] T001 Crear estructura de directorios según plan.md
- [ ] T002 Inicializar proyecto React + Vite + TypeScript en app/
- [ ] T003 [P] Configurar Tailwind CSS y design tokens
- [ ] T004 [P] Configurar ESLint y Prettier
- [ ] T005 Inicializar Cloud Functions en functions/
- [ ] T006 [P] Configurar Firebase SDK y emuladores
- [ ] T007 Crear tipos TypeScript compartidos en app/src/types/index.ts

---

## Phase 2: Foundational (Prerrequisitos Críticos)

**Purpose**: Infraestructura core que DEBE estar completa antes de cualquier user story

**⚠️ CRÍTICO**: No puede comenzar trabajo en user stories hasta completar esta fase

- [ ] T008 Configurar Firebase Authentication en app/src/lib/firebase.ts
- [ ] T009 [P] Crear Security Rules para users en firestore/firestore.rules
- [ ] T010 [P] Crear índices compuestos en firestore/firestore.indexes.json
- [ ] T011 Implementar servicio de auth en app/src/services/auth.ts
- [ ] T012 Implementar auth store en app/src/stores/authStore.ts
- [ ] T013 [P] Crear componentes UI base: Button, Input, Card, Modal
- [ ] T014 [P] Configurar React Router con rutas base
- [ ] T015 Implementar ProtectedRoute para rutas autenticadas

**Checkpoint**: Foundation ready - user story implementation puede comenzar en paralelo

---

## Phase 3: User Story 1 - Registro y Gestión de Usuarios (Priority: P1) 🎯 MVP

**Goal**: Usuarios pueden registrarse e iniciar sesión

**Independent Test**: Registrar usuario → login → ver perfil → actualizar perfil

### Tests for User Story 1

- [ ] T016 [P] [US1] Contract test para registro en tests/contract/test_auth_register.ts
- [ ] T017 [P] [US1] Contract test para login en tests/contract/test_auth_login.ts
- [ ] T018 [P] [US1] Integration test para flujo completo en tests/integration/test_auth_flow.ts

### Implementation for User Story 1

- [ ] T019 [P] [US1] Crear página Register.tsx con formulario
- [ ] T020 [P] [US1] Crear página Login.tsx con formulario
- [ ] T021 [US1] Implementar validación de cédula venezolana en utils/validation.ts
- [ ] T022 [US1] Integrar registro con Firebase Auth + Firestore
- [ ] T023 [US1] Implementar persistencia de sesión
- [ ] T024 [US1] Crear página Profile.tsx para ver/editar perfil
- [ ] T025 [US1] Implementar recuperación de contraseña
- [ ] T026 [US1] Agregar manejo de errores y loading states

**Checkpoint**: Usuarios pueden registrarse, iniciar sesión y gestionar su perfil

---

## Phase 4: User Story 2 - Censo Sociotécnico (Priority: P1)

**Goal**: Coordinadores pueden realizar encuestas y actualizar perfiles

**Independent Test**: Crear encuesta → guardar → verificar actualización de nivel digital

### Tests for User Story 2

- [ ] T027 [P] [US2] Contract test para creación de encuesta
- [ ] T028 [P] [US2] Integration test para actualización de perfil

### Implementation for User Story 2

- [ ] T029 [P] [US2] Crear servicio de censo en app/src/services/census.ts
- [ ] T030 [P] [US2] Crear componente CensusForm.tsx
- [ ] T031 [US2] Implementar geolocalización GPS
- [ ] T032 [US2] Crear página Census.tsx para coordinadores
- [ ] T033 [US2] Implementar Cloud Function para procesar encuesta
- [ ] T034 [US2] Agregar validación de cédula duplicada
- [ ] T035 [US2] Crear dashboard básico de encuestas por municipio

**Checkpoint**: Coordinadores pueden realizar encuestas en campo

---

## Phase 5: User Story 3 - Aula Resiliente (Priority: P1) 🎯 MVP

**Goal**: Estudiantes pueden acceder a cursos y completar módulos

**Independent Test**: Ver catálogo → inscribirse → completar módulo → ver progreso

### Tests for User Story 3

- [ ] T036 [P] [US3] Contract test para tracks y courses
- [ ] T037 [P] [US3] Contract test para enrollments
- [ ] T038 [P] [US3] Integration test para progreso de estudiante

### Implementation for User Story 3

- [ ] T039 [P] [US3] Crear servicio de educación en app/src/services/education.ts
- [ ] T040 [P] [US3] Crear education store en app/src/stores/educationStore.ts
- [ ] T041 [P] [US3] Crear componente TrackCard.tsx
- [ ] T042 [P] [US3] Crear componente CourseCard.tsx
- [ ] T043 [US3] Crear página Courses.tsx (catálogo)
- [ ] T044 [US3] Crear página CourseDetail.tsx (detalle del curso)
- [ ] T045 [US3] Implementar sistema de inscripción (enrollment)
- [ ] T046 [US3] Crear componente ProgressTracker.tsx
- [ ] T047 [US3] Implementar actualización de progreso en Firestore
- [ ] T048 [US3] Crear componente VideoPlayer.tsx para contenido
- [ ] T049 [US3] Crear componente Quiz.tsx para evaluaciones
- [ ] T050 [US3] Implementar scoring y retroalimentación de quiz

**Checkpoint**: Estudiantes pueden navegar cursos y completar contenido

---

## Phase 6: User Story 4 - Sistema de Gamificación (Priority: P2)

**Goal**: Estudiantes acumulan y canjean Puntos de Resiliencia

**Independent Test**: Completar acción → verificar puntos → canjear → verificar saldo

### Tests for User Story 4

- [ ] T051 [P] [US4] Contract test para resilience points
- [ ] T052 [P] [US4] Unit test para cálculo de puntos

### Implementation for User Story 4

- [ ] T053 [P] [US4] Crear servicio de puntos en app/src/services/points.ts
- [ ] T054 [P] [US4] Crear hook useResiliencePoints.ts
- [ ] T055 [US4] Implementar otorgación automática por completar módulo
- [ ] T056 [US4] Implementar otorgación por quiz aprobado
- [ ] T057 [US4] Implementar otorgación por completar curso
- [ ] T058 [US4] Implementar otorgación por completar track
- [ ] T059 [US4] Crear componente PointsBalance.tsx
- [ ] T060 [US4] Crear componente PointsHistory.tsx
- [ ] T061 [US4] Implementar sistema de canje
- [ ] T062 [US4] Crear Cloud Function para awardDailyAttendance

**Checkpoint**: Sistema de gamificación funcional con puntos y canje

---

## Phase 7: User Story 5 - Portal de Apadrinamiento (Priority: P2)

**Goal**: Empresas pueden patrocinar beneficiarios

**Independent Test**: Login sponsor → ver perfiles → crear patrocinio → ver milestones

### Tests for User Story 5

- [ ] T063 [P] [US5] Contract test para sponsors
- [ ] T064 [P] [US5] Contract test para sponsorships
- [ ] T065 [P] [US5] Integration test para flujo de patrocinio

### Implementation for User Story 5

- [ ] T066 [P] [US5] Crear servicio de patrocinio en app/src/services/sponsorship.ts
- [ ] T067 [P] [US5] Crear componente AnonymousProfile.tsx
- [ ] T068 [US5] Crear página SponsorPortal.tsx
- [ ] T069 [US5] Implementar registro de empresa patrocinante
- [ ] T070 [US5] Crear componente SponsorshipCard.tsx
- [ ] T071 [US5] Implementar creación de patrocinio
- [ ] T072 [US5] Crear componente MilestoneTracker.tsx
- [ ] T073 [US5] Implementar notificaciones de milestones
- [ ] T074 [US5] Crear dashboard de patrocinador
- [ ] T075 [US5] Implementar lógica de certificación "Empresa Solidaria"

**Checkpoint**: Empresas pueden patrocinar y trackear impacto

---

## Phase 8: User Story 6 - Dashboard de Impacto (Priority: P2)

**Goal**: Administradores ven métricas en tiempo real

**Independent Test**: Login admin → ver dashboard → filtrar → exportar

### Tests for User Story 6

- [ ] T076 [P] [US6] Contract test para impact metrics
- [ ] T077 [P] [US6] Integration test para actualización de métricas

### Implementation for User Story 6

- [ ] T078 [P] [US6] Crear servicio de dashboard en app/src/services/dashboard.ts
- [ ] T079 [P] [US6] Crear componente MetricCard.tsx
- [ ] T080 [US6] Crear página AdminPanel.tsx
- [ ] T081 [US6] Implementar gráficos con Recharts
- [ ] T082 [US6] Crear Cloud Function scheduledMetricsUpdate
- [ ] T083 [US6] Implementar filtros por municipio y fecha
- [ ] T084 [US6] Crear exportación a CSV
- [ ] T085 [US6] Crear exportación a PDF

**Checkpoint**: Dashboard completo con métricas y exportación

---

## Phase 9: User Story 7 - Sistema de Empleo (Priority: P3)

**Goal**: Egresados acceden a empleos y financiamiento

**Independent Test**: Ver empleos → aplicar → ser contratado → solicitar BNPL

### Tests for User Story 7

- [ ] T086 [P] [US7] Contract test para job opportunities
- [ ] T087 [P] [US7] Contract test para employments

### Implementation for User Story 7

- [ ] T088 [P] [US7] Crear servicio de empleo en app/src/services/employment.ts
- [ ] T089 [P] [US7] Crear componente JobCard.tsx
- [ ] T090 [US7] Crear página Jobs.tsx
- [ ] T091 [US7] Implementar publicación de empleos por sponsors
- [ ] T092 [US7] Crear sistema de aplicación a empleos
- [ ] T093 [US7] Implementar matching habilidades-requisitos
- [ ] T094 [US7] Crear scaffold para integración BNPL
- [ ] T095 [US7] Crear componente EmploymentStatus.tsx

**Checkpoint**: Sistema de empleo básico funcional

---

## Phase 10: Offline-First (Cross-Cutting)

**Purpose**: Funcionalidad offline para operación en campo

- [ ] T096 Configurar Service Workers con Vite PWA
- [ ] T097 Implementar IndexedDB para almacenamiento local
- [ ] T098 Crear utilidad offline.ts para detección de conectividad
- [ ] T099 Implementar descarga de contenido para uso offline
- [ ] T100 Crear sistema de cola de sincronización
- [ ] T101 Implementar sincronización automática al reconectar
- [ ] T102 Crear componente OfflineIndicator.tsx
- [ ] T103 Implementar conflict resolution (último write wins)

---

## Phase 11: Notificaciones (Cross-Cutting)

**Purpose**: Sistema de notificaciones push e in-app

- [ ] T104 Configurar Firebase Cloud Messaging
- [ ] T105 Crear servicio de notificaciones en app/src/services/notifications.ts
- [ ] T106 Crear componente NotificationBell.tsx
- [ ] T107 Crear página Notifications.tsx
- [ ] T108 Implementar triggers de notificación en Cloud Functions

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras transversales

- [ ] T109 Optimización de performance (lazy loading, code splitting)
- [ ] T110 Auditoría de accesibilidad (WCAG 2.1)
- [ ] T111 Revisión de seguridad (OWASP)
- [ ] T112 Pruebas de carga (5,000 usuarios)
- [ ] T113 Documentación de usuario
- [ ] T114 Despliegue a producción Firebase
- [ ] T115 Configurar monitoreo y alertas

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias - comenzar inmediatamente
- **Foundational (Phase 2)**: Depende de Setup - BLOQUEA todas las user stories
- **User Stories (Phase 3+)**: Todas dependen de Foundational
  - US1, US2, US3 pueden ejecutarse en paralelo después de Foundational
  - US4 depende parcialmente de US3 (puntos se otorgan al completar)
  - US5 es independiente de US1-US4
  - US6 depende de datos de US1-US5
  - US7 depende de US5 (egresados de patrocinios)
- **Offline (Phase 10)**: Puede comenzar después de US3
- **Notifications (Phase 11)**: Puede comenzar después de US1
- **Polish (Phase 12)**: Depende de todas las user stories deseadas

### User Story Dependencies

- **US1 (P1)**: Sin dependencias - puede comenzar después de Foundational
- **US2 (P1)**: Depende de US1 (usuarios deben existir)
- **US3 (P1)**: Depende de US1 - puede comenzar después de Foundational
- **US4 (P2)**: Depende parcialmente de US3
- **US5 (P2)**: Puede comenzar después de Foundational
- **US6 (P2)**: Depende de datos de otras user stories
- **US7 (P3)**: Depende de US5

### Within Each User Story

1. Tests PRIMERO y deben FALLAR antes de implementación
2. Modelos/Servicios antes de componentes
3. Componentes antes de páginas
4. Implementación core antes de integración
5. Story completa antes de siguiente prioridad

### Parallel Opportunities

**Paralelo inmediato después de Foundational**:
- US1 (Auth) + US3 (Education) + US5 (Sponsorship)

**Paralelo dentro de cada story**:
- Todos los tests marcados [P]
- Todos los servicios marcados [P]
- Todos los componentes base marcados [P]

---

## Implementation Strategy

### MVP First (US1 + US3 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational
3. Completar Phase 3: US1 (Auth)
4. Completar Phase 5: US3 (Education)
5. **PARAR y VALIDAR**: Auth + Courses funcionando
6. Desplegar si está listo

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. + US1 → Auth funcional → Deploy/Demo (MVP!)
3. + US3 → Educación funcional → Deploy/Demo
4. + US2 → Censo funcional → Deploy/Demo
5. + US4 → Gamificación → Deploy/Demo
6. + US5 → Apadrinamiento → Deploy/Demo
7. + US6 → Dashboard → Deploy/Demo
8. + US7 → Empleo → Deploy/Demo
9. + Offline → PWA completa → Deploy/Demo

### Parallel Team Strategy

Con múltiples desarrolladores:

1. Equipo completo: Setup + Foundational
2. Una vez Foundational listo:
   - Dev A: US1 (Auth) + US2 (Census)
   - Dev B: US3 (Education) + US4 (Gamification)
   - Dev C: US5 (Sponsorship) + US6 (Dashboard)
3. Historias se completan e integran independientemente

---

## Notes

- [P] = tareas paralelas (diferentes archivos, sin dependencias)
- [Story] = etiqueta que vincula tarea a user story para trazabilidad
- Cada user story debe ser completable y testeable independientemente
- Verificar que las pruebas fallan antes de implementar
- Commit después de cada tarea o grupo lógico
- Parar en cualquier checkpoint para validar story independientemente
- Evitar: tareas vagas, conflictos en mismo archivo, dependencias cross-story
