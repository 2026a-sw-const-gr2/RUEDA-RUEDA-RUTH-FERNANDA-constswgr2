import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoTipicoEntity } from '../../database/entities/plato-tipico.entity';
import { PlatosTipicosController } from './platos-tipicos.controller';
import { PlatosTipicosService } from './platos-tipicos.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlatoTipicoEntity])],
  controllers: [PlatosTipicosController],
  providers: [PlatosTipicosService],
})
export class PlatosTipicosModule {}
