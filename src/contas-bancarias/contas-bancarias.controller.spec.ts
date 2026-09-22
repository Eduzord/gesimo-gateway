import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ContasBancariasController } from './contas-bancarias.controller';
import { ContasBancariasService } from './contas-bancarias.service';

describe('ContasBancariasController', () => {
  let app: INestApplication;
  const service = {
    listar: jest.fn().mockResolvedValue([]),
    buscarPadrao: jest.fn().mockResolvedValue({ id: 1 }),
    buscarPorId: jest.fn().mockResolvedValue({ id: 5 }),
    criar: jest.fn().mockResolvedValue({ id: 2 }),
    atualizar: jest.fn().mockResolvedValue({ id: 5 }),
    tornarPadrao: jest.fn().mockResolvedValue({ id: 5, padrao: true }),
    reativar: jest.fn().mockResolvedValue({ id: 5, status: 'ATIVO' }),
    inativar: jest.fn().mockResolvedValue({ id: 5, status: 'INATIVO' }),
    removerDefinitivo: jest.fn().mockResolvedValue({ message: 'ok' }),
  };

  // Simula o JwtMiddleware: o papel do usuário vem do cabeçalho de teste
  const comoRole = (role?: string) => ({ 'x-teste-role': role ?? '' });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContasBancariasController],
      providers: [{ provide: ContasBancariasService, useValue: service }],
    }).compile();

    app = module.createNestApplication();
    app.use((req: any, _res: any, next: () => void) => {
      req.user = { role: req.headers['x-teste-role'] || undefined, rawToken: 'token' };
      next();
    });
    await app.init();
  });

  afterAll(async () => app.close());
  beforeEach(() => jest.clearAllMocks());

  it('GET /contas-bancarias/padrao não cai na rota :id', async () => {
    await request(app.getHttpServer()).get('/contas-bancarias/padrao').expect(200);

    expect(service.buscarPorId).not.toHaveBeenCalled();
    expect(service.buscarPadrao).toHaveBeenCalled();
  });

  it('GET /contas-bancarias/:id busca por id', async () => {
    await request(app.getHttpServer()).get('/contas-bancarias/5').expect(200);

    expect(service.buscarPorId).toHaveBeenCalledWith(5, expect.anything());
  });

  it('POST/PATCH não exigem ADMIN (qualquer usuário autenticado pode gerenciar contas)', async () => {
    await request(app.getHttpServer()).post('/contas-bancarias').set(comoRole('USER')).send({ descricao: 'x' }).expect(201);
    await request(app.getHttpServer()).patch('/contas-bancarias/5').set(comoRole('USER')).send({}).expect(200);
    await request(app.getHttpServer()).delete('/contas-bancarias/5').set(comoRole('USER')).expect(200);

    expect(service.criar).toHaveBeenCalled();
    expect(service.atualizar).toHaveBeenCalled();
    expect(service.inativar).toHaveBeenCalled();
  });

  it('DELETE /:id/hard exige ADMIN (403 para USER, sem chamar o microsserviço)', async () => {
    await request(app.getHttpServer()).delete('/contas-bancarias/5/hard').set(comoRole('USER')).expect(401);

    expect(service.removerDefinitivo).not.toHaveBeenCalled();
  });

  it('DELETE /:id/hard funciona para ADMIN', async () => {
    await request(app.getHttpServer()).delete('/contas-bancarias/5/hard').set(comoRole('ADMIN')).expect(200);

    expect(service.removerDefinitivo).toHaveBeenCalledWith(5, expect.anything());
  });
});
