#!/bin/sh
set -e

# Generar nginx.conf desde el template usando envsubst
# Solo reemplaza las variables definidas en el template
echo "🔧 Generando configuración de nginx desde template..."
envsubst '${STOCK_SERVICE_HOST} ${STOCK_SERVICE_PORT} ${LOGISTICA_SERVICE_HOST} ${LOGISTICA_SERVICE_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Mostrar configuración generada (solo upstreams para debug)
echo "📋 Configuración de upstreams:"
grep -A 2 "upstream" /etc/nginx/nginx.conf || true

echo "🚀 Iniciando nginx..."
# Ejecutar nginx
exec nginx -g 'daemon off;'

