import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ProfesorEntity } from '../profesor/profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';

@Entity()
export class ProyectoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column()
  presupuesto: number;

  @Column()
  notaFinal: number;

  @Column()
  estado: number;

  @Column({ type: 'timestamp' })
  fechaInicio: Date;

  @Column({ type: 'timestamp' })
  fechaFin: Date;

  @ManyToOne(() => EstudianteEntity, estudiante => estudiante.proyectos)
  lider: EstudianteEntity;

  @ManyToOne(() => ProfesorEntity, profesor => profesor.mentorias)
  mentor: ProfesorEntity;

  @OneToMany(() => EvaluacionEntity, evaluacion => evaluacion.proyecto)
  evaluaciones: EvaluacionEntity[];
} 