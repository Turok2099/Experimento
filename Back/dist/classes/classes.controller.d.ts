import { ClassesService } from './classes.service';
import { ScheduleQueryDto } from './dto/schedule-query.dto';
import { AdminClassesQueryDto } from './dto/admin-classes-query.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { UpdateClassStatusDto } from './dto/update-class-status.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from './entities/class.entity';
import { AdminAssignTrainerDto } from './dto/admin-assign-trainer.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
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
    myAgenda(user: {
        userId: string;
    }, q: ScheduleQueryDto): Promise<{
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
    findByDay(day: string): Promise<Class[]>;
    classReservations(user: {
        userId: string;
        role: string;
    }, id: string): Promise<{
        reservationId: string;
        userId: string;
        status: import("./entities/reservation.entity").ReservationStatus;
        createdAt: Date;
    }[]>;
    create(createClassDto: CreateClassDto): Promise<Class>;
    adminUpdate(id: string, dto: UpdateClassDto): Promise<Class>;
    adminSetStatus(id: string, dto: UpdateClassStatusDto): Promise<{
        id: string;
        isActive: boolean;
    }>;
    findById(id: string): Promise<Class>;
    adminAssignTrainer(id: string, dto: AdminAssignTrainerDto): Promise<{
        ok: boolean;
        data: Class;
    }>;
    adminToggle(id: string, dto: UpdateClassStatusDto): Promise<{
        ok: boolean;
        data: {
            id: string;
            isActive: boolean;
        };
    }>;
}
