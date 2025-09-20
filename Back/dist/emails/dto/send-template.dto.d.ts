declare class EmailAttachmentDto {
    filename: string;
    path?: string;
    content?: any;
    cid?: string;
}
export declare class SendTemplateDto {
    to: string;
    key: string;
    data?: Record<string, any>;
    attachments?: EmailAttachmentDto[];
}
export {};
