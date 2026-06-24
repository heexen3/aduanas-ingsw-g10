# Informe de Ejecución de Pruebas Visuales y de Accesibilidad (Versión 1.3)

**Asignatura:** Desarrollo de Software (DUOC)  
**Proyecto:** Plataforma Integrada "Aduanas Inteligente Chile"  
**Versión del Software:** 1.3 (Diseño Obsidian Dark & Glassmorphism Refinado)  
**Fecha de Ejecución:** 21 de Junio de 2026  
**Responsable de Calidad:** Equipo de Desarrollo (G10)

---

## 1. Resumen Ejecutivo de Pruebas

Este documento detalla el registro y los resultados del ciclo completo de pruebas visuales y de accesibilidad (UAT Visual) ejecutadas sobre la versión **1.3** del prototipo. El objetivo de este ciclo fue validar la implementación de la nueva interfaz **Obsidian Dark Mode & Glassmorphism**, asegurando la legibilidad de todos los textos del sistema, el redimensionamiento ergonómico de los botones/campos, y la eliminación total de glows y fondos claros residuales que generaban colisiones de legibilidad.

### Métricas de Ejecución:
| Métrica | Valor |
| :--- | :---: |
| **Total de Casos de Prueba Visuales Planificados** | 13 |
| **Casos Ejecutados** | 13 |
| **Casos Exitosos (Pass)** | 13 |
| **Casos Fallidos (Fail)** | 0 |
| **Tasa de Aprobación (Pass Rate)** | 100% |
| **Estado del Software** | **APROBADO PARA DESPLIEGUE (100% LEGIBLE Y PREMIUM)** |

---

## 2. Detalle de Casos de Prueba Visuales Ejecutados

### 🎨 MÓDULO 1: ESTÉTICA GENERAL Y TIPOGRAFÍA

#### TC-VIS-001: Implementación de Tipografía Outfit
* **Objetivo:** Verificar que la fuente tipográfica premium **Outfit** se cargue correctamente de forma remota y sea aplicada a todos los elementos del sistema de manera global.
* **Resultado Esperado:** Todos los títulos, párrafos, inputs, tablas y botones renderizan usando la familia tipográfica Outfit.
* **Resultado Obtenido:** Integración exitosa en `index.html`. La inspección de fuentes en las vistas de Login y del Dashboard confirmó la renderización global de la tipografía Outfit.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-002: Modo Oscuro Obsidian e Integración Radial
* **Objetivo:** Validar que el fondo general de la aplicación responda a un degradado radial oscuro sin fondos sólidos intrusivos, logrando una estética Obsidian uniforme.
* **Resultado Esperado:** Fondo de pantalla con degradado radial fluido desde `#131b2e` (centro-arriba) hasta `#060912` (bordes), sin elementos de color plano neón.
* **Resultado Obtenido:** Remoción exitosa del fondo neón de login. El degradado radial se visualiza uniforme en el fondo general del body en todas las pantallas.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-003: Efecto Vidrio Esmerilado (Glassmorphism) en Paneles Core
* **Objetivo:** Validar la aplicación de filtros de desenfoque de fondo y bordes translúcidos en las tarjetas (`.card`) y el menú lateral (`.sidebar`) para simular cristal translúcido.
* **Resultado Esperado:** Estilos con `backdrop-filter: blur(16px)` y bordes sutiles en `rgba(255, 255, 255, 0.08)`.
* **Resultado Obtenido:** Aplicación perfecta de glassmorphism con desenfoque dinámico. Los fondos de la consola se adaptan de forma fluida a la profundidad del body.
* **Estado:** **PASS (Exitoso)**

---

### 🎨 MÓDULO 2: ERGONOMÍA, ALTURAS Y DIMENSIONADO

#### TC-VIS-004: Altura de Botones y Botones Grandes (`.btn`, `.btn--lg`)
* **Objetivo:** Asegurar que los botones tengan una altura ergonómica adecuada, corrigiendo la falta de espaciado decimal que provocaba botones delgados.
* **Resultado Esperado:** Los botones comunes usan `padding: var(--space-3) var(--space-6)` (12px vertical) y los grandes (`.btn--lg`) usan `padding: var(--space-4) var(--space-8)` (16px vertical).
* **Resultado Obtenido:** Al configurar correctamente las variables decimales de espaciado, los botones adoptaron una altura táctil robusta. El botón de envío de login se visualiza imponente y de fácil pulsación.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-005: Altura y Espaciado de Campos de Entrada (`.input`)
* **Objetivo:** Validar que los campos del formulario de login y registro tengan un espacio interno adecuado para mejor visualización y usabilidad táctil.
* **Resultado Esperado:** Padding de inputs configurado a `var(--space-3) var(--space-4)` (12px / 16px).
* **Resultado Obtenido:** Campos de entrada cómodos y estilizados, con iconos centrados correctamente.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-006: Altura de Ítems del Menú Lateral (Sidebar Nav)
* **Objetivo:** Aumentar el tamaño vertical de los botones de navegación lateral para mejorar el área de clic e interacción del viajero y oficiales.
* **Resultado Esperado:** Los ítems `.sidebar__nav-item` cuentan con padding vertical de `var(--space-3-5)` (14px).
* **Resultado Obtenido:** Distribución de links de menú lateral con mayor separación, reduciendo el riesgo de clics erróneos.
* **Estado:** **PASS (Exitoso)**

