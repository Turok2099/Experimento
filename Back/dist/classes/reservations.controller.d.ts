import { ReservationsService } from './reservations.service';
declare class UpdateReservationStatusDto {
    status: 'attended' | 'no_show' | 'cancelled';
}
export declare class ReservationsController {
    private readonly reservations;
    constructor(reservations: ReservationsService);
    book(user: {
        userId: string;
    }, classId: string): Promise<{
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
    cancelMine(user: {
        userId: string;
    }, classId: string): Promise<{
        reservationId: string;
        status: import("./entities/reservation.entity").ReservationStatus;
    }>;
    setStatus(user: {
        userId: string;
        role: string;
    }, classId: string, reservationId: string, dto: UpdateReservationStatusDto): Promise<{
        reservationId: string;
        status: import("./entities/reservation.entity").ReservationStatus;
    }>;
}
export {};
