import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from './proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let repository: Repository<ProyectoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProyectoService],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    repository = module.get<Repository<ProyectoEntity>>(
      getRepositoryToken(ProyectoEntity),
    );
  });

  it('create should throw error when presupuesto is 0', async () => {
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 1);

    const proyecto: ProyectoEntity = {
      id: 0,
      titulo: 'Este es un título que tiene más de 15 caracteres',
      area: 'Software',
      presupuesto: 0,
      notaFinal: 0,
      estado: 0,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      lider: null,
      mentor: null,
      evaluaciones: []
    };

    await expect(() => service.create(proyecto)).rejects.toHaveProperty(
      'message',
      'El presupuesto debe ser mayor a 0'
    );
  });

  it('create should throw error when titulo length is 15 or less', async () => {
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 1);

    const proyecto: ProyectoEntity = {
      id: 0,
      titulo: 'Título corto',
      area: 'Software',
      presupuesto: 1000000,
      notaFinal: 0,
      estado: 0,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      lider: null,
      mentor: null,
      evaluaciones: []
    };

    await expect(() => service.create(proyecto)).rejects.toHaveProperty(
      'message',
      'El título debe tener más de 15 caracteres'
    );
  });

  it('avanzarProyecto should throw error when estado is 4', async () => {
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 1);

    const proyecto = await repository.save({
      id: 0,
      titulo: 'Este es un título que tiene más de 15 caracteres',
      area: 'Software',
      presupuesto: 1000000,
      notaFinal: 0,
      estado: 4,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      lider: null,
      mentor: null,
      evaluaciones: []
    });

    await expect(() => service.avanzarProyecto(proyecto.id)).rejects.toHaveProperty(
      'message',
      'El proyecto ya está en su estado máximo'
    );
  });

  it('findAllEstudiantes should return students list', async () => {
    const lider = { 
      id: 1, 
      nombre: 'Estudiante 1', 
      cedula: 123, 
      semestre: 4, 
      programa: 'Sistemas', 
      promedio: 4.0, 
      proyectos: [] 
    } as EstudianteEntity;

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 1);

    const proyecto: ProyectoEntity = {
      id: 1,
      titulo: 'Este es un título que tiene más de 15 caracteres',
      area: 'Software',
      presupuesto: 1000000,
      notaFinal: 0,
      estado: 0,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      lider: lider,
      mentor: null,
      evaluaciones: []
    };
    
    jest.spyOn(repository, 'findOne').mockResolvedValue(proyecto);

    const result = await service.findAllEstudiantes(1);
    expect(result).toHaveLength(1);
  });
}); 