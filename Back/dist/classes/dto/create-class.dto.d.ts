import type { GoalTag } from '../entities/class.entity';
export declare class CreateClassDto {
    trainerId: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    capacity?: number;
    goalTag?: GoalTag;
    coach?: string[];
    isActive?: boolean;
}
