# Plan de Pruebas de Aceptación (UAT) y Funcionales

Este documento contiene el registro de los casos de prueba seleccionados para la validación de la **Plataforma Digital Aduanera Inteligente - Chile** antes de su ejecución.

---

## 🗂️ MÓDULO 1: AUTENTICACIÓN, REGISTRO Y SEGURIDAD

### 🛂 CASO DE PRUEBA: TC-AUT-001 (Login válido de viajero)
* **Módulo:** Autenticación y Seguridad
* **Objetivo:** Verificar que un viajero registrado pueda iniciar sesión con credenciales válidas y que el sistema cargue el panel de control correspondiente a su rol.
* **Precondiciones:** El usuario existe en la base de datos (`viajero@aduanas.cl` / `viajero123`).
* **Datos de Prueba:**
  * Correo: `viajero@aduanas.cl`
  * Contraseña: `viajero123`
* **Pasos de Ejecución:**
  1. Navegar a la pantalla de inicio de sesión.
  2. Ingresar el correo `viajero@aduanas.cl` en el campo "RUT o correo institucional".
  3. Ingresar la contraseña `viajero123`.
  4. Presionar el botón "Iniciar sesión".
* **Resultado Esperado:** Redirección automática al Dashboard principal del viajero, despliegue del badge de rol "Viajero" y carga del menú lateral.

---

### 🛂 CASO DE PRUEBA: TC-AUT-002 (Login inválido)
* **Módulo:** Autenticación y Seguridad
* **Objetivo:** Verificar que el sistema bloquee el ingreso ante credenciales inválidas y muestre un banner destructivo con un mensaje de error claro.
* **Precondiciones:** El sistema se encuentra en el formulario de Login.
* **Datos de Prueba:**
  * Correo: `viajero@aduanas.cl`
  * Contraseña: `clave_incorrecta_pdi`
* **Pasos de Ejecución:**
  1. Ingresar el correo `viajero@aduanas.cl`.
  2. Ingresar la contraseña errónea `clave_incorrecta_pdi`.
  3. Presionar "Iniciar sesión".
* **Resultado Esperado:** El sistema permanece en la pantalla de Login y despliega una alerta de error roja que dice "Credenciales incorrectas. Intente nuevamente."

---

### 🛂 CASO DE PRUEBA: TC-REG-001 (Registro de usuario nuevo)
* **Módulo:** Autenticación y Seguridad
* **Objetivo:** Validar que un nuevo usuario viajero pueda registrarse de forma autónoma a través del formulario de registro y que su cuenta quede activa de inmediato en el sistema para poder iniciar sesión.
* **Precondiciones:** El sistema se encuentra en la pantalla de Login.
* **Datos de Prueba:**
  * Nombre: `Pedro Test Muñoz`
  * Correo: `pedro.test@aduanas.cl`
  * RUN: `18.888.888-8`
  * Contraseña: `pedro123`
* **Pasos de Ejecución:**
  1. Hacer clic en "Registrarse" o "Crear una cuenta" en el panel de Login.
  2. Completar todos los campos del formulario con los datos de prueba.
  3. Hacer clic en el botón "Crear Cuenta".
  4. Verificar el mensaje de éxito de creación.
  5. Iniciar sesión utilizando las credenciales registradas (`pedro.test@aduanas.cl` / `pedro123`).
* **Resultado Esperado:** Cuenta creada con éxito, redirección al Login o Dashboard y capacidad de autenticarse correctamente con el nuevo usuario.

---

### 🛂 CASO DE PRUEBA: TC-REC-001 (Recuperación de contraseña)
* **Módulo:** Autenticación y Seguridad
* **Objetivo:** Verificar que un usuario que haya olvidado sus credenciales pueda solicitar la recuperación a través del formulario de recuperación usando su correo electrónico.
* **Precondiciones:** El correo electrónico ingresado debe pertenecer a una cuenta activa (ej: `viajero@aduanas.cl`).
* **Datos de Prueba:**
  * Correo: `viajero@aduanas.cl`
* **Pasos de Ejecución:**
  1. Hacer clic en el botón "¿Olvidó su contraseña? → Recuperar acceso" en el Login.
  2. Ingresar el correo `viajero@aduanas.cl`.
  3. Hacer clic en el botón "Recuperar Acceso".
* **Resultado Esperado:** El sistema muestra una alerta de éxito confirmando el envío de recuperación o mostrando el acceso simulado para la demo académica.

---

### 🛂 CASO DE PRUEBA: TC-SEC-001 (Bloqueo de acceso no autenticado)
* **Módulo:** Autenticación y Seguridad
* **Objetivo:** Validar que el sistema deniegue el acceso directo a vistas del portal interno de funcionarios o viajeros a usuarios que no hayan iniciado sesión activa.
* **Precondiciones:** El usuario no se encuentra autenticado (sesión cerrada).
* **Pasos de Ejecución:**
  1. Intentar acceder directamente a una ruta interna (ej: simular navegación a la consola de administración o portal de funcionarios).
