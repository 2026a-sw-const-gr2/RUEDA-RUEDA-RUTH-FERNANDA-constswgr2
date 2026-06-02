import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from './../src/app.module';

describe('PlatosTipicosController (e2e)', () => {
  let app: INestApplication;
  const createdIds: number[] = [];
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  const apiKey = 'clave-e2e';

  const createApp = async (): Promise<INestApplication> => {
    process.env.FIS_EPN_API_KEY = apiKey;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const nestApp = moduleFixture.createNestApplication();
    await nestApp.init();
    return nestApp;
  };

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    app = await createApp();
  });

  afterEach(async () => {
    for (const id of createdIds.splice(0)) {
      await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
        .delete(`/platos-tipicos/${id}`)
        .set('X-FIS-EPN-KEY', apiKey)
        .catch(() => undefined);
    }

    await app.close();
    jest.restoreAllMocks();
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
      .set('X-FIS-EPN-KEY', apiKey)
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

  const expectLogContaining = (
    method: 'log' | 'warn' | 'error',
    expected: Record<string, unknown>,
  ): void => {
    const spy = jest.spyOn(Logger.prototype, method);
    expect(spy).toHaveBeenCalledWith(expect.any(String));
    const parsedLogs = spy.mock.calls
      .filter(([message]) => (message as string).startsWith('{'))
      .map(([message]) => JSON.parse(message as string));
    expect(parsedLogs).toEqual(
      expect.arrayContaining([expect.objectContaining(expected)]),
    );
  };

  it('permite health sin API Key', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get('/health')
      .expect(200);
  });

  it('devuelve 401 si falta API Key en endpoints del CRUD', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get('/platos-tipicos')
      .expect(401);

    expectLogContaining('warn', {
      level: 'WARN',
      action: 'API_KEY_VALIDATION',
      route: '/platos-tipicos',
    });
  });

  it('devuelve 401 si API Key es incorrecta', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get('/platos-tipicos')
      .set('X-FIS-EPN-KEY', 'clave-incorrecta')
      .expect(401);
  });

  it('permite acceder con API Key correcta', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get('/platos-tipicos')
      .set('X-FIS-EPN-KEY', apiKey)
      .expect(200);
  });

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
    expectLogContaining('log', {
      level: 'INFO',
      action: 'CREATE',
      route: '/platos-tipicos',
      platoId: response.body.data.id,
    });
  });

  it('lista platos tipicos', async () => {
    const nombre = `Encebollado Listar ${Date.now()}`;
    const createResponse = await createPlato(nombre);

    const listResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .get('/platos-tipicos')
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
      .expect(404);
  });

  it('devuelve estadisticas de platos tipicos', async () => {
    await createPlato(`Encebollado Stats Costa ${Date.now()}`);

    const segundoPlato = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .post('/platos-tipicos')
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
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

  it('rechaza campos obligatorios vacios o con solo espacios', async () => {
    const invalidPayloads = [
      { nombre: '' },
      { nombre: '   ' },
      { descripcion: '' },
      { descripcion: '   ' },
      { region: '' },
      { region: '   ' },
      { ingredientes: '' },
      { ingredientes: '   ' },
      { categoria: '' },
      { categoria: '   ' },
    ];

    for (const invalidPart of invalidPayloads) {
      await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
        .post('/platos-tipicos')
        .set('X-FIS-EPN-KEY', apiKey)
        .send({
          ...platoPayload(`Validacion Vacio ${Date.now()}`),
          ...invalidPart,
        })
        .expect(400);
    }
  });

  it('rechaza precio negativo', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .post('/platos-tipicos')
      .set('X-FIS-EPN-KEY', apiKey)
      .send({
        ...platoPayload(`Validacion Precio ${Date.now()}`),
        precio: -1,
      })
      .expect(400);

    expectLogContaining('warn', {
      level: 'WARN',
      action: 'VALIDATION',
      route: '/platos-tipicos',
    });
  });

  it('rechaza imagenUrl invalida', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .post('/platos-tipicos')
      .set('X-FIS-EPN-KEY', apiKey)
      .send({
        ...platoPayload(`Validacion Url ${Date.now()}`),
        imagenUrl: 'imagen-local',
      })
      .expect(400);
  });

  it('rechaza texto con script', async () => {
    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .post('/platos-tipicos')
      .set('X-FIS-EPN-KEY', apiKey)
      .send({
        ...platoPayload(`Validacion Script ${Date.now()}`),
        descripcion: 'Descripcion con <script>alert(1)</script>',
      })
      .expect(400);
  });

  it('rechaza texto con patrones SQL peligrosos', async () => {
    const sqlPayloads = [
      { nombre: 'SELECT * FROM platos' },
      { descripcion: 'DROP TABLE platos_tipicos' },
      { ingredientes: 'INSERT INTO platos values' },
      { categoria: 'Sopa -- comentario' },
    ];

    for (const invalidPart of sqlPayloads) {
      await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
        .post('/platos-tipicos')
        .set('X-FIS-EPN-KEY', apiKey)
        .send({
          ...platoPayload(`Validacion SQL ${Date.now()}`),
          ...invalidPart,
        })
        .expect(400);
    }
  });

  it('rechaza textos demasiado largos', async () => {
    const longPayloads = [
      { nombre: 'N'.repeat(101) },
      { descripcion: 'D'.repeat(501) },
      { categoria: 'C'.repeat(81) },
    ];

    for (const invalidPart of longPayloads) {
      await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
        .post('/platos-tipicos')
        .set('X-FIS-EPN-KEY', apiKey)
        .send({
          ...platoPayload(`Validacion Largo ${Date.now()}`),
          ...invalidPart,
        })
        .expect(400);
    }
  });

  it('aplica trim a textos antes de guardar', async () => {
    const response = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .post('/platos-tipicos')
      .set('X-FIS-EPN-KEY', apiKey)
      .send({
        ...platoPayload(`  Encebollado Trim ${Date.now()}  `),
        region: '  Costa  ',
        categoria: '  Sopa tradicional  ',
      })
      .expect(201);

    createdIds.push(response.body.data.id);

    expect(response.body.data.nombre).toMatch(/^Encebollado Trim/);
    expect(response.body.data.nombre).not.toMatch(/^ /);
    expect(response.body.data.nombre).not.toMatch(/ $/);
    expect(response.body.data.region).toBe('Costa');
    expect(response.body.data.categoria).toBe('Sopa tradicional');
  });

  it('actualiza un plato tipico existente', async () => {
    const nombre = `Encebollado Actualizar ${Date.now()}`;
    const createResponse = await createPlato(nombre);

    const updateResponse = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .patch(`/platos-tipicos/${createResponse.body.data.id}`)
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          data: { deleted: true, id },
        });
        expectMetadata(response.body);
      });

    await supertest(app.getHttpServer() as Parameters<typeof supertest>[0])
      .get(`/platos-tipicos/${id}`)
      .set('X-FIS-EPN-KEY', apiKey)
      .expect(404);
  });

  it('devuelve 404 al eliminar un plato tipico inexistente', async () => {
    const response = await supertest(
      app.getHttpServer() as Parameters<typeof supertest>[0],
    )
      .delete('/platos-tipicos/99999999')
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
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
      .set('X-FIS-EPN-KEY', apiKey)
      .expect(200);
  });
});
