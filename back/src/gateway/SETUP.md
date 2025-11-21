# Configuración del API Gateway

## Escenarios de Uso

### Escenario 1: Gateway en el mismo servidor que el servicio de shipping

Si tu Gateway corre en el puerto 3000 y el servicio de shipping en el puerto 3001 del mismo servidor:

**.env**
```env
PORT=3000
SHIPPING_SERVICE_URL=http://localhost:3001
```

**Uso:**
```bash
# Los clientes se conectan al Gateway
curl http://localhost:3000/shipping/transport-methods

# El Gateway reenvía al servicio
# Internamente: http://localhost:3001/shipping/transport-methods
```

---

### Escenario 2: Gateway como único punto de entrada (Producción)

El Gateway corre en el puerto 3000 y los servicios en servidores separados:

**.env**
```env
HOST=0.0.0.0
PORT=3000
SHIPPING_SERVICE_URL=http://shipping-service:3001
```

**Docker Compose Example:**
```yaml
services:
  gateway:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SHIPPING_SERVICE_URL=http://shipping-service:3001
    networks:
      - app-network

  shipping-service:
    build: ./shipping
    ports:
      - "3001:3001"  # Solo expuesto internamente
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

---

### Escenario 3: Gateway y Servicio en el mismo proceso (Monolito)

Si no tienes servicios separados y todo corre en el mismo proceso, el Gateway simplemente actuará como una capa adicional de routing, pero no es necesario configurar `SHIPPING_SERVICE_URL` ya que el módulo de shipping está importado directamente.

En este caso, **tu proyecto ya funciona sin el Gateway** porque todo está en el mismo servidor.

---

## ¿Cuándo usar el Gateway?

### ✅ Usa el Gateway cuando:

1. **Arquitectura de microservicios**: Tienes múltiples servicios independientes
2. **Separación de servicios**: El shipping service correrá en un servidor/contenedor diferente
3. **Múltiples clientes**: Diferentes aplicaciones (web, mobile, etc.) necesitan un punto único
4. **Seguridad centralizada**: Quieres autenticación/autorización en un solo lugar
5. **Balanceo de carga**: Necesitas distribuir tráfico entre instancias

### ❌ NO necesitas el Gateway si:

1. **Monolito**: Todo corre en un solo servidor/proceso
2. **Un solo servicio**: Solo tienes el módulo de shipping
3. **Simplicidad**: Quieres mantener la arquitectura simple por ahora

---

## Configuración Actual Recomendada

Dado que tu proyecto actual es **monolítico** (todo en un solo servidor NestJS), tienes dos opciones:

### Opción A: Usar el Gateway (Preparar para microservicios)

**Beneficio**: Estás preparando la arquitectura para futuro crecimiento

```env
# Gateway en puerto 3000
PORT=3000

# Si en el futuro separas el shipping service, lo moverías a 3001
SHIPPING_SERVICE_URL=http://localhost:3001
```

**Pasos adicionales**:
1. Crear un segundo proyecto NestJS solo para shipping
2. Mover el módulo de shipping a ese proyecto
3. Configurar el Gateway para que apunte a ese servicio

### Opción B: No usar Gateway por ahora (Recomendado para tu caso)

**Beneficio**: Mantener simplicidad, usar Gateway cuando realmente lo necesites

Simplemente no uses las rutas del Gateway (`/shipping/*`) y sigue usando tus rutas actuales directamente.

---

## Migración Futura a Microservicios

Cuando decidas separar el servicio de shipping:

1. **Crear nuevo proyecto** para el servicio de shipping
```bash
nest new shipping-service
```

2. **Mover el módulo** de shipping al nuevo proyecto

3. **Actualizar Gateway** para apuntar al nuevo servicio
```env
SHIPPING_SERVICE_URL=http://shipping-service:3001
```

4. **Actualizar clientes** para usar el Gateway
```
Antes: http://localhost:3000/shipping
Después: http://localhost:3000/shipping (mismo endpoint, pero pasa por Gateway)
```

---

## Testing

### Probar conexión directa (sin Gateway)
```bash
curl http://localhost:3000/shipping/transport-methods
```

### Probar a través del Gateway
```bash
# Primero verifica que el Gateway esté funcionando
curl http://localhost:3000/gateway/health

# Luego prueba el reenvío
curl http://localhost:3000/shipping/transport-methods
```

Nota: En tu configuración actual, **ambas URLs funcionarán igual** porque el Gateway y el servicio están en el mismo proceso.
