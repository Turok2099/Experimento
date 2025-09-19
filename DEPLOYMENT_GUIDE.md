# 🚀 Guía de Deployment en Vercel - NuevoTrain

## 📋 Prerequisitos

1. **Cuenta de Vercel** - [vercel.com](https://vercel.com)
2. **Base de datos PostgreSQL** - [Neon](https://neon.tech) o [Supabase](https://supabase.com)
3. **Cuenta de Stripe** - [stripe.com](https://stripe.com)
4. **Cuenta de Gmail** - Para emails (opcional)

---

## 🔧 Configuración del Backend

### 1. **Variables de Entorno en Vercel**

En el dashboard de Vercel, ve a tu proyecto backend y configura estas variables:

```env
# Base de datos
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secrets (genera claves seguras)
JWT_SECRET=tu-clave-super-secreta-jwt
JWT_REFRESH_SECRET=tu-clave-super-secreta-refresh

# Stripe
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_stripe
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# CORS
FRONT_ORIGIN=https://nuevotrain-frontend.vercel.app

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Entorno
NODE_ENV=production
```

### 2. **Deploy del Backend**

```bash
# En la carpeta Back/
cd Back
vercel --prod
```

**O desde GitHub:**

1. Conecta tu repositorio a Vercel
2. Configura el directorio raíz como `Back`
3. Deploy automático

---

## 🎨 Configuración del Frontend

### 1. **Variables de Entorno en Vercel**

En el dashboard de Vercel, ve a tu proyecto frontend y configura estas variables:

```env
# Backend API
NEXT_PUBLIC_API_URL=https://nuevotrain-backend.vercel.app

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica_stripe

# Google OAuth (opcional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-google-client-id

# EmailJS (opcional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu-public-key
```

### 2. **Deploy del Frontend**

```bash
# En la carpeta Front/
cd Front
vercel --prod
```

**O desde GitHub:**

1. Conecta tu repositorio a Vercel
2. Configura el directorio raíz como `Front`
3. Deploy automático

---

## 🗄️ Configuración de Base de Datos

### **Opción 1: Neon (Recomendado)**

1. Ve a [neon.tech](https://neon.tech)
2. Crea una nueva base de datos
3. Copia la `DATABASE_URL` y úsala en Vercel

### **Opción 2: Supabase**

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > Database
4. Copia la `DATABASE_URL` y úsala en Vercel

### **Ejecutar Migraciones**

```bash
# En el backend, después del deploy
npm run migration:run
```

---

## 🔐 Configuración de Stripe

### 1. **Crear Productos en Stripe**

1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crea productos para tus planes de suscripción
3. Copia las claves API

### 2. **Configurar Webhooks**

1. Ve a Webhooks en Stripe
2. Agrega endpoint: `https://nuevotrain-backend.vercel.app/stripe/webhook`
3. Selecciona eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copia el webhook secret

---

## 📧 Configuración de Email (Opcional)

### **Gmail App Password**

1. Habilita 2FA en Gmail
2. Ve a Google Account > Security > App passwords
3. Genera una contraseña para "Mail"
4. Usa esa contraseña en `SMTP_PASS`

---

## 🧪 Testing del Deployment

### **Backend**

```bash
# Test de salud
curl https://nuevotrain-backend.vercel.app/health

# Test de documentación
curl https://nuevotrain-backend.vercel.app/docs
```

### **Frontend**

1. Visita `https://nuevotrain-frontend.vercel.app`
2. Verifica que se conecte al backend
3. Prueba el registro/login
4. Prueba las reservas de clases

---

## 🚨 Troubleshooting

### **Error de CORS**

- Verifica que `FRONT_ORIGIN` esté configurado correctamente
- Asegúrate de que la URL del frontend coincida exactamente

### **Error de Base de Datos**

- Verifica que `DATABASE_URL` sea correcta
- Asegúrate de que la base de datos esté accesible desde Vercel

### **Error de Stripe**

- Verifica que las claves de Stripe sean correctas
- Asegúrate de usar claves de producción en producción

### **Error de Build**

- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel

---

## 📊 Monitoreo

### **Vercel Analytics**

- Ve a Analytics en tu dashboard de Vercel
- Monitorea el rendimiento y errores

### **Logs**

- Ve a Functions > Logs en Vercel
- Revisa los logs del backend

---

## 🔄 CI/CD Automático

### **GitHub Actions (Opcional)**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: cd Back && vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Frontend
        run: cd Front && vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## ✅ Checklist de Deployment

- [ ] Backend deployado en Vercel
- [ ] Frontend deployado en Vercel
- [ ] Base de datos configurada y migraciones ejecutadas
- [ ] Variables de entorno configuradas
- [ ] Stripe configurado
- [ ] CORS configurado correctamente
- [ ] Emails configurados (opcional)
- [ ] Google OAuth configurado (opcional)
- [ ] Testing completo realizado

---

## 🎉 ¡Listo!

Tu aplicación NuevoTrain debería estar funcionando en:

- **Backend**: `https://nuevotrain-backend.vercel.app`
- **Frontend**: `https://nuevotrain-frontend.vercel.app`
- **Documentación**: `https://nuevotrain-backend.vercel.app/docs`

---

_Guía creada para el proyecto NuevoTrain - Sistema de gestión de gimnasio_

