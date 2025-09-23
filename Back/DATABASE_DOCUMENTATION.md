# Documentación de Base de Datos y Endpoints - NuevoTrain

## Resumen del Proyecto

Sistema de gestión de gimnasio con funcionalidades de reservas de clases, suscripciones, pagos y gestión de usuarios. Stack: **Backend (NestJS + TypeORM + PostgreSQL)** y **Frontend (Next.js + React)**.

---

## 📊 Tablas de Base de Datos

### 1. **users** - Usuarios del Sistema

**Descripción:** Tabla principal de usuarios (miembros, entrenadores, administradores)

| Campo                    | Tipo         | Descripción             | Restricciones                                        |
| ------------------------ | ------------ | ----------------------- | ---------------------------------------------------- |
| `id`                     | UUID         | Identificador único     | PK, Auto-generado                                    |
| `name`                   | VARCHAR(80)  | Nombre completo         | NOT NULL                                             |
| `email`                  | VARCHAR(120) | Email único             | NOT NULL, UNIQUE, INDEX                              |
| `password_hash`          | VARCHAR      | Hash de contraseña      | NOT NULL, NO SELECT                                  |
| `role`                   | VARCHAR(10)  | Rol del usuario         | DEFAULT 'member', ENUM: 'member', 'trainer', 'admin' |
| `is_blocked`             | BOOLEAN      | Usuario bloqueado       | DEFAULT false                                        |
| `google_id`              | VARCHAR(64)  | ID de Google OAuth      | NULLABLE                                             |
| `address`                | VARCHAR(120) | Dirección               | NULLABLE                                             |
| `phone`                  | VARCHAR(20)  | Teléfono                | NULLABLE                                             |
| `refresh_token_hash`     | VARCHAR      | Hash del refresh token  | NULLABLE, NO SELECT                                  |
| `reset_token_hash`       | VARCHAR      | Hash del token de reset | NULLABLE, NO SELECT                                  |
| `reset_token_expires_at` | TIMESTAMPTZ  | Expiración del token    | NULLABLE                                             |
| `created_at`             | TIMESTAMPTZ  | Fecha de creación       | AUTO                                                 |
| `updated_at`             | TIMESTAMPTZ  | Fecha de actualización  | AUTO                                                 |

**Relaciones:**

- `OneToMany` → `reviews` (reviews del usuario)
- `OneToMany` → `class_histories` (historial de clases)
- `OneToMany` → `payments` (pagos del usuario)

---

### 2. **classes** - Clases de Gimnasio

**Descripción:** Clases disponibles para reservar

| Campo         | Tipo         | Descripción            | Restricciones                                                                    |
| ------------- | ------------ | ---------------------- | -------------------------------------------------------------------------------- |
| `id`          | UUID         | Identificador único    | PK, Auto-generado                                                                |
| `trainer_id`  | UUID         | ID del entrenador      | NOT NULL, FK → users.id                                                          |
| `title`       | VARCHAR(100) | Título de la clase     | NOT NULL                                                                         |
| `date`        | DATE         | Fecha de la clase      | NOT NULL, formato yyyy-mm-dd                                                     |
| `start_time`  | TIME         | Hora de inicio         | NOT NULL, formato HH:mm                                                          |
| `end_time`    | TIME         | Hora de fin            | NOT NULL                                                                         |
| `day_of_week` | VARCHAR(10)  | Día de la semana       | NULLABLE, ENUM: 'monday'...'sunday'                                              |
| `capacity`    | INTEGER      | Capacidad máxima       | DEFAULT 20                                                                       |
| `goal_tag`    | VARCHAR(20)  | Objetivo de la clase   | NULLABLE, ENUM: 'weight_loss', 'definition', 'muscle_gain', 'mobility', 'cardio' |
| `is_active`   | BOOLEAN      | Clase activa           | DEFAULT true                                                                     |
| `coach`       | JSON         | Array de coaches       | NULLABLE                                                                         |
| `created_at`  | TIMESTAMPTZ  | Fecha de creación      | AUTO                                                                             |
| `updated_at`  | TIMESTAMPTZ  | Fecha de actualización | AUTO                                                                             |

**Relaciones:**

- `ManyToOne` → `users` (entrenador)
- `OneToMany` → `class_histories` (historial de asistencias)

---

### 3. **reservations** - Reservas de Clases

**Descripción:** Reservas de usuarios para clases específicas

