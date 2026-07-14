# 🌊 La Guaira Resiliente Digital

> Plataforma Integral de Capacitación, Inclusión Laboral y Apadrinamiento Corporativo para la Reconstrucción Económica de La Guaira.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

---

## 📋 Descripción

Plataforma digital diseñada para apoyar a **100,000+ ciudadanos damnificados** del Estado La Guaira después del desastre sísmico, ofreciendo un ecosistema completo de recuperación económica y bienestar emocional.

### 🎯 Módulos Principales

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| 🎓 **Aula Resiliente** | Capacitación digital con 3 tracks y gamificación | ✅ |
| 💼 **Portal de Empleo** | Vinculación laboral y ofertas de trabajo | ✅ |
| 🤝 **Portal de Patrocinio** | Conexión empresas-beneficiarios | ✅ |
| 🧠 **Centro de Resiliencia** | 6 actividades basadas en APA | ✅ |
| 👨‍⚕️ **Directorio Psicólogos** | 8 especialistas pre-cargados | ✅ |
| 📊 **Panel Admin** | Gestión completa de usuarios | ✅ |
| 🏆 **Leaderboard** | Ranking de ciudadanos resilientes | ✅ |
| 🗺️ **Mapa Cobertura** | Visualización de municipios | ✅ |
| 📋 **Censo Digital** | 17 preguntas de-diagnóstico | ✅ |
| 📈 **Reportes** | Métricas e impacto | ✅ |

---

## 🛠️ Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                             │
├─────────────────────────────────────────────────────────┤
│  React 18 │ TypeScript │ Vite │ Tailwind CSS │ PWA     │
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

### Dependencias Principales

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **Framer Motion** - Animations
- **Firebase** - Backend as a Service
- **Vite PWA** - Progressive Web App

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+ 
- npm o yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/gointeraction/LaGuairaResiliente.git
cd LaGuairaResiliente

# 2. Instalar dependencias
cd app
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales Firebase

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Configuración Firebase

```bash
# 1. Login en Firebase
firebase login

# 2. Seleccionar proyecto
firebase use --add

# 3. Deploy reglas Firestore
firebase deploy --only firestore:rules

# 4. Deploy Cloud Functions
cd functions && npm install && cd ..
firebase deploy --only functions

# 5. Deploy Storage Rules
firebase deploy --only storage
```

---

## 📁 Estructura del Proyecto

```
LaGuairaResiliente/
├── app/                          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Layout y Navigation
│   │   │   ├── resilience/       # 6 actividades de resiliencia
│   │   │   └── ui/               # Componentes reutilizables
│   │   ├── pages/                # 17 páginas
│   │   ├── services/             # 9 servicios Firebase
│   │   ├── stores/               # 3 Zustand stores
│   │   ├── hooks/                # Hooks personalizados
│   │   ├── types/                # Tipos TypeScript (313 líneas)
│   │   └── utils/                # Utilidades
│   └── public/                   # Assets estáticos
├── functions/                    # Cloud Functions (370 líneas)
├── firestore/                    # Security Rules (15 colecciones)
├── storage/                      # Storage Rules
├── design-system/                # Documentación UI
├── specs/                        # Especificaciones SDD
└── SPECIFICATIONS.md             # Doc técnica completa
```

---

## 🎓 Módulos Detallados

### 1. Aula Resiliente - Tracks de Capacitación

| Track | Módulos | Duración | Descripción |
|-------|---------|----------|-------------|
| 🛒 Continuidad Comercial Digital | 8 | 40h | E-commerce, redes sociales, ventas online |
| 🔧 Micro-oficios Remotos | 6 | 30h | Freelancing, servicios digitales |
| 📦 Logística de Suministros | 5 | 25h | Cadena de suministro, distribución |

### 2. Centro de Resiliencia (Basado en APA)

| Actividad | Puntos | Descripción |
|-----------|--------|-------------|
| 🎨 Emotional Canvas | +15 | Mandala SVG interactivo con 12 emociones |
| 🎁 My Gifts Quiz | +20 | 20 talentos predefinidos + personalizados |
| 📔 Daily Journal | +10 | Diario con seguimiento de ánimo |
| 🧘 Mindfulness Sessions | +10-15 | 4 sesiones guiadas con timer |
| 📋 Action Plan Builder | +5 | Planes de acción por pasos |
| 📊 APA Assessment | +25 | 30 preguntas sobre 10 principios APA |

### 3. Sistema de Gamificación

```
Puntos por actividad:
├── Completar módulo:     +10 pts
├── Aprobar quiz:         +25 pts
├── Completar curso:      +100 pts
├── Completar track:      +300 pts
├── Día consecutivo:      +5 pts
├── Referir amigo:        +50 pts
├── Actividades Resiliencia: +5-25 pts
└── Completar plan acción: +5 pts
```

### 4. Directorio de Psicólogos

8 especialistas pre-cargados con:
- Perfil completo y especialidades
- Sistema de verificación (FPV/MPPS/COP/OPQ)
- Flujo de registro y aprobación
- Filtros por municipio y especialidad

---

## 🗺️ Cobertura - 4 Municipios

| Municipio | Población Objetivo | Color |
|-----------|-------------------|-------|
| 🏖️ Catia La Mar | 35,000+ | 🔵 Azul |
| ✈️ Maiquetía | 25,000+ | 🟢 Verde |
| 🌴 Macuto | 20,000+ | 🟣 Púrpura |
| 🏔️ Caraballeda | 20,000+ | 🟠 Naranja |

---

## 📊 Métricas del Sistema

```
Total Usuarios:          100,000+ (objetivo)
Cursos Disponibles:      19 (3 tracks)
Actividades Resiliencia: 6
Psicólogos Registrados:  8
Municipios Cubiertos:    4
Preguntas Censo:         17
```

---

## 🔐 Seguridad

- **Firestore Rules**: 15 colecciones con reglas por rol
- **Authentication**: Email/Password + Google OAuth
- **Storage Rules**: Acceso controlado por usuario
- **Roles**: ADMIN, TRAINER, COORDINATOR, STUDENT, SPONSOR

---

## 📱 PWA - Offline First

La plataforma funciona como Progressive Web App:
- ✅ Instalable en dispositivos móviles
- ✅ Service Worker para cache
- ✅ Funcionalidad offline limitada
- ✅ Sincronización automática al reconectar

---

## 🚀 Deploy

### Firebase Hosting

```bash
# Build producción
cd app
npm run build

# Deploy a Firebase Hosting
firebase deploy --only hosting
```

### Variables de Entorno

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

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

- 📄 [Especificación Técnica](SPECIFICATIONS.md) - Doc completa del sistema
- 🎨 [Design System](design-system/MASTER.md) - Guía de diseño
- 📐 [Guía de Escala](design-system/SCALE-GUIDE.md) - Optimización
- 🔧 [Specs Técnicos](specs/) - Desarrollo guiado por specs

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

### v1.0.0 (Actual)
- ✅ 17 páginas completas
- ✅ 13 componentes UI
- ✅ 9 servicios Firebase
- ✅ 6 actividades de resiliencia
- ✅ Sistema de gamificación
- ✅ Directorio de psicólogos
- ✅ Panel de administración
- ✅ Leaderboard interactivo
- ✅ Mapa de cobertura
- ✅ PWA configurada

---

<p align="center">
  <strong>🌊 La Guaira Resiliente Digital</strong><br>
  <em>Construyendo futuro juntos</em>
</p>
