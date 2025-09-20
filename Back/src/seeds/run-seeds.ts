import "reflect-metadata";
import { DataSource } from "typeorm";
import { connectionSource } from "../config/typeorm";
import { seedExercises } from "./exercises.seed";
import { Exercise } from "../exercises/entities/exercise.entity";

async function run() {
  const connection = await connectionSource.initialize();
  
  connection.setOptions({
    entities: [Exercise],       
    migrations: [],          
  } as any);

  await seedExercises(connection as DataSource);
  console.log("✅ Done.");
}

run().catch((err) => {
  console.error("❌ Error seeding", err);
  process.exit(1);
});