* **Resultado Esperado:** El sistema intercepta el acceso no autorizado y redirige inmediatamente al usuario a la pantalla de Login.

---

## 🗂️ MÓDULO 2: GESTIÓN DE VIAJES, MENORES Y DECLARACIONES

### 🛂 CASO DE PRUEBA: TC-VIAJ-001 (Registrar viaje con menores)
* **Módulo:** Gestión de Viajes y Control de Menores
* **Objetivo:** Validar que el sistema impida finalizar el envío del viaje si el viajero declara viajar con menores de edad pero no ha completado los datos de estos, o si no adjunta el documento PDF de autorización notarial obligatorio.
* **Precondiciones:** El usuario ha iniciado sesión como viajero y está en el formulario "Registrar Viaje".
* **Datos de Prueba:**
  * Origen: `Santiago`
  * Destino: `Mendoza, Argentina`
  * Checkbox: "Viajo con menores de edad" = Activo
* **Pasos de Ejecución:**
  1. Completar Paso 1 (Origen, Destino, Paso, Fecha, Motivo) y marcar check de menores. Presionar "Siguiente".
  2. En el Paso 2 (Acompañantes), presionar "Siguiente" sin agregar ningún menor. *(Verificar bloqueo)*
  3. Completar los campos del menor Juanito Pérez. Presionar el botón "+" para agregarlo a la tabla.
  4. Con el menor en la lista pero sin archivo adjunto, presionar "Siguiente". *(Verificar bloqueo)*
  5. Presionar el botón "Adjuntar PDF" del menor para cargar la autorización.
  6. Presionar "Siguiente".
* **Resultado Esperado:** Bloqueo en el paso 2 al intentar avanzar sin menores ("Debe agregar al menos un menor"). Bloqueo en el paso 2 al intentar avanzar sin adjuntar autorización notarial en PDF.

---

### 🛂 CASO DE PRUEBA: TC-MEN-001 (Completar datos de menor)
* **Módulo:** Control de Menores
* **Objetivo:** Verificar que se validen los campos del menor (Nombre completo, RUN, edad, relación) al agregarlo al grupo familiar.
* **Precondiciones:** El usuario está en el Paso 2 del formulario con check de menores activo.
* **Datos de Prueba:**
  * Nombre: `Juanito Pérez`
  * RUN: `22.345.678-9`
  * Edad: `10`
  * Relación: `Hijo/a`
* **Pasos de Ejecución:**
  1. Ingresar los datos de prueba en la sección "Menores de Edad".
  2. Presionar el botón "+".
* **Resultado Esperado:** El menor se agrega exitosamente en la lista interactiva de la tabla de menores.

---

### 🛂 CASO DE PRUEBA: TC-MEN-002 (Adjuntar autorización notarial PDF)
* **Módulo:** Control de Menores
* **Objetivo:** Verificar la simulación de carga del PDF de autorización para el menor.
* **Precondiciones:** El menor ha sido agregado a la lista en el paso 2.
* **Pasos de Ejecución:**
  1. Hacer clic en "Adjuntar PDF" junto al nombre del menor.
* **Resultado Esperado:** El estado de la columna cambia a exitoso displaying "autorizacion_juanito_perez.pdf ✓" y se permite continuar con el trámite.

---

### 🛂 CASO DE PRUEBA: TC-SAG-001 (Declaración SAG de alimentos)
* **Módulo:** Declaración Jurada Sanitaria SAG
* **Objetivo:** Comprobar que si el viajero declara portar productos fitosanitarios regulados (SÍ), el sistema genera una alerta sanitaria de color ámbar/rojo con código QR.
* **Precondiciones:** El usuario está en el Paso 3 del formulario de viaje.
* **Datos de Prueba:**
  * Declaración: `SÍ, traigo productos regulados`
  * Descripción: `3 Manzanas y artesanías de madera`
* **Pasos de Ejecución:**
  1. En la pantalla SAG, hacer clic en "SÍ, traigo productos regulados".
  2. Escribir la descripción de los productos.
  3. Presionar "Siguiente", avanzar y confirmar el trámite en el Paso 5.
* **Resultado Esperado:** La pre-aprobación o derivación a inspección física queda guardada. El trámite se genera correctamente en estado "Pendiente" derivado para inspección fitosanitaria.

---

