import { Module } from '@nestjs/common';
import { ReseñaService } from './reseña.service';

@Module({
  providers: [ReseñaService]
})
export class ReseñaModule {}
