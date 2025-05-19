import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';

@Module({
    imports: [TypeOrmModule.forFeature([EstudianteEntity])],
    providers: [EstudianteService],
    controllers: [EstudianteController],
    exports: [EstudianteService]
})
export class EstudianteModule {} 