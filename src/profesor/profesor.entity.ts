import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';

@Entity()
export class ProfesorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  departamento: string;

  @Column()
  facultad: string;

  @Column()
  extension: number;

  @Column()
  esParEvaluador: boolean;

  @OneToMany(() => ProyectoEntity, proyecto => proyecto.mentor)
  mentorias: ProyectoEntity[];

  @OneToMany(() => EvaluacionEntity, evaluacion => evaluacion.evaluador)
  evaluaciones: EvaluacionEntity[];
} 