| Campo        | Tipo        | Descripción          | Restricciones                                                        |
| ------------ | ----------- | -------------------- | -------------------------------------------------------------------- |
| `id`         | UUID        | Identificador único  | PK, Auto-generado                                                    |
| `class_id`   | UUID        | ID de la clase       | NOT NULL, FK → classes.id, UNIQUE con user_id                        |
| `user_id`    | UUID        | ID del usuario       | NOT NULL, FK → users.id, UNIQUE con class_id                         |
| `status`     | VARCHAR(12) | Estado de la reserva | DEFAULT 'booked', ENUM: 'booked', 'cancelled', 'attended', 'no_show' |
| `created_at` | TIMESTAMPTZ | Fecha de creación    | AUTO                                                                 |

**Relaciones:**

- `ManyToOne` → `classes` (clase reservada)
- `ManyToOne` → `users` (usuario que reserva)

---

### 4. **class_histories** - Historial de Asistencias

**Descripción:** Registro de asistencia a clases

| Campo        | Tipo        | Descripción          | Restricciones                                               |
| ------------ | ----------- | -------------------- | ----------------------------------------------------------- |
| `id`         | UUID        | Identificador único  | PK, Auto-generado                                           |
| `class_id`   | UUID        | ID de la clase       | NOT NULL, FK → classes.id                                   |
| `user_id`    | UUID        | ID del usuario       | NOT NULL, FK → users.id                                     |
| `status`     | VARCHAR(10) | Estado de asistencia | DEFAULT 'attended', ENUM: 'attended', 'missed', 'cancelled' |
| `created_at` | TIMESTAMPTZ | Fecha de creación    | AUTO                                                        |

**Relaciones:**

- `ManyToOne` → `classes` (clase)
- `ManyToOne` → `users` (usuario)

---

### 5. **reviews** - Reseñas y Comentarios

**Descripción:** Reseñas de usuarios sobre el servicio

| Campo        | Tipo         | Descripción            | Restricciones                                               |
| ------------ | ------------ | ---------------------- | ----------------------------------------------------------- |
| `id`         | UUID         | Identificador único    | PK, Auto-generado                                           |
| `user_id`    | UUID         | ID del usuario         | NOT NULL, FK → users.id                                     |
| `class_id`   | UUID         | ID de la clase         | NULLABLE, FK → classes.id                                   |
| `trainer_id` | UUID         | ID del entrenador      | NULLABLE, FK → users.id                                     |
| `rating`     | INTEGER      | Calificación 1-5       | NOT NULL, CHECK 1-5                                         |
| `comment`    | VARCHAR(500) | Comentario             | NULLABLE                                                    |
| `status`     | VARCHAR(10)  | Estado de moderación   | DEFAULT 'approved', ENUM: 'approved', 'pending', 'rejected' |
| `is_active`  | BOOLEAN      | Reseña activa          | DEFAULT true                                                |
| `created_at` | TIMESTAMPTZ  | Fecha de creación      | AUTO                                                        |
| `updated_at` | TIMESTAMPTZ  | Fecha de actualización | AUTO                                                        |

**Relaciones:**

- `ManyToOne` → `users` (usuario que reseña)

---

### 6. **plans** - Planes de Suscripción

**Descripción:** Planes de suscripción disponibles

| Campo           | Tipo          | Descripción            | Restricciones     |
| --------------- | ------------- | ---------------------- | ----------------- |
| `id`            | UUID          | Identificador único    | PK, Auto-generado |
| `name`          | VARCHAR(100)  | Nombre del plan        | NOT NULL          |
| `description`   | TEXT          | Descripción del plan   | NULLABLE          |
| `price`         | DECIMAL(10,2) | Precio del plan        | NOT NULL          |
| `currency`      | VARCHAR(3)    | Moneda                 | DEFAULT 'ARS'     |
| `duration_days` | INTEGER       | Duración en días       | NOT NULL          |
| `is_active`     | BOOLEAN       | Plan activo            | DEFAULT true      |
| `created_at`    | TIMESTAMPTZ   | Fecha de creación      | AUTO              |
| `updated_at`    | TIMESTAMPTZ   | Fecha de actualización | AUTO              |

---

### 7. **subscriptions** - Suscripciones de Usuarios

**Descripción:** Suscripciones activas de usuarios

