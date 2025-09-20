import { ClassHistory } from '../../classes/entities/class-history.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Payment } from '../../payments/entities/payment.entity';
export type UserRole = 'member' | 'trainer' | 'admin';
export declare class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    isBlocked: boolean;
    googleId: string | null;
    address: string | null;
    phone: string | null;
    refreshTokenHash: string | null;
    resetTokenHash: string | null;
    resetTokenExpiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    reviews?: Review[];
    classHistories: ClassHistory[];
    payments: Payment[];
}
