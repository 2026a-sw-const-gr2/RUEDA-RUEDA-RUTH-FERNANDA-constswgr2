import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from './../src/app.module';

describe('PlatosTipicosController (e2e)', () => {
  let app: INestApplication;
  const createdIds: number[] = [];
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

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

    createdIds.push(response.body.data.id);
    return response;
  };

  const expectMetadata = (body: {
    metadata?: Record<string, string>;
  }): void => {
    expect(body.metadata).toMatchObject({
      source: 'platos-tipicos-crud',
      system: 'Sistema de Platos Típicos Ecuatorianos',
      apiVersion: 'v1',
      timezone: 'America/Guayaquil',
      environment: expect.any(String),
      integrationTarget: 'EPN Event Manager',
    });
    expect(body.metadata?.timestampISO).toMatch(isoRegex);
  };

  it('crea un plato tipico', async () => {
    const nombre = `Encebollado Crear ${Date.now()}`;
    const response = await createPlato(nombre);

    expect(response.body).toMatchObject({
      data: {
        id: expect.any(Number),
        nombre,
        region: 'Costa',
        precio: 3.5,
      },
    });
    expectMetadata(response.body);
  });

  it('lista platos tipicos', async () => {
    const nombre = `Encebollado Listar ${Date.now()}`;
    const createResponse = await createPlato(nombre);

    const listResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .get('/platos-tipicos')
      .expect(200);

    expect(listResponse.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createResponse.body.data.id,
          nombre,
        }),
      ]),
    );
    expectMetadata(listResponse.body);
  });

  it('consulta un plato tipico existente', async () => {
    const nombre = `Encebollado Consultar ${Date.now()}`;
    const createResponse = await createPlato(nombre);

    const getResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .get(`/platos-tipicos/${createResponse.body.data.id}`)
      .expect(200);

    expect(getResponse.body).toMatchObject({
      data: {
        id: createResponse.body.data.id,
        nombre,
      },
    });
    expectMetadata(getResponse.body);
  });

  it('devuelve 404 al consultar un plato tipico inexistente', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get('/platos-tipicos/99999999')
      .expect(404);
  });

  it('devuelve estadisticas de platos tipicos', async () => {
    await createPlato(`Encebollado Stats Costa ${Date.now()}`);

    const segundoPlato = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .post('/platos-tipicos')
      .send({
        ...platoPayload(`Locro Stats Sierra ${Date.now()}`),
        region: 'Sierra',
        categoria: 'Sopa andina',
        precio: 5.75,
      })
      .expect(201);
    createdIds.push(segundoPlato.body.data.id);

    const listResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .get('/platos-tipicos')
      .expect(200);
    const platos = listResponse.body.data as Array<{
      precio: number;
      region: string;
      categoria: string;
    }>;
    const precios = platos.map((plato) => Number(plato.precio));
    const totalPrecio = precios.reduce((total, precio) => total + precio, 0);
    const countBy = (field: 'region' | 'categoria') =>
      platos.reduce<Record<string, number>>((acc, plato) => {
        acc[plato[field]] = (acc[plato[field]] ?? 0) + 1;
        return acc;
      }, {});

    const statsResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .get('/platos-tipicos/stats')
      .expect(200);

    expect(statsResponse.body.data).toMatchObject({
      totalPlatos: platos.length,
      precioPromedio: totalPrecio / platos.length,
      precioMinimo: Math.min(...precios),
      precioMaximo: Math.max(...precios),
      platosPorRegion: countBy('region'),
      platosPorCategoria: countBy('categoria'),
    });
    expect(statsResponse.body.data.generatedAt).toMatch(isoRegex);
    expect(statsResponse.body.data).not.toHaveProperty('platosDisponibles');
    expect(statsResponse.body.data).not.toHaveProperty('platosNoDisponibles');
    expectMetadata(statsResponse.body);
  });

  it('actualiza un plato tipico existente', async () => {
    const nombre = `Encebollado Actualizar ${Date.now()}`;
    const createResponse = await createPlato(nombre);

    const updateResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .patch(`/platos-tipicos/${createResponse.body.data.id}`)
      .send({
        precio: 4.25,
        categoria: 'Sopa actualizada',
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      data: {
        id: createResponse.body.data.id,
        nombre,
        precio: 4.25,
        categoria: 'Sopa actualizada',
      },
    });
    expectMetadata(updateResponse.body);
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
    const id = createResponse.body.data.id;
    createdIds.splice(createdIds.indexOf(id), 1);

    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .delete(`/platos-tipicos/${id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          data: { deleted: true, id },
        });
        expectMetadata(response.body);
      });

    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get(`/platos-tipicos/${id}`)
      .expect(404);
  });

  it('devuelve 404 al eliminar un plato tipico inexistente', async () => {
    const response = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .delete('/platos-tipicos/99999999')
      .expect(404);

    expect(response.body).not.toMatchObject({
      deleted: true,
      id: 99999999,
    });
  });

  it('mantiene eliminado el plato tipico en SQLite despues de reiniciar', async () => {
    const nombre = `Encebollado Eliminar Persistente ${Date.now()}`;
    const createResponse = await createPlato(nombre);
    const id = createResponse.body.data.id;
    createdIds.splice(createdIds.indexOf(id), 1);

    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .delete(`/platos-tipicos/${id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          data: { deleted: true, id },
        });
        expectMetadata(response.body);
      });

    await app.close();
    app = await createApp();

    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get(`/platos-tipicos/${id}`)
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

    expect(listResponse.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createResponse.body.data.id,
          nombre,
        }),
      ]),
    );
    expectMetadata(listResponse.body);

    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .delete(`/platos-tipicos/${createResponse.body.data.id}`)
      .expect(200);
  });
});
