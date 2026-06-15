@echo off
title Prototipo Aduanas - Servidor Local
chcp 65001 > nul
cls

echo =====================================================================
echo         INICIANDO PROTOTIPO DE PLATAFORMA ADUANERA LOCALMENTE
echo =====================================================================
echo.

:: 1. Verificar si Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado en este sistema.
    echo Por favor, descarga e instala Node.js desde https://nodejs.org/
    echo e inténtalo nuevamente.
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js detectado en el sistema:
node -v
echo.

:: 2. Verificar si node_modules existe, si no, instalar dependencias
if not exist node_modules (
    echo [INFO] No se detectó la carpeta node_modules. Instalando dependencias...
    echo Esto puede tardar unos minutos...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Hubo un error al instalar las dependencias con npm install.
        pause
        exit /b 1
    )
    echo [✓] Dependencias instaladas correctamente.
    echo.
)

:: 3. Verificar si la carpeta dist existe (si no, construir el proyecto)
if not exist dist (
    echo [INFO] No se encontró la carpeta 'dist'. Construyendo la aplicación...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] Hubo un error al construir la aplicación con npm run build.
        pause
        exit /b 1
    )
    echo [✓] Aplicación construida exitosamente en la carpeta 'dist'.
    echo.
)

:: 4. Iniciar el servidor local y abrir navegador automáticamente
node iniciar_servidor.cjs

pause