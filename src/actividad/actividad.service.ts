import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActividadEntity } from './actividad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActividadService {
    constructor(
        @InjectRepository(ActividadEntity)
        private readonly actividadRepository: Repository<ActividadEntity>
    ) {}

    async crearActividad(actividad: ActividadEntity): Promise<ActividadEntity> {
        return await this.actividadRepository.save(actividad);
    }

    async findActividadesByDate(date: string): Promise<ActividadEntity[]> {
        const actividades: ActividadEntity[] = await this.actividadRepository.find({ where: { fecha: date }, relations: ["estudiantes", "reseñas"] });
        return actividades;
    }

}
    