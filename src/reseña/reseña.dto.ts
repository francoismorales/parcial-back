import { IsString, IsInt, Min, Max, IsUUID } from 'class-validator';

export class ReseñaDto {
  @IsString()
  comentario: string;

  @IsInt()
  @Min(1)
  @Max(5)
  calificacion: number;

  @IsString()
  fecha: string;

  @IsUUID()
  estudianteId: string;

  @IsUUID()
  actividadId: string;
}
