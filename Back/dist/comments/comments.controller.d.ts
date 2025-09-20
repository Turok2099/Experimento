import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(req: any, createCommentDto: CreateCommentDto): Promise<import("./entities/comment.entity").Comment>;
    getMyComments(req: any): Promise<CommentResponseDto[]>;
    findAll(): Promise<CommentResponseDto[]>;
}
