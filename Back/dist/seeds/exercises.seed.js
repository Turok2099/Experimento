"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedExercises = seedExercises;
const exercise_entity_1 = require("../exercises/entities/exercise.entity");
const exercise_mocks_1 = require("./exercise-mocks");
async function seedExercises(dataSource) {
    const repo = dataSource.getRepository(exercise_entity_1.Exercise);
    const max = exercise_mocks_1.muscleGroupsMax.map(e => ({
        name: e.nombre,
        muscleGroup: e.grupoMuscular,
        series: e.series,
        repetitions: e.repeticiones,
        type: null,
        programTag: 'max',
        isActive: true,
    }));
    const hyper = exercise_mocks_1.muscleGroupsHyper.map(e => ({
        name: e.nombre,
        muscleGroup: e.grupoMuscular,
        series: e.series,
        repetitions: e.repeticiones,
        type: null,
        programTag: 'hyper',
        isActive: true,
    }));
    const cardio = exercise_mocks_1.cardioActivities.map(e => ({
        name: e.nombre,
        muscleGroup: 'Cardio',
        series: null,
        repetitions: null,
        type: e.tipo,
        programTag: null,
        isActive: true,
    }));
    await repo.save([...max, ...hyper, ...cardio]);
    console.log(`✅ Exercises seeded: ${max.length + hyper.length + cardio.length}`);
}
//# sourceMappingURL=exercises.seed.js.map