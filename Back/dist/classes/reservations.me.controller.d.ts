import { ReservationsService } from './reservations.service';
import { GetMyReservationsDto } from './dto/get-my-reservations.dto';
export declare class ReservationsMeController {
    private readonly reservations;
    constructor(reservations: ReservationsService);
    getMine(user: {
        userId?: string;
        id?: string;
        sub?: string;
    }, q: GetMyReservationsDto): Promise<{
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
