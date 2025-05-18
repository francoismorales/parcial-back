import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReseñaEntity } from './reseña.entity';
import { Repository } from 'typeorm';
import { ActividadEntity } from 'src/actividad/actividad.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';

@Injectable()
export class ReseñaService {
    constructor(
        @InjectRepository(ReseñaEntity)
        private readonly reseñaRepository: Repository<ReseñaEntity>,

        @InjectRepository(ActividadEntity)
        private readonly actividadRepository: Repository<ActividadEntity>,

        @InjectRepository(EstudianteEntity)
        private readonly estudianteRepository: Repository<EstudianteEntity>,
    ) {}

    async agregarReseña(reseña: ReseñaEntity): Promise<ReseñaEntity> {

    const actividad = await this.actividadRepository.findOne({where: { id: reseña.actividad.id },relations: ['estudiantes'],});

    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    // Validar estado
    if (actividad.estado !== 2) {
      throw new BadRequestException('Solo se pueden dejar reseñas de actividades finalizadas');
    }

    // Validar que el estudiante exista
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: reseña.estudiante.id },
      relations: ['actividades'],
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Validar que el estudiante esté inscrito en la actividad
    const inscrito = estudiante.actividades.some(act => act.id === actividad.id);
    if (!inscrito) {
      throw new BadRequestException('El estudiante no está inscrito en esta actividad');
    }

    return await this.reseñaRepository.save(reseña);
  }
}
