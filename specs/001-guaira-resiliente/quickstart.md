# Quickstart: La Guaira Resiliente Digital

**Feature**: 001-guaira-resiliente
**Date**: 2026-07-13

---

## Prerrequisitos

```bash
# Node.js 20+
node --version  # v20.0.0 o superior

# npm o yarn
npm --version

# Firebase CLI
npm install -g firebase-tools
firebase --version

# Python 3.11+ (para spec-kit si se usa)
python --version
```

---

## Setup Rápido (5 minutos)

### 1. Clonar e instalar dependencias

```bash
cd "C:\Users\iaege\Proyectos Cavecom-e\Resilente"

# Frontend
cd app
npm install

# Cloud Functions
cd ../functions
npm install
```

### 2. Configurar Firebase

```bash
# Login a Firebase
firebase login

# Seleccionar proyecto
firebase use la-guaira-resiliente

# O crear proyecto nuevo
firebase projects:create la-guaira-resiliente
firebase use la-guaira-resiliente
```

### 3. Configurar variables de entorno

```bash
# Crear archivo .env en app/
cp app/.env.example app/.env

# Editar con tus credenciales Firebase
# VITE_FIREBASE_API_KEY=
# VITE_FIREBASE_AUTH_DOMAIN=
# VITE_FIREBASE_PROJECT_ID=
# etc.
```

### 4. Iniciar desarrollo

```bash
# Terminal 1: Frontend
cd app
npm run dev

# Terminal 2: Emuladores Firebase
firebase emulators:start

# Terminal 3: Cloud Functions (si es necesario)
cd functions
npm run build:watch
```

### 5. Verificar funcionamiento

1. Abrir http://localhost:5173
2. Registrar un usuario nuevo
3. Iniciar sesión
4. Navegar por la aplicación

---

## Escenarios de Validación

### SC-001: Registro de Usuario

```bash
# Acción
1. Ir a /register
2. Completar formulario:
   - Email: test@example.com
   - Password: password123
   - Nombre: Juan
   - Apellido: Pérez
   - Cédula: 12345678
   - Municipio: MACUTO
3. Click "Registrar"

# Verificación
- [ ] Se crea usuario en Firebase Auth
- [ ] Se crea documento en Firestore collection "users"
- [ ] Se redirige a /dashboard
- [ ] Se muestra nombre del usuario en header
```

### SC-002: Login

```bash
# Acción
1. Ir a /login
2. Ingresar credenciales
3. Click "Iniciar Sesión"

# Verificación
- [ ] Se obtiene token JWT
- [ ] Se carga perfil desde Firestore
- [ ] Se redirige a /dashboard
- [ ] Se persiste sesión (refresh page)
```

### SC-003: Navegación de Cursos

```bash
# Acción
1. Login como estudiante
2. Ir a /courses
3. Seleccionar un track
4. Ver listado de cursos
5. Click en un curso

# Verificación
- [ ] Se muestran 3 tracks
- [ ] Cada track muestra número de módulos
- [ ] Los cursos se cargan desde Firestore
- [ ] El detalle muestra video/descripción
```

### SC-004: Inscripción y Progreso

```bash
# Acción
1. Login como estudiante
2. Ir a un curso
3. Click "Inscribirse"
4. Completar primer módulo
5. Ver progreso actualizado

# Verificación
- [ ] Se crea enrollment en Firestore
- [ ] El progreso se actualiza a 12.5% (1/8)
- [ ] Se otorgan 10 Puntos de Resiliencia
- [ ] El progreso persiste al recargar
```

### SC-005: Quiz y Puntos

```bash
# Acción
1. Completar un módulo con quiz
2. Responder todas las preguntas
3. Enviar quiz

# Verificación
- [ ] Se calcula el score
- [ ] Si score >= 80%, se aprueba
- [ ] Se otorgan 25 puntos bonus
- [ ] Se muestra retroalimentación
```

### SC-006: Portal de Patrocinador

```bash
# Acción
1. Login como sponsor (empresa)
2. Ir a /sponsor-portal
3. Ver perfiles anónimos
4. Seleccionar beneficiario
5. Crear patrocinio

# Verificación
- [ ] Se muestran perfiles sin datos sensibles
- [ ] Se muestra ubicación y necesidades
- [ ] Se crea sponsorship en Firestore
- [ ] Se envía notificación al coordinador
```

### SC-007: Dashboard de Impacto

```bash
# Acción
1. Login como admin
2. Ir a /admin
3. Ver métricas
4. Filtrar por municipio

# Verificación
- [ ] Se muestran métricas aggregate
- [ ] Los gráficos cargan correctamente
- [ ] El filtro actualiza las métricas
- [ ] Se puede exportar a CSV
```

### SC-008: Funcionamiento Offline

```bash
# Acción
1. Login como estudiante
2. Ir a un curso
3. Click "Descargar para offline"
4. Desactivar WiFi/datos
5. Navegar por el curso
6. Completar un módulo
7. Reactivar conexión

# Verificación
- [ ] El contenido está disponible offline
- [ ] El progreso se guarda localmente
- [ ] Al reconectar, se sincroniza con Firestore
- [ ] No se pierde ningún progreso
```

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Iniciar servidor de desarrollo
npm run build                  # Build de producción
npm run preview                # Preview del build

# Firebase
firebase emulators:start       # Iniciar emuladores
firebase deploy                # Desplegar a producción
firebase deploy --only hosting # Solo desplegar hosting
firebase deploy --only functions # Solo desplegar functions
firebase deploy --only firestore:rules # Solo reglas

# Testing
npm run test                   # Ejecutar tests
npm run test:coverage          # Tests con cobertura

# Linting
npm run lint                   # Verificar código
npm run lint:fix               # Auto-corregir
```

---

## Troubleshooting

### Problema: Firebase Auth no funciona

```bash
# Verificar que emuladores están corriendo
firebase emulators:start

# Verificar variables de entorno
cat app/.env | grep FIREBASE
```

### Problema: Firestore permissions denied

```bash
# Verificar reglas
cat firestore/firestore.rules

# Deploy reglas actualizadas
firebase deploy --only firestore:rules
```

### Problema: Build falla

```bash
# Limpiar cache
cd app
rm -rf node_modules
npm install

# Verificar TypeScript
npx tsc --noEmit
```

### Problema: Offline no funciona

```bash
# Verificar Service Worker
# En Chrome: Application > Service Workers

# Verificar IndexedDB
# En Chrome: Application > IndexedDB
```

---

## Estructura de Verificación

Para cada feature, verificar:

1. **Unit Tests**: Componentes aislados funcionan
2. **Integration Tests**: Flujo completo funciona
3. **Manual Testing**: UX es correcta
4. **Offline Testing**: Funciona sin conexión
5. **Performance**: Carga en < 3 segundos
6. **Accessibility**: Navegación con teclado/screen reader
