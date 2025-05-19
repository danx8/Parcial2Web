import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async findAll(): Promise<EvaluacionEntity[]> {
    return await this.evaluacionRepository.find({
      relations: ['proyecto', 'evaluador']
    });
  }

  async findOne(id: number): Promise<EvaluacionEntity> {
    const evaluacion = await this.evaluacionRepository.findOne({
      where: { id },
      relations: ['proyecto', 'evaluador']
    });
    if (!evaluacion)
      throw new BusinessLogicException("La evaluación no fue encontrada", BusinessError.NOT_FOUND);
    return evaluacion;
  }

  async create(evaluacion: EvaluacionEntity): Promise<EvaluacionEntity> {
    if (evaluacion.notaFinal < 0 || evaluacion.notaFinal > 5)
      throw new BusinessLogicException("La nota debe estar entre 0 y 5", BusinessError.PRECONDITION_FAILED);
    return await this.evaluacionRepository.save(evaluacion);
  }

  async update(id: number, evaluacion: EvaluacionEntity): Promise<EvaluacionEntity> {
    const persistedEvaluacion = await this.evaluacionRepository.findOne({ where: { id } });
    if (!persistedEvaluacion)
      throw new BusinessLogicException("La evaluación no fue encontrada", BusinessError.NOT_FOUND);
    if (evaluacion.notaFinal < 0 || evaluacion.notaFinal > 5)
      throw new BusinessLogicException("La nota debe estar entre 0 y 5", BusinessError.PRECONDITION_FAILED);
    return await this.evaluacionRepository.save({...persistedEvaluacion, ...evaluacion});
  }

  async delete(id: number) {
    const evaluacion = await this.evaluacionRepository.findOne({ where: { id } });
    if (!evaluacion)
      throw new BusinessLogicException("La evaluación no fue encontrada", BusinessError.NOT_FOUND);
    await this.evaluacionRepository.remove(evaluacion);
  }

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