import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>
  ) {}

  async findAll(): Promise<ProyectoEntity[]> {
    return await this.proyectoRepository.find({
      relations: ['lider', 'mentor', 'evaluaciones']
    });
  }

  async findOne(id: number): Promise<ProyectoEntity> {
    const proyecto: ProyectoEntity = await this.proyectoRepository.findOne({
      where: { id },
      relations: ['lider', 'mentor', 'evaluaciones']
    });
    if (!proyecto)
      throw new BusinessLogicException("El proyecto no fue encontrado", BusinessError.NOT_FOUND);
    return proyecto;
  }

  async create(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto <= 0)
      throw new BusinessLogicException("El presupuesto debe ser mayor a 0", BusinessError.PRECONDITION_FAILED);
    if (proyecto.titulo.length <= 15)
      throw new BusinessLogicException("El título debe tener más de 15 caracteres", BusinessError.PRECONDITION_FAILED);
    if (proyecto.fechaFin <= proyecto.fechaInicio)
      throw new BusinessLogicException("La fecha de fin debe ser posterior a la fecha de inicio", BusinessError.PRECONDITION_FAILED);
    return await this.proyectoRepository.save(proyecto);
  }

  async update(id: number, proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    const persistedProyecto: ProyectoEntity = await this.proyectoRepository.findOne({ where: { id } });
    if (!persistedProyecto)
      throw new BusinessLogicException("El proyecto no fue encontrado", BusinessError.NOT_FOUND);
    if (proyecto.presupuesto <= 0)
      throw new BusinessLogicException("El presupuesto debe ser mayor a 0", BusinessError.PRECONDITION_FAILED);
    if (proyecto.titulo.length <= 15)
      throw new BusinessLogicException("El título debe tener más de 15 caracteres", BusinessError.PRECONDITION_FAILED);
    if (proyecto.fechaFin <= proyecto.fechaInicio)
      throw new BusinessLogicException("La fecha de fin debe ser posterior a la fecha de inicio", BusinessError.PRECONDITION_FAILED);
    return await this.proyectoRepository.save({...persistedProyecto, ...proyecto});
  }

  async delete(id: number) {
    const proyecto: ProyectoEntity = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto)
      throw new BusinessLogicException("El proyecto no fue encontrado", BusinessError.NOT_FOUND);
    await this.proyectoRepository.remove(proyecto);
  }

  async avanzarProyecto(id: number): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto)
      throw new BusinessLogicException("El proyecto no fue encontrado", BusinessError.NOT_FOUND);
    if (proyecto.estado >= 4)
      throw new BusinessLogicException("El proyecto ya está en su estado máximo", BusinessError.PRECONDITION_FAILED);
    proyecto.estado += 1;
    return await this.proyectoRepository.save(proyecto);
  }

  async findAllEstudiantes(proyectoId: number): Promise<EstudianteEntity[]> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: proyectoId },
      relations: ['lider']
    });

    if (!proyecto)
      throw new BusinessLogicException("El proyecto no fue encontrado", BusinessError.NOT_FOUND);

    return [proyecto.lider];
  }
} 