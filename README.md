# Prototipo de Plataforma Aduanera Inteligente - Guía de Entregables

Este proyecto es un prototipo interactivo desarrollado en **React + TypeScript + Vite + Tailwind CSS** para optimizar el paso fronterizo terrestre, facilitando la gestión de declaraciones de viajeros y la fiscalización por parte de funcionarios de Aduanas, SAG y PDI.

A continuación, se detallan los tres métodos disponibles para ejecutar, evaluar y desplegar el proyecto.

---

## 🚀 Método 1: Ejecución Local "Un Clic" (Producción)
Este método compila la aplicación a su estado de producción optimizado y levanta un servidor de archivos estáticos nativo en Node.js de forma automática. Es ideal para evaluaciones presenciales offline.

### En Windows:
1. Haz doble clic en el archivo **`iniciar_localmente.bat`** en la raíz del proyecto.
2. El script realizará de forma automática las siguientes acciones:
   - Comprobar que tienes **Node.js** instalado.
   - Instalar las dependencias (`npm install`) si no existen.
   - Compilar la aplicación (`npm run build`) para generar la versión optimizada en la carpeta `dist`.
   - Iniciar el servidor local estático en el puerto **3000** (`node iniciar_servidor.cjs`).
   - Abrir de forma automática tu navegador en **`http://localhost:3000`**.

### En Linux / macOS:
Si no estás en Windows, puedes iniciar el servidor de producción manualmente desde tu terminal corriendo:
```bash
# 1. Instalar dependencias
npm install

# 2. Compilar aplicación
npm run build

# 3. Iniciar el servidor estático
node iniciar_servidor.cjs
```
*Luego abre tu navegador y entra a **`http://localhost:3000`**.*

---

## 🐳 Método 2: Dockerización y Contenedores (Recomendado para Evaluaciones)
El proyecto está completamente dockerizado utilizando una construcción en múltiples etapas (*multi-stage build*) con **Node.js** para compilar y **Nginx** como servidor web de producción de alto rendimiento.

### Requisitos:
- Tener instalado **Docker** y **Docker Compose**.

### Instrucciones:
1. Abre una terminal en la raíz del proyecto.
2. Ejecuta el comando para compilar e iniciar el contenedor:
   ```bash
   docker compose up --build
   ```
3. Una vez iniciado, abre tu navegador y accede a:
   - **`http://localhost:8080`**

### Detalles Técnicos del Contenedor:
- El puerto expuesto es el **`8080`**.
- La configuración de Nginx (`nginx.conf`) incluye reglas de reescritura para dar soporte al enrutamiento de rutas virtuales en el lado del cliente (Single Page Application).

---

## ☁️ Método 3: Despliegue en Servidores Gratuitos (Enlace Web Público)

Dado que la aplicación es 100% frontend (cliente), es muy sencillo alojarla gratis en la nube. Tienes tres opciones recomendadas:

### Opción A: Vercel (Recomendado - 2 minutos)
Vercel es la plataforma líder para hospedar aplicaciones de Vite y React.
1. Crea una cuenta gratuita en [Vercel](https://vercel.com).
2. Conecta tu repositorio de GitHub o ejecuta el comando CLI en tu máquina local:
   ```bash
   npx vercel
   ```
3. Sigue las instrucciones por pantalla. Vercel detectará que es un proyecto de Vite automáticamente, lo compilará y te dará un enlace público permanente.

### Opción B: Netlify (Fácil y Rápido)
Netlify es otra opción ideal para sitios estáticos.
1. Crea una cuenta gratuita en [Netlify](https://www.netlify.com).
2. Arrastra y suelta la carpeta **`dist`** (luego de correr `npm run build`) en la interfaz web de Netlify, o vincula tu repositorio de GitHub para despliegues automáticos.
3. Tendrás tu sitio en línea de inmediato.

### Opción C: GitHub Pages (Automatizado mediante CI/CD)
El proyecto incluye un flujo de trabajo configurado para GitHub Actions en `.github/workflows/deploy.yml`. 
1. Sube este proyecto a tu repositorio de **GitHub**.
2. Ve a la configuración de tu repositorio: **Settings > Pages**.
3. En la sección **Build and deployment**, selecciona como origen **GitHub Actions**.
4. ¡Listo! Cada vez que hagas `git push` a la rama `main` o `master`, GitHub compilará y publicará tu aplicación de forma automática.
5. El flujo ya incluye soporte para enrutamiento SPA mediante redirecciones de fallback en `404.html`.

---

## 🛠️ Desarrollo Local (Dev Mode)
Si deseas modificar el código en tiempo real con recarga caliente (*Hot Module Replacement*):
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo de Vite
npm run dev
```
*Abre tu navegador en la URL indicada por la terminal (usualmente `http://localhost:5173`).*