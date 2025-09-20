import { User } from '../../user/entities/user.entity';
export declare class Comment {
    id: string;
    text: string;
    rating: number;
    date: string;
    userId: string;
    user: User;
    createdAt: Date;
}
