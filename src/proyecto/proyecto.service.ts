import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async crearProyecto(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto <= 0) {
      throw new Error('El presupuesto debe ser mayor a 0');
    }
    if (proyecto.titulo.length <= 15) {
      throw new Error('El título debe tener más de 15 caracteres');
    }
    return await this.proyectoRepository.save(proyecto);
  }

  async avanzarProyecto(id: number): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
    });

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    if (proyecto.estado >= 4) {
      throw new Error('El proyecto ya está en su estado máximo');
    }

    proyecto.estado += 1;
    return await this.proyectoRepository.save(proyecto);
  }

  async findAllEstudiantes(proyectoId: number): Promise<EstudianteEntity[]> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: proyectoId },
      relations: ['lider'],
    });

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    return [proyecto.lider]; // En este caso solo retornamos el líder ya que es la única relación con estudiantes
  }
} 