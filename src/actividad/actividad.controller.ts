import {Body, Controller, Get, Param, Post, Patch, ParseUUIDPipe, ParseIntPipe} from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadDto } from './actividad.dto';
import { ActividadEntity } from './actividad.entity';

@Controller('actividades')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  // POST /actividades
  @Post()
  async crearActividad(@Body() dto: ActividadDto): Promise<ActividadEntity> {
    const actividad = new ActividadEntity();
    actividad.titulo = dto.titulo;
    actividad.fecha = dto.fecha;
    actividad.cupoMaximo = dto.cupoMaximo;

    return await this.actividadService.crearActividad(actividad);
  }

  // GET /actividades/fecha/:fecha
  @Get('fecha/:fecha')
  async getActividadesByFecha(@Param('fecha') fecha: string): Promise<ActividadEntity[]> {
    return await this.actividadService.findActividadesByDate(fecha);
  }

  // PATCH /actividades/:id/estado/:estado
  @Patch(':id/estado/:estado')
  async cambiarEstado(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('estado', new ParseIntPipe()) estado: number,
  ): Promise<ActividadEntity> {
    return await this.actividadService.cambiarEstado(id, estado);
  }
}
