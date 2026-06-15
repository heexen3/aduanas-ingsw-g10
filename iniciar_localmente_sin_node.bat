@echo off
title Prototipo Aduanas - Servidor Local (Sin Node.js)
chcp 65001 > nul
cls

echo =====================================================================
echo         INICIANDO PROTOTIPO DE PLATAFORMA ADUANERA (SIN NODE.JS)
echo =====================================================================
echo.
echo [INFO] Levantando el servidor local de archivos estáticos...
echo [INFO] Este método usa PowerShell nativo de Windows.
echo [INFO] No necesitas tener Node.js ni Python instalado.
echo.

:: Ejecutar el script de PowerShell ignorando políticas de restricción de ejecución
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0iniciar_servidor.ps1"

pause