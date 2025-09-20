// ormconfig.ts - Configuración para TypeORM CLI
import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

// Cargar variables de entorno
dotenvConfig();

const config = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? true : false,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});

export default config;

