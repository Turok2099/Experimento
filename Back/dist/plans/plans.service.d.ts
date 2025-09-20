import { Plan } from "./entities/plan.entity";
import { Repository } from "typeorm";
import { CreatePlanDto } from "./dto/create-plan-dto";
import { UpdatePlanDto } from "./dto/update-plan-dto";
export declare class PlansService {
    private readonly planRepository;
    constructor(planRepository: Repository<Plan>);
    create(dto: CreatePlanDto): Promise<Plan>;
    findAll(): Promise<Plan[] | {
        message: string;
    }>;
    findOne(id: string): Promise<Plan>;
    update(id: string, dto: UpdatePlanDto): Promise<Plan>;
    remove(id: string): Promise<Plan>;
}
