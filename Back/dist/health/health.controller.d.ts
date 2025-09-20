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
    getUsers(): Promise<{
        status: string;
        message: string;
        count: any;
        users: any;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        timestamp: string;
        count?: undefined;
        users?: undefined;
    }>;
    getUserPasswordHash(email: string): Promise<{
        status: string;
        message: string;
        email: string;
        timestamp: string;
        user?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            isBlocked: any;
            password_hash: any;
            created_at: any;
        };
        timestamp: string;
        email?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        timestamp: string;
        email?: undefined;
        user?: undefined;
    }>;
    testPassword(email: string, password: string): Promise<{
        status: string;
        message: string;
        email: string;
        timestamp: string;
        user?: undefined;
        password_test?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        user: {
            id: any;
            name: any;
            email: any;
        };
        password_test: {
            provided_password: string;
            stored_hash: any;
            is_valid: boolean;
        };
        timestamp: string;
        email?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        timestamp: string;
        email?: undefined;
        user?: undefined;
        password_test?: undefined;
    }>;
    fixPassword(email: string, newPassword: string): Promise<{
        status: string;
        message: string;
        email: string;
        timestamp: string;
        user?: undefined;
        password_update?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        user: {
            id: any;
            name: any;
            email: any;
        };
        password_update: {
            new_password: string;
            new_hash: string;
        };
        timestamp: string;
        email?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        timestamp: string;
        email?: undefined;
        user?: undefined;
        password_update?: undefined;
    }>;
    createAdmin(createAdminDto: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        status: string;
        message: string;
        email: string;
        timestamp: string;
        user?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            isBlocked: any;
            created_at: any;
        };
        timestamp: string;
        email?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        timestamp: string;
        email?: undefined;
        user?: undefined;
    }>;
}
