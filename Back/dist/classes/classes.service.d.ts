import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Reservation } from './entities/reservation.entity';
import { ScheduleQueryDto } from './dto/schedule-query.dto';
import { AdminClassesQueryDto } from './dto/admin-classes-query.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { User } from '../user/entities/user.entity';
export declare class ClassesService {
    private readonly classesRepo;
    private readonly resRepo;
    private readonly usersRepo;
    constructor(classesRepo: Repository<Class>, resRepo: Repository<Reservation>, usersRepo: Repository<User>);
    create(dto: CreateClassDto): Promise<Class>;
    findAll(): Promise<{
        id: string;
        name: string;
        title: string;
        date: string;
        startTime: string;
        endTime: string;
        dayOfWeek: import("./entities/class.entity").DayOfWeek | null;
        coach: string[];
        capacity: number;
        createdAt: Date;
    }[]>;
    findByDay(dayOfWeek: string): Promise<Class[]>;
    findById(id: string): Promise<Class>;
    schedule(q: ScheduleQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            id: string;
            title: string;
            date: string;
            startTime: string;
            endTime: string;
            capacity: number;
            occupied: number;
            available: number;
            goalTag: import("./entities/class.entity").GoalTag | null;
            trainerId: string;
        }[];
    }>;
    getActiveClassOrThrow(classId: string): Promise<Class>;
    adminList(q: AdminClassesQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            id: string;
            title: string;
            date: string;
            startTime: string;
            endTime: string;
            capacity: number;
            occupied: number;
            available: number;
            goalTag: import("./entities/class.entity").GoalTag | null;
            trainerId: string;
        }[];
    }>;
    adminUpdate(id: string, dto: UpdateClassDto): Promise<Class>;
    adminSetStatus(id: string, isActive: boolean): Promise<{
        id: string;
        isActive: boolean;
    }>;
    classReservationsFor(user: {
        userId: string;
        role: string;
    }, classId: string): Promise<{
        reservationId: string;
        userId: string;
        status: import("./entities/reservation.entity").ReservationStatus;
        createdAt: Date;
    }[]>;
    adminToggle(id: string, isActive: boolean): Promise<{
        id: string;
        isActive: boolean;
    }>;
    adminAssignTrainer(id: string, trainerId: string): Promise<Class>;
}
