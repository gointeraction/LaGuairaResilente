# Constitución del Proyecto: La Guaira Resiliente Digital

**Versión**: 1.0.0
**Fecha**: 2026-07-13
**Estado**: Activo

---

## Preámbulo

Esta constitución establece los principios fundamentales que guían el desarrollo de la plataforma "La Guaira Resiliente Digital", un sistema diseñado para apoyar la reconstrucción económica de La Guaira después del desastre sísmico, mediante capacitación digital, apadrinamiento corporativo e inclusión laboral.

---

## Artículo I: Principio de Biblioteca Primera

Toda funcionalidad del sistema DEBE comenzar como un módulo independiente y reutilizable. No se implementará funcionalidad directamente en el código de la aplicación sin primero abstraerla en un componente de biblioteca.

**Aplicación**:
- Los servicios Firebase (auth, education, sponsorship) serán módulos independientes
- Los hooks de React serán componentes reutilizables
- Los tipos TypeScript serán compartidos entre módulos

---

## Artículo II: Mandato de Interfaz CLI

Toda biblioteca DEBE exponer su funcionalidad a través de interfaces de texto que permitan:
- Entrada de texto (stdin, argumentos, archivos)
- Salida de texto (stdout)
- Soporte para formato JSON para intercambio de datos estructurados

**Aplicación**:
- Cloud Functions deben ser invocables desde CLI
- Scripts de migración deben ser ejecutables desde terminal
- Herramientas de desarrollo deben ser accesibles via comandos

---

## Artículo III: Imperativo de Test-First

**INNEGOCIABLE**: Toda implementación DEBE seguir Desarrollo Guiado por Pruebas (TDD).

**Orden estricto**:
1. Escribir pruebas unitarias
2. Validar y aprobar pruebas con el usuario
3. Confirmar que las pruebas FALLAN (Fase Roja)
4. Implementar código mínimo para pasar (Fase Verde)
5. Refactorizar manteniendo pruebas verdes

**Aplicación**:
- Cada Cloud Function tendrá pruebas de contract
- Cada componente React tendrá pruebas de integración
- Cada servicio tendrá pruebas unitarias

---

## Artículo IV: Gobernanza de Seguridad y Acceso

**Principios de Seguridad**:
1. Autenticación obligatoria para todas las operaciones de datos
2. Autorización basada en roles (RBAC)
3. Datos sensibles encriptados en reposo y en tránsito
4. Auditoría de todas las operaciones de administración
5. Cumplimiento con protección de datos personales

**Roles del Sistema**:
- `ADMIN`: Acceso total al sistema
- `TRAINER`: Gestión de cursos y contenido
- `COORDINATOR`: Gestión operativa en campo
- `STUDENT`: Participante en capacitaciones
- `SPONSOR`: Empresa/individuo patrocinante

---

## Artículo V: Gobernanza de Integración y Pruebas

**Estrategia de Pruebas**:
1. Pruebas de contrato antes de implementación
2. Pruebas de integración con servicios Firebase reales
3. Pruebas E2E para flujos críticos
4. Pruebas de rendimiento para escenarios de alto tráfico

**Criterios de Aprobación**:
- Cobertura de código mínima: 80%
- Todas las pruebas deben pasar antes de merge
- Revisión de código obligatoria para cambios principales

---

## Artículo VI: Gobernanza de Versionado y Cambios

**Versionado Semántico**:
- MAJOR: Cambios breaking en la API
- MINOR: Nuevas funcionalidades compatibles
- PATCH: Correcciones de bugs

**Proceso de Cambio**:
1. Todos los cambios deben tener un issue asociado
2. Changesets deben ser documentados
3. Pruebas de regresión antes de release
4. Changelog actualizado para cada release

---

## Artículo VII: Puerta de Simplicidad

**Reglas de Simplicidad**:
1. Máximo 3 proyectos para implementación inicial
2. No hay "future-proofing" - resolver problemas actuales
3. Usar funcionalidad nativa de Firebase antes que librerías externas
4. Composición sobre herencia
5. Preferir soluciones simples sobre elegantes

**Justificación de Complejidad**:
Cualquier desviación de la simplicidad DEBE documentarse con:
- El problema que resuelve
- Por qué la alternativa simple es insuficiente
- Impacto a largo plazo

---

## Artículo VIII: Puerta de Anti-Abstracción

**Reglas Anti-Abstracción**:
1. Usar Firebase SDK directamente, no crear wrappers innecesarios
2. Modelo de datos Firestore directo, sin capas de abstracción adicionales
3. Componentes React funcionales, no clases
4. Hooks personalizados solo cuando hay duplicación real de lógica

**Se Permiten Abstracciones**:
- Servicios Firebase (para organizabilidad)
- Hooks personalizados (para lógica compartida)
- Componentes UI reutilizables (para consistencia visual)

---

## Artículo IX: Pruebas de Integración Primero

**Prioridad de Pruebas**:
1. Pruebas de contract (definen la API)
2. Pruebas de integración (servicios reales)
3. Pruebas E2E (flujos de usuario)
4. Pruebas unitarias (componentes aislados)

**Entornos de Prueba**:
- Desarrollo: Emuladores Firebase
- Staging: Proyecto Firebase separado
- Producción: Proyecto Firebase principal

---

## Enmiendas

### Enmienda 1: Soporte Offline-First
**Fecha**: 2026-07-13
**Descripción**: Dado que la plataforma opera en zonas con conectividad limitada, se agrega el principio de que la funcionalidad crítica DEBE funcionar sin conexión y sincronizar cuando se restaure la conectividad.

### Enmienda 2: Gamificación como Mecanismo de Retención
**Fecha**: 2026-07-13
**Descripción**: El sistema de Puntos de Resiliencia es fundamental para la retención de usuarios y DEBE ser implementado desde la primera versión.

---

## Proceso de Enmienda

Modificaciones a esta constitución requieren:
1. Documentación explícita del rationale del cambio
2. Revisión y aprobación por los mantenedores del proyecto
3. Evaluación de compatibilidad hacia atrás
4. Actualización del número de versión
