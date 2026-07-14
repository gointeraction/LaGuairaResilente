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

### 👨‍⚕️ Salud Mental
| Módulo | Descripción | Ruta |
|--------|-------------|------|
| 👨‍⚕️ **Directorio Psicólogos** | 8 especialistas pre-cargados | `/directory` |
| 📝 **Registro Red Apoyo** | Flujo de verificación FPV/MPPS | `/support-network-register` |

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

### 💰 Patrocinio
| Módulo | Descripción | Ruta |
|--------|-------------|------|
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
├── app/                          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/            # AdminDashboard, UserEvolution, ModuleProgress, UserTracking
│   │   │   ├── layout/           # Layout, Navigation, TutorialProvider, TutorialButton
│   │   │   ├── resilience/       # 6 actividades de resiliencia
│   │   │   └── ui/               # 7 componentes reutilizables
│   │   ├── games/                # Phaser.js integration
│   │   │   ├── PhaserGame.tsx    # Componente principal + 5 escenas
│   │   │   └── socket/           # GameSocket client
│   │   ├── pages/                # 22+ páginas
│   │   ├── services/             # 15+ servicios
│   │   ├── stores/               # 3 Zustand stores
│   │   ├── hooks/                # Hooks personalizados
│   │   ├── types/                # Tipos TypeScript
│   │   └── utils/                # Utilidades
│   └── public/                   # Assets estáticos
├── functions/                    # Cloud Functions
├── firestore/                    # Security Rules (15 colecciones)
├── storage/                      # Storage Rules
├── games-server/                 # Servidor de juegos (Express + Socket.io)
│   ├── src/
│   │   ├── server.js             # Servidor principal
│   │   ├── games/                # 9 clases de juegos
│   │   └── data/                 # Datos de juegos
│   └── package.json
├── scripts/
│   └── firestore/                # Scripts de seed para Firestore
│       ├── seed.js               # Script principal de seed
│       └── package.json
├── design-system/                # Documentación UI
├── specs/                        # Especificaciones SDD
├── docs/                         # Documentación
└── SPECIFICATIONS.md             # Doc técnica completa
```

---

## 📊 Estadísticas del Sistema

```
Total Páginas:           22+
Total Componentes:       30+
Total Servicios:         15+
Total Stores:            3
Total Reportes:          35
Cursos Disponibles:      19 (3 tracks)
Actividades Resiliencia: 6
Psicólogos Registrados:  8
Municipios Cubiertos:    4
Preguntas Censo:         17
Juegos Multijugador:     9
Campamentos:             15
Nodos WiFi:              10
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

## 📊 Centro de Reportes (35 Reportes)

### Por Módulo
| Módulo | Reportes | IDs |
|--------|----------|-----|
| 🎓 Educación | 8 | RPT-001 a RPT-008 |
| 🧠 Resiliencia | 7 | RPT-009 a RPT-015 |
| 👨‍⚕️ Psicólogos | 4 | RPT-016 a RPT-019 |
| 💼 Empleo | 4 | RPT-020 a RPT-023 |
| 🤝 Patrocinio | 4 | RPT-024 a RPT-027 |
| 📋 Censo | 3 | RPT-028 a RPT-030 |
| 🏆 Gamificación | 3 | RPT-031 a RPT-033 |
| 📈 Impacto | 2 | RPT-034 a RPT-035 |

### Frecuencia
| Frecuencia | Cantidad |
|------------|----------|
| Diario | 4 |
| Semanal | 7 |
| Quincenal | 5 |
| Mensual | 17 |
| Trimestral | 2 |

### Exportación
- CSV
- Excel
- PDF

---

## 🏠 Coordinación de Emergencias

### Campamentos (15)
- **Catia La Mar**: 5 campamentos
- **Maiquetía**: 4 campamentos
- **Macuto**: 3 campamentos
- **Caraballeda**: 3 campamentos

### Nodos WiFi (10)
- Fibra Óptica: 4 nodos
- 4G LTE: 3 nodos
- Satelital: 2 nodos
- MESH: 1 nodo

### Logística
- Seguimiento de entregas
- Distribución de alimentos
- Recargas móviles
- Rutas de distribución

### Matching
- Algoritmo de puntuación automática
- Asignación patrocinador-beneficiario
- Seguimiento de progreso

---

## 🗺️ Cobertura - 4 Municipios

| Municipio | Población Objetivo | Color |
|-----------|-------------------|-------|
| 🏖️ Catia La Mar | 35,000+ | 🔵 Azul |
| ✈️ Maiquetía | 25,000+ | 🟢 Verde |
| 🌴 Macuto | 20,000+ | 🟣 Púrpura |
| 🏔️ Caraballeda | 20,000+ | 🟠 Naranja |

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

### Elementos Tutoriados
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

### Colecciones Firestore
```
users/              # Usuarios de la plataforma
├── uid
├── email
├── full_name
├── role            # ADMIN | TRAINER | COORDINATOR | STUDENT | SPONSOR
├── municipality    # CATIA_LA_MAR | MAIQUETIA | MACUTO | CARABALLEDA
├── points
├── courses_completed
├── current_streak
└── is_approved

tracks/             # Rutas de aprendizaje
courses/            # Cursos por track
enrollments/        # Inscripciones de estudiantes
points_transactions/ # Historial de puntos
camps/              # Campamentos
wifiNodes/          # Nodos WiFi
psychologists/      # Directorio de psicólogos
jobs/               # Ofertas de empleo
sponsors/           # Patrocinadores
resilienceActivities/ # Actividades de resiliencia
deliveries/         # Entregas logísticas
```

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+
- npm o yarn
- Firebase CLI

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/gointeraction/LaGuairaResiliente.git
cd LaGuairaResiliente

# Instalar dependencias del frontend
cd app
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración Firebase

```bash
# Login en Firebase
firebase login

# Seleccionar proyecto
firebase use --add

# Deploy reglas
firebase deploy --only firestore:rules

# Deploy funciones
firebase deploy --only functions
```

### Ejecutar Servidor de Juegos

```bash
# Navegar al directorio de juegos
cd games-server

# Instalar dependencias
npm install

# Iniciar servidor (puerto 3001)
npm start
```

### Poblar Base de Datos

```bash
# Navegar al directorio de scripts
cd scripts/firestore

# Instalar dependencias
npm install

# Ejecutar seed contra emulador
npm run seed:dev
```

---

## 🔐 Seguridad

- **Firestore Rules**: 15 colecciones con reglas por rol
- **Authentication**: Email/Password + Google OAuth
- **Storage Rules**: Acceso controlado por usuario
- **Roles**: ADMIN, TRAINER, COORDINATOR, STUDENT, SPONSOR
- **Tutorial**: Driver.js para onboarding seguro

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

### v1.2.0 (Actual)
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
