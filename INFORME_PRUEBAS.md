# Informe de Ejecución de Pruebas de Aceptación (UAT)
**Asignatura:** Ingeniería de Software  
**Proyecto:** Plataforma Integrada "Aduanas Inteligente Chile"  
**Versión del Software:** 1.1 (Estable)  
**Fecha de Ejecución:** 12 de Junio de 2026  
**Responsable de Calidad:** Equipo de Desarrollo (G10)

---

## 1. Resumen Ejecutivo de Pruebas

Este documento detalla el registro y los resultados de las pruebas de aceptación de usuario (UAT) y pruebas funcionales de caja negra ejecutadas sobre la versión **1.1** del prototipo. El objetivo de este ciclo de pruebas es validar que las interacciones críticas de negocio (flujos de control aduanero, validación de menores, alertas fitosanitarias del SAG y alertas migratorias de la PDI) cumplan con las reglas definidas en las historias de usuario del proyecto.

### Métricas de Ejecución:
| Métrica | Valor |
| :--- | :---: |
| **Total de Casos de Prueba Planificados** | 5 |
| **Casos Ejecutados** | 5 |
| **Casos Exitosos (Pass)** | 5 |
| **Casos Fallidos (Fail)** | 0 |
| **Tasa de Aprobación (Pass Rate)** | 100% |
| **Estado del Software** | **APROBADO PARA DESPLIEGUE** |

---

## 2. Detalle de Casos de Prueba Ejecutados

### 🛂 CASO DE PRUEBA 01: Validación de Autenticación Exitosa
* **ID:** TC-AUT-001
* **Módulo:** Autenticación y Seguridad
* **Objetivo:** Verificar que un viajero registrado pueda iniciar sesión con credenciales válidas y que el sistema cargue el panel de control correspondiente a su rol.
* **Precondiciones:** El usuario existe en la base de datos demo (`viajero@aduanas.cl` / `viajero123`).
* **Datos de Prueba:** 
  * Correo: `viajero@aduanas.cl`
  * Contraseña: `viajero123`
* **Pasos de Ejecución:**
  1. Navegar a la pantalla de inicio de sesión (`http://localhost:5173/`).
  2. Ingresar el correo `viajero@aduanas.cl` en el campo correspondiente.
  3. Ingresar la contraseña `viajero123`.
  4. Presionar el botón "Iniciar sesión".
* **Resultado Esperado:** Redirección automática al Dashboard principal del viajero, despliegue del badge de rol "Viajero" y carga del menú lateral filtrado.
* **Resultado Obtenido:** Redirección al panel, badge verde "Viajero" cargado exitosamente.
* **Estado:** **PASS (Exitoso)**

---

### 🛂 CASO DE PRUEBA 02: Validación de Autenticación Fallida (Control de Errores)
* **ID:** TC-AUT-002
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
* **Resultado Obtenido:** Bloqueo de sesión y visualización de alerta roja de error con el texto esperado.
* **Estado:** **PASS (Exitoso)**

---

### 🛂 CASO DE PRUEBA 03: Restricción y Carga de Menores de Edad (Ruta Alternativa)
* **ID:** TC-VIAJ-001
* **Módulo:** Gestión de Viajes y Control de Menores
* **Objetivo:** Validar que el sistema impida finalizar el envío del viaje si el viajero declara viajar con menores de edad pero no ha completado los datos de estos, o si no adjunta el documento PDF de autorización notarial obligatorio.
* **Precondiciones:** El usuario ha iniciado sesión como viajero y está en "Registrar Viaje".
* **Datos de Prueba:**
  * Origen: `Santiago`
  * Destino: `Mendoza, Argentina`
  * Checkbox: "Viajo con menores de edad" = Activo
  * Datos del menor: Juanito Pérez (RUN: `22.345.678-9`, Edad: 10, Relación: Hijo)
* **Pasos de Ejecución:**
  1. Completar Paso 1 (Origen, Destino, Paso "Los Libertadores", Fecha futura, Motivo) y marcar check de menores. Presionar "Siguiente".
  2. En el Paso 2, presionar "Siguiente" sin agregar ningún menor. *(Verificar bloqueo)*
  3. Completar los campos del menor Juanito Pérez. Presionar el botón "+" para agregarlo a la tabla.
  4. Con el menor en la lista pero sin archivo adjunto, presionar "Siguiente". *(Verificar bloqueo)*
  5. Presionar el botón "Adjuntar PDF" del menor para cargar la autorización simulada.
  6. Presionar "Siguiente", completar declaración SAG (trae productos = Sí, descripción: "3 manzanas"), confirmar en Paso 5 y presionar "Confirmar e Iniciar Trámite".
