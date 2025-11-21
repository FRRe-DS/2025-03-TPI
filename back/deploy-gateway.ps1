# Script para desplegar la arquitectura con Gateway

Write-Host "🚀 Desplegando arquitectura con API Gateway..." -ForegroundColor Cyan
Write-Host ""

# Detener contenedores existentes
Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose down

# Limpiar volúmenes si es necesario (opcional)
# docker-compose down -v

Write-Host ""
Write-Host "🔨 Construyendo imágenes..." -ForegroundColor Yellow
docker-compose build --no-cache

Write-Host ""
Write-Host "🎯 Levantando servicios..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "⏳ Esperando que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "🔍 Probando conectividad..." -ForegroundColor Cyan

# Probar Gateway Health Check
Write-Host ""
Write-Host "1️⃣  Probando Gateway Health Check..." -ForegroundColor Green
Start-Sleep -Seconds 2
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/gateway/health" -Method Get
    Write-Host "   ✅ Gateway funcionando correctamente" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host "   Services: $($response.services)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Error al conectar con Gateway" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
}

# Probar endpoint de Shipping a través del Gateway
Write-Host ""
Write-Host "2️⃣  Probando endpoint /shipping/test a través del Gateway..." -ForegroundColor Green
Start-Sleep -Seconds 2
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/shipping/test" -Method Get
    Write-Host "   ✅ Shipping Service accesible a través del Gateway" -ForegroundColor Green
    Write-Host "   Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Error al conectar con Shipping Service" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar que Shipping Service NO es accesible directamente
Write-Host ""
Write-Host "3️⃣  Verificando que Shipping Service NO es accesible directamente..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/shipping/test" -Method Get -TimeoutSec 3
    Write-Host "   ⚠️  ADVERTENCIA: Shipping Service es accesible públicamente (no debería)" -ForegroundColor Yellow
} catch {
    Write-Host "   ✅ Correcto: Shipping Service NO es accesible desde fuera" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Despliegue completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Endpoints disponibles:" -ForegroundColor Cyan
Write-Host "   • Gateway:          http://localhost:3000" -ForegroundColor White
Write-Host "   • Health Check:     http://localhost:3000/gateway/health" -ForegroundColor White
Write-Host "   • Shipping API:     http://localhost:3000/shipping/*" -ForegroundColor White
Write-Host ""
Write-Host "📝 Ver logs:" -ForegroundColor Cyan
Write-Host "   docker logs -f api_gateway" -ForegroundColor Gray
Write-Host "   docker logs -f shipping_service" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Detener servicios:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
