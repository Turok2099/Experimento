import { EmailsService } from './emails.service';
import { SendTemplateDto } from './dto/send-template.dto';
export declare class EmailsController {
    private readonly emails;
    constructor(emails: EmailsService);
    ping(): Promise<{
        ok: boolean;
    }>;
    sendByTemplate(dto: SendTemplateDto): Promise<{
        ok: boolean;
        messageId: any;
    }>;
    preview(key: string, json?: string): Promise<{
        subject: string;
        html: string;
    }>;
}
