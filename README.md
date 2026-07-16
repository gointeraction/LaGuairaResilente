# 🌊 La Guaira Resiliente Digital

> Plataforma Integral de Capacitación, Inclusión Laboral, Apadrinamiento Corporativo y Coordinación de Emergencias para la Reconstrucción de La Guaira.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

---

## 📋 Descripción

Plataforma digital diseñada para apoyar a **100,000+ ciudadanos damnificados** del Estado La Guaira después del desastre sísmico, ofreciendo un ecosistema completo de recuperación económica, bienestar emocional y coordinación de emergencias.

---

## 🎯 Módulos Principales (22+ Módulos)

### 📚 Educación y Capacitación
| Módulo | Descripción | Ruta |
|--------|-------------|------|
| 🎓 **Aula Resiliente** | 3 tracks, 19 cursos, gamificación | `/courses` |
| 📖 **Detalle Curso** | Contenido, quizzes, progreso | `/courses/:id` |
| 🏆 **Tabla de Líderes** | Ranking por puntos de resiliencia | `/leaderboard` |

### 🧠 Bienestar Emocional
| Módulo | Descripción | Ruta |
|--------|-------------|------|
| 🧠 **Centro de Resiliencia** | 6 actividades basadas en APA | `/resilience` |
| 🎨 **Emotional Canvas** | Mandala SVG interactivo | Componente |
| 📔 **Daily Journal** | Diario con seguimiento de ánimo | Componente |
| 🧘 **Mindfulness** | 4 sesiones guiadas con timer | Componente |
| 📋 **Action Plan** | Planes de acción personales | Componente |
| 📊 **APA Assessment** | Evaluación de 10 principios | Componente |
| 🎁 **My Gifts Quiz** | 20 talentos predefinidos | Componente |

### 👨‍⚕️ Salud Mental y Voluntariado (Portales Públicos)
| Módulo | Descripción | Ruta |
|--------|-------------|------|
| 👨‍⚕️ **Directorio Psicólogos** | Especialistas verificados (Acceso Público) | `/directory` |
| 📝 **Quiero Formar Parte** | Registro para voluntarios FPV/MPPS (Acceso Público) | `/support-network-register` |
| 💙 **Solicitar Ayuda** | Línea de soporte emocional CPDC (Acceso Público) | `/solicitar-ayuda` |

### 💼 Empleo y Patrocinio
| Módulo | Descripción | Ruta |
|--------|-------------|------|
| 💼 **Portal de Empleo** | Ofertas laborales y postulaciones | `/jobs` |
| 🤝 **Portal de Patrocinio** | Conexión empresas-beneficiarios | `/sponsor-portal` |

### 📊 Administración
| Módulo | Descripción | Ruta |
|--------|-------------|------|
| 📊 **Panel Admin** | Gestión de usuarios y roles | `/admin` |
| 📈 **Admin Dashboard** | Evolución individual y por módulo | `/admin/dashboard` |
| 📋 **Censo Digital** | 17 preguntas de-diagnóstico | `/census` |
| 🗺️ **Mapa de Cobertura** | Visualización de 4 municipios | `/coverage-map` |
| 📊 **Centro de Reportes** | 35 reportes exportables | `/reports` |

### 🏠 Coordinación de Emergencias
| Módulo | Descripción | Ruta |
|--------|-------------|------|
| 🏠 **Centro de Coordinación** | Gestión táctica de albergues | `/coordination` |
| 🎤 **Charlas y Eventos** | Gestión de eventos por albergue | `/coordination/events` |
| 👥 **Reuniones** | Coordinación y compromisos | `/coordination/meetings` |
| 🏕️ **Gestión de Campamentos** | 15 campamentos en 4 municipios | `/coordination/camps` |
| 📶 **Nodos WiFi** | 10 nodos de conectividad | `/coordination/wifi` |
| 🚚 **Logística** | Entregas, distribución, recargas | `/coordination/logistics` |
| 🤝 **Matching** | Asignación automática patrocinador-beneficiario | `/coordination/matching` |

### 🎮 Gamificación y Juegos
| Módulo | Descripción | Ruta |
|--------|-------------|------|
| 🎮 **Sala de Juegos** | 9 juegos multijugador con Phaser.js | `/games` |
| 🏅 **Canje de Puntos** | Catálogo de 10 items | `/redemption` |
| 📜 **Certificados** | Certificados digitales con QR | `/certificates` |

