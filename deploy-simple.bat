@echo off
REM 🚀 Script de Deployment SIMPLE para NuevoTrain en Vercel
REM Ejecutar desde la raíz del proyecto

echo 🚀 Iniciando deployment de NuevoTrain en Vercel...

REM Verificar que estemos en el directorio correcto
if not exist "Back\package.json" (
    echo ❌ No se encontró Back\package.json. Ejecuta desde la raíz del proyecto.
    pause
    exit /b 1
)

if not exist "Front\package.json" (
    echo ❌ No se encontró Front\package.json. Verifica la estructura del proyecto.
    pause
    exit /b 1
)

echo 🔐 Verificando login en Vercel...
vercel whoami
if %errorlevel% neq 0 (
    echo ❌ No estás logueado en Vercel. Ejecutando login...
    vercel login
    if %errorlevel% neq 0 (
        echo ❌ Error en el login. Intenta manualmente: vercel login
        pause
        exit /b 1
    )
)

echo ✅ Login verificado correctamente
echo.
echo 📦 Deployando Backend...

REM Deploy del Backend
cd Back
echo 🔧 Instalando dependencias del backend...
npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del backend
    cd ..
    pause
    exit /b 1
)

echo 🏗️ Construyendo backend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Error construyendo backend
    cd ..
    pause
    exit /b 1
)

echo 🚀 Deployando backend a Vercel...
echo ⚠️  Si es la primera vez, Vercel te pedirá configurar el proyecto
vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Error deployando backend
    cd ..
    pause
    exit /b 1
)
echo ✅ Backend deployado exitosamente

cd ..

echo.
echo 📦 Deployando Frontend...

REM Deploy del Frontend
cd Front
echo 🔧 Instalando dependencias del frontend...
npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del frontend
    cd ..
    pause
    exit /b 1
)

echo 🏗️ Construyendo frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Error construyendo frontend
    cd ..
    pause
    exit /b 1
)

echo 🚀 Deployando frontend a Vercel...
echo ⚠️  Si es la primera vez, Vercel te pedirá configurar el proyecto
vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Error deployando frontend
    cd ..
    pause
    exit /b 1
)
echo ✅ Frontend deployado exitosamente

cd ..

echo.
echo 🎉 ¡Deployment completado!
echo.
echo 📋 Próximos pasos:
echo 1. Ve a https://vercel.com/dashboard para ver tus proyectos
echo 2. Configura las variables de entorno en cada proyecto
echo 3. Configura la base de datos PostgreSQL (Neon/Supabase)
echo 4. Configura Stripe para pagos
echo 5. Ejecuta las migraciones de la base de datos
echo.
echo 📚 Consulta DEPLOYMENT_GUIDE.md para más detalles

pause
