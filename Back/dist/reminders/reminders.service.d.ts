import { Repository } from 'typeorm';
import { EmailsService } from '../emails/emails.service';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { SubscriptionReminder } from './entities/subscription-reminder.entity';
export declare class RemindersService {
    private readonly subsRepo;
    private readonly reminderRepo;
    private readonly emails;
    private readonly logger;
    constructor(subsRepo: Repository<Subscription>, reminderRepo: Repository<SubscriptionReminder>, emails: EmailsService);
    private cronsEnabled;
    private mode;
    private tz;
    private sendBenefitsNudgeBatch;
    benefitsEvery10m(): Promise<void>;
    benefitsHourly(): Promise<void>;
    runBenefitsOnce(): Promise<{
        ok: boolean;
        sent: number;
    }>;
}
