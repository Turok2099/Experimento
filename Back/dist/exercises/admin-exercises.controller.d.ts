import { ExercisesService } from './exercises.service';
import { ListExercisesDto } from './dto/list-exercise.dto';
import { ToggleExerciseDto } from './dto/toggle-exercise.dto';
export declare class AdminExercisesController {
    private readonly svc;
    constructor(svc: ExercisesService);
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
    toggle(id: string, dto: ToggleExerciseDto): Promise<{
        ok: boolean;
        data: {
            id: string;
            isActive: boolean;
        };
    }>;
}
