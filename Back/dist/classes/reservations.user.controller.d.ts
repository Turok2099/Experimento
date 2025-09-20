import { ReservationsService } from './reservations.service';
export declare class ReservationsUserController {
    private readonly reservations;
    constructor(reservations: ReservationsService);
    myHistory(user: {
        userId: string;
    }, page?: string, limit?: string, status?: 'booked' | 'attended' | 'cancelled' | 'no_show'): Promise<{
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
