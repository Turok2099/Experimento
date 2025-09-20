export declare class ScheduleQueryDto {
    goal?: string;
    date?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
    trainerId?: string;
    page?: number;
    limit?: number;
}
