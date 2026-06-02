import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatoTipicoEntity } from '../../database/entities/plato-tipico.entity';
import { EventsService } from '../events/events.service';
import { CreatePlatoTipicoDto } from './dto/create-plato-tipico.dto';
import { UpdatePlatoTipicoDto } from './dto/update-plato-tipico.dto';

type PlatoTipicoAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'QUERY';

export interface Metadata {
  source: 'platos-tipicos-crud';
  system: 'Sistema de Platos Típicos Ecuatorianos';
  apiVersion: 'v1';
  timestampISO: string;
  timezone: 'America/Guayaquil';
  environment: string;
  integrationTarget: 'EPN Event Manager';
}

export interface ResponseWithMetadata<T> {
  data: T;
  metadata: Metadata;
}

@Injectable()
export class PlatosTipicosService {
  constructor(
    @InjectRepository(PlatoTipicoEntity)
    private readonly platosRepo: Repository<PlatoTipicoEntity>,
    private readonly eventsService: EventsService,
  ) {}

  async create(
    dto: CreatePlatoTipicoDto,
  ): Promise<ResponseWithMetadata<PlatoTipicoEntity>> {
    this.validateCreateDto(dto);
    const plato = this.platosRepo.create({
      ...dto,
      precio: Number(dto.precio),
    });
    const saved = await this.platosRepo.save(plato);
    return this.withMetadata(saved, 'CREATE', saved.id);
  }

  async findAll(): Promise<ResponseWithMetadata<PlatoTipicoEntity[]>> {
    const platos = await this.platosRepo.find({ order: { id: 'ASC' } });
    return this.withMetadata(platos, 'QUERY');
  }

  async findOne(id: number): Promise<ResponseWithMetadata<PlatoTipicoEntity>> {
    const plato = await this.findEntityById(id);
    return this.withMetadata(plato, 'QUERY', id);
  }

  private async findEntityById(id: number): Promise<PlatoTipicoEntity> {
    const plato = await this.platosRepo.findOneBy({ id });

    if (!plato) {
      throw new NotFoundException(`No existe el plato tipico con id ${id}`);
    }

    return plato;
  }

  async update(
    id: number,
    dto: UpdatePlatoTipicoDto,
  ): Promise<ResponseWithMetadata<PlatoTipicoEntity>> {
    this.validateUpdateDto(dto);
    const plato = await this.findEntityById(id);
    Object.assign(plato, {
      ...dto,
      precio: dto.precio === undefined ? plato.precio : Number(dto.precio),
    });
    const saved = await this.platosRepo.save(plato);
    return this.withMetadata(saved, 'UPDATE', id);
  }

  async remove(
    id: number,
  ): Promise<ResponseWithMetadata<{ deleted: boolean; id: number }>> {
    const plato = await this.findEntityById(id);
    await this.platosRepo.remove(plato);
    return this.withMetadata({ deleted: true, id }, 'DELETE', id);
  }

  private validateCreateDto(dto: CreatePlatoTipicoDto): void {
    const requiredFields: Array<keyof CreatePlatoTipicoDto> = [
      'nombre',
      'descripcion',
      'region',
      'ingredientes',
      'precio',
      'imagenUrl',
      'categoria',
    ];

    for (const field of requiredFields) {
      if (dto[field] === undefined || dto[field] === null || dto[field] === '') {
        throw new BadRequestException(`El campo ${field} es obligatorio`);
      }
    }

    this.validatePrecio(dto.precio);
  }

  private validateUpdateDto(dto: UpdatePlatoTipicoDto): void {
    for (const [field, value] of Object.entries(dto)) {
      if (value === null || value === '') {
        throw new BadRequestException(`El campo ${field} no puede estar vacio`);
      }
    }

    if (dto.precio !== undefined) {
      this.validatePrecio(dto.precio);
    }
  }

  private validatePrecio(precio: number): void {
    const numericPrice = Number(precio);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      throw new BadRequestException('El precio debe ser un numero mayor o igual a 0');
    }
  }

  private createMetadata(): Metadata {
    return {
      source: 'platos-tipicos-crud',
      system: 'Sistema de Platos Típicos Ecuatorianos',
      apiVersion: 'v1',
      timestampISO: new Date().toISOString(),
      timezone: 'America/Guayaquil',
      environment: process.env.NODE_ENV ?? 'development',
      integrationTarget: 'EPN Event Manager',
    };
  }

  private async withMetadata<T>(
    data: T,
    action: PlatoTipicoAction,
    platoId?: number,
  ): Promise<ResponseWithMetadata<T>> {
    const metadata = this.createMetadata();
    await this.eventsService.registerEvent({
      source: metadata.source,
      entity: 'PlatoTipico',
      action,
      title: `${action} PlatoTipico`,
      description: `Operacion ${action} ejecutada desde el CRUD de platos tipicos`,
      payload: {
        platoId,
        metadata,
      },
    });

    return { data, metadata };
  }
}
