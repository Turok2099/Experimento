const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');

let cachedApp;

async function createNestApp() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);

    // Configurar CORS
    const allowedOrigins = [
      'http://localhost:3000',
      'https://nuevotrain-frontend.vercel.app',
      'https://nuevotrain-frontend-3mqnln0cx-jorge-castros-projects-839066ef.vercel.app',
      'https://nuevotrain-frontend-2xexop7sa-jorge-castros-projects-839066ef.vercel.app',
      ...(process.env.FRONT_ORIGIN?.split(',') || []),
    ];

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    });

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

module.exports = async (req, res) => {
  try {
    const app = await createNestApp();
    const expressApp = app.getHttpAdapter().getInstance();

    // Manejar la petición directamente con Express
    return expressApp(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack,
    });
  }
};
