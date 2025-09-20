"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ormconfig.ts - Configuración para TypeORM CLI
var typeorm_1 = require("typeorm");
var config = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    // SSL obligatorio para Neon
    ssl: { rejectUnauthorized: false },
    entities: ["src/**/*.entity{.ts,.js}"],
    migrations: ["src/migrations/*{.ts,.js}"],
    synchronize: false, // NO usar synchronize en producción
    logging: true,
    // Configuración de pool de conexiones
    extra: {
        max: 20, // Máximo de conexiones en el pool
        min: 5, // Mínimo de conexiones en el pool
        acquire: 30000, // Tiempo máximo para adquirir conexión
        idle: 10000, // Tiempo máximo de inactividad
    },
});
exports.default = config;
