<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Employability API – NestJS 

API backend desarrollada con **NestJS**, **PostgreSQL**, **TypeORM** y **JWT**, que gestiona:

- Usuarios con roles
- Autenticación (login, register, refresh)
- Vacantes
- Postulaciones a vacantes
- Control de acceso por roles (ADMIN, GESTOR, CODER)

---

## Tecnologías usadas

- NestJS
- PostgreSQL
- TypeORM
- Passport + JWT
- Swagger
- bcrypt
- class-validator / class-transformer

---

## Módulos del sistema

- **AuthModule** → autenticación y tokens
- **UsersModule** → usuarios
- **VacanciesModule** → vacantes
- **ApplicationsModule** → postulaciones
- **Common** → roles, guards, decorators

---

## Roles del sistema

| Rol     | Descripción |
|--------|------------|
| ADMIN  | Control total |
| GESTOR | Gestiona vacantes |
| CODER  | Aplica a vacantes |

 El rol **NO se envía en el register**, se asigna por defecto como `coder`.

---

##  Variables de entorno (.env)
``env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_NAME=nest_db

JWT_SECRET=super_secret_jwt_key
JWT_REFRESH_SECRET=super_secret_refresh_jwt_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
 Levantar el proyecto
bash
Copiar código
npm install
npm run start:dev
API: http://localhost:3000

Swagger: http://localhost:3000/api

 AUTENTICACIÓN (Postman)
 Register (crear usuario)
arduino
Copiar código
POST /auth/register
Body

json
Copiar código
{
  "name": "Coder Test",
  "email": "coder@test.com",
  "password": "123456"
}
 El usuario queda con rol CODER automáticamente.

 Login
bash
Copiar código
POST /auth/login
Body

json
Copiar código
{
  "email": "coder@test.com",
  "password": "123456"
}
Respuesta

json
Copiar código
{
  "accessToken": "...",
  "refreshToken": "..."
}
 Refresh token
bash
Copiar código
POST /auth/refresh
Body

json
Copiar código
{
  "refreshToken": "TOKEN_REFRESH"
}
 Crear ADMIN o GESTOR (manual)
En PostgreSQL:

sql
Copiar código
UPDATE users
SET role = 'admin'
WHERE email = 'admin@test.com';
 Los valores del enum son en minúscula (admin, gestor, coder).

 VACANTES
Crear vacante (ADMIN / GESTOR)
bash
Copiar código
POST /vacancies
Headers

makefile
Copiar código
Authorization: Bearer ACCESS_TOKEN
Body

json
Copiar código
{
  "title": "Backend Developer NestJS",
  "description": "Experiencia en NestJS, PostgreSQL y JWT"
}
Listar vacantes (público)
bash
Copiar código
GET /vacancies

### POSTULACIONES
Aplicar a vacante (CODER)
bash
Copiar código
POST /applications/apply
Headers

makefile
Copiar código
Authorization: Bearer ACCESS_TOKEN_CODER
Body

json
Copiar código
{
  "vacancyId": 1
}
Listar postulaciones (ADMIN / GESTOR)
bash
Copiar código
GET /applications
 Seguridad
JWT Access Token → rutas protegidas

Refresh Token → almacenado hasheado en BD

RolesGuard → control por rol

JwtAuthGuard → autenticación

✍️ Autor: Cristian CC
📅 Año: 2026

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
