# Feature Specification: La Guaira Resiliente Digital

**Feature Branch**: `001-guaira-resiliente`

**Created**: 2026-07-13

**Status**: Draft

**Input**: Plan Maestro "La Guaira Resiliente Digital" de CAVECOM-E

---

## User Scenarios & Testing

### User Story 1 - Registro y Gestión de Usuarios (Priority: P1)

Como ciudadano damnificado de La Guaira, quiero registrarme en la plataforma para acceder a capacitaciones digitales y servicios de reconstrucción económica.

**Why this priority**: Es la base de todo el sistema. Sin usuarios registrados no hay capacitación ni apadrinamiento.

**Independent Test**: Puede ser probado completamente registrando un nuevo usuario, verificando que se crea en Firebase Auth y Firestore, y que el usuario puede iniciar sesión.

**Acceptance Scenarios**:

1. **Given** un ciudadano con acceso a internet, **When** completa el formulario de registro con email, contraseña, nombre, cédula y municipio, **Then** se crea una cuenta en Firebase Auth y un documento en Firestore con rol `STUDENT`.

2. **Given** un usuario registrado, **When** inicia sesión con email y contraseña, **Then** recibe un token JWT y puede acceder a su perfil.

3. **Given** un usuario con sesión activa, **When** actualiza su perfil, **Then** los cambios se reflejan en Firestore inmediatamente.

4. **Given** un usuario olvida su contraseña, **When** solicita recuperación, **Then** recibe un email con instrucciones para restablecer.

---

### User Story 2 - Censo Sociotécnico (Priority: P1)

Como coordinador de campo, quiero realizar encuestas a los damnificados para evaluar su nivel de alfabetización digital y necesidades de capacitación.

**Why this priority**: Permite dimensionar el alcance del programa y personalizar la experiencia de capacitación.

**Independent Test**: Puede ser probado creando una encuesta, verificando que se almacena en Firestore con las respuestas correctas y que se actualiza el perfil del encuestado.

**Acceptance Scenarios**:

1. **Given** un coordinador autenticado, **When** completa una encuesta para un ciudadano, **Then** se crea un documento en `census_surveys` con las respuestas.

2. **Given** una encuesta completada, **When** se procesa, **Then** se actualiza el `digital_literacy_level` del usuario encuestado.

3. **Given** múltiples encuestas completadas, **When** se consulta el dashboard, **Then** se muestran estadísticas aggregate por municipio.

---

### User Story 3 - Aula Resiliente - Capacitación Offline (Priority: P1)

Como estudiante damnificado, quiero acceder a cursos de capacitación digital incluso sin conexión a internet, para aprender habilidades que me ayuden a reconstruir mi economía.

**Why this priority**: Es el core del valor propuesto. La capacitación es el mecanismo de transformación económica.

**Independent Test**: Puede ser probado descargando un curso, desconectando internet, completando módulos, y verificando que el progreso se sincroniza al reconectar.

**Acceptance Scenarios**:

1. **Given** un estudiante autenticado, **When** navega al catálogo de cursos, **Then** ve los 3 tracks disponibles con sus módulos.

2. **Given** un estudiante en un curso, **When** tiene conexión, **Then** puede descargar el contenido para uso offline.

3. **Given** un estudiante completando un módulo offline, **When** termina el módulo, **Then** el progreso se almacena localmente y se sincroniza cuando haya conexión.

4. **Given** un estudiante que completa un quiz con score >= 80%, **When** se procesa el resultado, **Then** recibe 25 Puntos de Resiliencia.

5. **Given** un estudiante que completa un curso, **When** se confirma el completion, **Then** recibe 100 Puntos de Resiliencia y una notificación.

---

### User Story 4 - Sistema de Gamificación (Priority: P2)

Como estudiante, quiero acumular Puntos de Resiliencia por mis logros académicos, para canjearlos por beneficios como recargas de saldo o prioridad en solicitudes.

**Why this priority**: Mecanismo clave de retención y motivación.

**Independent Test**: Puede ser probado verificando que los puntos se otorgan correctamente por cada acción y que el total se calcula adecuadamente.

**Acceptance Scenarios**:

1. **Given** un estudiante que completa acciones en la plataforma, **When** se registra la acción, **Then** recibe los puntos correspondientes según la tabla de gamificación.