---

### 🎨 MÓDULO 3: ACCESIBILIDAD, CONTRASTE Y GLOWS

#### TC-VIS-007: Contraste de Texto Secundario y Muted
* **Objetivo:** Validar que todos los textos grises secundarios e informativos tengan suficiente contraste sobre los fondos Obsidian para cumplir normas de legibilidad.
* **Resultado Esperado:** `--color-text-secondary` brilla en `#e2e8f0` (contraste > 7:1) y `--color-text-muted` brilla en `#cbd5e1` (contraste > 4.5:1).
* **Resultado Obtenido:** Aumento exitoso de las variables en `variables.css`. Los textos informativos y descriptivos son 100% legibles.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-008: Contraste de Texto y Detalles en la Barra Lateral
* **Objetivo:** Asegurar la visualización de los detalles de rol, nombres del usuario y links no activos del menú lateral sobre el fondo oscuro de la barra.
* **Resultado Esperado:** En sidebar, la opacidad de textos secundarios se eleva a un rango de `0.65` a `0.85`.
* **Resultado Obtenido:** Visibilidad instantánea de las opciones de menú no seleccionadas, del nombre del funcionario/viajero y del rol en el pie del sidebar.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-009: Remoción de Brillo Neón en Tarjetas Interactivas y Seleccionadas
* **Objetivo:** Eliminar glows de iluminación neón en tarjetas que provocaban un aspecto informal en la página principal, aplicando sombras estándar sobrias.
* **Resultado Esperado:** La sombra en hover de `.card--interactive` cambia a `var(--shadow-lg)` oscura y `.card--selected` a `var(--shadow-md)` oscura.
* **Resultado Obtenido:** Las tarjetas se elevan visualmente en hover de manera fluida y elegante sin desprendimientos de luces azules neón.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-010: Remoción de Brillo en Foco de Entradas (Inputs)
* **Objetivo:** Remover el glow brillante neón de los campos de texto al tomar foco para asegurar limpieza formal.
* **Resultado Esperado:** Reemplazo por un anillo de foco plano (`box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4)`).
* **Resultado Obtenido:** Los campos de texto muestran un borde limpio azul delimitado al recibir foco.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-011: Remoción de Brillos en Notificaciones e Insignias
* **Objetivo:** Quitar los glows alrededor de los badges de estado y del punto indicador de alerta de la campana.
* **Resultado Esperado:** Badges y `.header__notif-dot` se visualizan planos, con un borde de contraste limpio de 1.5px.
* **Resultado Obtenido:** Remoción de la dispersión de luz neón roja/verde, manteniendo los badges limpios y contrastantes.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-012: Eliminación Completa de Fondos Claros Residuales (Bandejas e Inputs)
* **Objetivo:** Asegurar que las sub-tarjetas, cajas de detalles, cuadros de patentes y archivos adjuntos no utilicen fondos claros heredados del prototipo original que provocaban colisiones visuales de texto.
* **Resultado Esperado:** Vistas de Seguimiento, Registro de Vehículo, Portal de Inspectores, Menores y Declaración SAG actualizan sus sub-paneles a variantes oscuras translúcidas.
* **Resultado Obtenido:** Conversión total de los sub-paneles inline y hojas de estilo CSS. Las patentes, los nombres de viajeros, los detalles del grupo familiar y las descripciones del SAG son legibles sobre fondos oscuros adaptados.
* **Estado:** **PASS (Exitoso)**

#### TC-VIS-013: Mantenimiento de Recuadro de QR Físico para Lectura de Escáner
* **Objetivo:** Verificar que el contenedor inmediato del código QR en las declaraciones impresas o digitales del SAG mantenga fondo blanco absoluto para asegurar su correcto escaneo por el hardware de aduanas.
* **Resultado Esperado:** El contenedor de SVG del código QR mantiene `background: white` para preservar el contraste del código bidimensional.
* **Resultado Obtenido:** El cuadro contenedor del QR de 10rem se visualiza con fondo blanco nítido y borde de rol de color, permitiendo una perfecta legibilidad del lector físico, mientras que la tarjeta base del documento se mantiene oscura.
* **Estado:** **PASS (Exitoso)**

---

## 3. Conclusiones del Ciclo Visual

* **Legibilidad y Accesibilidad:** La versión 1.3 soluciona todas las deficiencias de accesibilidad cromática de la versión anterior. Todos los textos en pantalla superan la relación de contraste WCAG AA, previniendo la fatiga visual.
* **Diseño Profesional y Premium:** La eliminación de los brillos neón sobredimensionados y la estandarización de las alturas de los botones/inputs proporciona una interfaz limpia, corporativa e intuitiva.
