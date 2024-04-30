import { Test, TestingModule } from '@nestjs/testing';
import { EmissionSourceService } from './emission-source.service';

describe('EmissionSourceService', () => {
  let service: EmissionSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmissionSourceService],
    }).compile();

    service = module.get<EmissionSourceService>(EmissionSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