### 💰 Patrocinio y Donaciones
| Módulo | Descripción | Ruta |
|--------|-------------|------|
| 💛 **Portal Público Patrocinador** | 6 tipos de aportes (Acceso Público) | `/patrocinadores` |
| 🤝 **Coordinación Patrocinadores** | Dashboard de gestión y estados | `/coordination/patrocinadores` |
| 👁️ **Dashboard Anónimo** | Monitoreo protegido de privacidad | `/sponsor-portal/anonymous` |

---

## 🛠️ Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                             │
├─────────────────────────────────────────────────────────┤
│  React 18 │ TypeScript │ Vite │ Tailwind CSS │ PWA     │
│  Zustand │ Framer Motion │ Lucide Icons                │
│  Phaser.js 3.80 │ Socket.io Client │ Driver.js         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND                              │
├─────────────────────────────────────────────────────────┤
│  Firebase Auth │ Cloud Firestore │ Cloud Functions      │
│  Firebase Storage │ Firebase Hosting                    │
│  25+ colecciones │ 18 funciones │ 30+ índices          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 GAMES SERVER                            │
├─────────────────────────────────────────────────────────┤
│  Node.js │ Express │ Socket.io │ 9 Juegos Phaser.js    │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
LaGuairaResiliente/
├── app/                              # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                # AdminDashboard, UserEvolution, ModuleProgress, UserTracking
│   │   │   ├── layout/               # Layout, Navigation, TutorialProvider, TutorialButton
│   │   │   ├── resilience/           # 6 actividades de resiliencia
│   │   │   └── ui/                   # 7 componentes reutilizables
│   │   ├── games/                    # Phaser.js integration
│   │   │   ├── PhaserGame.tsx        # Componente principal + 5 escenas
│   │   │   └── socket/               # GameSocket client
│   │   ├── pages/                    # 22+ páginas
│   │   ├── services/                 # 15+ servicios
│   │   ├── stores/                   # 3 Zustand stores
│   │   ├── hooks/                    # Hooks personalizados
│   │   ├── types/                    # Tipos TypeScript
│   │   └── utils/                    # Utilidades
│   └── public/                       # Assets estáticos
├── functions/                        # Cloud Functions (modular)
│   ├── src/
│   │   ├── index.ts                  # Entry point - exports all modules
│   │   ├── lib/
│   │   │   ├── admin.ts              # Firebase Admin initialization
│   │   │   └── helpers.ts            # Utilities (notifications, points, metrics)
│   │   ├── triggers/                 # Firestore triggers (6 functions)
│   │   ├── callable/                 # Callable functions (6 functions)
│   │   ├── jobs/                     # Scheduled functions (5 functions)
│   │   └── http/                     # HTTP functions (3 functions)
│   ├── tsconfig.json
│   └── package.json
├── firestore/                        # Firestore Security Rules
│   ├── firestore.rules               # 25+ colecciones con reglas por rol
│   └── firestore.indexes.json        # 30+ índices compuestos
├── storage/                          # Storage Rules
│   └── storage.rules                 # Reglas para avatars, cursos, documentos
├── games-server/                     # Servidor de juegos (Express + Socket.io)
│   ├── src/
│   │   ├── server.js                 # Servidor principal
│   │   ├── games/                    # 9 clases de juegos
│   │   └── data/                     # Datos de juegos
│   └── package.json
├── scripts/
│   └── firestore/                    # Scripts de seed para Firestore
│       ├── seed.js                   # Script principal de seed
│       └── package.json
├── .env.example                      # Template de variables de entorno
├── .firebaserc                       # Configuración de proyecto Firebase
├── firebase.json                     # Configuración Firebase (emulators, hosting)
├── design-system/                    # Documentación UI
├── specs/                            # Especificaciones SDD
├── docs/                             # Documentación
├── SPECIFICATIONS.md                 # Doc técnica completa
└── README.md                         # Este archivo
```

---

## 📊 Estadísticas del Sistema

```
Total Páginas:              22+
Total Componentes:          30+
Total Servicios:            15+
Total Stores:               3
Total Reportes:             35
Cursos Disponibles:         19 (3 tracks)
Actividades Resiliencia:    6
Psicólogos Registrados:     8
Municipios Cubiertos:       4
Preguntas Censo:            17
Juegos Multijugador:        9
Campamentos:                15
Nodos WiFi:                 10
Cloud Functions:            18
Firestore Collections:      25+
Firestore Indexes:          30+
```

---

## 🎓 Tracks de Capacitación

| Track | Módulos | Duración | Descripción |
|-------|---------|----------|-------------|
| 🛒 Continuidad Comercial Digital | 8 | 40h | E-commerce, redes sociales, ventas online |
| 🔧 Micro-oficios Remotos | 6 | 30h | Freelancing, servicios digitales |
| 📦 Logística de Suministros | 5 | 25h | Cadena de suministro, distribución |

---

## 🧠 Actividades de Resiliencia (Basado en APA)

| Actividad | Puntos | Descripción |
|-----------|--------|-------------|
| 🎨 Emotional Canvas | +15 | Mandala SVG interactivo con 12 emociones |
| 🎁 My Gifts Quiz | +20 | 20 talentos predefinidos + personalizados |
| 📔 Daily Journal | +10 | Diario con seguimiento de ánimo |
| 🧘 Mindfulness Sessions | +10-15 | 4 sesiones guiadas con timer |
| 📋 Action Plan Builder | +5 | Planes de acción por pasos |
| 📊 APA Assessment | +25 | 30 preguntas sobre 10 principios APA |

---

## 📊 Sistema de Gamificación

```
Puntos por actividad:
├── Completar módulo:      +10 pts
├── Aprobar quiz:          +25 pts
├── Completar curso:       +100 pts
├── Completar track:       +300 pts
├── Día consecutivo:       +5 pts
├── Referir amigo:         +50 pts
├── Emotional Canvas:      +15 pts
├── My Gifts Quiz:         +20 pts
├── Daily Journal:         +10 pts
├── Mindfulness:           +10-15 pts
├── Action Plan:           +5 pts
└── APA Assessment:        +25 pts
```

---

## 🎮 Juegos Multijugador (Phaser.js)

| Juego | Tipo | Descripción |
|-------|------|-------------|
| 📖 Glosario de Emociones | Palabras | Identificar emociones en situaciones |
| 🥢 Los Palitos | Destreza | Extraer palitos sin mover los demás |
| 🧩 Las Parejas | Memoria | Emparejar disparadores con estrategias |
| 🤩 Jugando con Emojis | Explosión | Destruir burbujas de emociones |
| 🦸 El Antifaz | Identidad | Conocer superpoderes personales |
| 🧩 Rompecabezas | Lógica | Reconstruir frases motivacionales |
| 🎯 Tengo el Control | Acción | Recolectar emociones positivas |
| 🛡️ Guardianes | Estrategia | Proteger el corazón de emociones |
| ⭐ Persona Única | Autoestima | Celebrar fortalezas personales |

---

## 🔐 Seguridad y Reglas Firestore

### Reglas por Colección (25+ colecciones)

| Colección | Lectura | Escritura | Descripción |
|-----------|---------|-----------|-------------|
| `users` | Authenticated | Owner + Admin | Perfiles de usuario |
| `tracks` | Público | Admin + Trainer | Rutas de aprendizaje |
| `courses` | Público | Admin + Trainer | Cursos por track |
| `enrollments` | Student own / Staff | Student create / Staff | Inscripciones |
| `quiz_submissions` | Student own / Staff | Student create | Resultados de quizzes |
| `points_transactions` | Student own / Staff | Staff only | Historial de puntos |
| `camps` | Authenticated | Coordinator + Admin | Campamentos |
| `wifiNodes` | Authenticated | Coordinator + Admin | Nodos WiFi |
| `psychologists` | Authenticated | Admin | Directorio psicólogos |
| `resilienceActivities` | Authenticated | Admin + Trainer | Actividades resiliencia |
| `deliveries` | Staff | Coordinator + Admin | Entregas logísticas |
| `sponsors` | Owner + Admin | Owner + Admin | Patrocinadores |
| `sponsorships` | Sponsor + Staff | Sponsor + Staff | Patrocinios |
| `beneficiaries` | Sponsor + Staff | Staff | Perfiles anónimos |
| `job_opportunities` | Authenticated | Sponsor + Admin | Ofertas de empleo |
| `employments` | Owner + Staff | Sponsor + Admin | Empleos |
| `census_surveys` | Staff | Staff | Encuestas de censo |
| `milestones` | Authenticated | Coordinator + Admin | Hitos de patrocinio |
| `notifications` | Owner | Owner mark read | Notificaciones |
| `impact_metrics` | Staff + Sponsor | Cloud Functions | Métricas globales |
| `redemptions` | Student own / Staff | Student create / Staff | Canjes de puntos |
| `certificates` | Authenticated | Staff | Certificados digitales |
| `game_sessions` | Authenticated | Authenticated | Sesiones de juego |
| `events` | Authenticated | Coordinator + Admin | Eventos |
| `meetings` | Authenticated | Coordinator + Admin | Reuniones |

### Funciones Helper
```javascript
isAuthenticated()    // Verifica autenticación
getUserRole()        // Obtiene rol del usuario
isAdmin()            // Verifica rol ADMIN
isCoordinator()      // Verifica rol COORDINATOR
isTrainer()          // Verifica rol TRAINER
isStudent()          // Verifica rol STUDENT
isSponsor()          // Verifica rol SPONSOR
isOwner(userId)      // Verifica propiedad
isApproved()         // Verifica aprobación
isStaff()            // Admin, Trainer o Coordinator
```

### Storage Rules
| Ruta | Lectura | Escritura | Límite |
|------|---------|-----------|--------|
| `/avatars/{userId}/` | Público | Owner | 5MB, imagen |
| `/courses/{courseId}/` | Authenticated | Staff | — |
| `/census/{surveyId}/` | Staff | Staff | — |
| `/sponsors/{sponsorId}/` | Owner + Admin | Owner | 10MB |
| `/beneficiaries/{beneficiaryId}/` | Staff | Staff | — |
| `/jobs/{jobId}/` | Authenticated | Sponsor + Admin | — |
| `/temp/{userId}/` | Owner | Owner | 10MB |

---

## ☁️ Cloud Functions (18 funciones)

### Triggers Firestore (6)
| Función | Evento | Descripción |
|---------|--------|-------------|
| `onUserCreated` | `users/create` | Bienvenida + actualizar métricas |
| `onEnrollmentCompleted` | `enrollments/update` | Otorgar puntos + verificar track |
| `onSponsorshipCreated` | `sponsorships/create` | Notificar sponsor + métricas |
| `onMilestoneCompleted` | `milestones/update` | Completar patrocinio si todos hitos listos |
| `onRedemptionCreated` | `redemptions/create` | Deductir puntos + notificar |
| `onCampUpdated` | `camps/update` | Alertar si campamento >90% capacidad |

### Callable Functions (6)
| Función | Descripción |
|---------|-------------|
| `getStudentTotalPoints` | Obtener total de puntos de un estudiante |
| `awardDailyAttendance` | Otorgar puntos de asistencia diaria (5 pts) |
| `submitQuiz` | Enviar quiz, calcular score, otorgar puntos si aprueba |
| `awardReferral` | Otorgar puntos por referido (50 referrer, 25 referido) |
| `autoMatchSponsors` | Algoritmo de matching automático patrocinador-beneficiario |
| `approveUser` | Aprobar/rechazar usuario (solo admins) |

### Scheduled Jobs (5)
| Función | Frecuencia | Descripción |
|---------|------------|-------------|
| `scheduledMetricsUpdate` | Cada 24h | Actualizar métricas de impacto |
| `scheduledStreakCheck` | Cada 24h | Verificar rachas diarias de actividad |
| `scheduledMilestoneCheck` | Cada 24h | Marcar hitos vencidos como OVERDUE |
| `scheduledWeeklyReport` | Lunes 9am | Enviar reporte semanal a admins |
| `scheduledCampMonitor` | Cada 6h | Monitorear capacidad de campamentos |

### HTTP Functions (3)
| Función | Método | Descripción |
|---------|--------|-------------|
| `verifyCertificate` | GET | Verificar certificado por código QR (público) |
| `getPublicStats` | GET | Estadísticas públicas de la plataforma |
| `processWebhook` | POST | Webhooks para integraciones externas |

---

## 🎓 Sistema de Tutoriales (Driver.js)

La plataforma incluye un sistema interactivo de tutoriales usando [Driver.js](https://driverjs.com) para guiar a los usuarios.

### Tutoriales Disponibles
| Tour | Descripción | Pasos |
|------|-------------|-------|
| 👋 Bienvenida | Tour general de la plataforma | 9 |
| 📊 Dashboard | Panel de control personal | 3 |
| 📚 Aula Resiliente | Cursos y tracks | 3 |
| 🧠 Resiliencia | Actividades emocionales | 2 |
| 🏆 Tabla de Líderes | Ranking y competencia | 2 |
| 🤝 Coordinación | Campamentos y logística | 4 |
| ⚙️ Administración | Panel admin | 2 |

### Uso
- **Primera visita**: El tutorial de bienvenida se muestra automáticamente
- **Botón flotante**: Haz clic en `?` en la esquina inferior derecha
- **Tutorial de página**: Selecciona "Tutorial de esta página" para la sección actual
- **Reiniciar**: Opción para ver el tutorial de bienvenida de nuevo

### Elementos Tutoriados (35+)
- Logo de la plataforma
- Navegación lateral (13 items)
- Header (notificaciones, menú de usuario)
- Dashboard (estadísticas, acciones rápidas, bienvenida)
- Cursos (tracks, lista, progreso)
- Resiliencia (puntos, actividades)
- Líderes (podio, ranking)
- Coordinación (tabs)
- Admin (estadísticas, usuarios)

---

## 🗄️ Base de Datos Firestore

### Scripts de Seed

Scripts para poblar la base de datos con datos iniciales de prueba.

```bash
# Navegar al directorio de scripts
cd scripts/firestore

