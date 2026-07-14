# La Guaira Resiliente Digital

Plataforma de Capacitación, Inclusión Laboral y Apadrinamiento Corporativo para la reconstrucción económica de La Guaira.

## 📋 Descripción

Esta plataforma está diseñada para apoyar a 100,000+ ciudadanos damnificados del Estado La Guaira después del desastre sísmico, ofreciendo:

- **Aula Resiliente**: Capacitación digital offline-first con gamificación
- **Portal de Apadrinamiento**: Conexión entre empresas y beneficiarios
- **Sistema de Empleo**: Vinculación laboral y financiamiento BNPL
- **Dashboard de Impacto**: Métricas en tiempo real para tomadores de decisiones

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Lucide Icons
- **Backend**: Firebase Cloud Functions
- **Database**: Cloud Firestore
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting
- **PWA**: Vite Plugin PWA

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+ (https://nodejs.org)
- npm o yarn
- Firebase CLI

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd Resilente

# Instalar dependencias
cd app
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales Firebase

# Iniciar desarrollo
npm run dev
```

### Configuración Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication (Email/Password)
3. Crear Firestore Database
4. Habilitar Storage
5. Copiar credenciales a `.env`

## 📁 Estructura del Proyecto

```
Resilente/
├── app/                    # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── pages/          # Páginas
│   │   ├── services/       # Servicios Firebase
│   │   ├── stores/         # Estado (Zustand)
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilidades
│   └── public/             # Assets estáticos
├── functions/              # Cloud Functions
├── firestore/              # Security Rules
├── storage/                # Storage Rules
├── design-system/          # Design System
└── specs/                  # Documentación SDD
```

## 🎨 Design System

Ver `design-system/MASTER.md` para el design system completo.

## 📊 Escala

- **Usuarios estimados**: 100,000+
- **Firebase Costo estimado**: ~$535/mes
- **Optimizaciones**: PWA, lazy loading, offline-first

## 📚 Documentación

- [Especificación Técnica](SPECIFICATIONS.md)
- [Design System](design-system/MASTER.md)
- [Guía de Escala](design-system/SCALE-GUIDE.md)
- [Spec-Driven Development](specs/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License
