import { DataSource } from 'typeorm';
import { Exercise } from '../exercises/entities/exercise.entity';
import { muscleGroupsMax, muscleGroupsHyper, cardioActivities } from './exercise-mocks';

export async function seedExercises(dataSource: DataSource) {
  const repo = dataSource.getRepository(Exercise);

  const max = muscleGroupsMax.map(e => ({
    name: e.nombre,
    muscleGroup: e.grupoMuscular,
    series: e.series,
    repetitions: e.repeticiones,
    type: null,
    programTag: 'max' as const,
    isActive: true,
  }));

  const hyper = muscleGroupsHyper.map(e => ({
    name: e.nombre,
    muscleGroup: e.grupoMuscular,
    series: e.series,
    repetitions: e.repeticiones,
    type: null,
    programTag: 'hyper' as const,
    isActive: true,
  }));

  const cardio = cardioActivities.map(e => ({
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
