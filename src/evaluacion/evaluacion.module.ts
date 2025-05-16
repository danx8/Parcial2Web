import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { EvaluacionService } from './evaluacion.service';
import { ProyectoEntity } from '../proyecto/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluacionEntity, ProyectoEntity])],
  providers: [EvaluacionService],
  exports: [EvaluacionService],
})
export class EvaluacionModule {} 