import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';

@Module({
  providers: [EstudianteService],
  exports: [EstudianteService]
})
export class EstudianteModule {} 