2. **Given** un estudiante con puntos acumulados, **When** consulta su saldo, **Then** ve el total y el historial de transacciones.

3. **Given** un estudiante que completa un track completo, **When** se verifica el logro, **Then** recibe 300 puntos bonus y una notificación especial.

---

### User Story 5 - Portal de Apadrinamiento Corporativo (Priority: P2)

Como representante de una empresa, quiero ver perfiles anónimos de damnificados para patrocinar su capacitación y reconstrucción económica.

**Why this priority**: Mecanismo de financiamiento sostenible del programa.

**Independent Test**: Puede ser probado creando un patrocinador, navegando perfiles anónimos, y creando un patrocinio que se registre correctamente.

**Acceptance Scenarios**:

1. **Given** una empresa registrada como patrocinante, **When** accede al portal, **Then** ve perfiles anónimos de beneficiarios con sus necesidades.

2. **Given** un patrocinador seleccionando un beneficiario, **When** crea un patrocinio, **Then** se registra con el tipo, monto y beneficio asociado.

3. **Given** un patrocinio activo, **When** avanza un milestone, **Then** el patrocinador recibe una notificación y puede ver el progreso.

4. **Given** un patrocinador que completa un patrocinio, **When** se verifica el logro, **Then** recibe el sello digital "Empresa Solidaria y Resiliente".

---

### User Story 6 - Dashboard de Impacto (Priority: P2)

Como administrador del programa, quiero ver métricas en tiempo real del impacto del programa para tomar decisiones informadas.

**Why this priority**: Permite medir el éxito y ajustar estrategias.

**Independent Test**: Puede ser probado verificando que las métricas se actualizan cuando ocurren eventos (nuevos usuarios, completaciones, patrocinios).

**Acceptance Scenarios**:

1. **Given** el dashboard de impacto, **When** se carga, **Then** muestra métricas actualizadas: total beneficiarios, cursos completados, patrocinios activos, fondos recaudados.

2. **Given** un filtro por municipio, **When** se aplica, **Then** las métricas se recalculan solo para ese municipio.

3. **Given** datos históricos, **When** se selecciona un rango de fechas, **Then** se muestra la evolución temporal de las métricas.

---

### User Story 7 - Sistema de Empleo y BNPL (Priority: P3)

Como egresado del programa, quiero acceder a oportunidades de empleo y financiamiento para inventory, para continuar mi crecimiento económico.

**Why this priority**: Completa el ciclo de reconstrucción económica.

**Independent Test**: Puede ser probado publicando un empleo, verificando que un egresado calificado puede aplicar y que el sistema BNPL funciona correctamente.

**Acceptance Scenarios**:

1. **Given** un egresado certificado, **When** navega la sección de empleos, **Then** ve oportunidades compatibles con su track de capacitación.

2. **Given** una empresa que publica un empleo, **When** se aprueba la publicación, **Then** aparece en el listado para egresados calificados.

3. **Given** un egresado contratado, **When** necesita inventory, **Then** puede solicitar financiamiento BNPL a través de la plataforma.

---

### Edge Cases

- ¿Qué pasa cuando un estudiante intenta inscribirse en un curso que ya completó?
  → Se muestra mensaje informativo y se ofrece revisar el curso o inscribirse en otro.

- ¿Cómo maneja el sistema la pérdida de conexión durante un quiz?
  → Se guarda el progreso localmente y se retoma cuando se restaure la conexión.

- ¿Qué pasa si un patrocinador quiere patrocinar a alguien que ya tiene patrocinio?
  → Se muestra que el beneficiario ya está asignado y se sugieren otros perfilés.

- ¿Cómo se maneja la duplicación de cédulas?
  → Se valida uniqueness al registro y se muestra error si ya existe.

---

## Requirements

### Functional Requirements

**Autenticación y Usuarios**:
- **FR-001**: Sistema DEBE permitir registro con email, contraseña, nombre, cédula y municipio
- **FR-002**: Sistema DEBE validar formato de cédula venezolana (7-10 dígitos)
- **FR-003**: Sistema DEBE soportar 5 roles: ADMIN, TRAINER, COORDINATOR, STUDENT, SPONSOR
- **FR-004**: Sistema DEBE enviar email de recuperación de contraseña

