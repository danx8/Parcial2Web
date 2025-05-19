import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProfesorDto } from './profesor.dto';
import { ProfesorEntity } from './profesor.entity';
import { ProfesorService } from './profesor.service';

@Controller('profesores')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProfesorController {
    constructor(private readonly profesorService: ProfesorService) {}

    @Get()
    async findAll() {
        return await this.profesorService.findAll();
    }

    @Get(':profesorId')
    async findOne(@Param('profesorId') profesorId: string) {
        return await this.profesorService.findOne(parseInt(profesorId));
    }

    @Post()
    async create(@Body() profesorDto: ProfesorDto) {
        const profesor: ProfesorEntity = plainToInstance(ProfesorEntity, profesorDto);
        return await this.profesorService.create(profesor);
    }

    @Put(':profesorId')
    async update(@Param('profesorId') profesorId: string, @Body() profesorDto: ProfesorDto) {
        const profesor: ProfesorEntity = plainToInstance(ProfesorEntity, profesorDto);
        return await this.profesorService.update(parseInt(profesorId), profesor);
    }

    @Delete(':profesorId')
    @HttpCode(204)
    async delete(@Param('profesorId') profesorId: string) {
        return await this.profesorService.delete(parseInt(profesorId));
    }
} 