* **Resultado Esperado:**
  * Bloqueo en el paso 2 al intentar avanzar sin menores ("Debe agregar al menos un menor").
  * Bloqueo en el paso 2 al intentar avanzar sin adjuntar autorización notarial en PDF.
  * Al adjuntar y confirmar, redirección a "Seguimiento" con la solicitud creada en estado "Pendiente".
* **Resultado Obtenido:** Comportamiento exactamente según lo esperado. Bloqueos de seguridad activos y trámite generado en base de datos.
* **Estado:** **PASS (Exitoso)**

---

### 🛂 CASO DE PRUEBA 04: Auditoría Aduanera con Observación Obligatoria (Portal Funcionario)
* **ID:** TC-FUNC-001
* **Módulo:** Portal de Funcionarios y Seguimiento
* **Objetivo:** Asegurar que el funcionario de aduanas no pueda rechazar un trámite sin ingresar una observación y que, al ingresar una observación válida, el viajero pueda visualizar el comentario del rechazo en tiempo real en su seguimiento.
* **Precondiciones:** Existe una solicitud de viaje en estado "Pendiente" generada en el sistema.
* **Datos de Prueba:**
  * Funcionario: Felipe Ortega (`funcionario@aduanas.cl` / `func123`)
  * Trámite seleccionado: El generado en el TC-VIAJ-001.
  * Observación: "Documentacion incompleta del grupo familiar"
* **Pasos de Ejecución:**
  1. Iniciar sesión como funcionario de Aduanas.
  2. Ir al "Portal Aduanas".
  3. Seleccionar la solicitud pendiente del listado.
  4. Hacer clic en "Rechazar Trámite".
  5. Intentar confirmar sin escribir observaciones. *(Verificar bloqueo)*
  6. Escribir la observación de rechazo y confirmar.
  7. Cerrar sesión e ingresar nuevamente como el viajero original.
  8. Navegar al módulo "Seguimiento" y seleccionar el trámite rechazado.
* **Resultado Esperado:**
  * El sistema debe obligar a ingresar observaciones de rechazo e impedir la transacción si está vacía.
  * Tras confirmar con comentarios, el trámite debe pasar a estado "Rechazado".
  * El viajero debe ver el trámite en estado "Rechazado" con el texto de la observación en una caja roja de aviso.
* **Resultado Obtenido:** Validación de observaciones activa. El flujo de comunicación funcionario-ciudadano funciona reactivamente mediante el estado global.
* **Estado:** **PASS (Exitoso)**

---

### 🛂 CASO DE PRUEBA 05: Alerta Migratoria de Arraigo Nacional (Control PDI)
* **ID:** TC-PDI-001
* **Módulo:** Control Migratorio (PDI)
* **Objetivo:** Verificar que al realizar la consulta de control migratorio de un RUN con orden de arraigo vigente, el sistema dispare una alerta de restricción y bloquee la autorización de salida.
* **Precondiciones:** Iniciar sesión como funcionario PDI (`pdi@aduanas.cl` / `pdi123`).
* **Datos de Prueba:**
  * RUN con arraigo: `11.111.111-1` (Roberto Ejemplo Sánchez)
* **Pasos de Ejecución:**
  1. Iniciar sesión con credenciales PDI.
  2. Ir a "Control Migratorio".
  3. Escribir el RUN `11.111.111-1` y presionar "Consultar RUN".
* **Resultado Esperado:** Carga automática de una ficha de color rojo con una alerta destacada "ALERTA: ARRAIGO NACIONAL VIGENTE". El botón "Registrar Cruce Autorizado" debe estar deshabilitado.
* **Resultado Obtenido:** Alerta disparada, restricción y botones bloqueados conforme al protocolo legal de seguridad.
* **Estado:** **PASS (Exitoso)**

---

## 3. Conclusiones y Firmas de Calidad

* **Conclusión de Ingeniería de Requisitos:** Las interfaces desarrolladas cumplen con la trazabilidad bidireccional entre la especificación académica de casos y la implementación técnica.
* **Conclusión de Pruebas Unitarias/UAT:** La tasa de éxito del 100% y la persistencia de datos local garantizan que el prototipo de la plataforma es robusto y está listo para ser defendido ante la comisión evaluadora.

```
-------------------------------               -------------------------------
      Felipe Ortega (Aduanas)                       Pablo Moreno (PDI)
     Inspector Jefe de Turno                       Oficial de Migraciones
```
