import { AppService } from './app.service';
import { DataSource } from 'typeorm';
export declare class AppController {
    private readonly appService;
    private readonly dataSource;
    constructor(appService: AppService, dataSource: DataSource);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
        message: string;
    };
    testDatabaseConnection(): Promise<{
        success: boolean;
        message: string;
        data: {
            currentTime: any;
            dbVersion: any;
            tables: any;
            environment: string | undefined;
            hasDatabaseUrl: boolean;
        };
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data: {
            environment: string | undefined;
            hasDatabaseUrl: boolean;
            currentTime?: undefined;
            dbVersion?: undefined;
            tables?: undefined;
        };
        timestamp: string;
    }>;
}
