import { IsString, IsInt, Min, Max, Matches } from 'class-validator';

export class ActividadDto {
  @IsString()
  titulo: string;

  @IsString()
  fecha: string;

  @IsInt()
  @Min(1)
  cupoMaximo: number;
}
