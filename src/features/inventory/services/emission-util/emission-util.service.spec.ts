import { Test, TestingModule } from '@nestjs/testing';
import { EmissionUtilService } from './emission-util.service';

describe('EmissionUtilService', () => {
  let service: EmissionUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmissionUtilService],
    }).compile();

    service = module.get<EmissionUtilService>(EmissionUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
