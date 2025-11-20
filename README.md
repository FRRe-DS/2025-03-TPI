# Trabajo Práctico Integrador (TPI) - Desarrollo de Software

Grupo: 3 - Big Brain

Archivo de registro y seguimiento de todas las actividades, documentación y código fuente del Trabajo Práctico Integrador correspondiente a la asignatura Desarrollo de Software de la facultad.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803.svg?style=for-the-badge&logo=typeorm&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Trello](https://img.shields.io/badge/Trello-%23026AA7.svg?style=for-the-badge&logo=Trello&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

---


# Do you need to use our backend? 🙋🫵

Follow these steps to pull our Docker image and run the backend with MySQL using Docker Compose.

## 1) Find the Docker image link

- Go to the organization packages page: [FRRe-DS Packages](https://github.com/orgs/FRRe-DS/packages)
- Our container image is published under the name: `2025-grupo-03-backend-logistica`.
- Open the package and copy the Docker pull URL (we recommend using a specific tag, e.g., a commit SHA).


## 2) Create a Docker Compose to run our Backend + MySQL

Create a `docker-compose.yml` like this (replace the `image:` tag with the one you copied from the package):

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: shipping_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: shipping_db
      MYSQL_USER: shipping_user
      MYSQL_PASSWORD: shipping_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "shipping_user", "-pshipping_pass"]
      interval: 3s
      timeout: 5s
      retries: 20
      start_period: 10s

  back:
    image: ghcr.io/<owner>/2025-grupo-03-backend-logistica:<tag> #replace this with the actual value from step 1!!
    container_name: shipping_back
    restart: always
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USERNAME: shipping_user
      DB_PASSWORD: shipping_pass
      DB_DATABASE: shipping_db
    depends_on:
      mysql:
        condition: service_healthy
    ports:
      - "3010:3000"

volumes:
  mysql_data:
```

Run it:

```bash
docker compose up -d
# wait for MySQL healthcheck
curl http://localhost:3010/shipping/transport-methods
```


Troubleshooting GHCR pulls:
- Name invalid → make sure you have copied the correct image name. Eg: `ghcr.io/<owner>/2025-grupo-03-backend-logistica:<tag>`.
