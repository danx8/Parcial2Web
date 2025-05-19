import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EvaluacionDto } from './evaluacion.dto';
import { EvaluacionEntity } from './evaluacion.entity';
import { EvaluacionService } from './evaluacion.service';

@Controller('evaluaciones')
@UseInterceptors(BusinessErrorsInterceptor)
export class EvaluacionController {
    constructor(private readonly evaluacionService: EvaluacionService) {}

    @Get()
    async findAll() {
        return await this.evaluacionService.findAll();
    }

    @Get(':evaluacionId')
    async findOne(@Param('evaluacionId') evaluacionId: string) {
        return await this.evaluacionService.findOne(parseInt(evaluacionId));
    }

    @Post()
    async create(@Body() evaluacionDto: EvaluacionDto) {
        const evaluacion: EvaluacionEntity = plainToInstance(EvaluacionEntity, evaluacionDto);
        return await this.evaluacionService.create(evaluacion);
    }

    @Put(':evaluacionId')
    async update(@Param('evaluacionId') evaluacionId: string, @Body() evaluacionDto: EvaluacionDto) {
        const evaluacion: EvaluacionEntity = plainToInstance(EvaluacionEntity, evaluacionDto);
        return await this.evaluacionService.update(parseInt(evaluacionId), evaluacion);
    }

    @Delete(':evaluacionId')
    @HttpCode(204)
    async delete(@Param('evaluacionId') evaluacionId: string) {
        return await this.evaluacionService.delete(parseInt(evaluacionId));
    }
} 