import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EstudianteDto } from './estudiante.dto';
import { EstudianteEntity } from './estudiante.entity';
import { EstudianteService } from './estudiante.service';

@Controller('estudiantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
    constructor(private readonly estudianteService: EstudianteService) {}

    @Get()
    async findAll() {
        return await this.estudianteService.findAll();
    }

    @Get(':estudianteId')
    async findOne(@Param('estudianteId') estudianteId: string) {
        return await this.estudianteService.findOne(parseInt(estudianteId));
    }

    @Post()
    async create(@Body() estudianteDto: EstudianteDto) {
        const estudiante: EstudianteEntity = plainToInstance(EstudianteEntity, estudianteDto);
        return await this.estudianteService.create(estudiante);
    }

    @Put(':estudianteId')
    async update(@Param('estudianteId') estudianteId: string, @Body() estudianteDto: EstudianteDto) {
        const estudiante: EstudianteEntity = plainToInstance(EstudianteEntity, estudianteDto);
        return await this.estudianteService.update(parseInt(estudianteId), estudiante);
    }

    @Delete(':estudianteId')
    @HttpCode(204)
    async delete(@Param('estudianteId') estudianteId: string) {
        return await this.estudianteService.delete(parseInt(estudianteId));
    }
} 