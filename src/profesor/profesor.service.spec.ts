import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProfesorService } from './profesor.service';
import { ProfesorEntity } from './profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let repository: Repository<ProfesorEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProfesorService],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    repository = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );
  });

  it('create should throw error when extension is not 5 digits', async () => {
    const profesor: ProfesorEntity = {
      id: 0,
      cedula: 123456789,
      nombre: "Test Profesor",
      departamento: "Sistemas",
      facultad: "Ingeniería",
      extension: 123,
      esParEvaluador: false,
      mentorias: [],
      evaluaciones: []
    };

    await expect(() => service.create(profesor)).rejects.toHaveProperty(
      'message',
      'La extensión debe tener exactamente 5 dígitos'
    );
  });

  it('asignarEvaluador should throw error when profesor has 3 evaluations', async () => {
    const profesor = {
      id: 1,
      evaluaciones: [
        { id: 1 } as EvaluacionEntity,
        { id: 2 } as EvaluacionEntity,
        { id: 3 } as EvaluacionEntity
      ]
    };
    
    jest.spyOn(repository, 'findOne').mockResolvedValue(profesor as ProfesorEntity);

    await expect(() => service.asignarEvaluador(1)).rejects.toHaveProperty(
      'message',
      'El profesor ya tiene 3 o más evaluaciones activas'
    );
  });
}); 