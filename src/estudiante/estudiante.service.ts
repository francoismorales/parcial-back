import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstudianteService {

    constructor(
       @InjectRepository(EstudianteEntity)
       private readonly estudianteRepository: Repository<EstudianteEntity>
   ){}
 
    async crearEstudiante(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
       return await this.estudianteRepository.save(estudiante);
   }

    async findEstudianteById(id: string): Promise<EstudianteEntity | null> {
   const estudiante: EstudianteEntity | null = await this.estudianteRepository.findOne({where: {id}, relations: ["actividades", "reseñas"] } );
   return estudiante;
   }




}
