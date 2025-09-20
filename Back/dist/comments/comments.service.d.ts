import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UsersService } from '../user/users.service';
export declare class CommentService {
    private commentRepository;
    private userService;
    constructor(commentRepository: Repository<Comment>, userService: UsersService);
    create(userId: string, createCommentDto: CreateCommentDto): Promise<Comment>;
    findByUser(userId: string): Promise<CommentResponseDto[]>;
    findAll(): Promise<CommentResponseDto[]>;
}
