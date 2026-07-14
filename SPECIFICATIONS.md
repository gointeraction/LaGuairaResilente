# La Guaira Resiliente Digital - Especificaciones de la Plataforma

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Técnica](#arquitectura-técnica)
3. [Módulos y Funcionalidades](#módulos-y-funcionalidades)
4. [Base de Datos](#base-de-datos)
5. [Diseño UI/UX](#diseño-uiux)
6. [Seguridad](#seguridad)
7. [Gamificación](#gamificación)
8. [Integraciones](#integraciones)
9. [Despliegue](#despliegue)
10. [Roadmap](#roadmap)

---

## Resumen Ejecutivo

**La Guaira Resiliente Digital** es una plataforma web diseñada para impulsar la reconstrucción económica y social de los ciudadanos de La Guaira, Venezuela, tras el terremoto de agosto 2024. La plataforma integra formación digital, gamificación de resiliencia, censo digital, directorio de especialistas y un sistema de patrocinio empresarial.

### Objetivos

- **100,000+** usuarios objetivo en 4 municipios
- Capacitación digital en 3 tracks especializados
- Sistema de gamificación para mantener engagement
- Directorio de apoyo psicológico solidario
- Conexión empleo-graduados-empresas

### Municipios Objetivo

| Municipio | Población Est. | Prioridad |
|-----------|----------------|-----------|
| Catia La Mar | 280,000 | Alta |
| Maiquetía | 90,000 | Alta |
| Macuto | 30,000 | Media |
| Caraballeda | 25,000 | Media |

---

## Arquitectura Técnica

### Stack Tecnológico

```
Frontend:
├── React 18+ con TypeScript
├── Vite (bundler)
├── Tailwind CSS (estilos)
├── Zustand (estado global)
├── React Router v6 (routing)
├── Lucide React (iconos)
├── React Hot Toast (notificaciones)
└── PWA (Progressive Web App)

Backend:
├── Firebase Authentication
├── Cloud Firestore (base de datos)
├── Cloud Functions (lógica serverless)
├── Cloud Storage (archivos)
├── Firebase Hosting (despliegue)
└── Firebase Emulators (desarrollo)
```

### Estructura de Directorios

```
Resilente/
├── app/                          # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Navigation, Layout
│   │   │   ├── resilience/       # 6 actividades
│   │   │   └── ui/               # Componentes base
│   │   ├── hooks/                # Custom hooks
│   │   ├── lib/                  # Config Firebase
│   │   ├── pages/                # 14 páginas
│   │   ├── services/             # 8 servicios
│   │   ├── stores/               # 3 stores Zustand
│   │   ├── styles/               # CSS global
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Helpers
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── functions/                    # Cloud Functions
│   └── src/index.ts
├── firestore/                    # Security Rules
│   ├── firestore.rules
│   └── firestore.indexes.json
├── storage/                      # Storage Rules
│   └── storage.rules
├── firebase.json                 # Config Firebase
├── SPECIFICATIONS.md
└── README.md
```

---

## Módulos y Funcionalidades

### 1. Autenticación y Gestión de Usuarios

**Rutas:** `/login`, `/register`, `/profile`

#### Funcionalidades

- Registro con email y contraseña
- Inicio de sesión con persistencia
- Cierre de sesión seguro
- Recuperación de contraseña
- Perfil de usuario editable
- Roles: ADMIN, TRAINER, COORDINATOR, STUDENT, SPONSOR

#### Datos del Usuario

```typescript
interface UserProfile {
  first_name: string;
  last_name: string;
  phone: string | null;
  cedula: string;
  municipality: Municipality;
  digital_literacy_level: DigitalLiteracyLevel;
  is_affected: boolean;
  camp_id: string | null;
}
```

---

### 2. Panel Principal (Dashboard)

**Ruta:** `/dashboard`

#### Métricas en Tiempo Real

- Total de usuarios registrados
- Cursos completados
- Puntos de resiliencia totales
- Empleos generados
- Patrocinios activos

#### Accesos Rápidos

- Último curso en progreso
- Actividades de resiliencia pendientes
- Notificaciones nuevas
- Ofertas de empleo destacadas

---

### 3. Sistema Educativo

**Rutas:** `/courses`, `/courses/:courseId`

#### 3 Tracks de Formación

| Track | Módulos | Duración | Certificación |
|-------|---------|----------|---------------|
| Continuidad Comercial Digital | 8 | 40h | Sí |
| Micro-oficios Remotos | 6 | 30h | Sí |
| Logística de Suministros | 5 | 25h | Sí |

#### Estructura de Curso

```typescript
interface Course {
  id: string;
  track_id: string;
  title: string;
  description: string;
  module_number: number;
  total_modules: number;
  duration_minutes: number;
  content_type: 'VIDEO' | 'INTERACTIVE' | 'MIXED';
  video_url: string | null;
  document_url: string | null;
  thumbnail_url: string | null;
  quiz: Quiz | null;
  order: number;
}
```

#### Sistema de Evaluación

- Quiz al final de cada módulo
- Puntuación mínima: 70%
- Intentos ilimitados
- Retroalimentación inmediata

---

### 4. Centro de Resiliencia

**Ruta:** `/resilience`

Basado en los **10 principios de la APA** para desarrollar resiliencia.

#### 4.1 Claridad Emocional (Emotional Canvas)

**Puntos:** +15

- Mandala interactivo SVG de 12 segmentos
- 12 emociones con colores asociados
- Reflexión escrita post-actividad
- Guardado en Firestore

#### 4.2 Mis Dones y Talentos (My Gifts Quiz)

**Puntos:** +20

- 20 cualidades predefinidas
- Opción de agregar cualidades personalizadas
- Reflexión sobre cómo se manifiestan
- Certificado digital de completado

#### 4.3 Diario de Reflexión (Daily Journal)

**Puntos:** +10

- Prompts diarios rotativos
- Tracking de ánimo antes/después
- Sección de gratitud (3 items)
- Historial de entradas

#### 4.4 Sesiones de Mindfulness

**Puntos:** +10-15

| Sesión | Duración | Tipo |
|--------|----------|------|
| Respiración Profunda | 5 min | BREATHING |
| Escaneo Corporal | 10 min | BODY_SCAN |
| Visualización Guiada | 7 min | GUIDED_VISUALIZATION |
| Meditación de Gratitud | 5 min | MEDITATION |

- Timer interactivo con progreso
- Instrucciones en tiempo real
- Control play/pause/reset
- Estadísticas de sesiones

#### 4.5 Plan de Acción

**Puntos:** +5 por paso completado

- Constructor de metas personalizadas
- Sugerencias de objetivos comunes
- Pasos ilimitados
- Seguimiento de progreso
- Fecha objetivo opcional

#### 4.6 Evaluación APA (10 Principios)

**Puntos:** +25

| Principio | Descripción |
|-----------|-------------|
| Conexiones | Red de apoyo social |
| Perspectiva | Ver crisis como desafíos |
| Aceptación | Cambio natural de la vida |
| Metas | Objetivos realistas |
| Acción | Decisiones decisivas |
| Autodescubrimiento | Oportunidades de crecimiento |
| Autoimagen | Visión positiva |
| Contexto | Perspectiva y contexto |
| Esperanza | Visión optimista |
| Autocuidado | Salud física y mental |

- 3 preguntas por principio (30 total)
- Escala: Nunca / A veces / Frecuentemente / Siempre
- Resultados con feedback personalizado
- Recomendaciones de mejora

---

### 5. Directorio de Especialistas

**Ruta:** `/directory`

#### Funcionalidades

- Buscador por nombre, especialidad o ubicación
- Filtros: País, Modalidad, Especialidad
- Tarjetas de contacto con información completa
- Enlace directo a WhatsApp y Email
- Indicador de Red de Apoyo Solidario

#### Datos del Especialista

```typescript
interface Psychologist {
  id: string;
  name: string;
  specialty: string;
  description: string;
  university: string;
  location: string;
  country: string;
  modality: 'ONLINE' | 'IN_PERSON' | 'BOTH';
  verification: string;
  phone: string;
  email: string;
  is_solidarity_network: boolean;
}
```

#### Especialistas Pre-cargados

- Luis E. Chesneau R. (Caracas)
- Marián Brando (Miami)
- Oriana Valladares (Caracas)
- Ana Margarita Omaña (Caracas)
- Sofía Hernández (Montevideo)
- Alexis González (Isla Margarita)
- Natalia Mudarra (Panamá)
- Yamila Guerrero (Caracas)

---

### 6. Red de Apoyo Solidario

**Ruta:** `/support-network-register`

#### Formulario de Registro (3 Pasos)

**Paso 1: Datos Personales**
- Nombre completo
- Cédula/ID
- País y Ciudad
- Teléfono y WhatsApp
- Email

**Paso 2: Formación Profesional**
- Especialidad principal
- Sub-especialidad
- Universidad
- Entidad de verificación (FPV, MPPS, COP, OPQ)
- Número de registro
- Años de experiencia
- Modalidad de atención
- Idiomas

**Paso 3: Disponibilidad**
- Horario disponible
- Descripción de práctica
- Enfoque terapéutico
- Aceptación de Red Solidaria

#### Flujo de Aprobación

1. Especialista completa formulario
2. Estado: PENDING
3. Administrador revisa
4. Estado: APPROVED o REJECTED
5. Si APPROVED → Se agrega al directorio

---

### 7. Censo Digital

**Ruta:** `/census`

#### 17 Preguntas de Censo

| Categoría | Preguntas |
|-----------|-----------|
| Nivel Digital | 1 pregunta |
| Conectividad | 1 pregunta |
| Dispositivos | 1 pregunta |
| Interés | 1 pregunta |
| Empleo | 1 pregunta |
| Familia | 1 pregunta |
| Hogar | 1 pregunta |
| Necesidades | 1 pregunta |

#### Funcionalidades

- Formulario multi-paso con progreso
- Captura de GPS automática
- Opción de omitir preguntas
- Validación en tiempo real
- Envío offline con sync

---

### 8. Ofertas de Empleo

**Ruta:** `/jobs`

#### Funcionalidades

- Lista de ofertas disponibles
- Filtros por municipio y modalidad
- Búsqueda por palabra clave
- Tarjetas con información completa
- Enlace directo a WhatsApp

#### Datos de Oferta

```typescript
interface JobOpportunity {
  id: string;
  company_id: string;
  company_name: string;
  title: string;
  description: string;
  type: 'REMOTE' | 'ONSITE' | 'HYBRID';
  municipality: Municipality;
  requirements: string[];
  salary_usd?: number;
  employment_type: string;
  status: 'OPEN' | 'FILLED' | 'CLOSED';
}
```

---

### 9. Portal de Patrocinio

**Ruta:** `/sponsor-portal`

#### Métricas del Sponsor

- Total de patrocinios
- Patrocinios activos
- Graduados contratados
- Total invertido

#### Paquetes de Patrocinio

| Tipo | Descripción |
|------|-------------|
| INDIVIDUAL | Para una persona específica |
| MUNICIPAL | Para todo un municipio |

---

### 10. Reportes Admin

**Ruta:** `/reports`

#### Dashboard de Reportes

- Resumen de usuarios por tipo
- Estadísticas de educación
- Datos del censo por municipio
- Exportación a CSV

#### Métricas de Impacto

- Total beneficiarios
- Horas de capacitación
- Empleos generados
- Puntos totales

---

## Base de Datos

### Colecciones Principales

```
users/                    # Usuarios del sistema
├── profile
├── role
└── status

courses/                  # Cursos disponibles
├── track_id
├── title
├── quiz
└── order

tracks/                   # Tracks de formación
├── name
├── module_count
└── duration_hours

enrollments/              # Inscripciones
├── student_id
├── course_id
├── status
└── progress_percent

resilience_points/        # Puntos de resiliencia
├── student_id
├── points
├── reason
└── reference_id

psychologists/            # Directorio de especialistas
├── name
├── specialty
├── verification
└── is_solidarity_network

support_network_registrations/  # Solicitudes de red
├── full_name
├── specialty
├── status
└── accepts_solidarity

census_surveys/           # Encuestas de censo
├── surveyor_id
├── respondent_name
├── municipality
└── responses

job_opportunities/        # Ofertas de empleo
├── company_name
├── title
├── municipality
└── salary_usd

notifications/            # Notificaciones
├── user_id
├── title
├── type
└── read

resilience_emotional_canvas/  # Actividades
resilience_my_gifts/
resilience_journal/
resilience_mindfulness/
resilience_action_plans/
resilience_apa_assessments/
```

### Índices Compuestos

```json
{
  "indexes": [
    {
      "collectionGroup": "enrollments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "student_id", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "resilience_points",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "student_id", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## Diseño UI/UX

### Design System

#### Paleta de Colores

```css
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-900: #1e3a8a;

--success-500: #22c55e;
--warning-500: #f59e0b;
--danger-500: #ef4444;
--info-500: #06b6d4;
```

#### Tipografía

- **Headers:** Inter Bold (700)
- **Body:** Inter Regular (400)
- **Monospace:** Fira Code

#### Espaciado

- Base: 4px
- Escala: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

#### Componentes

| Componente | Estilo |
|------------|--------|
| Buttons | Rounded-lg, hover states |
| Cards | White bg, shadow-sm, rounded-xl |
| Inputs | Border-gray-300, focus:ring-primary |
| Badges | Rounded-full, size variants |

### Responsive Design

- **Mobile:** < 640px (1 columna)
- **Tablet:** 640-1024px (2 columnas)
- **Desktop:** > 1024px (3-4 columnas)

### Accesibilidad

- Contraste WCAG AA
- Touch targets mínimos 44px
- Soporte para reduced-motion
- Focus visible en todos los elementos

---

## Seguridad

### Firebase Security Rules

#### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Courses (public read)
    match /courses/{courseId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Enrollments
    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Psychologists (public read)
    match /psychologists/{psychId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

#### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## Gamificación

### Sistema de Puntos de Resiliencia

| Acción | Puntos |
|--------|--------|
| Módulo completado | +10 |
| Quiz aprobado | +25 |
| Curso completado | +100 |
| Track completado | +300 |
| Asistencia diaria | +5 |
| Referido | +50 |
| Actividad Emotional Canvas | +15 |
| Actividad My Gifts | +20 |
| Actividad Journal | +10 |
| Sesión Mindfulness (5min) | +10 |
| Sesión Mindfulness (10min) | +15 |
| Paso de Plan de Acción | +5 |
| Evaluación APA | +25 |

### Niveles de Resiliencia

| Nivel | Puntos Requeridos | Beneficios |
|-------|-------------------|------------|
| Principiante | 0-99 | Acceso básico |
| Intermedio | 100-499 | Contenido premium |
| Avanzado | 500-999 | Mentoría |
| Experto | 1000+ | Líder de comunidad |

### Rachas

- **1 día:** +5 puntos bonus
- **7 días:** +25 puntos bonus
- **30 días:** +100 puntos bonus

---

## Integraciones

### Firebase Services

| Servicio | Uso |
|----------|-----|
| Authentication | Login/Registro |
| Firestore | Base de datos principal |
| Cloud Storage | Imágenes, documentos |
| Cloud Functions | Lógica serverless |
| Hosting | Despliegue web |
| Messaging | Notificaciones push |

### Cloud Functions

```typescript
// Triggers
onUserCreated          // Bienvenida
onEnrollmentCompleted  // Puntos bonus
onSponsorshipCreated   // Notificación
onMilestoneCompleted   // Actualización

// Callable
getStudentTotalPoints
awardDailyAttendance
submitQuiz

// Scheduled
scheduledMetricsUpdate    // Diario
scheduledMilestoneCheck   // Diario
```

---

## Despliegue

### Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar proyecto
firebase init

# Desplegar
npm run build
firebase deploy
```

### Variables de Entorno

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Emuladores (Desarrollo)

```bash
# Iniciar emuladores
firebase emulators:start

# Puertos
Auth:       9099
Firestore:  8080
Storage:    9199
Functions:  5001
```

---

## Roadmap

### Fase 1: Core (Completada) ✅

- [x] Autenticación de usuarios
- [x] Sistema educativo básico
- [x] Gamificación de puntos
- [x] Panel de control

### Fase 2: Resiliencia (Completada) ✅

- [x] 6 actividades de resiliencia
- [x] Sistema de puntos detallado
- [x] Tracking de rachas
- [x] Evaluación APA

### Fase 3: Directorio (Completada) ✅

- [x] Directorio de psicólogos
- [x] Red de apoyo solidario
- [x] Formulario de registro
- [x] Sistema de aprobación

### Fase 4: Empleo y Patrocinio (Completada) ✅

- [x] Ofertas de empleo
- [x] Portal de patrocinio
- [x] Conexión graduados-empresas
- [x] Métricas de impacto

### Fase 5: Censo y Reportes (Completada) ✅

- [x] Formulario de censo digital
- [x] Captura GPS
- [x] Reportes admin
- [x] Exportación CSV

### Fase 6: Mejoras (Pendiente)

- [ ] Notificaciones push
- [ ] Modo offline completo
- [ ] Chat en tiempo real
- [ ] Videoconferencia integrada
- [ ] App móvil nativa
- [ ] Analytics avanzados
- [ ] Multi-idioma (EN/PT)
- [ ] Certificados digitales

---

## Equipo de Desarrollo

**Desarrollado por:** CAVECOM-E  
**Proyecto:** La Guaira Resiliente Digital  
**Versión:** 1.0.0  
**Última actualización:** Julio 2026

---

## Licencia

Este proyecto es propietario de CAVECOM-E y está destinado al uso de la comunidad de La Guaira, Venezuela.

---

*Documento generado automáticamente - La Guaira Resiliente Digital*
