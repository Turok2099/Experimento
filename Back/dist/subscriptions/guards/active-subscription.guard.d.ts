import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions.service';
export declare class ActiveSubscriptionGuard implements CanActivate {
    private readonly subs;
    constructor(subs: SubscriptionsService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
