import { Class } from './class.entity';
import { User } from '../../user/entities/user.entity';
export type ReservationStatus = 'booked' | 'cancelled' | 'attended' | 'no_show';
export declare class Reservation {
    id: string;
    class: Class;
    classId: string;
    user: User;
    userId: string;
    status: ReservationStatus;
    createdAt: Date;
}