**Censo Sociotécnico**:
- **FR-005**: Coordinadores DEBEN poder crear encuestas con preguntas predefinidas
- **FR-006**: Sistema DEBE actualizar el nivel de alfabetización digital del usuario al procesar encuesta
- **FR-007**: Sistema DEBE geolocalizar las encuestas con coordenadas GPS

**Aula Resiliente**:
- **FR-008**: Sistema DEBE提供 3 tracks de capacitación con 8, 6 y 5 módulos respectivamente
- **FR-009**: Sistema DEBE permitir descarga de contenido para uso offline
- **FR-010**: Sistema DEBE sincronizar progreso cuando se restaure conexión
- **FR-011**: Sistema DEBE calcular y otorgar Puntos de Resiliencia automáticamente
- **FR-012**: Sistema DEBE提供 quizzes con scoring y retroalimentación

**Gamificación**:
- **FR-013**: Sistema DEBE otorgar puntos según tabla: módulo (+10), quiz (+25), curso (+100), track (+300), asistencia (+5)
- **FR-014**: Sistema DEBE permitir canje de puntos por recargas, alimentos o prioridad
- **FR-015**: Sistema DEBE mostrar historial de transacciones de puntos

**Apadrinamiento**:
- **FR-016**: Sistema DEBE mostrar perfiles anónimos de beneficiarios a patrocinadores
- **FR-017**: Sistema DEBE soportar 3 tipos de patrocinio: Comercial, Conectividad/Talento, Infraestructura
- **FR-018**: Sistema DEBE trackear milestones de cada patrocinio
- **FR-019**: Sistema DEBE emitir sello digital de certificación a patrocinadores que cumplan objetivos

**Dashboard**:
- **FR-020**: Dashboard DEBE mostrar métricas en tiempo real
- **FR-021**: Dashboard DEBE permitir filtrar por municipio y período
- **FR-022**: Dashboard DEBE exportar datos a PDF y CSV

**Empleo**:
- **FR-023**: Sistema DEBE publicar oportunidades de empleo de empresas patrocinantes
- **FR-024**: Sistema DEBE matching entre habilidades del egresado y requisitos del empleo
- **FR-025**: Sistema DEBE integrar esquemas BNPL para financiamiento de inventory

### Key Entities

- **User**: Ciudadano registrado con perfil, rol y estado
- **CensusSurvey**: Encuesta sociotécnica con respuestas y geolocalización
- **Camp**: Campamento de refugios con capacidad y servicios
- **Track**: Programa de capacitación con módulos
- **Course**: Módulo individual con contenido y quiz
- **Enrollment**: Inscripción de estudiante en curso con progreso
- **QuizSubmission**: Envío de quiz con scoring
- **ResiliencePoint**: Transacción de puntos de gamificación
- **Sponsor**: Empresa patrocinante con certificación
- **Sponsorship**: Patrocinio activo con milestones
- **Beneficiary**: Perfil anónimo de beneficiario para patrocinadores
- **JobOpportunity**: Empleo publicado por empresa
- **Employment**: Contratación de egresado
- **Milestone**: Hito de progreso en patrocinio
- **Notification**: Notificación push/in-app
- **ImpactMetric**: Métricas de impacto del programa

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Usuarios pueden completar registro en menos de 3 minutos
- **SC-002**: Sistema maneja 5,000 usuarios simultáneos sin degradación
- **SC-003**: 90% de estudiantes completan al menos un módulo en la primera semana
- **SC-004**: Tasa de retención superior al 85% usando gamificación
- **SC-005**: Patrocinadores pueden crear patrocinio en menos de 5 minutos
- **SC-006**: Dashboard carga en menos de 3 segundos
- **SC-007**: Contenido offline disponible en menos de 30 segundos con conexión 3G

---

## Assumptions

- Los usuarios tienen acceso a al menos conexión 3G intermittente
- La plataforma opera principalmente en municipios: Catia La Mar, Maiquetía, Macuto, Caraballeda
- Firebase Project ya está creado y configurado
- Los emuladores Firebase están disponibles para desarrollo local
- El contenido de capacitación será proporcionado por CAVECOM-E
- Las empresas patrocinantes ya están afiliadas a la cámara
- El sistema BNPL será integrado con pasarelas de pago existentes en Venezuela
