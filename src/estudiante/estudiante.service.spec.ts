import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<EstudianteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
  });

  it('create should throw error when promedio is less than 3.2', async () => {
    const estudiante: EstudianteEntity = {
      id: 0,
      cedula: 123456789,
      nombre: "Test Student",
      semestre: 4,
      programa: "Ingeniería de Sistemas",
      promedio: 3.0,
      proyectos: []
    };

    await expect(() => service.create(estudiante)).rejects.toHaveProperty(
      'message',
      'El promedio debe ser mayor a 3.2'
    );
  });

  it('create should throw error when semestre is less than 4', async () => {
    const estudiante: EstudianteEntity = {
      id: 0,
      cedula: 123456789,
      nombre: "Test Student",
      semestre: 3,
      programa: "Ingeniería de Sistemas",
      promedio: 4.0,
      proyectos: []
    };

    await expect(() => service.create(estudiante)).rejects.toHaveProperty(
      'message',
      'El semestre debe ser mayor o igual a 4'
    );
  });

  it('delete should throw error when student has active projects', async () => {
    const estudiante = {
      id: 1,
      proyectos: [{ id: 1, estado: 1 }]
    };
    
    jest.spyOn(repository, 'findOne').mockResolvedValue(estudiante as EstudianteEntity);

    await expect(() => service.delete(1)).rejects.toHaveProperty(
      'message',
      'No se puede eliminar un estudiante con proyectos activos'
    );
  });
}); 