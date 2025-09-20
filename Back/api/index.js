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
  // Manejar preflight requests (OPTIONS) antes de NestJS
  if (req.method === 'OPTIONS') {
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://front-amber-tau.vercel.app',
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization, Cookie, X-Requested-With',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  const expressApp = await bootstrap();
  return expressApp(req, res);
};
