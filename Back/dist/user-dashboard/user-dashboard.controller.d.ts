import { UsersService } from '../user/users.service';
import { CommentService } from '../comments/comments.service';
import { ClassesService } from '../classes/classes.service';
import { ClassHistoryService } from '../classes/class-history.service';
import { DashboardDataDto } from './dto/user-dashboard-data.dto';
export declare class DashboardController {
    private readonly userService;
    private readonly commentService;
    private readonly classService;
    private readonly classHistoryService;
    constructor(userService: UsersService, commentService: CommentService, classService: ClassesService, classHistoryService: ClassHistoryService);
    getDashboardData(req: any): Promise<DashboardDataDto>;
}
