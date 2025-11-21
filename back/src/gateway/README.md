# API Gateway

## Descripción

El API Gateway proporciona un punto único de acceso para todos los servicios del sistema. Actúa como intermediario entre los clientes y los microservicios internos.

## Características

- ✅ **Punto único de entrada**: Un solo endpoint para todos los servicios
- ✅ **Reenvío de peticiones**: Redirige automáticamente las peticiones al servicio correcto
- ✅ **Manejo de headers**: Reenvía headers de autorización y otros headers necesarios
- ✅ **Gestión de errores**: Captura y formatea errores de los servicios
- ✅ **Timeout configurado**: 30 segundos de timeout por defecto
- ✅ **Health check**: Endpoint para verificar el estado del gateway

## Configuración

### Variables de Entorno

Agrega las siguientes variables en tu archivo `.env`:

```env
# URL del servicio de shipping
SHIPPING_SERVICE_URL=http://localhost:3001

# Puedes agregar más servicios aquí
# AUTH_SERVICE_URL=http://localhost:3002
# INVENTORY_SERVICE_URL=http://localhost:3003
```

## Endpoints

### Health Check

```http
GET /gateway/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "message": "API Gateway is running",
  "services": ["shipping"],
  "timestamp": "2025-11-20T10:30:00.000Z"
}
```

### Shipping Service

Todas las rutas que comiencen con `/shipping` serán redirigidas al servicio de shipping.

**Ejemplos:**

```http
# Listar órdenes
GET /shipping?page=1&items_per_page=10

# Obtener orden por ID
GET /shipping/123

# Crear orden
POST /shipping
Content-Type: application/json
Authorization: Bearer <token>

# Calcular costo
POST /shipping/cost
Content-Type: application/json

# Cancelar orden
POST /shipping/123/cancel
Authorization: Bearer <token>
```

## Cómo funciona

1. **Cliente** hace una petición al Gateway: `GET /shipping/123`
2. **Gateway** intercepta la petición en `GatewayController`
3. **GatewayService** reenvía la petición al servicio configurado
4. **Servicio** procesa la petición y devuelve la respuesta
5. **Gateway** reenvía la respuesta al cliente

## Estructura de Archivos

```
src/gateway/
├── gateway.module.ts      # Módulo del Gateway
├── gateway.controller.ts  # Controlador que maneja las rutas
├── gateway.service.ts     # Lógica de reenvío de peticiones
└── README.md             # Esta documentación
```

## Agregar Nuevos Servicios

### 1. Agregar la URL del servicio

En `gateway.service.ts`, agrega el nuevo servicio al objeto `services`:

```typescript
private readonly services = {
  shipping: process.env.SHIPPING_SERVICE_URL || 'http://localhost:3001',
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',  // Nuevo
};
```

### 2. Crear el handler en el controlador

En `gateway.controller.ts`, agrega un nuevo método:

```typescript
@All('auth*')
async handleAuthRequests(@Req() req: Request, @Res() res: Response) {
  const path = req.url.replace(/^\/auth/, '/auth');
  
  try {
    const result = await this.gatewayService.forwardRequest(
      'auth',
      path,
      req.method,
      req.body,
      req.headers,
      req.query,
    );
    
    if (result.headers) {
      Object.keys(result.headers).forEach(key => {
        res.setHeader(key, result.headers[key]);
      });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.response || error.message || 'Internal server error';
    
    return res.status(status).json(message);
  }
}
```

### 3. Agregar variable de entorno

En `.env` y `.env.example`:

```env
AUTH_SERVICE_URL=http://localhost:3002
```

## Ventajas

1. **Centralización**: Un solo punto de entrada facilita la gestión
2. **Seguridad**: Puedes agregar autenticación/autorización en un solo lugar
3. **Monitoreo**: Más fácil registrar y monitorear todas las peticiones
4. **Versionamiento**: Gestión de versiones simplificada
5. **Rate Limiting**: Puedes controlar el tráfico de manera centralizada
6. **Ocultamiento**: Los clientes no conocen la arquitectura interna

## Consideraciones

- El Gateway agrega una pequeña latencia adicional
- Es un punto único de falla (considera alta disponibilidad)
- Monitorea el rendimiento y ajusta el timeout según necesidades
- Considera agregar caché para peticiones frecuentes
- Implementa circuit breaker para manejar servicios caídos

## Pruebas

Para probar el Gateway localmente:

```bash
# Inicia el servidor
npm run start:dev

# Prueba el health check
curl http://localhost:3000/gateway/health

# Prueba el reenvío al servicio de shipping
curl http://localhost:3000/shipping/transport-methods
```
