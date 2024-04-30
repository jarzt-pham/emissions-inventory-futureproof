import { Test, TestingModule } from '@nestjs/testing';
import { FactorController } from './factor.controller';
import { FactorService } from './services/factor.service';

describe('FactorController', () => {
  let controller: FactorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FactorController],
      providers: [FactorService],
    }).compile();

    controller = module.get<FactorController>(FactorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
