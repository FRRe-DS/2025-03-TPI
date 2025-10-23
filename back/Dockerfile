# Etapa 1: Build (compilar el código TypeScript)
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Compilamos el proyecto NestJS
RUN npm run build

# Exponemos el puerto del servidor
EXPOSE 3010

# Comando de inicio
CMD ["node", "dist/main.js"]
