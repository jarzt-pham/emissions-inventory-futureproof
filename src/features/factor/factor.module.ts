import { Module } from '@nestjs/common';
import { FactorService } from './services/factor.service';
import { FactorController } from './factor.controller';

@Module({
  controllers: [FactorController],
  providers: [FactorService],
})
export class FactorModule {}
