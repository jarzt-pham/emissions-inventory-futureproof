import { Test, TestingModule } from '@nestjs/testing';
import { FactorService } from './factor.service';

describe('FactorService', () => {
  let service: FactorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactorService],
    }).compile();

    service = module.get<FactorService>(FactorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
