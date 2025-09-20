import { User } from '../../user/entities/user.entity';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export declare class Subscription {
    id: string;
    user: User;
    userId: string;
    planId: string | null;
    startAt: Date;
    endAt: Date;
    status: SubscriptionStatus;
    createdAt: Date;
    updatedAt: Date;
}
