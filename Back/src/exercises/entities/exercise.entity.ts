import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export type ProgramTag = 'max' | 'hyper' | null;

@Entity({ name: 'exercises' })
@Index(['muscleGroup', 'name'])
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;                            // <- mock: nombre

  @Column({ name: 'muscle_group', length: 50 })
  muscleGroup: string;                     // <- mock: grupoMuscular (Pecho/Espalda/.../Core/Cardio)

  @Column({ type: 'int', nullable: true })
  series: number | null;                   // <- mock: series

  @Column({ type: 'int', nullable: true })
  repetitions: number | null;              // <- mock: repeticiones

  @Column({ type: 'varchar', length: 30, nullable: true })
  type: string | null;                     // <- mock: tipo ("Máquina" | "Clase" | null)

  @Column({ name: 'program_tag', type: 'varchar', length: 10, nullable: true })
  programTag: ProgramTag;                  // 'max' | 'hyper' | null (para diferenciar los sets)

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