### 🛂 CASO DE PRUEBA: TC-VEH-001 (Registro de vehículo salida temporal)
* **Módulo:** Gestión Aduanera de Vehículos
* **Objetivo:** Comprobar que un viajero puede registrar su vehículo particular adjuntando el padrón del vehículo para obtener el pase de aduana (Código QR).
* **Precondiciones:** El usuario tiene activado el check "Viajo en vehículo particular" en el Paso 1.
* **Datos de Prueba:**
  * Patente: `ABCD-12`
  * Marca: `Toyota`, Modelo: `Hilux`, Año: `2021`, Color: `Blanco`
  * Propietario: `Juan Rodríguez Soto`
  * RUN Propietario: `12.345.678-9`
  * Padrón: Carga simulada activa.
* **Pasos de Ejecución:**
  1. En el Paso 4 del formulario de viaje, rellenar los campos de la patente, marca, modelo, año, color, propietario y RUN.
  2. Hacer clic en "Adjuntar Padrón".
  3. Presionar "Siguiente" y finalizar el viaje.
* **Resultado Esperado:** Trámite guardado con los datos vehiculares completos. En el resumen final se incluye el pase vehicular con el código QR generado.

---

## 🗂️ MÓDULO 3: ROLES, FISCALIZACIÓN Y AUDITORÍA

### 🛂 CASO DE PRUEBA: TC-FUNC-001 (Rechazo con observación obligatoria)
* **Módulo:** Portal de Funcionarios
* **Objetivo:** Asegurar que el funcionario de aduanas no pueda rechazar un trámite sin ingresar una observación y que el sistema exija redactar comentarios.
* **Precondiciones:** Existe una solicitud de viaje en estado "Pendiente" generada en el sistema. Iniciar sesión como funcionario de Aduanas (`funcionario@aduanas.cl` / `func123`).
* **Datos de Prueba:**
  * Solicitud: La creada en los flujos anteriores.
  * Intento 1: Sin observaciones.
  * Intento 2 (Observación): `Documentacion incompleta del grupo familiar`
* **Pasos de Ejecución:**
  1. Ir al "Portal Aduanas".
  2. Seleccionar la solicitud pendiente del listado.
  3. Hacer clic en "Rechazar Trámite".
  4. Intentar confirmar sin escribir observaciones. *(Verificar bloqueo / Alerta de campo requerido)*
  5. Escribir la observación de rechazo y confirmar.
* **Resultado Esperado:** El sistema impide confirmar si está vacía la observación de rechazo. Tras ingresar el comentario, se confirma la acción, pasa el estado a "Rechazado" y se registra en la bitácora.

---

### 🛂 CASO DE PRUEBA: TC-OBS-001 (Mostrar observación al usuario)
* **Módulo:** Seguimiento y Consultas
* **Objetivo:** Validar que el viajero pueda ver el estado "Rechazado" de su trámite junto con la justificación ingresada por el inspector aduanero en tiempo real.
* **Precondiciones:** El trámite fue rechazado con observaciones por un funcionario. Iniciar sesión como viajero.
* **Pasos de Ejecución:**
  1. Navegar al módulo "Seguimiento".
  2. Seleccionar el trámite con estado "Rechazado".
* **Resultado Esperado:** El trámite se muestra con un badge de estado "Rechazado" y el texto de la observación se visualiza en una caja de alerta roja destacada.

---

### 🛂 CASO DE PRUEBA: TC-PDI-001 (Alerta migratoria por arraigo)
* **Módulo:** Control Migratorio (PDI)
* **Objetivo:** Verificar que al realizar la consulta de control migratorio de un RUN con orden de arraigo vigente, el sistema dispare una alerta de restricción y bloquee la autorización de salida.
* **Precondiciones:** Iniciar sesión como funcionario PDI (`pdi@aduanas.cl` / `pdi123`).
* **Datos de Prueba:**
  * RUN con arraigo: `11.111.111-1` (Roberto Ejemplo Sánchez)
* **Pasos de Ejecución:**
  1. Ir a "Control Migratorio" en el Portal de la PDI.
  2. Escribir el RUN `11.111.111-1` y presionar "Consultar RUN".
* **Resultado Esperado:** Carga automática de una ficha de color rojo con una alerta destacada "ALERTA: ARRAIGO NACIONAL VIGENTE". El botón "Registrar Cruce Autorizado" debe estar deshabilitado.

---

### 🛂 CASO DE PRUEBA: TC-RLY-001 (Persistencia del trámite)
* **Módulo:** Fiabilidad y Persistencia
* **Objetivo:** Validar que el estado del trámite y el historial persistan en almacenamiento local incluso tras cerrar sesión o recargar el navegador.
* **Precondiciones:** Se crea y aprueba/rechaza un trámite en la plataforma.
* **Pasos de Ejecución:**
  1. Crear un trámite de prueba.
  2. Cerrar sesión y recargar la pestaña del navegador.
  3. Iniciar sesión nuevamente.
  4. Ir a "Seguimiento".
* **Resultado Esperado:** Los trámites previos e historial deben conservarse en su totalidad con los datos y estados intactos.
