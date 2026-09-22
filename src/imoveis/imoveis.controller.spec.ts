import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ImoveisController } from './imoveis.controller';
import { ImoveisService } from './imoveis.service';

describe('ImoveisController - ordem das rotas', () => {
  let app: INestApplication;
  const service = {
    checkHealth: jest.fn().mockResolvedValue({ ok: true }),
    findAllContratos: jest.fn().mockResolvedValue([]),
    findAllDespesas: jest.fn().mockResolvedValue([]),
    findImoveisByLocador: jest.fn().mockResolvedValue([]),
    findOneImovel: jest.fn().mockResolvedValue({ id: 5 }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImoveisController],
      providers: [{ provide: ImoveisService, useValue: service }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  it('GET /imoveis/contratos não cai na rota :id e repassa os filtros', async () => {
    await request(app.getHttpServer()).get('/imoveis/contratos?idImovel=3&idLocatario=8').expect(200);

    expect(service.findOneImovel).not.toHaveBeenCalled();
    expect(service.findAllContratos).toHaveBeenCalledWith(
      { idImovel: '3', idLocatario: '8', idLocador: undefined },
      undefined,
    );
  });

  it('GET /imoveis/despesas não cai na rota :id', async () => {
    await request(app.getHttpServer()).get('/imoveis/despesas').expect(200);

    expect(service.findOneImovel).not.toHaveBeenCalled();
    expect(service.findAllDespesas).toHaveBeenCalled();
  });

  it('GET /imoveis/locador/:idLocador chama a listagem por locador', async () => {
    await request(app.getHttpServer()).get('/imoveis/locador/7').expect(200);

    expect(service.findImoveisByLocador).toHaveBeenCalledWith(7, undefined);
    expect(service.findOneImovel).not.toHaveBeenCalled();
  });

  it('GET /imoveis/health continua funcionando', async () => {
    await request(app.getHttpServer()).get('/imoveis/health').expect(200);

    expect(service.checkHealth).toHaveBeenCalled();
    expect(service.findOneImovel).not.toHaveBeenCalled();
  });

  it('GET /imoveis/:id continua buscando o imóvel', async () => {
    await request(app.getHttpServer()).get('/imoveis/5').expect(200);

    expect(service.findOneImovel).toHaveBeenCalledWith(5, undefined);
  });
});