# Instalar dependencias
npm install

# Ejecutar seed completo (contra emulador)
npm run seed:dev

# Ejecutar seed completo (contra producción)
npm run seed

# Seed de colección específica
npm run seed:users
npm run seed:courses
npm run seed:tracks
npm run seed:camps
npm run seed:wifi
npm run seed:psychologists
npm run seed:jobs
npm run seed:sponsors
npm run seed:resilience

# Limpiar y re-sembrar
npm run seed:clear
```

### Datos Semilla
| Colección | Cantidad | Descripción |
|-----------|----------|-------------|
| `users` | ~100 | 1 admin, 5 trainers, 4 coordinadores, 85 estudiantes, 5 sponsors |
| `tracks` | 3 | Continuidad Comercial, Micro-oficios, Logística |
| `courses` | 19 | 8 + 6 + 5 módulos por track |
| `enrollments` | ~50 | Inscripciones de estudiantes |
| `camps` | 15 | Campamentos en 4 municipios |
| `wifiNodes` | 10 | Nodos de conectividad |
| `psychologists` | 8 | Especialistas pre-cargados |
| `jobs` | 5 | Ofertas laborales |
| `sponsors` | 5 | Patrocinadores corporativos |
| `resilienceActivities` | 6 | Actividades de resiliencia |
| `deliveries` | 5 | Entregas logísticas |
| `points_transactions` | ~150 | Transacciones de puntos |

---

## 🗺️ Cobertura - 4 Municipios

| Municipio | Población Objetivo | Color |
|-----------|-------------------|-------|
| 🏖️ Catia La Mar | 35,000+ | 🔵 Azul |
| ✈️ Maiquetía | 25,000+ | 🟢 Verde |
| 🌴 Macuto | 20,000+ | 🟣 Púrpura |
| 🏔️ Caraballeda | 20,000+ | 🟠 Naranja |

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+
- npm o yarn
- Firebase CLI

### 1. Clonar e Instalar

```bash
# Clonar repositorio
git clone https://github.com/gointeraction/LaGuairaResiliente.git
cd LaGuairaResiliente

