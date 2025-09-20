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

  // Configuración de CORS para Vercel - Más flexible
  const allowedOrigins = [
    'http://localhost:3000',
    // URLs específicos del frontend
    'https://nuevotrain-frontend.vercel.app',
    'https://nuevotrain-frontend-3mqnln0cx-jorge-castros-projects-839066ef.vercel.app',
    'https://nuevotrain-frontend-2xexop7sa-jorge-castros-projects-839066ef.vercel.app',
    'https://nuevotrain-frontend-ajxnvxr2u-jorge-castros-projects-839066ef.vercel.app',
    // URLs dinámicos desde variable de entorno
    ...(process.env.FRONT_ORIGIN?.split(',').map((url) => url.trim()) || []),
    // Patrón flexible para URLs de Vercel del frontend
    ...(process.env.FRONT_ORIGIN?.split(',')
      .map((url) => url.trim())
      .filter((url) => url.includes('nuevotrain-frontend')) || []),
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Permitir localhost en desarrollo
      if (origin.includes('localhost')) return callback(null, true);

      // Permitir cualquier URL de nuevotrain-frontend en Vercel
      if (
        origin.includes('nuevotrain-frontend') &&
        origin.includes('vercel.app')
      ) {
        return callback(null, true);
      }

      // Verificar si está en la lista de orígenes permitidos
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Rechazar otros orígenes
      callback(new Error('No permitido por CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
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
    .setTitle('NuevoTrain API')
    .setDescription('API del sistema de gestión de gimnasio')
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
