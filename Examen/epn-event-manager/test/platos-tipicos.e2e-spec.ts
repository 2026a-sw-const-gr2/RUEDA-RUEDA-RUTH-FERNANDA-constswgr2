import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from './../src/app.module';

describe('PlatosTipicosController (e2e)', () => {
  let app: INestApplication;

  const createApp = async (): Promise<INestApplication> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const nestApp = moduleFixture.createNestApplication();
    await nestApp.init();
    return nestApp;
  };

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('persiste un plato tipico en SQLite despues de reiniciar la aplicacion', async () => {
    const nombre = `Encebollado Persistente ${Date.now()}`;

    const createResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .post('/platos-tipicos')
      .send({
        nombre,
        descripcion: 'Plato tradicional de la Costa ecuatoriana.',
        region: 'Costa',
        ingredientes: 'Pescado, yuca, cebolla, tomate y limon',
        precio: 3.5,
        imagenUrl: 'https://example.com/encebollado.jpg',
        categoria: 'Sopa tradicional',
      })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      id: expect.any(Number),
      nombre,
      region: 'Costa',
      precio: 3.5,
    });

    await app.close();
    app = await createApp();

    const listResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .get('/platos-tipicos')
      .expect(200);

    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createResponse.body.id,
          nombre,
        }),
      ]),
    );

    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .delete(`/platos-tipicos/${createResponse.body.id}`)
      .expect(200);
  });
});
