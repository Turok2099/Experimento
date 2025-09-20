import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    testStripe(): Promise<{
        success: boolean;
        message: string;
        data: {
            connected: boolean;
            balance: number;
            currency: string;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    createPaymentIntent(dto: CreatePaymentIntentDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            clientSecret: string | null;
            paymentIntentId: string;
            paymentId: string;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    createCheckoutSession(body: {
        planId: string;
        successUrl: string;
        cancelUrl: string;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            sessionId: string;
            url: string | null;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    confirmPayment(paymentIntentId: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            paymentId: string;
            status: import("./entities/payment.entity").PaymentStatus;
            amount: number;
            currency: string;
            subscriptionId: string | null;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    createSubscriptionFromPayment(paymentId: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            data: import("../subscriptions/entities/subscription.entity").Subscription;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    checkPaymentAndSubscriptionStatus(paymentIntentId: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            paymentId: string;
            paymentStatus: import("./entities/payment.entity").PaymentStatus;
            stripeStatus: import("../../node_modules/stripe").Stripe.PaymentIntent.Status;
            amount: number;
            currency: string;
            subscriptionCreated: boolean;
            subscriptionId: string | null;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    createAndConfirmPayment(dto: CreatePaymentIntentDto, req: any): Promise<{
        success: boolean;
        message: string;
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
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    confirmPaymentPost(body: {
        paymentIntentId: string;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            paymentId: string;
            status: import("./entities/payment.entity").PaymentStatus;
            amount: number;
            currency: string;
            subscriptionId: string | null;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
