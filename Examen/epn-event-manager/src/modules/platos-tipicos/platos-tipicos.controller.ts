import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';
import { CreatePlatoTipicoDto } from './dto/create-plato-tipico.dto';
import { UpdatePlatoTipicoDto } from './dto/update-plato-tipico.dto';
import { PlatosTipicosService } from './platos-tipicos.service';

@Controller('platos-tipicos')
@UseGuards(ApiKeyGuard)
export class PlatosTipicosController {
  constructor(private readonly platosTipicosService: PlatosTipicosService) {}

  @Post()
  create(@Body() dto: CreatePlatoTipicoDto) {
    return this.platosTipicosService.create(dto);
  }

  @Get()
  findAll() {
    return this.platosTipicosService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.platosTipicosService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platosTipicosService.findOne(this.parseId(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlatoTipicoDto) {
    return this.platosTipicosService.update(this.parseId(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platosTipicosService.remove(this.parseId(id));
  }

  private parseId(id: string): number {
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new BadRequestException('El id debe ser un numero entero positivo');
    }

    return parsedId;
  }
}
