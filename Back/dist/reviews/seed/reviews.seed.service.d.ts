import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Reservation } from '../../classes/entities/reservation.entity';
export declare class ReviewsSeedService {
    private readonly reviewsRepo;
    private readonly reservationsRepo;
    constructor(reviewsRepo: Repository<Review>, reservationsRepo: Repository<Reservation>);
    run(maxTotal?: number): Promise<{
        created: number;
        skipped: number;
    }>;
}
