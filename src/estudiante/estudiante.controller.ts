import {Body, Controller, Get, Param, Post, ParseUUIDPipe} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto } from './estudiante.dto';
import { EstudianteEntity } from './estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  // POST /estudiantes
  @Post()
  async crearEstudiante(@Body() dto: EstudianteDto): Promise<EstudianteEntity> {
    const estudiante = new EstudianteEntity();
    estudiante.cedula = dto.cedula;
    estudiante.nombre = dto.nombre;
    estudiante.correo = dto.correo;
    estudiante.programa = dto.programa;
    estudiante.semestre = dto.semestre;
    return await this.estudianteService.crearEstudiante(estudiante);
  }

  // GET /estudiantes/:id
  @Get(':id')
  async getEstudianteById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<EstudianteEntity> {
    return await this.estudianteService.findEstudianteById(id);
  }

  // POST /estudiantes/:estudianteId/inscribirse/:actividadId
  @Post(':estudianteId/inscribirse/:actividadId')
  async inscribirseActividad(
    @Param('estudianteId', new ParseUUIDPipe()) estudianteId: string,
    @Param('actividadId', new ParseUUIDPipe()) actividadId: string,
  ): Promise<{ mensaje: string }> {
    await this.estudianteService.inscribirseActividad(estudianteId, actividadId);
    return { mensaje: 'Inscripción realizada con éxito' };
  }
}
