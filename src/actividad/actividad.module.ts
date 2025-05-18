import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { ActividadEntity } from './actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActividadEntity])],
  providers: [ActividadService],
  controllers: [ActividadController],
  exports: [TypeOrmModule]
})
export class ActividadModule {}
