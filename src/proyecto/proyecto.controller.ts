import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProyectoDto } from './proyecto.dto';
import { ProyectoEntity } from './proyecto.entity';
import { ProyectoService } from './proyecto.service';

@Controller('proyectos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProyectoController {
    constructor(private readonly proyectoService: ProyectoService) {}

    @Get()
    async findAll() {
        return await this.proyectoService.findAll();
    }

    @Get(':proyectoId')
    async findOne(@Param('proyectoId') proyectoId: string) {
        return await this.proyectoService.findOne(parseInt(proyectoId));
    }

    @Post()
    async create(@Body() proyectoDto: ProyectoDto) {
        const proyecto: ProyectoEntity = plainToInstance(ProyectoEntity, proyectoDto);
        return await this.proyectoService.create(proyecto);
    }

    @Put(':proyectoId')
    async update(@Param('proyectoId') proyectoId: string, @Body() proyectoDto: ProyectoDto) {
        const proyecto: ProyectoEntity = plainToInstance(ProyectoEntity, proyectoDto);
        return await this.proyectoService.update(parseInt(proyectoId), proyecto);
    }

    @Delete(':proyectoId')
    @HttpCode(204)
    async delete(@Param('proyectoId') proyectoId: string) {
        return await this.proyectoService.delete(parseInt(proyectoId));
    }
} 