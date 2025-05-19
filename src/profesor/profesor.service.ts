import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorEntity } from './profesor.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
  ) {}

  async findAll(): Promise<ProfesorEntity[]> {
    return await this.profesorRepository.find({ relations: ['mentorias'] });
  }

  async findOne(id: number): Promise<ProfesorEntity> {
    const profesor: ProfesorEntity = await this.profesorRepository.findOne({
      where: { id },
      relations: ['mentorias']
    });
    if (!profesor)
      throw new BusinessLogicException("El profesor no fue encontrado", BusinessError.NOT_FOUND);
    return profesor;
  }

  async create(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    const extensionStr = profesor.extension.toString();
    if (extensionStr.length !== 5) {
      throw new BusinessLogicException("La extensión debe tener exactamente 5 dígitos", BusinessError.PRECONDITION_FAILED);
    }
    return await this.profesorRepository.save(profesor);
  }

  async update(id: number, profesor: ProfesorEntity): Promise<ProfesorEntity> {
    const persistedProfesor: ProfesorEntity = await this.profesorRepository.findOne({ where: { id } });
    if (!persistedProfesor)
      throw new BusinessLogicException("El profesor no fue encontrado", BusinessError.NOT_FOUND);
    return await this.profesorRepository.save({...persistedProfesor, ...profesor});
  }

  async delete(id: number) {
    const profesor: ProfesorEntity = await this.profesorRepository.findOne({ where: { id } });
    if (!profesor)
      throw new BusinessLogicException("El profesor no fue encontrado", BusinessError.NOT_FOUND);
    await this.profesorRepository.remove(profesor);
  }

  async asignarEvaluador(profesorId: number): Promise<ProfesorEntity> {
    const profesor = await this.profesorRepository.findOne({
      where: { id: profesorId },
      relations: ['evaluaciones'],
    });

    if (!profesor) {
      throw new BusinessLogicException("El profesor no fue encontrado", BusinessError.NOT_FOUND);
    }

    const evaluacionesActivas = profesor.evaluaciones.length;
    if (evaluacionesActivas >= 3) {
      throw new BusinessLogicException("El profesor ya tiene 3 o más evaluaciones activas", BusinessError.PRECONDITION_FAILED);
    }

    profesor.esParEvaluador = true;
    return await this.profesorRepository.save(profesor);
  }
} 