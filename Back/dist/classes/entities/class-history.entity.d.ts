import { Class } from './class.entity';
import { User } from '../../user/entities/user.entity';
export type ClassHistoryStatus = 'attended' | 'missed' | 'cancelled';
export declare class ClassHistory {
    id: string;
    class: Class;
    classId: string;
    user: User;
    userId: string;
    status: ClassHistoryStatus;
    createdAt: Date;
}
