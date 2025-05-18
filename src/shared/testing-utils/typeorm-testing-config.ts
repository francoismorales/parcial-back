import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from '../../estudiante/estudiante.entity';
import { ActividadEntity } from '../../actividad/actividad.entity';
import { ReseñaEntity } from '../../reseña/reseña.entity'; // sin ñ

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [EstudianteEntity, ActividadEntity, ReseñaEntity],
    synchronize: true,
    //keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity, ReseñaEntity]),
];
