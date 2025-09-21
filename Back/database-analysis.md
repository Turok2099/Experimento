# Análisis de Base de Datos - NuevoTrain

## 📊 **Información del Proyecto Neon**

- **Proyecto ID:** `silent-forest-42748267`
- **Nombre:** `proyect_trainup`
- **Región:** `aws-us-east-1`
- **Creado:** `2025-09-20T02:41:01Z`

## 🔗 **Cadena de Conexión**

```
postgresql://neondb_owner:npg_Cl4pkmw0QJPI@ep-sparkling-snow-ad7hvyaf.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 📋 **Tablas del Proyecto**

### 1. **users** (16 registros)

- `id` (uuid, PK)
- `name` (varchar)
- `email` (varchar, unique)
- `role` (varchar, default: 'member')
- `google_id` (varchar, nullable)
- `address` (varchar, nullable)
- `phone` (varchar, nullable)
- `isBlocked` (boolean, default: false)
- `password_hash` (varchar)
- `refresh_token_hash` (varchar, nullable)
- `reset_token_hash` (varchar, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 2. **payments** (8 registros)

- `id` (uuid, PK)
- `user_id` (uuid, FK)
- `amount` (numeric)
- `currency` (varchar, default: 'ARS')
- `status` (varchar, default: 'pending')
- `payment_type` (varchar, default: 'subscription')
- `plan_id` (uuid, nullable)
- `subscription_id` (uuid, nullable)
- `stripe_metadata` (jsonb, nullable)
- `stripe_payment_intent_id` (varchar)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 3. **subscriptions** (5 registros)

- `id` (uuid, PK)
- `user_id` (uuid, FK)
- `plan_id` (uuid, nullable)
- `start_at` (timestamp with time zone)
- `end_at` (timestamp with time zone)
- `status` (varchar, default: 'active')
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 4. **plans** (2 registros)

- `id` (uuid, PK)
- `name` (varchar)
- `description` (text, nullable)
- `price` (numeric)
- `currency` (varchar, default: 'ARS')
- `durationDays` (integer)
- `isActive` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 5. **locations** (1 registro)

- `id` (uuid, PK)
- `name` (varchar)
- `country` (varchar)
- `city` (varchar)
- `address` (varchar)
- `lat` (numeric)
- `lng` (numeric)
- `isActive` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 6. **classes** (0 registros)

- `id` (uuid, PK)
- `trainer_id` (uuid, FK)
- `title` (varchar)
- `date` (date)
- `start_time` (time)
- `end_time` (time)
- `day_of_week` (varchar, nullable)
- `capacity` (integer, default: 20)
- `goal_tag` (varchar, nullable)
- `is_active` (boolean, default: true)
- `coach` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 7. **class_histories** (0 registros)

- `id` (uuid, PK)
- `user_id` (uuid, FK)
- `class_id` (uuid, FK)
- `status` (varchar, default: 'attended')
- `created_at` (timestamp)

### 8. **reservations** (0 registros)

- `id` (uuid, PK)
- `user_id` (uuid, FK)
- `class_id` (uuid, FK)
- `status` (varchar, default: 'booked')
- `created_at` (timestamp)

### 9. **reviews** (0 registros)

- `id` (uuid, PK)
- `user_id` (uuid, FK)
- `rating` (integer)
- `class_id` (uuid, nullable)
- `trainer_id` (uuid, nullable)
- `comment` (varchar, nullable)
- `is_active` (boolean, default: true)
- `status` (varchar, default: 'approved')
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 10. **comments** (0 registros)

- `id` (integer, PK, auto-increment)
- `user_id` (uuid, FK)
- `text` (text)
- `rating` (integer)
- `date` (date)
- `userId` (varchar)
- `createdAt` (timestamp)

### 11. **exercises** (0 registros)

- `id` (uuid, PK)
- `name` (varchar)
- `muscle_group` (varchar)
- `is_active` (boolean, default: true)
- `series` (integer, nullable)
- `repetitions` (integer, nullable)
- `type` (varchar, nullable)
- `program_tag` (varchar, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 12. **subscription_reminders** (0 registros)

- `id` (uuid, PK)
- `subscriptionId` (uuid, FK)
- `type` (varchar)
- `createdAt` (timestamp)

## ✅ **Verificación del Usuario gaby5@mail.com**

### **Información del Usuario:**

- **ID:** `c7f32df0-814a-4816-a700-1863ad9d6252`
- **Nombre:** `gaby5`
- **Email:** `gaby5@mail.com`
- **Rol:** `member`
- **Estado:** `isBlocked: false` ✅
- **Creado:** `2025-09-21T14:00:06.873Z`

### **Pagos Registrados:**

- **ID del Pago:** `7e4b40fe-ccb4-4ea2-b908-7c87663a0d0e`
- **Monto:** `$20.00 USD`
- **Estado:** `succeeded` ✅
- **Tipo:** `subscription`
- **Stripe Payment Intent:** `pi_3S9nob2RLVEWGhyi0Mln9hZs`
- **Fecha:** `2025-09-21T14:00:34.059Z`

### **Suscripción:**

- **ID de Suscripción:** `643bc1f1-1536-4250-9d30-ee011291862b`
- **Plan ID:** `1ce2884e-c6e8-4105-8f14-5042a803c3f2`
- **Estado:** `active` ✅
- **Inicio:** `2025-09-21T14:00:48.802Z`
- **Fin:** `2025-10-21T14:00:48.802Z`
- **Duración:** 30 días

### **Plan Asociado:**

- **ID:** `1ce2884e-c6e8-4105-8f14-5042a803c3f2`
- **Nombre:** `Plan Premium`
- **Precio:** `$20.00`
- **Duración:** 30 días

## 🎯 **Conclusión**

✅ **El pago está correctamente registrado en la base de datos**
✅ **La suscripción tiene estado 'active'**
✅ **El usuario tiene acceso completo al sistema**
✅ **Todo el flujo de pago funcionó correctamente**
