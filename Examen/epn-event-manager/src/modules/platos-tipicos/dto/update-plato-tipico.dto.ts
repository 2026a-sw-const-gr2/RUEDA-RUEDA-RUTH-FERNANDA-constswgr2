import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlatoTipicoDto {
  @ApiPropertyOptional({
    example: 'Encebollado manabi',
    maxLength: 100,
    description: 'Nombre actualizado del plato tipico.',
  })
  nombre?: string;

  @ApiPropertyOptional({
    example: 'Descripcion actualizada del plato.',
    maxLength: 500,
    description: 'Descripcion actualizada del plato.',
  })
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'Costa',
    description: 'Region actualizada del Ecuador.',
  })
  region?: string;

  @ApiPropertyOptional({
    example: 'Pescado, yuca, cebolla, tomate, limon y cilantro',
    description: 'Ingredientes actualizados del plato.',
  })
  ingredientes?: string;

  @ApiPropertyOptional({
    example: 4,
    minimum: 0,
    description: 'Precio referencial actualizado.',
  })
  precio?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/encebollado-actualizado.jpg',
    description: 'URL actualizada de imagen del plato.',
  })
  imagenUrl?: string;

  @ApiPropertyOptional({
    example: 'Sopa',
    maxLength: 80,
    description: 'Categoria actualizada del plato.',
  })
  categoria?: string;
}
