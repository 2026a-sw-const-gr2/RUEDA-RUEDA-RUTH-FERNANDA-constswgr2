import { ApiProperty } from '@nestjs/swagger';

export class CreatePlatoTipicoDto {
  @ApiProperty({
    example: 'Encebollado',
    maxLength: 100,
    description: 'Nombre del plato tipico ecuatoriano.',
  })
  nombre: string;

  @ApiProperty({
    example: 'Plato tradicional de la Costa ecuatoriana preparado con pescado.',
    maxLength: 500,
    description: 'Descripcion general del plato.',
  })
  descripcion: string;

  @ApiProperty({
    example: 'Costa',
    description: 'Region del Ecuador a la que pertenece el plato.',
  })
  region: string;

  @ApiProperty({
    example: 'Pescado, yuca, cebolla, tomate y limon',
    description: 'Ingredientes principales del plato.',
  })
  ingredientes: string;

  @ApiProperty({
    example: 3.5,
    minimum: 0,
    description: 'Precio referencial del plato.',
  })
  precio: number;

  @ApiProperty({
    example: 'https://example.com/encebollado.jpg',
    description: 'URL publica de una imagen del plato.',
  })
  imagenUrl: string;

  @ApiProperty({
    example: 'Sopa tradicional',
    maxLength: 80,
    description: 'Categoria gastronomica del plato.',
  })
  categoria: string;
}
