import { Test, TestingModule } from '@nestjs/testing';
import { LocadorController } from './locador.controller';

describe('LocadorController', () => {
  let controller: LocadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocadorController],
    }).compile();

    controller = module.get<LocadorController>(LocadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
