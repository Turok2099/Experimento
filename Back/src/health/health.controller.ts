import { Controller, Get, Param } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check básico' })
  @ApiResponse({ status: 200, description: 'Servicio funcionando' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'NuevoTrain Backend',
      version: '1.0.0',
    };
  }

  @Get('database')
  @ApiOperation({ summary: 'Verificar conexión a base de datos' })
  @ApiResponse({ status: 200, description: 'Conexión exitosa' })
  @ApiResponse({ status: 500, description: 'Error de conexión' })
  async checkDatabase() {
    try {
      // Verificar conexión
      await this.dataSource.query('SELECT 1');

      // Obtener información de las tablas
      const tables = await this.getTablesInfo();

      return {
        status: 'ok',
        database: 'connected',
        provider: 'Neon PostgreSQL',
        timestamp: new Date().toISOString(),
        tables: tables,
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('tables')
  @ApiOperation({ summary: 'Listar todas las tablas y sus registros' })
  @ApiResponse({ status: 200, description: 'Información de tablas obtenida' })
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

      const tableInfo: any[] = [];

      for (const tableName of tables) {
        try {
          // Verificar si la tabla existe
          const tableExists = await this.dataSource.query(
            `
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = $1
            );
          `,
            [tableName],
          );

          if (tableExists[0].exists) {
            // Contar registros
            const countResult = await this.dataSource.query(
              `SELECT COUNT(*) as count FROM ${tableName}`,
            );

            // Obtener estructura de la tabla
            const columns = await this.dataSource.query(
              `
              SELECT column_name, data_type, is_nullable, column_default
              FROM information_schema.columns 
              WHERE table_name = $1 
              ORDER BY ordinal_position
            `,
              [tableName],
            );

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
          } else {
            tableInfo.push({
              name: tableName,
              exists: false,
              recordCount: 0,
              columns: [],
            });
          }
        } catch (tableError) {
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
    } catch (error) {
      throw new Error(
        `Error al obtener información de tablas: ${error.message}`,
      );
    }
  }

  @Get('test-insert')
  @ApiOperation({ summary: 'Probar inserción en base de datos' })
  @ApiResponse({ status: 200, description: 'Inserción de prueba exitosa' })
  async testInsert() {
    try {
      // Crear una ubicación de prueba
      const testLocation = await this.dataSource.query(
        `
          INSERT INTO locations (name, country, city, address, lat, lng, "isActive", created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `,
        [
          'Gimnasio de Prueba ' + Date.now(),
          'Argentina',
          'Buenos Aires',
          'Av. Test 123',
          '-34.6037',
          '-58.3816',
          true,
          new Date(),
          new Date(),
        ],
      );

      return {
        status: 'ok',
        message: 'Inserción de prueba exitosa',
        data: testLocation[0],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error en inserción de prueba',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar todos los usuarios registrados' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida' })
  async getUsers() {
    try {
      const users = await this.dataSource.query(
        'SELECT id, name, email, role, "isBlocked", created_at FROM users ORDER BY created_at DESC',
      );

      return {
        status: 'ok',
        message: 'Usuarios obtenidos exitosamente',
        count: users.length,
        users: users,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'Error al obtener usuarios',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('user/:email')
  @ApiOperation({ summary: 'Verificar hash de contraseña de un usuario' })
  @ApiResponse({ status: 200, description: 'Información del usuario obtenida' })
  async getUserPasswordHash(@Param('email') email: string) {
    try {
      const user = await this.dataSource.query(
        'SELECT id, name, email, role, "isBlocked", password_hash, created_at FROM users WHERE email = $1',
        [email]
      );

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
    } catch (error: any) {
      return {
        status: 'error',
        message: 'Error al obtener usuario',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
