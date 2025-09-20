import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/loging.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailsService } from '../emails/emails.service';
import { AuthResponse, AuthTokens } from './types';
export declare class AuthService {
    private readonly usersRepo;
    private readonly jwt;
    private readonly emails;
    private readonly logger;
    constructor(usersRepo: Repository<User>, jwt: JwtService, emails: EmailsService);
    private hash;
    private signTokens;
    private publicUser;
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    refresh(userId: string, refreshToken: string): Promise<AuthTokens>;
    revokeRefresh(userId: string): Promise<{
        revoked: boolean;
    }>;
    me(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("../user/entities/user.entity").UserRole;
        isBlocked: boolean;
        address: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        accepted: boolean;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        updated: boolean;
    }>;
    googleLogin(idToken: string): Promise<AuthResponse>;
    completeGoogleRegistration(dto: {
        email: string;
        address: string;
        phone: string;
    }): Promise<AuthResponse & {
        needsCompletion: boolean;
    }>;
    syncGoogleUser(dto: {
        email: string;
        name: string;
    }): Promise<AuthResponse>;
}
