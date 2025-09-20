export type ProgramTag = 'max' | 'hyper' | null;
export declare class Exercise {
    id: string;
    name: string;
    muscleGroup: string;
    series: number | null;
    repetitions: number | null;
    type: string | null;
    programTag: ProgramTag;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
