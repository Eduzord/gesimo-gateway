import { Test, TestingModule } from '@nestjs/testing';
import { LocatariosService } from './locatarios.service';

describe('LocatariosService', () => {
  let service: LocatariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocatariosService],
    }).compile();

    service = module.get<LocatariosService>(LocatariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
