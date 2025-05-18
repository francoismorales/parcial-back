import { Body, Controller, Post } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { ReseñaDto } from './reseña.dto';
import { ReseñaEntity } from './reseña.entity';

@Controller('reseñas')
export class ReseñaController {
  constructor(private readonly reseñaService: ReseñaService) {}

  @Post()
  async agregarReseña(@Body() dto: ReseñaDto): Promise<ReseñaEntity> {
    const reseña = new ReseñaEntity();
    reseña.comentario = dto.comentario;
    reseña.calificacion = dto.calificacion;
    reseña.fecha = dto.fecha;
    reseña.estudiante = { id: dto.estudianteId } as any;
    reseña.actividad = { id: dto.actividadId } as any;

    return await this.reseñaService.agregarReseña(reseña);
  }
}
