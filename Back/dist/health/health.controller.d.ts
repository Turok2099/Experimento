import { DataSource } from 'typeorm';
export declare class HealthController {
    private dataSource;
    constructor(dataSource: DataSource);
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
    };
    checkDatabase(): Promise<{
        status: string;
        database: string;
        provider: string;
        timestamp: string;
        tables: any[];
        error?: undefined;
    } | {
        status: string;
        database: string;
        error: any;
        timestamp: string;
        provider?: undefined;
        tables?: undefined;
    }>;
    getTablesInfo(): Promise<any[]>;
    testInsert(): Promise<{
        status: string;
        message: string;
        data: any;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        timestamp: string;
        data?: undefined;
    }>;
}
