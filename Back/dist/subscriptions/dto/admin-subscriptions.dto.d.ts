export declare class AdminListSubscriptionsDto {
    status?: 'active' | 'cancelled' | 'expired';
    userId?: string;
    planId?: string;
    page?: string;
    limit?: string;
    sort?: 'createdAt:DESC' | 'createdAt:ASC' | 'startAt:DESC' | 'startAt:ASC' | 'endAt:DESC' | 'endAt:ASC';
}
export declare class AdminPatchSubscriptionStatusDto {
    status: 'active' | 'cancelled' | 'expired';
    reason?: string;
}
