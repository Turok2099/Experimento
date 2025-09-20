import { PlansService } from './plans.service';
import { UpdatePlanDto } from './dto/update-plan-dto';
import { CreatePlanDto } from './dto/create-plan-dto';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    findAll(): Promise<import("./entities/plan.entity").Plan[] | {
        message: string;
    }>;
    findOne(id: string): Promise<import("./entities/plan.entity").Plan>;
    update(id: string, dto: UpdatePlanDto): Promise<import("./entities/plan.entity").Plan>;
    remove(id: string): Promise<import("./entities/plan.entity").Plan>;
    create(dto: CreatePlanDto): Promise<import("./entities/plan.entity").Plan>;
}
