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

## 🎯 Módulos Principales (22 Módulos)

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

---

## 🛠️ Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                             │
├─────────────────────────────────────────────────────────┤
│  React 18 │ TypeScript │ Vite │ Tailwind CSS │ PWA     │
│  Zustand │ Framer Motion │ Lucide Icons                │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND                              │
├─────────────────────────────────────────────────────────┤
│  Firebase Auth │ Cloud Firestore │ Cloud Functions      │
│  Firebase Storage │ Firebase Hosting                    │
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
│   │   │   ├── layout/           # Layout y Navigation
│   │   │   ├── resilience/       # 6 actividades de resiliencia
│   │   │   └── ui/               # 7 componentes reutilizables
│   │   ├── pages/                # 22 páginas
│   │   ├── services/             # 10 servicios
│   │   ├── stores/               # 3 Zustand stores
│   │   ├── hooks/                # Hooks personalizados
│   │   ├── types/                # Tipos TypeScript (313 líneas)
│   │   └── utils/                # Utilidades
│   └── public/                   # Assets estáticos
├── functions/                    # Cloud Functions
├── firestore/                    # Security Rules (15 colecciones)
├── storage/                      # Storage Rules
├── design-system/                # Documentación UI
├── specs/                        # Especificaciones SDD
├── docs/                         # Documentación (REPORTES.md)
└── SPECIFICATIONS.md             # Doc técnica completa
```

---

## 📊 Estadísticas del Sistema

```
Total Páginas:           22
Total Componentes:       20+
Total Servicios:         10
Total Stores:            3
Total Reportes:          35
Cursos Disponibles:      19 (3 tracks)
Actividades Resiliencia: 6
Psicólogos Registrados:  8
Municipios Cubiertos:    4
Preguntas Censo:         17
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

### Albergues
- Gestión de 4 municipios
- Control de ocupación
- Coordinadores asignados
- Amenidades disponibles

### Charlas y Eventos
- Charlas informativas
- Talleres prácticos
- Capacitaciones
- Eventos sociales
- Emergencias

### Reuniones
- Reuniones ordinarias
- Reuniones extraordinarias
- Seguimiento
- Emergencias
- Sistema de compromisos

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

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/gointeraction/LaGuairaResiliente.git
cd LaGuairaResiliente

# Instalar dependencias
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

---

## 🔐 Seguridad

- **Firestore Rules**: 15 colecciones con reglas por rol
- **Authentication**: Email/Password + Google OAuth
- **Storage Rules**: Acceso controlado por usuario
- **Roles**: ADMIN, TRAINER, COORDINATOR, STUDENT, SPONSOR

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

Desarrollado por **CAVECOM-E** para la reconstrucción de La Guaira.

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles.

---

## 🆕 Changelog

### v1.1.0 (Actual)
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
  <em>Construyendo futuro juntos</em>
</p>
