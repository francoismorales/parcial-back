import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReseñaEntity } from './reseña.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReseñaService {
    constructor(
        @InjectRepository(ReseñaEntity)
        private readonly reseñaRepository: Repository<ReseñaEntity>
    ) {}

    async agregarReseña(reseña: ReseñaEntity): Promise<ReseñaEntity> {
        return await this.reseñaRepository.save(reseña);
    }
}
