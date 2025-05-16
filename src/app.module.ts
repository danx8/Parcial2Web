import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante/estudiante.entity';
import { ProfesorEntity } from './profesor/profesor.entity';
import { ProyectoEntity } from './proyecto/proyecto.entity';
import { EvaluacionEntity } from './evaluacion/evaluacion.entity';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ProfesorModule } from './profesor/profesor.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [EstudianteEntity, ProfesorEntity, ProyectoEntity, EvaluacionEntity],
      synchronize: process.env.NODE_ENV !== 'production',
      dropSchema: false,
    }),
    EstudianteModule,
    ProfesorModule,
    ProyectoModule,
    EvaluacionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
