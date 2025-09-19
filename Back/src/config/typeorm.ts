import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

// Cargar variables de entorno según el entorno
if (process.env.NODE_ENV === 'development') {
  dotenvConfig({ path: '.env.development' });
} else {
  dotenvConfig();
}

// Configuración para Vercel (usando DATABASE_URL) o desarrollo local
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    // Configuración para Vercel/Producción
    return {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      autoLoadEntities: true,
      logging: false,
      synchronize: false,
      dropSchema: false,
    };
  } else {
    // Configuración para desarrollo local
    return {
      type: 'postgres' as const,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as unknown as number,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      autoLoadEntities: true,
      logging: false,
      synchronize: false,
      dropSchema: false,
    };
  }
};

const config = getDatabaseConfig();

export const typeOrmConfig = registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
