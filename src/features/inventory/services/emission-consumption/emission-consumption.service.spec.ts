import { Test, TestingModule } from '@nestjs/testing';
import { EmissionConsumptionService } from './emission-consumption.service';

describe('EmissionConsumptionService', () => {
  let service: EmissionConsumptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmissionConsumptionService],
    }).compile();

    service = module.get<EmissionConsumptionService>(EmissionConsumptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
