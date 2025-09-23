import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { ExercisesService } from './exercises.service';
import { AdminExercisesController } from './admin-exercises.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  controllers: [AdminExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
