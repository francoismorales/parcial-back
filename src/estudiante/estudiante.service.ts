import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { Repository } from 'typeorm';
import { ActividadEntity } from 'src/actividad/actividad.entity';

@Injectable()
export class EstudianteService {

    constructor(
       @InjectRepository(EstudianteEntity)
       private readonly estudianteRepository: Repository<EstudianteEntity>,

       @InjectRepository(ActividadEntity)
        private readonly actividadRepository: Repository<ActividadEntity>,
   ){}

   async crearEstudiante(estudiante: EstudianteEntity): Promise<EstudianteEntity> {

    // Validar el correo
    const vsalidacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!vsalidacionCorreo.test(estudiante.correo)) {
      throw new BadRequestException('Correo inválido');
    }

    // Validar el semestre
    if (estudiante.semestre < 1 || estudiante.semestre > 10) {
      throw new BadRequestException('El semestre debe estar entre 1 y 10');
    }

    return await this.estudianteRepository.save(estudiante);
  }

   async findEstudianteById(id: string): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({where: { id },relations: ['actividades', 'reseñas'],});

    if (!estudiante) {
      throw new NotFoundException(`Estudiante no encontrado`);
    }

    return estudiante;
  }

  async inscribirseActividad(estudianteId: string, actividadId: string): Promise<void> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante no encontrado`);
    }

    const actividad = await this.actividadRepository.findOne({where: { id: actividadId },relations: ['estudiantes'],});

    if (!actividad) {
      throw new NotFoundException(`Actividad no encontrada`);
    }

    // Validar que haya cupo
    if (actividad.estudiantes.length >= actividad.cupoMaximo) {
      throw new BadRequestException('No hay cupos disponibles');
    }

    // Validar estado 0
    if (actividad.estado !== 0) {
      throw new BadRequestException('La actividad no está activa');
    }

    // Verificar si ya está inscrito
    const yaInscrito = actividad.estudiantes.some(est => est.id === estudiante.id);
    if (yaInscrito) {
      throw new BadRequestException('El estudiante ya está inscrito en esta actividad');
    }

    // Inscribir
    estudiante.actividades.push(actividad);
    await this.estudianteRepository.save(estudiante);
  }


}
