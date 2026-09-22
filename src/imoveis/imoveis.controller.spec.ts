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
    findDespesasPorImovel: jest.fn().mockResolvedValue([]),
    findImoveisByLocador: jest.fn().mockResolvedValue([]),
    findOneImovel: jest.fn().mockResolvedValue({ id: 5 }),
    listarReajustes: jest.fn().mockResolvedValue([]),
    prepararMemoriaCalculo: jest.fn().mockResolvedValue({}),
    listarMemoriasCalculo: jest.fn().mockResolvedValue([]),
    buscarMemoriaCalculo: jest.fn().mockResolvedValue({ id: 1 }),
    baixarMemoriaCalculoExcel: jest.fn().mockResolvedValue({ buffer: Buffer.from('PK'), nomeArquivo: 'memoria.xlsx' }),
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

  it('GET /imoveis/despesas/imovel/:idImovel não cai na rota :id', async () => {
    await request(app.getHttpServer()).get('/imoveis/despesas/imovel/9?emAberto=true').expect(200);

    expect(service.findOneImovel).not.toHaveBeenCalled();
    expect(service.findDespesasPorImovel).toHaveBeenCalledWith(9, 'true', undefined);
  });

  it('GET /imoveis/contratos/:id/reajustes não cai na rota /imoveis/:id nem em /contratos/:id', async () => {
    await request(app.getHttpServer()).get('/imoveis/contratos/4/reajustes').expect(200);

    expect(service.findOneImovel).not.toHaveBeenCalled();
    expect(service.listarReajustes).toHaveBeenCalledWith(4, undefined);
  });

  it('GET /imoveis/memoria-calculo/imovel/:idImovel/preparacao não cai na rota :id', async () => {
    await request(app.getHttpServer()).get('/imoveis/memoria-calculo/imovel/9/preparacao?competencia=2026-07-01').expect(200);

    expect(service.findOneImovel).not.toHaveBeenCalled();
    expect(service.prepararMemoriaCalculo).toHaveBeenCalledWith(9, '2026-07-01', undefined);
  });

  it('GET /imoveis/memoria-calculo/imovel/:idImovel/historico não cai na rota :id', async () => {
    await request(app.getHttpServer()).get('/imoveis/memoria-calculo/imovel/9/historico').expect(200);

    expect(service.findOneImovel).not.toHaveBeenCalled();
    expect(service.listarMemoriasCalculo).toHaveBeenCalledWith(9, undefined);
  });

  it('GET /imoveis/memoria-calculo/:id busca a memória, e não o imóvel', async () => {
    await request(app.getHttpServer()).get('/imoveis/memoria-calculo/1').expect(200);

    expect(service.findOneImovel).not.toHaveBeenCalled();
    expect(service.buscarMemoriaCalculo).toHaveBeenCalledWith(1, undefined);
  });

  it('GET /imoveis/memoria-calculo/:id/excel devolve o binário com content-type correto', async () => {
    const resposta = await request(app.getHttpServer()).get('/imoveis/memoria-calculo/1/excel').expect(200);

    expect(resposta.headers['content-type']).toContain('spreadsheetml');
    expect(resposta.headers['content-disposition']).toContain('memoria.xlsx');
  });
});
