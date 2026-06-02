import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from './../src/app.module';

describe('PlatosTipicosController (e2e)', () => {
  let app: INestApplication;
  const createdIds: number[] = [];

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
    for (const id of createdIds.splice(0)) {
      await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
        .delete(`/platos-tipicos/${id}`)
        .catch(() => undefined);
    }

    await app.close();
  });

  const platoPayload = (nombre: string) => ({
    nombre,
    descripcion: 'Plato tradicional de la Costa ecuatoriana.',
    region: 'Costa',
    ingredientes: 'Pescado, yuca, cebolla, tomate y limon',
    precio: 3.5,
    imagenUrl: 'https://example.com/encebollado.jpg',
    categoria: 'Sopa tradicional',
  });

  const createPlato = async (nombre: string) => {
    const response = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .post('/platos-tipicos')
      .send(platoPayload(nombre))
      .expect(201);

    createdIds.push(response.body.id);
    return response;
  };

  it('crea un plato tipico', async () => {
    const nombre = `Encebollado Crear ${Date.now()}`;
    const response = await createPlato(nombre);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      nombre,
      region: 'Costa',
      precio: 3.5,
    });
  });

  it('lista platos tipicos', async () => {
    const nombre = `Encebollado Listar ${Date.now()}`;
    const createResponse = await createPlato(nombre);

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
  });

  it('consulta un plato tipico existente', async () => {
    const nombre = `Encebollado Consultar ${Date.now()}`;
    const createResponse = await createPlato(nombre);

    const getResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .get(`/platos-tipicos/${createResponse.body.id}`)
      .expect(200);

    expect(getResponse.body).toMatchObject({
      id: createResponse.body.id,
      nombre,
    });
  });

  it('devuelve 404 al consultar un plato tipico inexistente', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get('/platos-tipicos/99999999')
      .expect(404);
  });

  it('actualiza un plato tipico existente', async () => {
    const nombre = `Encebollado Actualizar ${Date.now()}`;
    const createResponse = await createPlato(nombre);

    const updateResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .patch(`/platos-tipicos/${createResponse.body.id}`)
      .send({
        precio: 4.25,
        categoria: 'Sopa actualizada',
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: createResponse.body.id,
      nombre,
      precio: 4.25,
      categoria: 'Sopa actualizada',
    });
  });

  it('devuelve 404 al actualizar un plato tipico inexistente', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .patch('/platos-tipicos/99999999')
      .send({ precio: 4.25 })
      .expect(404);
  });

  it('elimina un plato tipico existente', async () => {
    const nombre = `Encebollado Eliminar ${Date.now()}`;
    const createResponse = await createPlato(nombre);
    const id = createResponse.body.id;
    createdIds.splice(createdIds.indexOf(id), 1);

    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .delete(`/platos-tipicos/${id}`)
      .expect(200)
      .expect({ deleted: true, id });

    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get(`/platos-tipicos/${id}`)
      .expect(404);
  });

  it('devuelve 404 al eliminar un plato tipico inexistente', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .delete('/platos-tipicos/99999999')
      .expect(404);
  });

  it('persiste un plato tipico en SQLite despues de reiniciar la aplicacion', async () => {
    const nombre = `Encebollado Persistente ${Date.now()}`;
    const createResponse = await createPlato(nombre);

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
