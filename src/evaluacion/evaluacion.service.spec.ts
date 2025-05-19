import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionEntity } from './evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { faker } from '@faker-js/faker';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let evaluacionRepository: Repository<EvaluacionEntity>;
  let proyectoRepository: Repository<ProyectoEntity>;
  let evaluacionList: EvaluacionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EvaluacionService],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    evaluacionRepository = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );
    proyectoRepository = module.get<Repository<ProyectoEntity>>(
      getRepositoryToken(ProyectoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await evaluacionRepository.clear();
    evaluacionList = [];
    for(let i = 0; i < 5; i++) {
      const evaluacion: EvaluacionEntity = {
        id: i + 1,
        notaFinal: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
        retroalimentacion: faker.lorem.sentence(),
        proyecto: null,
        evaluador: null
      };
      evaluacionList.push(await evaluacionRepository.save(evaluacion));
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all evaluaciones', async () => {
    const evaluaciones = await service.findAll();
    expect(evaluaciones).not.toBeNull();
    expect(evaluaciones).toHaveLength(evaluacionList.length);
  });

  it('findOne should return a evaluacion by id', async () => {
    const storedEvaluacion = evaluacionList[0];
    const evaluacion = await service.findOne(storedEvaluacion.id);
    expect(evaluacion).not.toBeNull();
    expect(evaluacion.notaFinal).toEqual(storedEvaluacion.notaFinal);
  });

  it('findOne should throw an exception for an invalid evaluacion', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty(
      'message',
      'La evaluación no fue encontrada',
    );
  });

  it('create should return a new evaluacion', async () => {
    const evaluacion: EvaluacionEntity = {
      id: 0,
      notaFinal: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
      retroalimentacion: faker.lorem.sentence(),
      proyecto: null,
      evaluador: null
    };

    const newEvaluacion = await service.create(evaluacion);
    expect(newEvaluacion).not.toBeNull();
    expect(newEvaluacion.notaFinal).toEqual(evaluacion.notaFinal);
  });

  it('create should throw an exception for an invalid nota', async () => {
    const evaluacion: EvaluacionEntity = {
      id: 0,
      notaFinal: 6,
      retroalimentacion: faker.lorem.sentence(),
      proyecto: null,
      evaluador: null
    };

    await expect(() => service.create(evaluacion)).rejects.toHaveProperty(
      'message',
      'La nota debe estar entre 0 y 5',
    );
  });

  it('update should modify a evaluacion', async () => {
    const evaluacion = evaluacionList[0];
    evaluacion.notaFinal = 4.5;
    const updatedEvaluacion = await service.update(evaluacion.id, evaluacion);
    expect(updatedEvaluacion).not.toBeNull();
    expect(updatedEvaluacion.notaFinal).toEqual(4.5);
  });

  it('update should throw an exception for an invalid evaluacion', async () => {
    const evaluacion = evaluacionList[0];
    evaluacion.notaFinal = 4.5;
    await expect(() => service.update(0, evaluacion)).rejects.toHaveProperty(
      'message',
      'La evaluación no fue encontrada',
    );
  });

  it('update should throw an exception for an invalid nota', async () => {
    const evaluacion = evaluacionList[0];
    evaluacion.notaFinal = 6;
    await expect(() => service.update(evaluacion.id, evaluacion)).rejects.toHaveProperty(
      'message',
      'La nota debe estar entre 0 y 5',
    );
  });

  it('delete should remove a evaluacion', async () => {
    const evaluacion = evaluacionList[0];
    await service.delete(evaluacion.id);
    const deletedEvaluacion = await evaluacionRepository.findOne({ where: { id: evaluacion.id } });
    expect(deletedEvaluacion).toBeNull();
  });

  it('delete should throw an exception for an invalid evaluacion', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty(
      'message',
      'La evaluación no fue encontrada',
    );
  });
}); 