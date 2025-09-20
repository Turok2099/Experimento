import { DataSource } from 'typeorm';
export declare const typeOrmConfig: (() => import("typeorm/driver/postgres/PostgresConnectionOptions").PostgresConnectionOptions) & import("@nestjs/config").ConfigFactoryKeyHost<import("typeorm/driver/postgres/PostgresConnectionOptions").PostgresConnectionOptions>;
export declare const connectionSource: DataSource;
