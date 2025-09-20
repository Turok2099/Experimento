import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/loging.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleTokenDto } from './dto/google.dto';
import { JwtService } from '@nestjs/jwt';
import type { Response, Request } from 'express';
import { GoogleCompleteDto } from './dto/google-complete.dto';
export declare class AuthController {
    private readonly auth;
    private readonly jwt;
    constructor(auth: AuthService, jwt: JwtService);
    private setRefreshCookie;
    register(dto: RegisterDto, res: Response): Promise<{
        user: import("./types").PublicUser;
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: import("./types").PublicUser;
        accessToken: string;
    }>;
    google({ idToken }: GoogleTokenDto, res: Response): Promise<{
        user: import("./types").PublicUser;
        accessToken: string;
    }>;
    googleComplete(dto: GoogleCompleteDto, res: Response): Promise<{
        user: import("./types").PublicUser;
        accessToken: string;
        needsCompletion: boolean;
    }>;
    forgot(dto: ForgotPasswordDto): Promise<{
        accepted: boolean;
    }>;
    reset(dto: ResetPasswordDto): Promise<{
        updated: boolean;
    }>;
    refresh(req: Request, res: Response): Promise<{
        error: string;
        accessToken?: undefined;
    } | {
        accessToken: string;
        error?: undefined;
    }>;
    logout(req: Request, res: Response): Promise<void>;
}
