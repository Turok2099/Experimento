import { RemindersService } from './reminders.service';
export declare class RemindersController {
    private readonly reminders;
    constructor(reminders: RemindersService);
    runBenefits(): Promise<{
        ok: boolean;
        sent: number;
    }>;
}
