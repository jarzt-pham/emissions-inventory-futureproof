import { Test, TestingModule } from '@nestjs/testing';
import { EmissionSourceController } from './emission-source.controller';
import { EmissionSourceService } from './services/emission-source/emission-source.service';

describe('EmissionSourceController', () => {
  let controller: EmissionSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmissionSourceController],
      providers: [EmissionSourceService],
    }).compile();

    controller = module.get<EmissionSourceController>(EmissionSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