# Instalar dependencias del frontend
cd app
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env

# Editar .env con tus credenciales de Firebase
# VITE_FIREBASE_API_KEY=tu-api-key
# VITE_FIREBASE_PROJECT_ID=tu-project-id
# ... etc
```

### 3. Configurar Firebase

```bash
# Login en Firebase
firebase login

# Seleccionar proyecto
firebase use --add

# Iniciar emuladores (desarrollo)
firebase emulators:start
```

### 4. Ejecutar Frontend

```bash
cd app
npm run dev
# Abrir http://localhost:5173
```

### 5. Ejecutar Servidor de Juegos

```bash
cd games-server
npm install
npm start
# Servidor en http://localhost:3001
```

### 6. Poblar Base de Datos

```bash
cd scripts/firestore
npm install
npm run seed:dev
```

### 7. Deploy a Producción

```bash
# Build del frontend
cd app
npm run build

# Deploy completo
firebase deploy

# Deploy solo functions
firebase deploy --only functions

# Deploy solo reglas
firebase deploy --only firestore:rules
```

---

## 📱 PWA - Offline First

- ✅ Instalable en dispositivos móviles
- ✅ Service Worker para cache
- ✅ Funcionalidad offline limitada
- ✅ Sincronización automática al reconectar

---

## 📈 Escala y Costos

| Métrica | Valor |
|---------|-------|
| Usuarios estimados | 100,000+ |
| Costo Firebase/mes | ~$535 |
| Almacenamiento | ~50GB |
| Lecturas Firestore | ~10M/mes |
| Escrituras Firestore | ~2M/mes |

---

## 📚 Documentación

- 📄 [Especificación Técnica](SPECIFICATIONS.md)
- 🎨 [Design System](design-system/MASTER.md)
- 📐 [Guía de Escala](design-system/SCALE-GUIDE.md)
- 📊 [Catálogo de Reportes](docs/REPORTES.md)
- 🔧 [Specs Técnicos](specs/)
- 🔐 [Firestore Rules](firestore/firestore.rules)
- ☁️ [Cloud Functions](functions/src/)
- 🎓 [Guía de Tutoriales](#-sistema-de-tutoriales-driverjs)
- 🗄️ [Scripts de Seed Firestore](#-base-de-datos-firestore)

---

## 🤝 Contribuir

```bash
# 1. Fork el proyecto
# 2. Crear branch feature
git checkout -b feature/nueva-funcionalidad

