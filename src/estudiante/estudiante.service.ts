import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EstudianteService {
    constructor(
        @InjectRepository(EstudianteEntity)
        private readonly estudianteRepository: Repository<EstudianteEntity>
    ) {}

    async findAll(): Promise<EstudianteEntity[]> {
        return await this.estudianteRepository.find({ relations: ['proyectos'] });
    }

    async findOne(id: number): Promise<EstudianteEntity> {
        const estudiante: EstudianteEntity = await this.estudianteRepository.findOne({
            where: { id },
            relations: ['proyectos']
        });
        if (!estudiante)
            throw new BusinessLogicException("El estudiante no fue encontrado", BusinessError.NOT_FOUND);
        return estudiante;
    }

    async create(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
        if (estudiante.promedio <= 3.2)
            throw new BusinessLogicException("El promedio debe ser mayor a 3.2", BusinessError.PRECONDITION_FAILED);
        if (estudiante.semestre < 4)
            throw new BusinessLogicException("El semestre debe ser mayor o igual a 4", BusinessError.PRECONDITION_FAILED);
        return await this.estudianteRepository.save(estudiante);
    }

    async update(id: number, estudiante: EstudianteEntity): Promise<EstudianteEntity> {
        const persistedEstudiante: EstudianteEntity = await this.estudianteRepository.findOne({ where: { id } });
        if (!persistedEstudiante)
            throw new BusinessLogicException("El estudiante no fue encontrado", BusinessError.NOT_FOUND);
        if (estudiante.promedio <= 3.2)
            throw new BusinessLogicException("El promedio debe ser mayor a 3.2", BusinessError.PRECONDITION_FAILED);
        if (estudiante.semestre < 4)
            throw new BusinessLogicException("El semestre debe ser mayor o igual a 4", BusinessError.PRECONDITION_FAILED);
        return await this.estudianteRepository.save({...persistedEstudiante, ...estudiante});
    }

    async delete(id: number) {
        const estudiante: EstudianteEntity = await this.estudianteRepository.findOne({
            where: { id },
            relations: ['proyectos']
        });
        if (!estudiante)
            throw new BusinessLogicException("El estudiante no fue encontrado", BusinessError.NOT_FOUND);
        if (estudiante.proyectos && estudiante.proyectos.some(p => p.estado > 0))
            throw new BusinessLogicException("No se puede eliminar un estudiante con proyectos activos", BusinessError.PRECONDITION_FAILED);
        await this.estudianteRepository.remove(estudiante);
    }
} 