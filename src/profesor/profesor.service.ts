import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorEntity } from './profesor.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
  ) {}

  async crearProfesor(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    const extensionStr = profesor.extension.toString();
    if (extensionStr.length !== 5) {
      throw new Error('La extensión debe tener exactamente 5 dígitos');
    }
    return await this.profesorRepository.save(profesor);
  }

  async asignarEvaluador(profesorId: number): Promise<ProfesorEntity> {
    const profesor = await this.profesorRepository.findOne({
      where: { id: profesorId },
      relations: ['evaluaciones'],
    });

    if (!profesor) {
      throw new Error('Profesor no encontrado');
    }

    const evaluacionesActivas = profesor.evaluaciones.length;
    if (evaluacionesActivas >= 3) {
      throw new Error('El profesor ya tiene 3 o más evaluaciones activas');
    }

    profesor.esParEvaluador = true;
    return await this.profesorRepository.save(profesor);
  }
} 