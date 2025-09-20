import { ClassHistoryService } from './class-history.service';
import { ClassHistoryResponseDto } from './dto/class-history-response.dto';
import { CreateClassHistoryDto } from './dto/create-class-history.dto';
export declare class ClassHistoryController {
    private readonly classHistoryService;
    constructor(classHistoryService: ClassHistoryService);
    create(req: any, createClassHistoryDto: CreateClassHistoryDto): Promise<import("./entities/class-history.entity").ClassHistory>;
    getMyHistory(req: any): Promise<ClassHistoryResponseDto[]>;
}
