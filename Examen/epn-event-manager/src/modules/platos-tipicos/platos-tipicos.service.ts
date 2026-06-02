import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatoTipicoEntity } from '../../database/entities/plato-tipico.entity';
import { CreatePlatoTipicoDto } from './dto/create-plato-tipico.dto';
import { UpdatePlatoTipicoDto } from './dto/update-plato-tipico.dto';

@Injectable()
export class PlatosTipicosService {
  constructor(
    @InjectRepository(PlatoTipicoEntity)
    private readonly platosRepo: Repository<PlatoTipicoEntity>,
  ) {}

  async create(dto: CreatePlatoTipicoDto): Promise<PlatoTipicoEntity> {
    this.validateCreateDto(dto);
    const plato = this.platosRepo.create({
      ...dto,
      precio: Number(dto.precio),
    });
    return this.platosRepo.save(plato);
  }

  findAll(): Promise<PlatoTipicoEntity[]> {
    return this.platosRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<PlatoTipicoEntity> {
    const plato = await this.platosRepo.findOneBy({ id });

    if (!plato) {
      throw new NotFoundException(`No existe el plato tipico con id ${id}`);
    }

    return plato;
  }

  async update(
    id: number,
    dto: UpdatePlatoTipicoDto,
  ): Promise<PlatoTipicoEntity> {
    this.validateUpdateDto(dto);
    const plato = await this.findOne(id);
    Object.assign(plato, {
      ...dto,
      precio: dto.precio === undefined ? plato.precio : Number(dto.precio),
    });
    return this.platosRepo.save(plato);
  }

  async remove(id: number): Promise<{ deleted: boolean; id: number }> {
    const plato = await this.findOne(id);
    await this.platosRepo.remove(plato);
    return { deleted: true, id };
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
}
