import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { IrrfController } from './irrf.controller';
import { IrrfService } from './irrf.service';

describe('IrrfController (gateway)', () => {
  let app: INestApplication;
  const service = {
    findAllTabelas: jest.fn().mockResolvedValue([]),
    findTabelaVigente: jest.fn().mockResolvedValue({ id: 1 }),
    findOneTabela: jest.fn().mockResolvedValue({ id: 5 }),
    createTabela: jest.fn().mockResolvedValue({ id: 2 }),
    updateTabela: jest.fn().mockResolvedValue({ id: 2 }),
    removeTabela: jest.fn().mockResolvedValue({ message: 'ok' }),
    calcular: jest.fn().mockResolvedValue({ valorIrrf: 0 }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IrrfController],
      providers: [{ provide: IrrfService, useValue: service }],
    }).compile();

    app = module.createNestApplication();
    // Simula o JwtMiddleware: o papel do usuário vem do cabeçalho de teste
    app.use((req: any, _res: any, next: () => void) => {
      req.user = { role: req.headers['x-teste-role'], rawToken: 'token' };
      next();
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  const como = (role: string) => ({ 'x-teste-role': role });

  it('GET /irrf/tabelas/vigente não cai na rota :id e repassa a data', async () => {
    await request(app.getHttpServer()).get('/irrf/tabelas/vigente?data=2026-03-10').set(como('USER')).expect(200);

    expect(service.findOneTabela).not.toHaveBeenCalled();
    expect(service.findTabelaVigente).toHaveBeenCalledWith('2026-03-10', expect.objectContaining({ role: 'USER' }));
  });

  it('GET /irrf/tabelas/:id busca por id', async () => {
    await request(app.getHttpServer()).get('/irrf/tabelas/5').set(como('USER')).expect(200);

    expect(service.findOneTabela).toHaveBeenCalledWith(5, expect.anything());
  });

  it('USER pode consultar e calcular', async () => {
    await request(app.getHttpServer()).get('/irrf/tabelas').set(como('USER')).expect(200);
    await request(app.getHttpServer()).post('/irrf/calcular').set(como('USER')).send({ baseCalculo: 1 }).expect(201);
  });

  it.each([
    ['POST', '/irrf/tabelas'],
    ['PATCH', '/irrf/tabelas/2'],
    ['DELETE', '/irrf/tabelas/2'],
  ])('USER não pode %s %s (403, sem chamar o microsserviço)', async (metodo, url) => {
    await (request(app.getHttpServer()) as any)[metodo.toLowerCase()](url).set(como('USER')).send({}).expect(403);

    expect(service.createTabela).not.toHaveBeenCalled();
    expect(service.updateTabela).not.toHaveBeenCalled();
    expect(service.removeTabela).not.toHaveBeenCalled();
  });

  it('ADMIN cadastra, edita e exclui', async () => {
    await request(app.getHttpServer()).post('/irrf/tabelas').set(como('ADMIN')).send({ descricao: 'x' }).expect(201);
    await request(app.getHttpServer()).patch('/irrf/tabelas/2').set(como('ADMIN')).send({ descricao: 'y' }).expect(200);
    await request(app.getHttpServer()).delete('/irrf/tabelas/2').set(como('ADMIN')).expect(200);

    expect(service.createTabela).toHaveBeenCalledWith({ descricao: 'x' }, expect.anything());
    expect(service.updateTabela).toHaveBeenCalledWith(2, { descricao: 'y' }, expect.anything());
    expect(service.removeTabela).toHaveBeenCalledWith(2, expect.anything());
  });
});
