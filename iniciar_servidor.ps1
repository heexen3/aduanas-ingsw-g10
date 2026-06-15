$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "===================================================" -ForegroundColor Green
    Write-Host " Servidor de Producción Local (PowerShell) Activo" -ForegroundColor Green
    Write-Host " Disponible en: http://localhost:$port" -ForegroundColor Green
    Write-Host "===================================================" -ForegroundColor Green
    Write-Host "No necesitas tener Node.js ni Python instalado." -ForegroundColor Cyan
    Write-Host "Presiona Ctrl+C en esta ventana para apagar el servidor." -ForegroundColor Yellow
    Write-Host ""
    
    # Abrir navegador automáticamente
    Start-Process "http://localhost:$port"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.RawUrl.Split('?')[0]
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        $filePath = Join-Path "$PSScriptRoot\dist" $urlPath.Replace("/", "\").TrimStart("\")
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Determinar tipo MIME
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "application/octet-stream"
            switch ($ext) {
                ".html" { $mime = "text/html; charset=utf-8" }
                ".css"  { $mime = "text/css; charset=utf-8" }
                ".js"   { $mime = "text/javascript; charset=utf-8" }
                ".json" { $mime = "application/json; charset=utf-8" }
                ".png"  { $mime = "image/png" }
                ".jpg"  { $mime = "image/jpeg" }
                ".jpeg" { $mime = "image/jpeg" }
                ".gif"  { $mime = "image/gif" }
                ".svg"  { $mime = "image/svg+xml" }
                ".ico"  { $mime = "image/x-icon" }
                ".webp" { $mime = "image/webp" }
                ".woff" { $mime = "font/woff" }
                ".woff2"{ $mime = "font/woff2" }
            }
            
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # Soporte SPA: si no existe el archivo y no tiene extensión, servimos index.html
            $ext = [System.IO.Path]::GetExtension($urlPath)
            if ([string]::IsNullOrEmpty($ext)) {
                $fallbackPath = Join-Path "$PSScriptRoot\dist" "index.html"
                if (Test-Path $fallbackPath) {
                    $bytes = [System.IO.File]::ReadAllBytes($fallbackPath)
                    $response.ContentType = "text/html; charset=utf-8"
                    $response.ContentLength64 = $bytes.Length
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                } else {
                    $response.StatusCode = 404
                }
            } else {
                $response.StatusCode = 404
            }
        }
        $response.Close()
    }
} catch {
    Write-Error $_
} finally {
    $listener.Stop()
}
