import { UsersService } from './users.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ReservationsService } from '../classes/reservations.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly users;
    private readonly reservationsService;
    constructor(users: UsersService, reservationsService: ReservationsService);
    myHistory(user: {
        userId: string;
    }, page?: string, limit?: string): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            reservationId: string;
            status: import("../classes/entities/reservation.entity").ReservationStatus;
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
    getProfile(req: any): Promise<UserProfileDto>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<UserProfileDto>;
    findAll(page?: string, limit?: string): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            id: string;
            name: string;
            email: string;
            role: import("./entities/user.entity").UserRole;
            isBlocked: boolean;
            address: string | null;
            phone: string | null;
            createdAt: Date;
        }[];
    }>;
    updateRole(id: string, dto: UpdateRoleDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("./entities/user.entity").UserRole;
        isBlocked: boolean;
        address: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("./entities/user.entity").UserRole;
        isBlocked: boolean;
        address: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
}
