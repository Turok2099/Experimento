import { ConfigService } from '@nestjs/config';
import Stripe from '../../node_modules/stripe';
export declare class StripeService {
    private configService;
    private readonly logger;
    private stripe;
    constructor(configService: ConfigService);
    testConnection(): Promise<boolean>;
    createProduct(name: string, description?: string): Promise<Stripe.Product>;
    createPrice(productId: string, amount: number, currency?: string): Promise<Stripe.Price>;
    createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string): Promise<Stripe.Checkout.Session>;
    getStripeClient(): Stripe;
}
