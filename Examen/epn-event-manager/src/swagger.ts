import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('EPN Event Manager - Platos Tipicos')
    .setDescription(
      'API para mantenimiento de platos tipicos ecuatorianos con persistencia SQLite.',
    )
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-FIS-EPN-KEY',
        in: 'header',
        description: 'API Key requerida para endpoints del CRUD.',
      },
      'X-FIS-EPN-KEY',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
