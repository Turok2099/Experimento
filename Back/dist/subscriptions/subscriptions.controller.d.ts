import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, AdminCreateSubscriptionDto } from './dto/create-subscription.dto';
export declare class SubscriptionsController {
    private readonly subs;
    constructor(subs: SubscriptionsService);
    myStatus(user: {
        userId: string;
    }): Promise<{
        active: boolean;
        status: string;
        current: null;
    } | {
        active: boolean;
        status: string;
        current: {
            id: string;
            planId: string | null;
            startAt: Date;
            endAt: Date;
            daysLeft: number;
        };
    }>;
    createSelf(user: {
        userId: string;
    }, dto: CreateSubscriptionDto): Promise<import("./entities/subscription.entity").Subscription>;
    createAdmin(dto: AdminCreateSubscriptionDto): Promise<import("./entities/subscription.entity").Subscription>;
    cancel(id: string): Promise<import("./entities/subscription.entity").Subscription>;
    devTrial(user: {
        userId: string;
    }): Promise<import("./entities/subscription.entity").Subscription>;
}
