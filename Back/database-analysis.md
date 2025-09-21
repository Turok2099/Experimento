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

## 🎯 **Próximos Pasos**
1. Verificar usuario `gaby5@mail.com`
2. Revisar pagos del usuario
3. Verificar suscripciones y su estado
4. Confirmar que el status de subscription sea 'active'
