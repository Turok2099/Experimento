import { User } from '../../user/entities/user.entity';
import { ClassHistory } from './class-history.entity';
export type GoalTag = 'weight_loss' | 'definition' | 'muscle_gain' | 'mobility' | 'cardio';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export declare class Class {
    id: string;
    trainer: User;
    trainerId: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    dayOfWeek: DayOfWeek | null;
    capacity: number;
    goalTag: GoalTag | null;
    isActive: boolean;
    coach: string[] | null;
    createdAt: Date;
    updatedAt: Date;
    classHistories: ClassHistory[];
    calculateDayOfWeek(): DayOfWeek | null;
    setDateWithDayOfWeek(date: string): void;
}
