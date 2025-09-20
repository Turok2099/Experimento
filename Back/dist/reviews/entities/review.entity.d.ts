import { User } from '../../user/entities/user.entity';
export type ReviewStatus = 'approved' | 'pending' | 'rejected';
export declare class Review {
    id: string;
    user: User;
    userId: string;
    classId: string | null;
    trainerId: string | null;
    rating: number;
    comment: string | null;
    status: ReviewStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
