import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Reservation } from './entities/reservation.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
type ReservationStatus = 'booked' | 'cancelled' | 'attended' | 'no_show';
export declare class ReservationsService {
    private readonly classesRepo;
    private readonly resRepo;
    private readonly subs;
    constructor(classesRepo: Repository<Class>, resRepo: Repository<Reservation>, subs: SubscriptionsService);
    book(userId: string, classId: string): Promise<{
        reservationId: string;
        classId: string;
        title: string;
        date: string;
        startTime: string;
        endTime: string;
        trainer: {
            id: string;
        };
        status: import("./entities/reservation.entity").ReservationStatus;
        createdAt: Date;
    }>;
    cancelMine(userId: string, classId: string): Promise<{
        reservationId: string;
        status: import("./entities/reservation.entity").ReservationStatus;
    }>;
    setStatusAsTrainerOrAdmin(user: {
        userId: string;
        role: string;
    }, classId: string, reservationId: string, status: ReservationStatus): Promise<{
        reservationId: string;
        status: import("./entities/reservation.entity").ReservationStatus;
    }>;
    userHistory(userId: string, page?: number, limit?: number, status?: ReservationStatus): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            reservationId: string;
            status: import("./entities/reservation.entity").ReservationStatus;
            createdAt: Date;
            class: {
                id: string;
                title: string;
                date: string;
                startTime: string;
                endTime: string;
                trainerId: string;
            } | null;
        }[];
    }>;
    findByUser(userId: string, q: {
        page?: number;
        limit?: number;
        status?: ReservationStatus;
    }): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            reservationId: string;
            status: import("./entities/reservation.entity").ReservationStatus;
            createdAt: Date;
            class: {
                id: string;
                title: string;
                date: string;
                startTime: string;
                endTime: string;
                trainerId: string;
            } | null;
        }[];
    }>;
}
export {};
