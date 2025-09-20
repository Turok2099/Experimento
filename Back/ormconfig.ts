// ormconfig.ts - Configuración para TypeORM CLI
import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

// Cargar variables de entorno específicamente para desarrollo
dotenvConfig({ path: '.env.development' });

const config = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Para Neon, usar la configuración SSL correcta
  ssl: process.env.DATABASE_URL?.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : false,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});

export default config;
