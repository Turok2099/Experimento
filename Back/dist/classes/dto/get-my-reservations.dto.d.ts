export type ReservationStatus = 'booked' | 'attended' | 'cancelled' | 'no_show';
export declare class GetMyReservationsDto {
    page?: number;
    limit?: number;
    status?: ReservationStatus;
}
