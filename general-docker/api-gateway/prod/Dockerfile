FROM nginx:latest

# Copiar el template de nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf.template

# Copiar el script de entrada
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
EXPOSE 443

# Usar el entrypoint para generar la configuración dinámicamente
CMD ["/entrypoint.sh"]
