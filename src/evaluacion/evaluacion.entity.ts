import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { ProfesorEntity } from '../profesor/profesor.entity';

@Entity()
export class EvaluacionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  notaFinal: number;

  @Column()
  retroalimentacion: string;

  @ManyToOne(() => ProyectoEntity, proyecto => proyecto.evaluaciones)
  proyecto: ProyectoEntity;

  @ManyToOne(() => ProfesorEntity, profesor => profesor.evaluaciones)
  evaluador: ProfesorEntity;
} 