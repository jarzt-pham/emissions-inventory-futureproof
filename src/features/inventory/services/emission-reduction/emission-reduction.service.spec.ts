import { Test, TestingModule } from '@nestjs/testing';
import { EmissionReductionService } from './emission-reduction.service';

describe('EmissionReductionService', () => {
  let service: EmissionReductionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmissionReductionService],
    }).compile();

    service = module.get<EmissionReductionService>(EmissionReductionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
