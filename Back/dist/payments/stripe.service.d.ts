import Stripe from '../../node_modules/stripe';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { User } from '../user/entities/user.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PlansService } from '../plans/plans.service';
export interface CreateSubscriptionPaymentDto {
    userId: string;
    planId: string;
    userEmail: string;
    userName: string;
}
export interface WebhookResult {
    processed: boolean;
    reason: string;
    paymentData?: any;
    error?: string;
}
export declare class StripeService {
    private paymentRepository;
    private userRepository;
    private subscriptionsService;
    private plansService;
    private stripe;
    constructor(paymentRepository: Repository<Payment>, userRepository: Repository<User>, subscriptionsService: SubscriptionsService, plansService: PlansService);
    createSubscriptionPayment(data: CreateSubscriptionPaymentDto): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    getPaymentInfo(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    createPaymentIntent(data: {
        amount: number;
        currency: string;
        userId?: string;
    }): Promise<any>;
    processWebhookNotification(webhookData: any, signature: string): Promise<WebhookResult>;
    private handleCheckoutSessionCompleted;
    private handlePaymentIntentSucceeded;
    private handlePaymentIntentFailed;
    private savePaymentToDatabase;
    private updatePaymentStatus;
    getUserPayments(userId: string): Promise<Payment[]>;
    getAllPayments(): Promise<Payment[]>;
}
