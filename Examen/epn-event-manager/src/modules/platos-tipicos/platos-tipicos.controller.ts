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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from './api-key.guard';
import { CreatePlatoTipicoDto } from './dto/create-plato-tipico.dto';
import { UpdatePlatoTipicoDto } from './dto/update-plato-tipico.dto';
import { PlatosTipicosService } from './platos-tipicos.service';

@ApiTags('Platos tipicos')
@ApiSecurity('X-FIS-EPN-KEY')
@ApiHeader({
  name: 'X-FIS-EPN-KEY',
  required: true,
  description: 'API Key requerida para consumir endpoints del CRUD.',
})
@ApiUnauthorizedResponse({
  description: 'API Key ausente o incorrecta.',
})
@Controller('platos-tipicos')
@UseGuards(ApiKeyGuard)
export class PlatosTipicosController {
  constructor(private readonly platosTipicosService: PlatosTipicosService) {}

  @ApiOperation({ summary: 'Crear un plato tipico ecuatoriano' })
  @ApiBody({ type: CreatePlatoTipicoDto })
  @ApiResponse({
    status: 201,
    description: 'Plato tipico creado correctamente.',
  })
  @ApiBadRequestResponse({
    description: 'Datos invalidos, campos vacios o entrada no permitida.',
  })
  @Post()
  create(@Body() dto: CreatePlatoTipicoDto) {
    return this.platosTipicosService.create(dto);
  }

  @ApiOperation({ summary: 'Listar platos tipicos ecuatorianos' })
  @ApiOkResponse({
    description: 'Listado de platos tipicos con metadata adaptativa.',
  })
  @Get()
  findAll() {
    return this.platosTipicosService.findAll();
  }

  @ApiOperation({ summary: 'Consultar estadisticas de platos tipicos' })
  @ApiOkResponse({
    description:
      'Estadisticas con total, precios, agrupacion por region y categoria.',
  })
  @Get('stats')
  getStats() {
    return this.platosTipicosService.getStats();
  }

  @ApiOperation({ summary: 'Consultar un plato tipico por id' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Id entero positivo del plato tipico.',
  })
  @ApiOkResponse({
    description: 'Plato tipico encontrado con metadata adaptativa.',
  })
  @ApiBadRequestResponse({
    description: 'Id invalido.',
  })
  @ApiNotFoundResponse({
    description: 'No existe el plato tipico solicitado.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platosTipicosService.findOne(this.parseId(id));
  }

  @ApiOperation({ summary: 'Actualizar parcialmente un plato tipico' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Id entero positivo del plato tipico.',
  })
  @ApiBody({ type: UpdatePlatoTipicoDto })
  @ApiOkResponse({
    description: 'Plato tipico actualizado correctamente.',
  })
  @ApiBadRequestResponse({
    description: 'Id invalido o datos invalidos.',
  })
  @ApiNotFoundResponse({
    description: 'No existe el plato tipico solicitado.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlatoTipicoDto) {
    return this.platosTipicosService.update(this.parseId(id), dto);
  }

  @ApiOperation({ summary: 'Eliminar un plato tipico' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Id entero positivo del plato tipico.',
  })
  @ApiOkResponse({
    description: 'Plato tipico eliminado correctamente.',
  })
  @ApiBadRequestResponse({
    description: 'Id invalido.',
  })
  @ApiNotFoundResponse({
    description: 'No existe el plato tipico solicitado.',
  })
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
