import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async crearEvaluacion(evaluacion: EvaluacionEntity): Promise<EvaluacionEntity> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: evaluacion.proyecto.id },
      relations: ['mentor'],
    });

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    if (evaluacion.evaluador.id === proyecto.mentor.id) {
      throw new Error('El evaluador no puede ser el mismo que el mentor');
    }

    if (evaluacion.notaFinal < 0 || evaluacion.notaFinal > 5) {
      throw new Error('La calificación debe estar entre 0 y 5');
    }

    return await this.evaluacionRepository.save(evaluacion);
  }
} 