| Campo        | Tipo        | Descripción            | Restricciones                                            |
| ------------ | ----------- | ---------------------- | -------------------------------------------------------- |
| `id`         | UUID        | Identificador único    | PK, Auto-generado                                        |
| `user_id`    | UUID        | ID del usuario         | NOT NULL, FK → users.id                                  |
| `plan_id`    | UUID        | ID del plan            | NULLABLE, FK → plans.id                                  |
| `start_at`   | TIMESTAMPTZ | Fecha de inicio        | NOT NULL                                                 |
| `end_at`     | TIMESTAMPTZ | Fecha de fin           | NOT NULL                                                 |
| `status`     | VARCHAR(10) | Estado de suscripción  | DEFAULT 'active', ENUM: 'active', 'cancelled', 'expired' |
| `created_at` | TIMESTAMPTZ | Fecha de creación      | AUTO                                                     |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización | AUTO                                                     |

**Relaciones:**

- `ManyToOne` → `users` (usuario suscrito)
- `ManyToOne` → `plans` (plan de suscripción)

---

### 8. **payments** - Pagos Procesados

**Descripción:** Registro de pagos procesados

| Campo                      | Tipo          | Descripción            | Restricciones                                                          |
| -------------------------- | ------------- | ---------------------- | ---------------------------------------------------------------------- |
| `id`                       | UUID          | Identificador único    | PK, Auto-generado                                                      |
| `user_id`                  | UUID          | ID del usuario         | NOT NULL, FK → users.id                                                |
| `stripe_payment_intent_id` | VARCHAR       | ID de Stripe           | NOT NULL, UNIQUE                                                       |
| `amount`                   | DECIMAL(10,2) | Monto del pago         | NOT NULL                                                               |
| `currency`                 | VARCHAR(3)    | Moneda                 | NOT NULL                                                               |
| `status`                   | VARCHAR(20)   | Estado del pago        | DEFAULT 'pending', ENUM: 'pending', 'succeeded', 'failed', 'cancelled' |
| `payment_type`             | VARCHAR(20)   | Tipo de pago           | DEFAULT 'subscription', ENUM: 'subscription', 'one_time'               |
| `plan_id`                  | UUID          | ID del plan            | NULLABLE, FK → plans.id                                                |
| `subscription_id`          | UUID          | ID de suscripción      | NULLABLE, FK → subscriptions.id                                        |
| `stripe_metadata`          | JSONB         | Metadatos de Stripe    | NULLABLE                                                               |
| `created_at`               | TIMESTAMPTZ   | Fecha de creación      | AUTO                                                                   |
| `updated_at`               | TIMESTAMPTZ   | Fecha de actualización | AUTO                                                                   |

**Relaciones:**

- `ManyToOne` → `users` (usuario que paga)

---

### 9. **locations** - Ubicaciones de Gimnasios

**Descripción:** Ubicaciones físicas de los gimnasios

| Campo        | Tipo          | Descripción            | Restricciones     |
| ------------ | ------------- | ---------------------- | ----------------- |
| `id`         | UUID          | Identificador único    | PK, Auto-generado |
| `name`       | VARCHAR(120)  | Nombre de la ubicación | NOT NULL          |
| `country`    | VARCHAR(120)  | País                   | NOT NULL, INDEX   |
| `city`       | VARCHAR(120)  | Ciudad                 | NOT NULL, INDEX   |
| `address`    | VARCHAR(200)  | Dirección completa     | NOT NULL          |
| `lat`        | DECIMAL(10,6) | Latitud                | NOT NULL          |
| `lng`        | DECIMAL(10,6) | Longitud               | NOT NULL          |
| `is_active`  | BOOLEAN       | Ubicación activa       | DEFAULT true      |
| `created_at` | TIMESTAMPTZ   | Fecha de creación      | AUTO              |
| `updated_at` | TIMESTAMPTZ   | Fecha de actualización | AUTO              |

---

### 10. **exercises** - Ejercicios Disponibles

**Descripción:** Catálogo de ejercicios del gimnasio

| Campo          | Tipo         | Descripción            | Restricciones                  |
| -------------- | ------------ | ---------------------- | ------------------------------ |
| `id`           | UUID         | Identificador único    | PK, Auto-generado              |
| `name`         | VARCHAR(120) | Nombre del ejercicio   | NOT NULL                       |
| `muscle_group` | VARCHAR(50)  | Grupo muscular         | NOT NULL, INDEX                |
| `series`       | INTEGER      | Número de series       | NULLABLE                       |
| `repetitions`  | INTEGER      | Número de repeticiones | NULLABLE                       |
| `type`         | VARCHAR(30)  | Tipo de ejercicio      | NULLABLE                       |
| `program_tag`  | VARCHAR(10)  | Etiqueta de programa   | NULLABLE, ENUM: 'max', 'hyper' |
| `is_active`    | BOOLEAN      | Ejercicio activo       | DEFAULT true                   |
| `created_at`   | TIMESTAMPTZ  | Fecha de creación      | AUTO                           |
| `updated_at`   | TIMESTAMPTZ  | Fecha de actualización | AUTO                           |

