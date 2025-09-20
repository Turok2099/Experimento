const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);
  await nestApp.init();
  app = nestApp.getHttpAdapter().getInstance(); // Express instance
  return app;
}

// Inicializar la app una sola vez
if (!app) {
  bootstrap().then(expressApp => {
    app = expressApp;
  });
}

// Exportar la app directamente (patrón de Vercel)
module.exports = app;
