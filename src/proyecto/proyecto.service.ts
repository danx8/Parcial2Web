import { Injectable } from '@nestjs/common';
import { ProyectoEntity } from './proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

@Injectable()
export class ProyectoService {
  private proyectos: ProyectoEntity[] = [];
  private nextId = 1;

  async crearProyecto(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto <= 0) {
      throw new Error('El presupuesto debe ser mayor a 0');
    }
    if (proyecto.titulo.length <= 15) {
      throw new Error('El título debe tener más de 15 caracteres');
    }
    
    proyecto.id = this.nextId++;
    proyecto.estado = 1; // Estado inicial
    this.proyectos.push(proyecto);
    return proyecto;
  }

  async avanzarProyecto(id: number): Promise<ProyectoEntity> {
    const proyecto = this.proyectos.find(p => p.id === id);

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    if (proyecto.estado >= 4) {
      throw new Error('El proyecto ya está en su estado máximo');
    }

    proyecto.estado += 1;
    return proyecto;
  }

  async findAllEstudiantes(proyectoId: number): Promise<EstudianteEntity[]> {
    const proyecto = this.proyectos.find(p => p.id === proyectoId);

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    return [proyecto.lider]; // En este caso solo retornamos el líder ya que es la única relación con estudiantes
  }

  async findOne(id: number): Promise<ProyectoEntity | undefined> {
    return this.proyectos.find(p => p.id === id);
  }

  async findAll(): Promise<ProyectoEntity[]> {
    return this.proyectos;
  }
} 