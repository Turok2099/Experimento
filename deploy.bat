@echo off
REM 🚀 Script de Deployment para NuevoTrain en Vercel (Windows)
REM Ejecutar desde la raíz del proyecto

echo 🚀 Iniciando deployment de NuevoTrain en Vercel...

REM Verificar que Vercel CLI esté instalado
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI no está instalado. Instalando...
    npm install -g vercel
)

REM Verificar que estemos en el directorio correcto
if not exist "Back\package.json" (
    echo ❌ No se encontró la estructura del proyecto. Ejecuta desde la raíz del proyecto.
    pause
    exit /b 1
)

echo 📦 Deployando Backend...

REM Deploy del Backend
cd Back
if exist "package.json" (
    echo 🔧 Instalando dependencias del backend...
    npm install
    
    echo 🏗️ Construyendo backend...
    npm run build
    
    echo 🚀 Deployando backend a Vercel...
    vercel --prod --yes
    echo ✅ Backend deployado exitosamente
) else (
    echo ❌ No se encontró package.json en Back/
    pause
    exit /b 1
)

cd ..

echo 📦 Deployando Frontend...

REM Deploy del Frontend
cd Front
if exist "package.json" (
    echo 🔧 Instalando dependencias del frontend...
    npm install
    
    echo 🏗️ Construyendo frontend...
    npm run build
    
    echo 🚀 Deployando frontend a Vercel...
    vercel --prod --yes
    echo ✅ Frontend deployado exitosamente
) else (
    echo ❌ No se encontró package.json en Front/
    pause
    exit /b 1
)

cd ..

echo.
echo 🎉 ¡Deployment completado!
echo.
echo 📋 Próximos pasos:
echo 1. Configura las variables de entorno en Vercel Dashboard
echo 2. Configura la base de datos PostgreSQL
echo 3. Configura Stripe para pagos
echo 4. Ejecuta las migraciones de la base de datos
echo.
echo 📚 Consulta DEPLOYMENT_GUIDE.md para más detalles
echo.
echo 🔗 URLs de tu aplicación:
echo - Backend: https://nuevotrain-backend.vercel.app
echo - Frontend: https://nuevotrain-frontend.vercel.app
echo - Documentación: https://nuevotrain-backend.vercel.app/docs

pause

