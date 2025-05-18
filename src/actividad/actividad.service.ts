import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        
        actividad.estado = 0;
        
        return await this.actividadRepository.save(actividad);
    }

    async findActividadesByDate(date: string): Promise<ActividadEntity[]> {
        const actividades: ActividadEntity[] = await this.actividadRepository.find({ where: { fecha: date }, relations: ["estudiantes", "reseñas"] });
        return actividades;
    }

    async cambiarEstado(actividadId: string, nuevoEstado: number): Promise<ActividadEntity> {
        const actividad = await this.actividadRepository.findOne({where: { id: actividadId },relations: ['estudiantes'],});

        if (!actividad) {
        throw new NotFoundException(`Actividad no encontrada.`);
        }

        if (![0, 1, 2].includes(nuevoEstado)) {
        throw new BadRequestException('Estado inválido.');
        }

        const inscritos = actividad.estudiantes.length;
        const porcentajeOcupado = (inscritos / actividad.cupoMaximo) * 100;

        if (nuevoEstado === 1 && porcentajeOcupado < 80) {
        throw new BadRequestException('La actividad solo puede cerrarse si al menos el 80% del cupo está lleno.');
        }

        if (nuevoEstado === 2 && inscritos < actividad.cupoMaximo) {
        throw new BadRequestException('La actividad solo puede finalizarse si el cupo está lleno.');
        }

        actividad.estado = nuevoEstado;
        return await this.actividadRepository.save(actividad);
  }

}
    