// src/exercises/exercises.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { ListExercisesDto } from './dto/list-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(@InjectRepository(Exercise) private readonly repo: Repository<Exercise>) {}

  private toNum(v: unknown, def: number) {
    if (v === undefined || v === null || v === '') return def;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : def;
  }

  async list(q: ListExercisesDto) {
    const page = this.toNum((q as any).page, 1);
    const limit = this.toNum((q as any).limit, 20);

    const where: any = {};
    if (q.q) where.name = ILike(`%${q.q}%`);
    if (q.muscleGroup) where.muscleGroup = q.muscleGroup;
    if (q.type) where.type = q.type;
    if (q.programTag) where.programTag = q.programTag;
    if (typeof q.isActive === 'string') where.isActive = q.isActive === 'true';

    const [rows, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Mapear a las claves del mock del front
    const data = rows.map(e => ({
      id: e.id,
      isActive: e.isActive,
      nombre: e.name,
      series: e.series ?? undefined,
      repeticiones: e.repetitions ?? undefined,
      grupoMuscular: e.muscleGroup,
      tipo: e.type ?? undefined,
      programTag: e.programTag ?? undefined,
    }));

    return { ok: true, total, page, limit, data };
  }

  async toggle(id: string, isActive: boolean) {
    const ex = await this.repo.findOne({ where: { id } });
    if (!ex) throw new NotFoundException('Ejercicio no encontrado');
    ex.isActive = isActive;
    const saved = await this.repo.save(ex);
    return { ok: true, data: { id: saved.id, isActive: saved.isActive } };
  }
}
