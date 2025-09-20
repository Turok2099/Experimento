const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;

async function bootstrap() {
  if (!app) {
    const nestApp = await NestFactory.create(AppModule);
    await nestApp.init();
    app = nestApp.getHttpAdapter().getInstance(); // Express instance
  }
  return app;
}

// Exportar función que maneja las requests
module.exports = async (req, res) => {
  // Manejar preflight requests (OPTIONS) directamente
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    const allowedOrigins = [
      'http://localhost:3000',
      'https://front-amber-tau.vercel.app',
      'https://nuevotrain-frontend.vercel.app'
    ];
    
    // Verificar si el origin está permitido
    if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400');
      return res.status(200).end();
    } else {
      return res.status(403).end();
    }
  }
  
  const expressApp = await bootstrap();
  return expressApp(req, res);
};
