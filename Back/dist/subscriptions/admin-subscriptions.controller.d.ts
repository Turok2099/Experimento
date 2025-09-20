import { SubscriptionsService } from './subscriptions.service';
import { AdminListSubscriptionsDto, AdminPatchSubscriptionStatusDto } from './dto/admin-subscriptions.dto';
export declare class AdminSubscriptionsController {
    private readonly subsSvc;
    constructor(subsSvc: SubscriptionsService);
    list(q: AdminListSubscriptionsDto): Promise<{
        ok: boolean;
        total: number;
        page: number;
        limit: number;
        data: import("./entities/subscription.entity").Subscription[];
    }>;
    patchStatus(id: string, dto: AdminPatchSubscriptionStatusDto): Promise<{
        ok: boolean;
        data: import("./entities/subscription.entity").Subscription;
    }>;
}
