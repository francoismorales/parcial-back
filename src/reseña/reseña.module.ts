import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseñaService } from './reseña.service';
import { ReseñaController } from './reseña.controller';
import { ReseñaEntity } from './reseña.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReseñaEntity,
      ActividadEntity,
      EstudianteEntity,
    ]),
  ],
  providers: [ReseñaService],
  controllers: [ReseñaController],
})
export class ReseñaModule {}
