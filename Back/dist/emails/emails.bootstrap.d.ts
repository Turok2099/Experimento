import { OnApplicationBootstrap } from '@nestjs/common';
import { EmailsService } from './emails.service';
export declare class EmailsBootstrap implements OnApplicationBootstrap {
    private readonly emails;
    private readonly logger;
    constructor(emails: EmailsService);
    onApplicationBootstrap(): Promise<void>;
}
