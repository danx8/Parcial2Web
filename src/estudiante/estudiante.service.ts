import { Injectable } from '@nestjs/common';
import { EstudianteEntity } from './estudiante.entity';

@Injectable()
export class EstudianteService {
  private estudiantes: EstudianteEntity[] = [];
  private nextId = 1;

  async crearEstudiante(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    if (estudiante.promedio <= 3.2) {
      throw new Error('El promedio debe ser mayor a 3.2');
    }
    if (estudiante.semestre < 4) {
      throw new Error('El semestre debe ser mayor o igual a 4');
    }
    
    estudiante.id = this.nextId++;
    this.estudiantes.push(estudiante);
    return estudiante;
  }

  async eliminarEstudiante(id: number): Promise<void> {
    const index = this.estudiantes.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Estudiante no encontrado');
    }

    const estudiante = this.estudiantes[index];
    const proyectosActivos = estudiante.proyectos?.filter(p => p.estado < 4) || [];
    
    if (proyectosActivos.length > 0) {
      throw new Error('No se puede eliminar un estudiante con proyectos activos');
    }

    this.estudiantes.splice(index, 1);
  }

  async findOne(id: number): Promise<EstudianteEntity | undefined> {
    return this.estudiantes.find(e => e.id === id);
  }

  async findAll(): Promise<EstudianteEntity[]> {
    return this.estudiantes;
  }
} 