import type { Attachment } from 'nodemailer/lib/mailer';
export declare class EmailsService {
    private transporter;
    private templates;
    private initTransporter;
    verifyConnection(): Promise<true>;
    send(to: string, subject: string, html: string, attachments?: Attachment[]): Promise<{
        ok: boolean;
        messageId: any;
    }>;
    renderTemplate(key: string, data?: Record<string, any>): Promise<{
        subject: string;
        html: string;
    }>;
    sendByTemplate(to: string, key: string, data?: Record<string, any>, attachments?: Attachment[]): Promise<{
        ok: boolean;
        messageId: any;
    }>;
    sendWelcome(to: string, name: string): Promise<{
        ok: boolean;
        messageId: any;
    }>;
    sendPasswordResetEmail(to: string, resetLink: string): Promise<{
        ok: boolean;
        messageId: any;
    }>;
}
