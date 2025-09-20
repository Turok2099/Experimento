import { Repository } from 'typeorm';
import { ClassHistory } from './entities/class-history.entity';
import { Class } from './entities/class.entity';
export type ClassHistoryResponseDto = {
    id: string;
    class: string;
    date: string;
};
export declare class ClassHistoryService {
    private readonly classHistoryRepository;
    private readonly classesRepo;
    constructor(classHistoryRepository: Repository<ClassHistory>, classesRepo: Repository<Class>);
    add(userId: string, classId: string, status?: 'attended' | 'missed' | 'cancelled'): Promise<ClassHistory>;
    listForUser(userId: string): Promise<ClassHistoryResponseDto[]>;
    create(userId: string, dto: {
        classId: string;
        status?: 'attended' | 'missed' | 'cancelled';
    } | any): Promise<ClassHistory>;
    findByUser(userId: string): Promise<ClassHistoryResponseDto[]>;
}
