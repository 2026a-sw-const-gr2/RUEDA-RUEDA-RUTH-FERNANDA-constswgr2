import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoTipicoEntity } from '../../database/entities/plato-tipico.entity';
import { EventsModule } from '../events/events.module';
import { ApiKeyGuard } from './api-key.guard';
import { PlatosTipicosController } from './platos-tipicos.controller';
import { PlatosTipicosService } from './platos-tipicos.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlatoTipicoEntity]), EventsModule],
  controllers: [PlatosTipicosController],
  providers: [PlatosTipicosService, ApiKeyGuard],
})
export class PlatosTipicosModule {}