# 3. Hacer cambios
git add .
git commit -m "feat: descripción del cambio"

# 4. Push
git push origin feature/nueva-funcionalidad

# 5. Abrir Pull Request
```

---

## 👥 Equipo

**Plataforma desarrollada por la Dirección Nacional de Inteligencia Artificial de CAVECOM-E 2026**

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles.

---

## 🆕 Changelog

### v1.3.0 (Actual)
- ✅ Firestore Rules completas (25+ colecciones, 30+ índices)
- ✅ Cloud Functions modulares (18 funciones)
  - 6 triggers Firestore
  - 6 callable functions
  - 5 scheduled jobs
  - 3 HTTP functions
- ✅ Storage Rules (7 rutas)
- ✅ `.env.example` con todas las variables de entorno
- ✅ `functions/tsconfig.json` para compilación TypeScript
- ✅ Arquitectura modular de Cloud Functions

### v1.2.0
- ✅ Sistema de tutoriales con Driver.js
- ✅ 7 tours interactivos
- ✅ 35+ elementos tutoriados
- ✅ Scripts de seed para Firestore
- ✅ Gestión de campamentos (15 camps)
- ✅ Nodos WiFi (10 nodes)
- ✅ Logística y distribución
- ✅ Matching patrocinador-beneficiario
- ✅ Dashboard anónimo de patrocinio
- ✅ Canje de puntos
- ✅ Certificados con QR
- ✅ 9 juegos multijugador (Phaser.js + Socket.io)

### v1.1.0
- ✅ 22 páginas completas
- ✅ 20+ componentes UI
- ✅ 10 servicios
- ✅ 6 actividades de resiliencia
- ✅ Sistema de gamificación
- ✅ Directorio de psicólogos
- ✅ Panel de administración
- ✅ Admin Dashboard con seguimiento individual
- ✅ Leaderboard interactivo
- ✅ Mapa de cobertura
- ✅ Centro de coordinación de emergencias
- ✅ Gestión de charlas y eventos
- ✅ Gestión de reuniones
- ✅ 35 reportes exportables
- ✅ PWA configurada

### v1.0.0
- ✅ Estructura base del proyecto
- ✅ Módulos de educación y resiliencia
- ✅ Sistema de autenticación
- ✅ Firebase configurado

---

<p align="center">
  <strong>🌊 La Guaira Resiliente Digital</strong><br>
  <em>Desarrollado por la Dirección Nacional de Inteligencia Artificial de CAVECOM-E 2026</em><br>
  <em>Construyendo futuro juntos</em>
</p>
