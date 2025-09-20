import { ReviewsService } from './reviews.service';
import { ReviewsQueryDto } from './dto/reviews-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto, UpdateReviewStatusDto, ModerateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviews;
    constructor(reviews: ReviewsService);
    list(q: ReviewsQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: import("./entities/review.entity").Review[];
    }>;
    my(user: {
        userId: string;
    }, q: ReviewsQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: import("./entities/review.entity").Review[];
    }>;
    create(user: {
        userId: string;
    }, dto: CreateReviewDto): Promise<import("./entities/review.entity").Review>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateReviewDto): Promise<import("./entities/review.entity").Review>;
    remove(user: {
        userId: string;
    }, id: string): Promise<import("./entities/review.entity").Review>;
    adminList(q: any): Promise<{
        page: number;
        limit: number;
        total: number;
        items: import("./entities/review.entity").Review[];
    }>;
    adminSetStatus(id: string, dto: UpdateReviewStatusDto): Promise<import("./entities/review.entity").Review>;
    moderate(id: string, dto: ModerateReviewDto): Promise<import("./entities/review.entity").Review>;
    stats(): Promise<{
        total: number;
        average: number;
        distribution: Record<number, number>;
    }>;
}
