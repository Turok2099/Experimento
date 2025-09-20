const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);
  await nestApp.init();
  app = nestApp.getHttpAdapter().getInstance(); // Express instance
}

async function handler(req, res) {
  if (!app) {
    await bootstrap();
  }
  return app(req, res); // Express sabe manejar req/res directo
}

module.exports = handler;
