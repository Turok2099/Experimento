"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("../config/typeorm");
const exercises_seed_1 = require("./exercises.seed");
const exercise_entity_1 = require("../exercises/entities/exercise.entity");
async function run() {
    const connection = await typeorm_1.connectionSource.initialize();
    connection.setOptions({
        entities: [exercise_entity_1.Exercise],
        migrations: [],
    });
    await (0, exercises_seed_1.seedExercises)(connection);
    console.log("✅ Done.");
}
run().catch((err) => {
    console.error("❌ Error seeding", err);
    process.exit(1);
});
//# sourceMappingURL=run-seeds.js.map