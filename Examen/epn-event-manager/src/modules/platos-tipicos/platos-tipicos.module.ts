import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoTipicoEntity } from '../../database/entities/plato-tipico.entity';
import { EventsModule } from '../events/events.module';
import { PlatosTipicosController } from './platos-tipicos.controller';
import { PlatosTipicosService } from './platos-tipicos.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlatoTipicoEntity]), EventsModule],
  controllers: [PlatosTipicosController],
  providers: [PlatosTipicosService],
})
export class PlatosTipicosModule {}
