import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { ListExercisesDto } from './dto/list-exercise.dto';
export declare class ExercisesService {
    private readonly repo;
    constructor(repo: Repository<Exercise>);
    private toNum;
    list(q: ListExercisesDto): Promise<{
        ok: boolean;
        total: number;
        page: number;
        limit: number;
        data: {
            id: string;
            isActive: boolean;
            nombre: string;
            series: number | undefined;
            repeticiones: number | undefined;
            grupoMuscular: string;
            tipo: string | undefined;
            programTag: "max" | "hyper" | undefined;
        }[];
    }>;
    toggle(id: string, isActive: boolean): Promise<{
        ok: boolean;
        data: {
            id: string;
            isActive: boolean;
        };
    }>;
}
