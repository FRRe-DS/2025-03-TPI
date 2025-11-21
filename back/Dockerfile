# Etapa 1: Build (compilar el código TypeScript)
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el resto del código fuente
COPY . .

# Compilamos el proyecto NestJS
RUN npm run build

# Etapa 2: Production
FROM node:20-alpine
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm ci --only=production

# Copiamos el código compilado desde el builder
COPY --from=builder /app/dist ./dist

# Exponemos el puerto del servidor
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]
