# Informe de Ejecución de Pruebas de Aceptación (UAT) y Funcionales (Versión 1.2)

**Asignatura:** Desarrollo de Software (DUOC)  
**Proyecto:** Plataforma Integrada "Aduanas Inteligente Chile"  
**Versión del Software:** 1.2 (Estable con integraciones dinámicas)  
**Fecha de Ejecución:** 21 de Junio de 2026  
**Responsable de Calidad:** Equipo de Desarrollo (G10)

---

## 1. Resumen Ejecutivo de Pruebas

Este documento detalla el registro y los resultados del ciclo completo de pruebas de aceptación de usuario (UAT) y pruebas funcionales de caja negra ejecutadas sobre la versión **1.2** del prototipo. El objetivo de este ciclo fue validar las interacciones críticas de negocio, incluyendo la implementación de los gaps de diseño solucionados (Registro de usuarios dinámicos, Recuperación de contraseña e integración real del panel de Administración).

### Métricas de Ejecución:
| Métrica | Valor |
| :--- | :---: |
| **Total de Casos de Prueba Planificados** | 14 |
| **Casos Ejecutados** | 14 |
| **Casos Exitosos (Pass)** | 14 |
| **Casos Fallidos (Fail)** | 0 |
| **Tasa de Aprobación (Pass Rate)** | 100% |
| **Estado del Software** | **APROBADO PARA DESPLIEGUE (100% FUNCIONAL)** |

---

## 2. Detalle de Casos de Prueba Ejecutados

### 🛂 MÓDULO 1: AUTENTICACIÓN, REGISTRO Y SEGURIDAD

#### TC-AUT-001: Login válido de viajero
* **Objetivo:** Verificar que un viajero registrado pueda iniciar sesión con credenciales válidas y que el sistema cargue el panel de control correspondiente a su rol.
* **Datos de Prueba:** Correo: `viajero@aduanas.cl` / Contraseña: `viajero123`
* **Resultado Esperado:** Redirección al Dashboard principal del viajero y visualización del rol.
* **Resultado Obtenido:** Redirección exitosa, despliegue de badge "Viajero" y carga del panel de control.
* **Estado:** **PASS (Exitoso)**

#### TC-AUT-002: Login inválido
* **Objetivo:** Verificar que el sistema bloquee el ingreso ante credenciales inválidas y muestre un banner destructivo con un mensaje de error claro.
* **Datos de Prueba:** Correo: `viajero@aduanas.cl` / Contraseña: `clave_incorrecta_pdi`
* **Resultado Esperado:** El sistema permanece en la pantalla de Login y despliega una alerta de error roja.
* **Resultado Obtenido:** Acceso bloqueado. Visualización de alerta roja con el mensaje "Credenciales incorrectas. Intente nuevamente."
* **Estado:** **PASS (Exitoso)**

#### TC-REG-001: Registro de usuario nuevo
* **Objetivo:** Validar que un nuevo usuario viajero pueda registrarse de forma autónoma y que su cuenta quede activa de inmediato.
* **Datos de Prueba:** Nombre: `Pedro Test Munoz`, Correo: `pedro.test@aduanas.cl`, RUN: `18.888.888-8`, Contraseña: `pedro123`
* **Resultado Esperado:** Cuenta creada con éxito, redirección al Login y capacidad de autenticarse con el nuevo usuario.
* **Resultado Obtenido:** Formulario de registro completado. El sistema guardó el usuario dinámicamente en el contexto (`localStorage`) e inició sesión correctamente tras redirigir.
* **Estado:** **PASS (Exitoso)**

#### TC-REC-001: Recuperación de contraseña
* **Objetivo:** Verificar que un usuario que haya olvidado sus credenciales pueda solicitar la recuperación usando su correo electrónico.
* **Datos de Prueba:** Correo: `viajero@aduanas.cl`
* **Resultado Esperado:** Visualización de la tarjeta de éxito con las credenciales recuperadas para la demo académica.
* **Resultado Obtenido:** Búsqueda en el repositorio de usuarios dinámicos exitosa; visualización inmediata de la tarjeta con la contraseña `viajero123`.
* **Estado:** **PASS (Exitoso)**

#### TC-SEC-001: Bloqueo de acceso no autenticado
* **Objetivo:** Validar que el sistema deniegue el acceso directo a vistas del portal interno a usuarios que no hayan iniciado sesión activa.
* **Resultado Esperado:** Intercepción de la ruta e redirección automática al Login.
* **Resultado Obtenido:** Intentos de forzar vistas internas sin sesión activa son interceptados por `AuthContext`, redirigiendo al usuario al login.
* **Estado:** **PASS (Exitoso)**

---

### 🛂 MÓDULO 2: GESTIÓN DE VIAJES, MENORES Y DECLARACIONES

#### TC-VIAJ-001: Registrar viaje con menores (Validación de Flujo)
* **Objetivo:** Validar que el sistema impida finalizar el envío si se declara viajar con menores pero no se completan los datos de estos, o si no se adjunta el documento PDF de autorización notarial obligatorio.
* **Resultado Esperado:** Bloqueo en el Paso 2 ante la ausencia de menores o la falta del archivo PDF de autorización notarial.
* **Resultado Obtenido:** El sistema bloqueó la navegación al Paso 3 mostrando las alertas: "Ha marcado que viaja con menores de edad. Por favor agregue al menos un menor" y "Falta adjuntar la autorización notarial para el menor...".
* **Estado:** **PASS (Exitoso)**

