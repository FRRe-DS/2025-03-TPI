# Docker Compose - Sistema Integrado

Este directorio contiene la configuración de Docker Compose para levantar todo el sistema integrado, incluyendo los módulos de Logística, Stock, Compras y el API Gateway.

## 📋 Prerequisitos

- Docker Desktop instalado (Windows/Mac/Linux)
- Docker Compose v2 o superior
- Puertos disponibles: `3306`, `5432`, `3010`, `3099`, `3081`, `3088`, `443`

## 🚀 Instrucciones de Uso

### 1. Crear la red compartida (solo la primera vez)

Todos los servicios se comunican a través de una red Docker externa llamada `shared_net`. Antes de levantar los servicios, debes crear esta red:

```bash
docker network create shared_net
```

Para verificar que la red fue creada correctamente:

```bash
docker network ls | grep shared_net
```

Nota: la red `shared_net` solo debe crearse una vez en la máquina host. Si ya existe, no es necesario volver a crearla; la red permanecerá hasta que la elimines explícitamente con `docker network rm shared_net`.

Para crear la red solo si no existe (comando portable en PowerShell):

```powershell
# Windows PowerShell - crea la red solo si no existe
if (-not (docker network ls --filter name=^shared_net$ --format "{{.Name}}")) { docker network create shared_net }
```


### 2. Levantar todos los servicios

Desde el directorio `general-docker`, ejecuta:

```bash
docker compose up
```

O para ejecutar en segundo plano (modo detached):

```bash
docker compose up -d
```

Para reconstruir las imágenes (si modificaste el Dockerfile del API Gateway):

```bash
docker compose up --build
```

### 3. Verificar el estado de los servicios

Ver los contenedores en ejecución:

```bash
docker compose ps
```

Ver logs de todos los servicios:

```bash
docker compose logs -f
```

Ver logs de un servicio específico:

```bash
docker compose logs -f <nombre-servicio>
```

Ejemplos:
- `docker compose logs -f api-gateway`
- `docker compose logs -f back-logistica`
- `docker compose logs -f backend-stock`

### 4. Detener los servicios

Detener todos los contenedores:

```bash
docker compose down
```

Detener y eliminar volúmenes (⚠️ esto borrará los datos de las bases de datos):

```bash
docker compose down -v
```

## 🏗️ Arquitectura del Sistema

El sistema está compuesto por los siguientes servicios:

### Bases de Datos

- **mysql-logistica** (puerto `3306`): Base de datos MySQL para el módulo de logística
- **postgres-stock** (puerto `5432`): Base de datos PostgreSQL para el módulo de stock

### Backends

- **back-logistica** (puerto `3010`): API del módulo de logística
- **backend-stock** (puerto `3099`): API del módulo de stock
- **backend-compras** (puerto `3081`): API del módulo de compras

### Gateway

- **api-gateway** (puertos `3088`, `443`): Nginx como API Gateway que enruta las peticiones a los diferentes backends

## 🔧 Configuración Avanzada

### Variables de Entorno

Cada servicio tiene sus propias variables de entorno definidas en el `docker-compose.yml`. Para modificarlas:

1. Edita el archivo `docker-compose.yml`
2. Localiza el servicio que deseas configurar
3. Modifica las variables en la sección `environment`

### Healthchecks

Los servicios de bases de datos tienen healthchecks configurados:

- **MySQL**: Verifica cada 3 segundos con `mysqladmin ping`
- **PostgreSQL**: Verifica cada 10 segundos con `pg_isready`

Los backends esperan a que las bases de datos estén saludables antes de iniciar (configurado con `depends_on`).

### Archivos de Inicialización de PostgreSQL

El servicio `postgres-stock` ejecuta automáticamente los scripts SQL ubicados en:
- `./stock/init.sql`: Inicialización de base de datos y usuarios
- `./stock/schema.sql`: Definición del esquema de tablas

Estos archivos se montan en `/docker-entrypoint-initdb.d/` y se ejecutan en orden alfabético.

## 🐛 Solución de Problemas

### Error: "network shared_net declared as external, but could not be found"

**Solución**: Crear la red manualmente:
```bash
docker network create shared_net
```

### Error: "port is already allocated"

**Causa**: Otro servicio está usando el puerto en tu máquina.

**Solución**: 
1. Identifica qué está usando el puerto:
   ```bash
   # Windows PowerShell
   Get-NetTCPConnection -LocalPort <PUERTO> | Select-Object -Property LocalPort,OwningProcess
   
   # Linux/Mac
   lsof -i :<PUERTO>
   ```
2. Detén el servicio conflictivo o cambia el puerto en `docker-compose.yml`

### Error al descargar imágenes de GitHub Container Registry

Las imágenes provienen de `ghcr.io/frre-ds/`. Si son privadas, necesitas autenticarte:

```bash
docker login ghcr.io
# Usuario: tu usuario de GitHub
# Contraseña: Personal Access Token con permisos de packages:read
```

### Los servicios no se comunican entre sí

Verifica que todos estén en la misma red:
```bash
docker network inspect shared_net
```

## 📊 Puertos Expuestos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| mysql-logistica | 3306 | Base de datos MySQL |
| postgres-stock | 5432 | Base de datos PostgreSQL |
| back-logistica | 3010 | API Logística |
| backend-stock | 3099 | API Stock |
| backend-compras | 3081 | API Compras |
| api-gateway | 3088 | HTTP Gateway |
| api-gateway | 443 | HTTPS Gateway |

## 🧹 Limpieza

Para limpiar completamente el sistema:

```bash
# Detener y eliminar contenedores, redes y volúmenes
docker compose down -v

# Eliminar la red compartida
docker network rm shared_net

# Limpiar imágenes no utilizadas (opcional)
docker image prune -a
```

## 📝 Notas Adicionales

- Los volúmenes `mysql_logistica_data` y `postgres_stock_data` persisten los datos de las bases de datos
- El API Gateway tiene montado `nginx.conf` de forma read-only
- Los servicios backend tienen `restart: always` configurado para reiniciarse automáticamente en caso de fallo
- La autenticación se realiza contra Keycloak en Railway: `https://keycloak-production-7751.up.railway.app`
