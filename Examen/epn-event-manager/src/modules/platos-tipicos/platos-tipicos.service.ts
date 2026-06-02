import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatoTipicoEntity } from '../../database/entities/plato-tipico.entity';
import { EventsService } from '../events/events.service';
import { CreatePlatoTipicoDto } from './dto/create-plato-tipico.dto';
import { UpdatePlatoTipicoDto } from './dto/update-plato-tipico.dto';

type PlatoTipicoAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'QUERY';
type LogAction = PlatoTipicoAction | 'READ' | 'VALIDATION';
type TextField = Exclude<keyof CreatePlatoTipicoDto, 'precio'>;

export interface PlatosTipicosStats {
  totalPlatos: number;
  precioPromedio: number;
  precioMinimo: number;
  precioMaximo: number;
  platosPorRegion: Record<string, number>;
  platosPorCategoria: Record<string, number>;
  generatedAt: string;
}

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
  private readonly logger = new Logger(PlatosTipicosService.name);

  constructor(
    @InjectRepository(PlatoTipicoEntity)
    private readonly platosRepo: Repository<PlatoTipicoEntity>,
    private readonly eventsService: EventsService,
  ) {}

  async create(
    dto: CreatePlatoTipicoDto,
  ): Promise<ResponseWithMetadata<PlatoTipicoEntity>> {
    try {
      const sanitizedDto = this.sanitizeCreateDto(dto);
      const plato = this.platosRepo.create({
        ...sanitizedDto,
        precio: Number(sanitizedDto.precio),
      });
      const saved = await this.platosRepo.save(plato);
      this.logInfo('CREATE', '/platos-tipicos', saved.id);
      return this.withMetadata(saved, 'CREATE', saved.id);
    } catch (error) {
      this.logOperationError('CREATE', '/platos-tipicos', error);
      throw error;
    }
  }

  async findAll(): Promise<ResponseWithMetadata<PlatoTipicoEntity[]>> {
    try {
      const platos = await this.platosRepo.find({ order: { id: 'ASC' } });
      this.logInfo('READ', '/platos-tipicos');
      return this.withMetadata(platos, 'QUERY');
    } catch (error) {
      this.logOperationError('READ', '/platos-tipicos', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ResponseWithMetadata<PlatoTipicoEntity>> {
    try {
      const plato = await this.findEntityById(id);
      this.logInfo('READ', '/platos-tipicos/:id', id);
      return this.withMetadata(plato, 'QUERY', id);
    } catch (error) {
      this.logOperationError('READ', '/platos-tipicos/:id', error, id);
      throw error;
    }
  }

  async getStats(): Promise<ResponseWithMetadata<PlatosTipicosStats>> {
    try {
      const platos = await this.platosRepo.find();
      const precios = platos.map((plato) => Number(plato.precio));
      const totalPrecio = precios.reduce((total, precio) => total + precio, 0);
      const totalPlatos = platos.length;
      const stats: PlatosTipicosStats = {
        totalPlatos,
        precioPromedio: totalPlatos === 0 ? 0 : totalPrecio / totalPlatos,
        precioMinimo: totalPlatos === 0 ? 0 : Math.min(...precios),
        precioMaximo: totalPlatos === 0 ? 0 : Math.max(...precios),
        platosPorRegion: this.countBy(platos, 'region'),
        platosPorCategoria: this.countBy(platos, 'categoria'),
        generatedAt: new Date().toISOString(),
      };

      this.logInfo('READ', '/platos-tipicos/stats');
      return this.withMetadata(stats, 'QUERY');
    } catch (error) {
      this.logOperationError('READ', '/platos-tipicos/stats', error);
      throw error;
    }
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
    try {
      const sanitizedDto = this.sanitizeUpdateDto(dto);
      const plato = await this.findEntityById(id);
      Object.assign(plato, {
        ...sanitizedDto,
        precio:
          sanitizedDto.precio === undefined
            ? plato.precio
            : Number(sanitizedDto.precio),
      });
      const saved = await this.platosRepo.save(plato);
      this.logInfo('UPDATE', '/platos-tipicos/:id', id);
      return this.withMetadata(saved, 'UPDATE', id);
    } catch (error) {
      this.logOperationError('UPDATE', '/platos-tipicos/:id', error, id);
      throw error;
    }
  }

  async remove(
    id: number,
  ): Promise<ResponseWithMetadata<{ deleted: boolean; id: number }>> {
    try {
      const plato = await this.findEntityById(id);
      await this.platosRepo.remove(plato);
      this.logInfo('DELETE', '/platos-tipicos/:id', id);
      return this.withMetadata({ deleted: true, id }, 'DELETE', id);
    } catch (error) {
      this.logOperationError('DELETE', '/platos-tipicos/:id', error, id);
      throw error;
    }
  }

  private sanitizeCreateDto(dto: CreatePlatoTipicoDto): CreatePlatoTipicoDto {
    const textFields: TextField[] = [
      'nombre',
      'descripcion',
      'region',
      'ingredientes',
      'imagenUrl',
      'categoria',
    ];
    const sanitized = { ...dto };

    for (const field of textFields) {
      sanitized[field] = this.sanitizeTextField(field, dto[field]);
    }

    if (dto.precio === undefined || dto.precio === null) {
      throw new BadRequestException('El campo precio es obligatorio');
    }

    this.validatePrecio(dto.precio);
    return sanitized;
  }

  private sanitizeUpdateDto(dto: UpdatePlatoTipicoDto): UpdatePlatoTipicoDto {
    const sanitized = { ...dto };

    for (const [field, value] of Object.entries(dto)) {
      if (field === 'precio') {
        continue;
      }

      sanitized[field as TextField] = this.sanitizeTextField(
        field as TextField,
        value,
      );
    }

    if (dto.precio !== undefined) {
      this.validatePrecio(dto.precio);
    }

    return sanitized;
  }

  private validatePrecio(precio: number): void {
    const numericPrice = Number(precio);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      this.logWarn(
        'VALIDATION',
        '/platos-tipicos',
        'El precio debe ser un numero mayor o igual a 0',
      );
      throw new BadRequestException(
        'El precio debe ser un numero mayor o igual a 0',
      );
    }
  }

  private sanitizeTextField(field: TextField, value: unknown): string {
    if (typeof value !== 'string') {
      this.logWarn(
        'VALIDATION',
        '/platos-tipicos',
        `El campo ${field} es obligatorio`,
      );
      throw new BadRequestException(`El campo ${field} es obligatorio`);
    }

    const sanitized = value.trim();

    if (sanitized.length === 0) {
      this.logWarn(
        'VALIDATION',
        '/platos-tipicos',
        `El campo ${field} es obligatorio`,
      );
      throw new BadRequestException(`El campo ${field} es obligatorio`);
    }

    this.validateTextLength(field, sanitized);
    this.validateSafeText(field, sanitized);

    if (field === 'imagenUrl') {
      this.validateImageUrl(sanitized);
    }

    return sanitized;
  }

  private validateTextLength(field: TextField, value: string): void {
    const limits: Partial<Record<TextField, number>> = {
      nombre: 100,
      descripcion: 500,
      region: 100,
      ingredientes: 500,
      imagenUrl: 2048,
      categoria: 80,
    };
    const limit = limits[field];

    if (limit !== undefined && value.length > limit) {
      this.logWarn(
        'VALIDATION',
        '/platos-tipicos',
        `El campo ${field} no debe superar ${limit} caracteres`,
      );
      throw new BadRequestException(
        `El campo ${field} no debe superar ${limit} caracteres`,
      );
    }
  }

  private validateSafeText(field: TextField, value: string): void {
    const dangerousPattern = /<\s*script\b|\b(SELECT|DROP|INSERT)\b|--/i;

    if (dangerousPattern.test(value)) {
      this.logWarn(
        'VALIDATION',
        '/platos-tipicos',
        `El campo ${field} contiene texto no permitido`,
      );
      throw new BadRequestException(
        `El campo ${field} contiene texto no permitido`,
      );
    }
  }

  private validateImageUrl(value: string): void {
    try {
      const url = new URL(value);

      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      this.logWarn(
        'VALIDATION',
        '/platos-tipicos',
        'El campo imagenUrl debe ser una URL valida',
      );
      throw new BadRequestException(
        'El campo imagenUrl debe ser una URL valida',
      );
    }
  }

  private countBy(
    platos: PlatoTipicoEntity[],
    field: 'region' | 'categoria',
  ): Record<string, number> {
    return platos.reduce<Record<string, number>>((acc, plato) => {
      acc[plato[field]] = (acc[plato[field]] ?? 0) + 1;
      return acc;
    }, {});
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

  private logInfo(action: LogAction, route: string, platoId?: number): void {
    this.logger.log(
      JSON.stringify({
        level: 'INFO',
        timestampISO: new Date().toISOString(),
        route,
        action,
        platoId,
        message: `Operacion ${action} ejecutada`,
      }),
    );
  }

  private logWarn(
    action: LogAction,
    route: string,
    message: string,
    platoId?: number,
  ): void {
    this.logger.warn(
      JSON.stringify({
        level: 'WARN',
        timestampISO: new Date().toISOString(),
        route,
        action,
        platoId,
        message,
      }),
    );
  }

  private logError(
    action: LogAction,
    route: string,
    message: string,
    platoId?: number,
  ): void {
    this.logger.error(
      JSON.stringify({
        level: 'ERROR',
        timestampISO: new Date().toISOString(),
        route,
        action,
        platoId,
        message,
      }),
    );
  }

  private logOperationError(
    action: LogAction,
    route: string,
    error: unknown,
    platoId?: number,
  ): void {
    const message =
      error instanceof Error ? error.message : 'Error no identificado';

    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      this.logWarn(action, route, message, platoId);
      return;
    }

    this.logError(action, route, message, platoId);
  }
}
