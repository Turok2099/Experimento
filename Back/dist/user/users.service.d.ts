import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findMe(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: UserRole;
        isBlocked: boolean;
        address: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            isBlocked: boolean;
            address: string | null;
            phone: string | null;
            createdAt: Date;
        }[];
    }>;
    updateRole(id: string, role: UserRole): Promise<{
        id: string;
        name: string;
        email: string;
        role: UserRole;
        isBlocked: boolean;
        address: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
    updateStatus(id: string, isBlocked: boolean): Promise<{
        id: string;
        name: string;
        email: string;
        role: UserRole;
        isBlocked: boolean;
        address: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
    private ensureExists;
    private publicUser;
    findById(id: string): Promise<User>;
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        address: string | null;
        phone: string | null;
    }>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string | null;
        phone: string | null;
    }>;
    updateUser(id: string, updateUserDto: Partial<{
        name: string;
        email: string;
        phone: string;
        address: string;
    }>): Promise<{
        id: string;
        name: string;
        email: string;
        role: UserRole;
        isBlocked: boolean;
        address: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
}
