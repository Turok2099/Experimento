import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsQueryDto } from './dto/reviews-query.dto';
import { Reservation } from '../classes/entities/reservation.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
export declare class ReviewsService {
    private readonly reviews;
    private readonly reservations;
    private readonly subs;
    constructor(reviews: Repository<Review>, reservations: Repository<Reservation>, subs: SubscriptionsService);
    private assertUserCanReview;
    create(userId: string, dto: CreateReviewDto): Promise<Review>;
    listPublic(q: ReviewsQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: Review[];
    }>;
    myReviews(userId: string, q: ReviewsQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: Review[];
    }>;
    update(userId: string, id: string, dto: UpdateReviewDto): Promise<Review>;
    softDelete(userId: string, id: string): Promise<Review>;
    adminList(q: ReviewsQueryDto & {
        includeInactive?: string;
        status?: 'approved' | 'pending' | 'rejected';
    }): Promise<{
        page: number;
        limit: number;
        total: number;
        items: Review[];
    }>;
    adminSetStatus(id: string, isActive: boolean): Promise<Review>;
    adminModerate(id: string, status: 'approved' | 'rejected'): Promise<Review>;
    stats(): Promise<{
        total: number;
        average: number;
        distribution: Record<number, number>;
    }>;
}
