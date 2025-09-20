"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let HealthController = class HealthController {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'NuevoTrain Backend',
            version: '1.0.0',
        };
    }
    async checkDatabase() {
        try {
            await this.dataSource.query('SELECT 1');
            const tables = await this.getTablesInfo();
            return {
                status: 'ok',
                database: 'connected',
                provider: 'Neon PostgreSQL',
                timestamp: new Date().toISOString(),
                tables: tables,
            };
        }
        catch (error) {
            return {
                status: 'error',
                database: 'disconnected',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getTablesInfo() {
        try {
            const tables = [
                'users',
                'locations',
                'classes',
                'class_histories',
                'reservations',
                'reviews',
                'comments',
                'plans',
                'subscriptions',
                'payments',
                'exercises',
                'subscription_reminders',
            ];
            const tableInfo = [];
            for (const tableName of tables) {
                try {
                    const tableExists = await this.dataSource.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = $1
            );
          `, [tableName]);
                    if (tableExists[0].exists) {
                        const countResult = await this.dataSource.query(`SELECT COUNT(*) as count FROM ${tableName}`);
                        const columns = await this.dataSource.query(`
              SELECT column_name, data_type, is_nullable, column_default
              FROM information_schema.columns 
              WHERE table_name = $1 
              ORDER BY ordinal_position
            `, [tableName]);
                        tableInfo.push({
                            name: tableName,
                            exists: true,
                            recordCount: parseInt(countResult[0].count),
                            columns: columns.map((col) => ({
                                name: col.column_name,
                                type: col.data_type,
                                nullable: col.is_nullable === 'YES',
                                default: col.column_default,
                            })),
                        });
                    }
                    else {
                        tableInfo.push({
                            name: tableName,
                            exists: false,
                            recordCount: 0,
                            columns: [],
                        });
                    }
                }
                catch (tableError) {
                    tableInfo.push({
                        name: tableName,
                        exists: false,
                        error: tableError.message,
                        recordCount: 0,
                        columns: [],
                    });
                }
            }
            return tableInfo;
        }
        catch (error) {
            throw new Error(`Error al obtener información de tablas: ${error.message}`);
        }
    }
    async testInsert() {
        try {
            const testLocation = await this.dataSource.query(`
          INSERT INTO locations (name, country, city, address, lat, lng, "isActive", created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `, [
                'Gimnasio de Prueba ' + Date.now(),
                'Argentina',
                'Buenos Aires',
                'Av. Test 123',
                '-34.6037',
                '-58.3816',
                true,
                new Date(),
                new Date(),
            ]);
            return {
                status: 'ok',
                message: 'Inserción de prueba exitosa',
                data: testLocation[0],
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Error en inserción de prueba',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getUsers() {
        try {
            const users = await this.dataSource.query('SELECT id, name, email, role, "isBlocked", created_at FROM users ORDER BY created_at DESC');
            return {
                status: 'ok',
                message: 'Usuarios obtenidos exitosamente',
                count: users.length,
                users: users,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Error al obtener usuarios',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getUserPasswordHash(email) {
        try {
            const user = await this.dataSource.query('SELECT id, name, email, role, "isBlocked", password_hash, created_at FROM users WHERE email = $1', [email]);
            if (user.length === 0) {
                return {
                    status: 'error',
                    message: 'Usuario no encontrado',
                    email: email,
                    timestamp: new Date().toISOString(),
                };
            }
            return {
                status: 'ok',
                message: 'Usuario encontrado',
                user: {
                    id: user[0].id,
                    name: user[0].name,
                    email: user[0].email,
                    role: user[0].role,
                    isBlocked: user[0].isBlocked,
                    password_hash: user[0].password_hash,
                    created_at: user[0].created_at,
                },
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Error al obtener usuario',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check básico' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Servicio funcionando' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('database'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar conexión a base de datos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conexión exitosa' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error de conexión' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkDatabase", null);
__decorate([
    (0, common_1.Get)('tables'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las tablas y sus registros' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Información de tablas obtenida' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getTablesInfo", null);
__decorate([
    (0, common_1.Get)('test-insert'),
    (0, swagger_1.ApiOperation)({ summary: 'Probar inserción en base de datos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inserción de prueba exitosa' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "testInsert", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los usuarios registrados' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de usuarios obtenida' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('user/:email'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar hash de contraseña de un usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Información del usuario obtenida' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getUserPasswordHash", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], HealthController);
//# sourceMappingURL=health.controller.js.map