import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { StripeService } from '../stripe/stripe.service';
import { PlansService } from '../plans/plans.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
export interface CreatePaymentIntentData extends CreatePaymentIntentDto {
    userId: string;
}
export declare class PaymentsService {
    private readonly paymentRepository;
    private readonly stripeService;
    private readonly plansService;
    private readonly subscriptionsService;
    private readonly logger;
    constructor(paymentRepository: Repository<Payment>, stripeService: StripeService, plansService: PlansService, subscriptionsService: SubscriptionsService);
    testStripeConnection(): Promise<{
        connected: boolean;
        balance: number;
        currency: string;
    }>;
    createPaymentIntent(dto: CreatePaymentIntentData): Promise<{
        success: boolean;
        data: {
            clientSecret: string | null;
            paymentIntentId: string;
            paymentId: string;
        };
    }>;
    createCheckoutSession(planId: string, userId: string, successUrl: string, cancelUrl: string): Promise<{
        success: boolean;
        data: {
            sessionId: string;
            url: string | null;
        };
    }>;
    confirmPayment(paymentIntentId: string): Promise<{
        success: boolean;
        data: {
            paymentId: string;
            status: PaymentStatus;
            amount: number;
            currency: string;
            subscriptionId: string | null;
        };
    }>;
    createSubscriptionFromPayment(paymentId: string): Promise<{
        success: boolean;
        data: import("../subscriptions/entities/subscription.entity").Subscription;
    }>;
    checkPaymentAndCreateSubscription(paymentIntentId: string, userId: string): Promise<{
        paymentId: string;
        paymentStatus: PaymentStatus;
        stripeStatus: import("../../node_modules/stripe").Stripe.PaymentIntent.Status;
        amount: number;
        currency: string;
        subscriptionCreated: boolean;
        subscriptionId: string | null;
    }>;
    createAndConfirmPayment(dto: CreatePaymentIntentData): Promise<{
        success: boolean;
        data: {
            paymentId: string;
            paymentIntentId: string;
            subscriptionId: string;
            amount: number;
            currency: string;
            planId: string | null;
            subscription: {
                id: string;
                status: import("../subscriptions/entities/subscription.entity").SubscriptionStatus;
                startAt: Date;
                endAt: Date;
            };
        };
    }>;
}
