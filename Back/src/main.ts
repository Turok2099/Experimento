import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

/**
 * 🔹 Configuración común de la app Nest
 */
async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (process.env.FRONT_ORIGIN || 'http://localhost:3000').split(','),
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TrainUp API')
    .setDescription('API del proyecto final')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('refresh_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  return app;
}

/**
 * 🔹 Bootstrap para AWS Lambda / Vercel
 */
async function bootstrapLambda() {
  const app = await createApp();
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

/**
 * ⚡ Handler para Vercel (Lambda)
 */
export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!server) {
    server = await bootstrapLambda();
  }
  return server(event, context, callback);
};

/**
 * 🚀 Bootstrap para desarrollo local
 */
async function bootstrapLocal() {
  const app = await createApp();

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📚 Documentation available at http://localhost:${port}/docs`);
}

/**
 * Ejecutar localmente solo en desarrollo
 */
if (process.env.NODE_ENV === 'development') {
  bootstrapLocal();
}
