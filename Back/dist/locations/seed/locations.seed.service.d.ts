import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
export declare class LocationsSeedService {
    private readonly repo;
    private readonly logger;
    constructor(repo: Repository<Location>);
    run(): Promise<void>;
}
