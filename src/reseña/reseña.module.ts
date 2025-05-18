import { Module } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { ReseñaController } from './reseña.controller';

@Module({
  providers: [ReseñaService],
  controllers: [ReseñaController]
})
export class ReseñaModule {}
