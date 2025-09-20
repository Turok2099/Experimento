import { Subscription } from '../../subscriptions/entities/subscription.entity';
export declare class SubscriptionReminder {
    id: string;
    subscriptionId: string;
    subscription: Subscription;
    type: string;
    createdAt: Date;
}