#### TC-MEN-001: Completar datos de menor
* **Objetivo:** Verificar que se agreguen los datos del menor correctamente al grupo familiar.
* **Datos de Prueba:** Nombre: `Juanito Perez`, RUN: `22.345.678-9`, Edad: `10`, Relación: `Hijo/a`
* **Resultado Esperado:** El menor se agrega a la lista interactiva de la tabla.
* **Resultado Obtenido:** Registro añadido a la tabla de menores en el Paso 2 con sus datos correctos.
* **Estado:** **PASS (Exitoso)**

#### TC-MEN-002: Adjuntar autorización notarial PDF
* **Objetivo:** Verificar la simulación de carga del PDF de autorización para el menor.
* **Resultado Esperado:** El estado de la columna cambia a exitoso displaying "autorizacion_juanito_perez.pdf ✓" y se habilita el avance.
* **Resultado Obtenido:** Al hacer clic en "Adjuntar PDF", se cargó el archivo simulado y el sistema permitió avanzar de paso.
* **Estado:** **PASS (Exitoso)**

#### TC-SAG-001: Declaración SAG de alimentos
* **Objetivo:** Comprobar que si el viajero declara portar productos regulados (SÍ), el sistema genera la derivación a inspección física en frontera.
* **Datos de Prueba:** Declaración: `SÍ`, Descripción: `3 Manzanas y artesanias de madera`
* **Resultado Esperado:** Registro de la alerta y derivación al funcionario en el portal del SAG.
* **Resultado Obtenido:** Trámite guardado y clasificado en estado "Pendiente" con la marca de inspección SAG requerida.
* **Estado:** **PASS (Exitoso)**

#### TC-VEH-001: Registro de vehículo salida temporal
* **Objetivo:** Comprobar que un viajero puede registrar su vehículo particular adjuntando el padrón para obtener el pase de aduana (Código QR).
* **Datos de Prueba:** Patente: `ABCD-12`, Marca: `Toyota`, Modelo: `Hilux`, Año: `2021`, Color: `Blanco`, Propietario: `Juan Rodriguez Soto`, RUN: `12.345.678-9`, Padrón vehicular adjunto.
* **Resultado Esperado:** Creación del pase vehicular con el código QR generado.
* **Resultado Obtenido:** Pase de aduana generado exitosamente bajo el ID de control vehicular de la patente, mostrando el código QR correspondiente.
* **Estado:** **PASS (Exitoso)**

---

### 🛂 MÓDULO 3: ROLES, FISCALIZACIÓN Y AUDITORÍA

#### TC-FUNC-001: Rechazo con observación obligatoria
* **Objetivo:** Asegurar que el funcionario no pueda rechazar un trámite sin ingresar una observación y que el sistema exija redactar comentarios.
* **Datos de Prueba:** Funcionario: `funcionario@aduanas.cl` / `func123`, Observación: `"Documentacion incompleta del grupo familiar"`
* **Resultado Esperado:** Bloqueo del rechazo si la observación está vacía; pase a estado "Rechazado" al escribirla.
* **Resultado Obtenido:** El sistema bloqueó la acción de rechazo inicialmente mostrando advertencia de campo obligatorio. Al ingresar la observación, el trámite pasó a estado **Rechazado** de forma correcta.
* **Estado:** **PASS (Exitoso)**

#### TC-OBS-001: Mostrar observación al usuario
* **Objetivo:** Validar que el viajero pueda ver el estado "Rechazado" junto con la justificación en tiempo real.
* **Resultado Esperado:** Visualización del trámite como "Rechazado" y el texto de la observación en una caja de alerta roja destacada en la vista de seguimiento.
* **Resultado Obtenido:** El viajero visualizó el estado corregido y la alerta roja con la frase `"Documentacion incompleta del grupo familiar"`.
* **Estado:** **PASS (Exitoso)**

#### TC-PDI-001: Alerta migratoria por arraigo
* **Objetivo:** Verificar que al realizar la consulta de control migratorio de un RUN con orden de arraigo vigente, el sistema dispare una alerta de restricción y bloquee la autorización de salida.
* **Datos de Prueba:** RUN con arraigo: `11.111.111-1` (Roberto Ejemplo Sánchez)
* **Resultado Esperado:** Alerta destructiva destacada en rojo y botón de autorización de cruce bloqueado.
* **Resultado Obtenido:** Carga de ficha migratoria en rojo brillante con el texto `"ALERTA: ARRAIGO NACIONAL VIGENTE"`. El botón de "Registrar Cruce Autorizado" se deshabilitó por completo de acuerdo al protocolo legal.
* **Estado:** **PASS (Exitoso)**

#### TC-RLY-001: Persistencia del trámite
* **Objetivo:** Validar que el estado del trámite y el historial persistan en almacenamiento local incluso tras cerrar sesión o recargar.
* **Resultado Esperado:** El sistema conserva el estado del trámite en `localStorage`.
* **Resultado Obtenido:** Se verificó la conservación intacta de los trámites y logs de auditoría en `localStorage` al cerrar e iniciar sesión con diferentes roles.
* **Estado:** **PASS (Exitoso)**

---

## 3. Conclusiones

* **Robustez del Sistema:** La integración de la gestión de usuarios dinámicos en el `AuthContext` garantiza la coherencia del control de acceso RBAC. El panel de administración ahora responde de forma reactiva e impacta directamente sobre la sesión y autenticación de los usuarios.
* **Cumplimiento Académico:** Las interfaces cumplen rigurosamente con los criterios de aceptación y las reglas de negocio especificadas en el plan de pruebas de la asignatura Ingeniería de Software.
