#Gestor de Productos – Proyecto Fullstack

Proyecto **fullstack** desarrollado con **Spring Boot (Backend)** y **React (Frontend)**, enfocado en aplicar buenas prácticas profesionales, seguridad con JWT y arquitectura limpia.
El sistema simula una aplicación real de gestión de productos y pedidos con control de usuarios y roles.
---
## Tecnologías Utilizadas

### Backend
- Java 17
- Spring Boot
- Spring Security
- JWT (JSON Web Tokens)
- JPA / Hibernate
- Lombok
- MySQL / H2
- Maven

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Context API

## Seguridad y Roles

El sistema cuenta con autenticación y autorización basada en **JWT**, con dos roles:

- **ADMIN**
  - Acceso a todos los pedidos
  - Gestión completa del sistema
- **CLIENTE**
  - Creación de pedidos
  - Visualización de sus propios pedidos

Los endpoints están protegidos según el rol del usuario.

---

## Funcionalidades Principales

### Productos
- CRUD completo de productos
- Validaciones de datos
- Persistencia con JPA

### Pedidos
- Creación de pedidos con múltiples productos
- Validación de stock disponible
- Cálculo automático de totales y descuentos
- Endpoints diferenciados por rol

### Frontend
- Login con JWT
- Rutas protegidas por autenticación y rol
- Dashboard diferenciado:
  - ADMIN: ve todos los pedidos
  - CLIENTE: ve solo sus pedidos
- Creación y listado de pedidos
- Manejo de estado global de autenticación

---

## Arquitectura Backend

El backend sigue una arquitectura en capas:

- Controller
- Service
- Repository
- DTOs
- Configuración de seguridad (JWT + filtros)

Esto permite un código desacoplado, mantenible y escalable.