---

### 11. **comments** - Comentarios del Sistema

**Descripción:** Comentarios generales del sistema

| Campo        | Tipo        | Descripción              | Restricciones           |
| ------------ | ----------- | ------------------------ | ----------------------- |
| `id`         | UUID        | Identificador único      | PK, Auto-generado       |
| `text`       | TEXT        | Contenido del comentario | NOT NULL                |
| `rating`     | INTEGER     | Calificación 1-5         | NOT NULL, CHECK 1-5     |
| `date`       | DATE        | Fecha del comentario     | NOT NULL                |
| `user_id`    | UUID        | ID del usuario           | NOT NULL, FK → users.id |
| `created_at` | TIMESTAMPTZ | Fecha de creación        | AUTO                    |

**Relaciones:**

- `ManyToOne` → `users` (usuario que comenta)

---

### 12. **subscription_reminders** - Recordatorios de Suscripción

**Descripción:** Recordatorios automáticos de suscripciones

| Campo             | Tipo        | Descripción          | Restricciones                          |
| ----------------- | ----------- | -------------------- | -------------------------------------- |
| `id`              | UUID        | Identificador único  | PK, Auto-generado                      |
| `subscription_id` | UUID        | ID de suscripción    | NOT NULL, FK → subscriptions.id, INDEX |
| `type`            | VARCHAR(64) | Tipo de recordatorio | NOT NULL, INDEX                        |
| `created_at`      | TIMESTAMPTZ | Fecha de creación    | AUTO                                   |

**Relaciones:**

- `ManyToOne` → `subscriptions` (suscripción)

---

## 🚀 Endpoints de la API

### **Autenticación** (`/auth`)

| Método | Endpoint                | Descripción                   | Autenticación | Body                        |
| ------ | ----------------------- | ----------------------------- | ------------- | --------------------------- |
| `POST` | `/auth/register`        | Registro de usuario           | ❌            | `{ name, email, password }` |
| `POST` | `/auth/login`           | Login con email/contraseña    | ❌            | `{ email, password }`       |
| `POST` | `/auth/google`          | Login con Google              | ❌            | `{ idToken }`               |
| `POST` | `/auth/google/complete` | Completar registro Google     | ❌            | `{ idToken, name, email }`  |
| `POST` | `/auth/forgot-password` | Solicitar reset de contraseña | ❌            | `{ email }`                 |
| `POST` | `/auth/reset-password`  | Resetear contraseña           | ❌            | `{ token, newPassword }`    |
| `POST` | `/auth/refresh`         | Renovar access token          | Cookie        | -                           |
| `POST` | `/auth/logout`          | Cerrar sesión                 | Cookie        | -                           |

### **Usuarios** (`/users`)

| Método | Endpoint            | Descripción                  | Autenticación | Roles |
| ------ | ------------------- | ---------------------------- | ------------- | ----- |
| `GET`  | `/users/profile`    | Obtener perfil del usuario   | ✅            | -     |
| `PUT`  | `/users/profile`    | Actualizar perfil            | ✅            | -     |
| `GET`  | `/users/me/history` | Historial de reservas        | ✅            | -     |
| `GET`  | `/users`            | Listar usuarios (paginado)   | ✅            | admin |
| `PUT`  | `/users/:id/role`   | Cambiar rol de usuario       | ✅            | admin |
| `PUT`  | `/users/:id/status` | Bloquear/desbloquear usuario | ✅            | admin |

### **Clases** (`/classes`)

| Método  | Endpoint                            | Descripción              | Autenticación | Roles          |
| ------- | ----------------------------------- | ------------------------ | ------------- | -------------- |
| `GET`   | `/classes`                          | Obtener todas las clases | ❌            | -              |
| `GET`   | `/classes/schedule`                 | Listado con filtros      | ❌            | -              |
| `GET`   | `/classes/mine`                     | Agenda del entrenador    | ✅            | trainer        |
| `GET`   | `/classes/admin`                    | Listado para admin       | ✅            | admin          |
| `GET`   | `/classes/by-day/:day`              | Clases por día           | ❌            | -              |
| `GET`   | `/classes/:id`                      | Obtener clase por ID     | ❌            | -              |
| `GET`   | `/classes/:id/reservations`         | Asistentes de la clase   | ✅            | trainer, admin |
| `POST`  | `/classes`                          | Crear nueva clase        | ✅            | admin          |
| `PATCH` | `/classes/:id`                      | Editar clase             | ✅            | admin          |
| `PATCH` | `/classes/:id/status`               | Activar/desactivar clase | ✅            | admin          |
| `PATCH` | `/classes/admin/:id/assign-trainer` | Asignar entrenador       | ✅            | admin          |
| `PATCH` | `/classes/admin/:id/toggle`         | Toggle clase (alias)     | ✅            | admin          |

