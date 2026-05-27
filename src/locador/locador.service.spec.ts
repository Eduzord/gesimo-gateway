import { Test, TestingModule } from '@nestjs/testing';
import { LocadorService } from './locador.service';

describe('LocadorService', () => {
  let service: LocadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocadorService],
    }).compile();

    service = module.get<LocadorService>(LocadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
