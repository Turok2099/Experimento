import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ExercisesService } from './exercises.service';
import { ListExercisesDto } from './dto/list-exercise.dto';
import { ToggleExerciseDto } from './dto/toggle-exercise.dto';

@ApiTags('Admin - Exercises')
@ApiBearerAuth()
@Controller('admin/exercises')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminExercisesController {
  constructor(private readonly svc: ExercisesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar ejercicios (admin)' })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'muscleGroup', required: false, type: String, example: 'Pecho' })
  @ApiQuery({ name: 'type', required: false, type: String, example: 'Máquina' })
  @ApiQuery({ name: 'programTag', required: false, enum: ['max','hyper'] })
  @ApiQuery({ name: 'isActive', required: false, type: String, example: 'true' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiOkResponse({ description: 'Listado mapeado con las claves del mock (nombre, series, repeticiones, grupoMuscular, tipo)' })
  list(@Query() q: ListExercisesDto) { return this.svc.list(q); }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Activar/Desactivar ejercicio' })
  @ApiOkResponse({ description: 'Estado actualizado' })
  toggle(@Param('id') id: string, @Body() dto: ToggleExerciseDto) { return this.svc.toggle(id, dto.isActive); }
}