### **Reservas** (`/classes`)

| Método   | Endpoint                                          | Descripción               | Autenticación    | Roles          |
| -------- | ------------------------------------------------- | ------------------------- | ---------------- | -------------- |
| `POST`   | `/classes/:id/reservations`                       | Reservar clase            | ✅ + Suscripción | -              |
| `DELETE` | `/classes/:id/reservations`                       | Cancelar mi reserva       | ✅               | -              |
| `PATCH`  | `/classes/:id/reservations/:reservationId/status` | Cambiar estado de reserva | ✅               | trainer, admin |

### **Reseñas** (`/reviews`)

| Método   | Endpoint                | Descripción                | Autenticación    | Roles |
| -------- | ----------------------- | -------------------------- | ---------------- | ----- |
| `GET`    | `/reviews`              | Listado público de reseñas | ❌               | -     |
| `GET`    | `/reviews/me`           | Mis reseñas                | ✅               | -     |
| `POST`   | `/reviews`              | Crear reseña               | ✅ + Suscripción | -     |
| `PATCH`  | `/reviews/:id`          | Actualizar mi reseña       | ✅               | -     |
| `DELETE` | `/reviews/:id`          | Eliminar mi reseña         | ✅               | -     |
| `GET`    | `/reviews/admin`        | Listado admin              | ✅               | admin |
| `PATCH`  | `/reviews/:id/status`   | Activar/desactivar reseña  | ✅               | admin |
| `PATCH`  | `/reviews/:id/moderate` | Aprobar/rechazar reseña    | ✅               | admin |
| `GET`    | `/reviews/stats/global` | Estadísticas globales      | ❌               | -     |

### **Planes** (`/plans`)

| Método   | Endpoint     | Descripción             | Autenticación | Roles |
| -------- | ------------ | ----------------------- | ------------- | ----- |
| `GET`    | `/plans`     | Listar todos los planes | ❌            | -     |
| `GET`    | `/plans/:id` | Obtener plan por ID     | ❌            | -     |
| `POST`   | `/plans`     | Crear nuevo plan        | ✅            | admin |
| `PATCH`  | `/plans/:id` | Actualizar plan         | ✅            | admin |
| `DELETE` | `/plans/:id` | Eliminar plan           | ✅            | admin |

### **Suscripciones** (`/subscription`)

| Método | Endpoint                     | Descripción               | Autenticación | Roles |
| ------ | ---------------------------- | ------------------------- | ------------- | ----- |
| `GET`  | `/subscription/status`       | Estado de mi suscripción  | ✅            | -     |
| `POST` | `/subscription/create`       | Crear suscripción         | ✅            | -     |
| `POST` | `/subscription/admin/create` | Crear suscripción (admin) | ✅            | admin |
| `POST` | `/subscription/:id/cancel`   | Cancelar suscripción      | ✅            | admin |
| `POST` | `/subscription/dev/trial`    | Crear trial (solo dev)    | ✅            | -     |

### **Pagos** (`/payments`)

| Método | Endpoint                                                | Descripción                  | Autenticación | Roles |
| ------ | ------------------------------------------------------- | ---------------------------- | ------------- | ----- |
| `GET`  | `/payments/test-stripe`                                 | Probar conexión Stripe       | ❌            | -     |
| `POST` | `/payments/create-payment-intent`                       | Crear PaymentIntent          | ✅            | -     |
| `POST` | `/payments/create-checkout-session`                     | Crear sesión checkout        | ✅            | -     |
| `GET`  | `/payments/confirm-payment/:paymentIntentId`            | Confirmar pago               | ✅            | -     |
| `POST` | `/payments/create-subscription-from-payment/:paymentId` | Crear suscripción desde pago | ✅            | -     |
| `GET`  | `/payments/status/:paymentIntentId`                     | Verificar estado de pago     | ✅            | -     |
| `POST` | `/payments/create-and-confirm`                          | Crear y confirmar pago       | ✅            | -     |
| `POST` | `/payments/confirm`                                     | Confirmar pago (POST)        | ✅            | -     |

