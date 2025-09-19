#!/bin/bash

# 🚀 Script de Deployment para NuevoTrain en Vercel
# Ejecutar desde la raíz del proyecto

echo "🚀 Iniciando deployment de NuevoTrain en Vercel..."

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

# Verificar que estemos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -d "Back" ] && [ ! -d "Front" ]; then
    echo "❌ No se encontró la estructura del proyecto. Ejecuta desde la raíz del proyecto."
    exit 1
fi

echo "📦 Deployando Backend..."

# Deploy del Backend
cd Back
if [ -f "package.json" ]; then
    echo "🔧 Instalando dependencias del backend..."
    npm install
    
    echo "🏗️ Construyendo backend..."
    npm run build
    
    echo "🚀 Deployando backend a Vercel..."
    vercel --prod --yes
    echo "✅ Backend deployado exitosamente"
else
    echo "❌ No se encontró package.json en Back/"
    exit 1
fi

cd ..

echo "📦 Deployando Frontend..."

# Deploy del Frontend
cd Front
if [ -f "package.json" ]; then
    echo "🔧 Instalando dependencias del frontend..."
    npm install
    
    echo "🏗️ Construyendo frontend..."
    npm run build
    
    echo "🚀 Deployando frontend a Vercel..."
    vercel --prod --yes
    echo "✅ Frontend deployado exitosamente"
else
    echo "❌ No se encontró package.json en Front/"
    exit 1
fi

cd ..

echo ""
echo "🎉 ¡Deployment completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las variables de entorno en Vercel Dashboard"
echo "2. Configura la base de datos PostgreSQL"
echo "3. Configura Stripe para pagos"
echo "4. Ejecuta las migraciones de la base de datos"
echo ""
echo "📚 Consulta DEPLOYMENT_GUIDE.md para más detalles"
echo ""
echo "🔗 URLs de tu aplicación:"
echo "- Backend: https://nuevotrain-backend.vercel.app"
echo "- Frontend: https://nuevotrain-frontend.vercel.app"
echo "- Documentación: https://nuevotrain-backend.vercel.app/docs"

