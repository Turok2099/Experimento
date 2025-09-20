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
  const expressApp = await bootstrap();
  return expressApp(req, res);
};