### **Ubicaciones** (`/locations`)

| Método   | Endpoint                    | Descripción                  | Autenticación | Roles           |
| -------- | --------------------------- | ---------------------------- | ------------- | --------------- |
| `GET`    | `/locations`                | Listar todas las ubicaciones | ❌            | -               |
| `GET`    | `/locations/by-country`     | Ubicaciones por país         | ❌            | Query: country  |
| `GET`    | `/locations/nearest`        | Ubicaciones más cercanas     | ❌            | Query: lat, lng |
| `GET`    | `/locations/:id/directions` | Direcciones a ubicación      | ❌            | Query: lat, lng |
| `POST`   | `/locations`                | Crear ubicación              | ❌            | admin           |
| `PATCH`  | `/locations/:id`            | Actualizar ubicación         | ❌            | admin           |
| `DELETE` | `/locations/:id`            | Eliminar ubicación           | ❌            | admin           |

### **Ejercicios** (`/admin/exercises`)

| Método  | Endpoint                      | Descripción                  | Autenticación | Roles |
| ------- | ----------------------------- | ---------------------------- | ------------- | ----- |
| `GET`   | `/admin/exercises`            | Listar ejercicios            | ✅            | admin |
| `PATCH` | `/admin/exercises/:id/toggle` | Activar/desactivar ejercicio | ✅            | admin |

### **Comentarios** (`/comments`)

| Método | Endpoint                | Descripción                  | Autenticación | Roles |
| ------ | ----------------------- | ---------------------------- | ------------- | ----- |
| `GET`  | `/comments`             | Listar todos los comentarios | ❌            | -     |
| `GET`  | `/comments/my-comments` | Mis comentarios              | ✅            | -     |
| `POST` | `/comments`             | Crear comentario             | ✅            | -     |

### **Emails** (`/emails`)

| Método | Endpoint                         | Descripción                | Autenticación | Roles |
| ------ | -------------------------------- | -------------------------- | ------------- | ----- |
| `GET`  | `/emails/ping`                   | Verificar conexión SMTP    | ❌            | -     |
| `POST` | `/emails/send/template`          | Enviar email por plantilla | ✅            | -     |
| `GET`  | `/emails/templates/:key/preview` | Preview de plantilla       | ❌            | -     |

### **Recordatorios** (`/reminders`)

| Método | Endpoint                  | Descripción                         | Autenticación | Roles |
| ------ | ------------------------- | ----------------------------------- | ------------- | ----- |
| `POST` | `/reminders/run-benefits` | Ejecutar recordatorio de beneficios | ❌            | -     |

### **Dashboard** (`/dashboard`)

| Método | Endpoint           | Descripción                | Autenticación | Roles |
| ------ | ------------------ | -------------------------- | ------------- | ----- |
| `GET`  | `/dashboard/stats` | Estadísticas del dashboard | ✅            | -     |

---

## 🔐 Autenticación y Autorización

### **Roles del Sistema:**

- **`member`**: Usuario regular (puede reservar clases, crear reseñas)
- **`trainer`**: Entrenador (puede ver sus clases, gestionar asistencias)
- **`admin`**: Administrador (acceso completo al sistema)

### **Guards de Seguridad:**

- **`JwtAuthGuard`**: Verifica token JWT válido
- **`RolesGuard`**: Verifica rol del usuario
- **`ActiveSubscriptionGuard`**: Verifica suscripción activa

### **Headers Requeridos:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 📝 Notas Importantes

1. **Base URL**: `http://localhost:3000` (desarrollo)
2. **Formato de Fechas**: ISO 8601 para timestamps, `yyyy-mm-dd` para fechas
3. **Paginación**: Parámetros `page` y `limit` en endpoints de listado
4. **Validación**: Todos los endpoints validan datos de entrada
5. **Logs**: Sistema de logging implementado para debugging
6. **Stripe**: Integración completa para pagos
7. **Email**: Sistema de plantillas para notificaciones

---

## 🚀 Instalación y Configuración

### **Dependencias del Backend:**

```bash
npm install @nestjs/core @nestjs/common @nestjs/typeorm @nestjs/jwt
npm install typeorm pg class-validator class-transformer
npm install stripe @nestjs/swagger
npm install nodemailer @nestjs/mail
```

### **Variables de Entorno Requeridas:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/nuevotrain
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

_Documentación generada automáticamente - Última actualización: $(date)_
