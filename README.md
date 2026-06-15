# 🇨🇱 Plataforma Digital Aduanera Inteligente - Chile (Paso Fronterizo Terrestre)

## 📌 Contexto del Proyecto y Evaluación Académica
Este sistema ha sido diseñado como un **entregable para la evaluación académica de Desarrollo de Software (DUOC)**. 
Consiste en un prototipo digital de alta fidelidad, interactivo y reactivo, orientado a optimizar, digitalizar y automatizar los procesos aduaneros, migratorios y sanitarios en los pasos fronterizos terrestres de Chile. El sistema integra el trabajo conjunto de tres entidades estatales clave:
1. **Servicio Nacional de Aduanas** (Control de vehículos y equipaje).
2. **Servicio Agrícola y Ganadero - SAG** (Declaración jurada y control fitosanitario).
3. **Policía de Investigaciones - PDI** (Control migratorio y validación de menores de edad).

---

## 🌟 Características Principales por Módulo

### 👨‍✈️ 1. Módulo del Viajero (Ciudadano)
- **Registro Unificado de Viaje**: Formulario interactivo por pasos para registrar origen, destino, acompañantes y declarar propósitos de viaje.
- **Validación Integrada de Menores de Edad**: Carga y validación del estado de autorizaciones notariales o certificados de nacimiento para la salida del país de menores.
- **Admisión Temporal de Vehículos**: Registro de patentes, padrón y datos del propietario para agilizar el control vehicular en frontera.
- **Declaración Jurada Digital del SAG**: Declaración jurada digitalizada con alerta y generación dinámica de **Código QR de Alerta Sanitaria** (diferenciado con riesgo alto/bajo según lo declarado).
- **Seguimiento en Tiempo Real (Tracker)**: Panel de trazabilidad donde el ciudadano visualiza el estado actual de cada trámite ("Pendiente", "Aprobado", "Rechazado con Observaciones").

### 🕵️‍♂️ 2. Módulo de Funcionarios (Inspectores en Frontera)
- **Portal de Aduanas**: Bandeja de entrada para revisar vehículos declarados, inspeccionar padrones y registrar aprobaciones o rechazos.
- **Portal del SAG**: Control y validación física de equipaje, gestionando alertas sanitarias de viajeros que declararon portar productos regulados.
- **Portal de la PDI**: Módulo de control migratorio rápido y validación biométrica/documental de menores de edad.
- **Gestión Obligatoria de Observaciones**: En caso de rechazo, el funcionario debe redactar obligatoriamente una observación (ej: *"Padrón borroso"*), la cual se notifica de inmediato al historial visible del ciudadano.

### 📊 3. Consola de Administración y Reportes
- **Consola de Auditoría**: Trazabilidad completa con logs de eventos temporales por cada acción de los funcionarios para auditorías académicas.
- **Métricas Operacionales**: Dashboard estadístico con gráficos interactivos (Recharts) que muestran el flujo de viajeros, tasas de aprobación/rechazo y tiempos promedio de atención.

---

## 🛠️ Stack Tecnológico
- **Frontend Core**: React 18 (TypeScript)
- **Construcción & Bundler**: Vite 6
- **Diseño & Estilos**: Tailwind CSS 4 + MUI Material Icons
- **Visualización de Datos**: Recharts (Gráficos interactivos de flujo y rendimiento)
- **Gestión de Estado**: Context API nativa de React para persistencia de estados y autenticación en memoria local (`localStorage`).

---

## 🚪 Credenciales de Acceso Rápido (Demo)
Para facilitar la evaluación, el sistema cuenta con cuentas de demostración pre-configuradas para cada perfil:

| Perfil / Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Viajero (Ciudadano)** | `viajero@aduanas.cl` | `viajero123` |
| **Inspector de Aduanas** | `aduanas@funcionarios.cl` | `aduanas123` |
| **Inspector del SAG** | `sag@funcionarios.cl` | `sag123` |
| **Oficial de la PDI** | `pdi@funcionarios.cl` | `pdi123` |
| **Administrador General**| `admin@plataforma.cl` | `admin123` |

---

## 🚀 Métodos de Ejecución y Despliegue

### 💻 Método 1: Ejecución Local "Un Clic" (Recomendado para Windows)
Este método autodetecta el entorno, instala dependencias si faltan, compila el sitio de producción y levanta un servidor de archivos estáticos optimizado en el puerto `3000`, abriendo el navegador automáticamente.

1. Abre la carpeta del proyecto en Windows Explorer.
2. Haz doble clic en el archivo **`iniciar_localmente.bat`**.
3. El navegador se abrirá de forma automática en: **`http://localhost:3000`**.

*(Para Linux/macOS, puedes levantar el servidor de producción ejecutando `npm install && npm run build && node iniciar_servidor.cjs` en tu terminal).*

---

### 🐳 Método 2: Ejecución mediante Docker (Contenedores)
El proyecto cuenta con un `Dockerfile` en múltiples etapas que compila la aplicación y la monta en una imagen ultraligera de **Nginx** configurada para SPA.

1. Abre tu terminal en la raíz del proyecto.
2. Construye y levanta los servicios:
   ```bash
   docker compose up --build
   ```
3. Accede desde tu navegador a: **`http://localhost:8080`**.

---

### ☁️ Método 3: Despliegue Público Gratuito (Enlace Web)

#### GitHub Pages (Automatizado mediante CI/CD)
El repositorio cuenta con la acción de GitHub Actions configurada en `.github/workflows/deploy.yml`.
1. Sube este proyecto a tu repositorio de **GitHub**.
2. Ve a **Settings > Pages** en tu repositorio de GitHub.
3. En **Build and deployment**, selecciona **GitHub Actions** como origen.
4. Cada `git push` en la rama `main` o `master` compilará la versión final de producción y la publicará en la web pública gratuita de GitHub.
