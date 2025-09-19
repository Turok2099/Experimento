import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { connectionSource } from '../config/typeorm';          
import { seedExercises } from './exercises.seed';
import { Exercise } from '../exercises/entities/exercise.entity'; 

async function run() {
  connectionSource.setOptions({
    entities: [Exercise],       
    migrations: [],          
  } as any);

  await connectionSource.initialize();
  await seedExercises(connectionSource as DataSource);
  await connectionSource.destroy();
  console.log('✅ Done.');
}

run().catch((err) => {
  console.error('❌ Error seeding', err);
  process.exit(1);
});
