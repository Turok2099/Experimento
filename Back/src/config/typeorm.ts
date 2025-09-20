import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

// Cargar variables de entorno específicamente para desarrollo
dotenvConfig({ path: '.env.development' });

// Configuración para PostgreSQL con Neon
const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: process.env.NODE_ENV === 'development',
  synchronize: process.env.NODE_ENV === 'development', // Solo en desarrollo
  dropSchema: false,
  // Para Neon, usar la configuración SSL correcta
  ssl: process.env.DATABASE_URL?.includes('neon.tech') 
    ? { rejectUnauthorized: false } 
    : false,
};

export const typeOrmConfig = registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
