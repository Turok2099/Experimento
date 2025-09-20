import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { AdminCreateSubscriptionDto } from './dto/create-subscription.dto';
import { PlansService } from '../plans/plans.service';
import { AdminListSubscriptionsDto, AdminPatchSubscriptionStatusDto } from './dto/admin-subscriptions.dto';
export declare class SubscriptionsService {
    private readonly subsRepo;
    private readonly plans;
    constructor(subsRepo: Repository<Subscription>, plans: PlansService);
    private now;
    hasActive(userId: string): Promise<boolean>;
    statusFor(userId: string): Promise<{
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
    createFromPlan(userId: string, planId: string): Promise<Subscription>;
    createAdmin(dto: AdminCreateSubscriptionDto): Promise<Subscription>;
    private extendOrCreate;
    cancel(id: string): Promise<Subscription>;
    adminList(q: AdminListSubscriptionsDto): Promise<{
        data: Subscription[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminChangeStatus(id: string, dto: AdminPatchSubscriptionStatusDto): Promise<Subscription>;
}
