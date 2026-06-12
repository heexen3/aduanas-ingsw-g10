# Plan de Implementación - Versión 1.1 (Corregido)

Este plan describe las modificaciones al prototipo en React para corregir los fallos identificados en la **Versión 1.0** y habilitar la ejecución exitosa de la suite de pruebas manuales corregida, guardando los cambios bajo la etiqueta `v1.1` en Git.

## User Review Required

> [!IMPORTANT]
> **Gestión de Estado Compartido en App.tsx:** Para que el prototipo actúe de forma reactiva e integrada, levantaremos el estado de los trámites a `App.tsx` y usaremos `localStorage` para persistir el rol de usuario y las solicitudes creadas. Esto asegurará que:
> 1. Al crear un viaje con menores y vehículos (CP-VIAJ-001), se guarde y aparezca en la pantalla de Seguimiento (`TramiteTracking.tsx`).
> 2. Al realizar la declaración del SAG con alerta (CP-VIAJ-002), se actualice el submódulo correspondiente en la misma solicitud.
> 3. Al iniciar sesión como funcionario y buscar la solicitud por RUN o ID, se puedan ver las observaciones del vehículo/menor, registrar un rechazo con comentarios obligatorios (CP-FUNC-001) y que este comentario sea visible para el viajero.

---

## Proposed Changes

### 1. Estado Global e Integración (`App.tsx` y `Layout.tsx`)

#### [MODIFY] [App.tsx]
* Implementar persistencia de sesión (`role`, `isLoggedIn`) en `localStorage`.
* Crear una interfaz `Tramite` que contenga:
  * `id`: código único auto-generado (ej: `ADN-2026-XXXX`).
  * `nombre`, `rut`, `paso`, `fecha`, `estado` ("Pendiente", "Aprobado", "Rechazado", "En revisión").
  * `tipo` ("Viaje", "Vehículo", "Menor", "SAG").
  * `documentos`: lista de strings de archivos adjuntos.
  * `historial`: timeline de eventos (ej: `{ evento, fecha, actor }`).
  * `detalles`: detalles del viaje, menores (nombre, rut, edad, doc), vehículo (patente, marca, modelo, anio, propietario, rut, doc), y declaración SAG (traeProductos, descripcion, items).
* Crear el estado `tramites` inicializado con los registros existentes de la v1.0.
* Pasar `tramites` y handlers `setTramites`, `onNavigate` a los componentes respectivos.

#### [MODIFY] [Layout.tsx]
* Sincronizar la barra de navegación para que use el estado de navegación de `App.tsx`.

---

### 2. Autenticación (`LoginPage.tsx`)

#### [MODIFY] [LoginPage.tsx]
* Asegurar que el login use la masa de datos de demo oficial y persista el rol correctamente en `localStorage` al autenticar.
* Mantener la visualización destructiva del error de credenciales (`text-red-500` / `bg-red-50` de Tailwind) cuando falle.

---

### 3. Registro de Viaje Integrado (`TravelRegistration.tsx`)

#### [MODIFY] [TravelRegistration.tsx]
* Agregar en el **Paso 1** del formulario de viaje los campos obligatorios: Origen y Destino, y los flags condicionales:
  * `[ ] Viaja con menores de edad`
  * `[ ] Viaja en vehículo particular`
* **Paso 2:** Si "Viaja con menores de edad" está marcado, renderizar e integrar los inputs del menor basados en `MinorValidation.tsx` (Nombre del menor, RUT, Edad, Relación con tutor, y subida del documento de autorización notarial).
* **Paso 3:** Si "Viaja en vehículo particular" está marcado, renderizar e integrar los campos del vehículo basados en `VehicleRegistration.tsx` (Patente, Marca, Modelo, Año, Color, Propietario, RUT Propietario, y subida de padrón).
* **Paso 4 (Confirmar):** Mostrar un resumen completo unificado.
* **Envío:** Al presionar "Confirmar registro", se crea una solicitud del tipo "Viaje" con el estado `"Pendiente de Validación"`, se inyecta en el estado de `tramites` global y se redirige automáticamente a `TramiteTracking.tsx`.

---

### 4. Declaración SAG con Alerta Sanitaria (`SAGDeclaration.tsx`)

#### [MODIFY] [SAGDeclaration.tsx]
* Incorporar la pregunta obligatoria de control:
  * **"¿Trae consigo productos de origen vegetal, frutas o artesanías de madera?"** (con opciones SÍ / NO).
* Si el viajero marca **"SÍ"**:
  * Renderizar una caja de texto para la descripción del ítem (ej: "Frutas frescas y artesanías de madera").
  * Al hacer clic en "Enviar Declaración", si hay un viaje del usuario activo en el tracker:
    * Actualizar el submódulo SAG del trámite del viajero a `"Pendiente de Inspección Física"` en `tramites` global.
    * Generar en pantalla una alerta destacada y un código QR de alerta fitosanitaria diferenciado (ej: con borde y elementos de riesgo naranja/rojo).
* Si marca **"NO"**, marcar como aprobado automáticamente.

---

### 5. Portal de Funcionarios y Seguimiento (`OfficialsPortal.tsx` y `TramiteTracking.tsx`)

#### [MODIFY] [OfficialsPortal.tsx]
* Usar la lista global de `tramites` de `App.tsx` para listar solicitudes en tiempo real.
* Permitir filtrar o buscar por RUN o ID.
* Mostrar en el panel de detalle la documentación adjunta del vehículo y menores cargados en la solicitud de viaje.
* Al presionar "Rechazar Trámite" o "Registrar Observación":
  * Validar la obligatoriedad del comentario de rechazo (ej: "Padrón vehicular borroso, se solicita re-adjuntar").
  * Cambiar el estado del trámite en la lista global a `"Rechazado por observaciones"` (o `"Rechazado"` en el estado del backend).
  * Inyectar el comentario con fecha y autor en la lista `historial` del trámite.

#### [MODIFY] [TramiteTracking.tsx]
* Mostrar en tiempo real las solicitudes cargadas en el estado global.
* Mostrar el estado `"Rechazado por observaciones"` (o si el estado es rechazado, detallar el rechazo) y desplegar el comentario y el historial actualizado en la sección de timeline del ciudadano.

---

## Verification Plan

### Manual Verification
1. **Prueba CP-AUT-001:** Login exitoso con `viajero@aduanas.cl` / `viajero123`.
2. **Prueba CP-AUT-002:** Login fallido con `viajero@aduanas.cl` / `viajero123_ERROR`.
3. **Prueba CP-VIAJ-001:** Carga de viaje con origen, destino, menores, patente `ABCD-12`, padrón simulado, y validar estado "Pendiente de Validación" en Seguimiento.
4. **Prueba CP-VIAJ-002:** Responder "SÍ" en SAG, describir "Frutas frescas y artesanías de madera", enviar y verificar código QR de alerta y actualización en Seguimiento a "Pendiente de Inspección Física".
5. **Prueba CP-FUNC-001:** Login de funcionario, buscar trámite, rechazar con observación "Padrón vehicular borroso, se solicita re-adjuntar", confirmar y verificar que aparezca en el historial del trámite visible para el viajero.
