# 🚀 Arquitectura con API Gateway Separado

## **Cambios Realizados**

### **Arquitectura Anterior (Monolito)**
```
Cliente → Puerto 3000 (Gateway + Shipping en mismo contenedor)
```

### **Arquitectura Nueva (Microservicios)**
```
Cliente 
  ↓
Gateway :3000 (Puerto público)
  ↓
Shipping Service :3001 (Red interna Docker, NO accesible desde fuera)
  ↓
MySQL :3306 (Red interna Docker)
```

---

## **Archivos Modificados**

### 1. **docker-compose.yml**

Ahora tenemos **dos servicios separados**:

- **`gateway`**: Contenedor expuesto en puerto 3000
  - Solo carga `GatewayModule`
  - No tiene acceso a la base de datos
  - Solo reenvía peticiones

- **`shipping-service`**: Contenedor en puerto 3001 (interno)
  - Carga `ShippingModule`, `KeycloakModule`, `TypeORM`
  - Conectado a MySQL
  - NO expuesto públicamente

### 2. **src/app.module.ts**

Ahora carga módulos dinámicamente según `APP_MODE`:

- **`APP_MODE=gateway`**: Solo carga `GatewayModule`
- **`APP_MODE=shipping`**: Carga módulos de negocio (Shipping, TypeORM, Keycloak)
- **`APP_MODE=monolith`** (default): Carga todo (modo desarrollo local)

### 3. **Variables de Entorno**

Creados dos archivos:

- **`.env.gateway`**: Configuración del Gateway
- **`.env.shipping`**: Configuración del servicio de Shipping

---

## **Cómo Funciona**

### **1. Cliente hace petición**
```bash
curl http://localhost:3000/shipping/transport-methods
```

### **2. Gateway recibe (Puerto 3000)**
```typescript
// Gateway escucha en :3000
@All('shipping*')
async handleShippingRequests(@Req() req: Request) {
  // Reenvía a http://shipping-service:3001/shipping/transport-methods
  const result = await this.gatewayService.forwardRequest(
    'shipping',
    '/shipping/transport-methods',
    'GET',
    null,
    req.headers,
    req.query,
  );
  return result;
}
```

### **3. Gateway reenvía a Shipping Service (Puerto 3001)**
```typescript
// gateway.service.ts
const url = `http://shipping-service:3001/shipping/transport-methods`;
const response = await this.httpService.request({ url, ... });
```

### **4. Shipping Service procesa**
```typescript
// shipping.controller.ts (en contenedor shipping-service)
@Get('transport-methods')
@Public()
async getTransportMethods() {
  return await this.shippingService.getTransportMethods();
}
```

### **5. Respuesta fluye de vuelta**
```
Shipping Service → Gateway → Cliente
```

---

## **Comandos Docker**

### **Levantar los servicios**
```bash
docker-compose up --build
```

**Salida esperada:**
```
🚪 Starting in GATEWAY mode        (contenedor: api_gateway)
📦 Starting in SHIPPING SERVICE mode (contenedor: shipping_service)
```

### **Ver logs de cada servicio**
```bash
# Ver logs del Gateway
docker logs -f api_gateway

# Ver logs del Shipping Service
docker logs -f shipping_service
```

### **Probar conectividad interna**
```bash
# Desde el contenedor Gateway, probar conexión al Shipping Service
docker exec -it api_gateway curl http://shipping-service:3001/shipping/test
```

---

## **Ventajas de Esta Arquitectura**

### **✅ Seguridad**
- El Shipping Service **no está expuesto públicamente**
- Solo el Gateway es accesible desde fuera
- Clientes no pueden saltarse el Gateway

### **✅ Escalabilidad**
```bash
# Puedes escalar solo el servicio que necesites
docker-compose up --scale shipping-service=3

# Gateway distribuye carga entre las 3 instancias
```

### **✅ Independencia**
- Puedes actualizar el Gateway sin tocar el Shipping Service
- Puedes actualizar el Shipping Service sin tocar el Gateway
- Cada servicio tiene sus propias variables de entorno

### **✅ Monitoreo**
- Logs separados por servicio
- Más fácil identificar dónde está el problema

---

## **Modo Desarrollo Local (sin Docker)**

Si quieres desarrollar localmente sin Docker:

### **Opción 1: Modo Monolito (Recomendado para desarrollo)**

```bash
# No configures APP_MODE (o ponlo en 'monolith')
npm run start:dev

# Todo corre en un solo proceso en :3000
# Acceso directo: http://localhost:3000/shipping/...
```

### **Opción 2: Dos procesos separados**

**Terminal 1 - Shipping Service:**
```bash
set APP_MODE=shipping
set PORT=3001
npm run start:dev
```

**Terminal 2 - Gateway:**
```bash
set APP_MODE=gateway
set PORT=3000
set SHIPPING_SERVICE_URL=http://localhost:3001
npm run start:dev
```

---

## **Verificar que Funciona**

### **1. Health Check del Gateway**
```bash
curl http://localhost:3000/gateway/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "message": "API Gateway is running",
  "services": ["shipping"],
  "timestamp": "2025-11-21T10:30:00.000Z"
}
```

### **2. Petición a través del Gateway**
```bash
curl http://localhost:3000/shipping/transport-methods
```

**Respuesta esperada:**
```json
{
  "transport_methods": [...]
}
```

### **3. Verificar que Shipping Service NO es accesible desde fuera**
```bash
# Esto DEBE FALLAR (puerto no expuesto)
curl http://localhost:3001/shipping/transport-methods
# curl: (7) Failed to connect to localhost port 3001: Connection refused
```

---

## **Troubleshooting**

### **Error: "Service shipping not configured"**
- El Gateway no encuentra `SHIPPING_SERVICE_URL`
- Verifica que `.env.gateway` esté correctamente configurado

### **Error: "Connection refused to shipping-service:3001"**
- El servicio de shipping no está levantado
- Verifica logs: `docker logs shipping_service`

### **Error: Gateway devuelve 503 Service Unavailable**
- El healthcheck del Shipping Service está fallando
- Verifica que el endpoint `/shipping/test` exista

### **Gateway se inicia pero no reenvía peticiones**
- Verifica que `APP_MODE=gateway` esté configurado
- Verifica logs: debería decir "🚪 Starting in GATEWAY mode"

---

## **Próximos Pasos (Opcional)**

### **1. Agregar más servicios**

```yaml
# En docker-compose.yml
inventory-service:
  build: ./inventory
  expose:
    - "3002"
  env_file:
    - .env.inventory
```

```typescript
// En gateway.service.ts
private readonly services = {
  shipping: process.env.SHIPPING_SERVICE_URL,
  inventory: process.env.INVENTORY_SERVICE_URL, // ← Nuevo
};
```

### **2. Implementar Load Balancing**

```yaml
shipping-service:
  deploy:
    replicas: 3  # Crea 3 instancias
```

### **3. Agregar autenticación en el Gateway**

```typescript
@All('shipping*')
@UseGuards(KeycloakAuthGuard)  // ← Validar en Gateway
async handleShippingRequests() { ... }
```

---

## **Resumen**

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Contenedores** | 1 (back) | 2 (gateway + shipping-service) |
| **Puertos expuestos** | 3000 | Solo 3000 (gateway) |
| **Base de datos** | Accesible desde back | Solo desde shipping-service |
| **Seguridad** | Baja | Alta (capa de protección) |
| **Escalabilidad** | Limitada | Alta (servicios independientes) |

---

¿Todo claro? ¡Ahora todas las peticiones pasan primero por el Gateway! 🎉
