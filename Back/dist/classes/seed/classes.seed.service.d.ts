import { Repository } from 'typeorm';
import { Class } from '../entities/class.entity';
import { User } from '../../user/entities/user.entity';
export declare class ClassesSeedService {
    private readonly classesRepo;
    private readonly usersRepo;
    private readonly log;
    constructor(classesRepo: Repository<Class>, usersRepo: Repository<User>);
    run(): Promise<void>;
    private offsetDate;
}
