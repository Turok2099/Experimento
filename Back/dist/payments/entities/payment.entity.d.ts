import { User } from '../../user/entities/user.entity';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled';
export type PaymentType = 'subscription' | 'one_time';
export declare class Payment {
    id: string;
    user: User;
    userId: string;
    stripePaymentIntentId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentType: PaymentType;
    planId: string | null;
    subscriptionId: string | null;
    stripeMetadata: object | null;
    createdAt: Date;
    updatedAt: Date;
}
