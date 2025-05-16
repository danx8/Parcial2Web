import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async crearEstudiante(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    if (estudiante.promedio <= 3.2) {
      throw new Error('El promedio debe ser mayor a 3.2');
    }
    if (estudiante.semestre < 4) {
      throw new Error('El semestre debe ser mayor o igual a 4');
    }
    return await this.estudianteRepository.save(estudiante);
  }

  async eliminarEstudiante(id: number): Promise<void> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });
    
    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    const proyectosActivos = estudiante.proyectos.filter(p => p.estado < 4);
    if (proyectosActivos.length > 0) {
      throw new Error('No se puede eliminar un estudiante con proyectos activos');
    }

    await this.estudianteRepository.remove(estudiante);
  }
} 