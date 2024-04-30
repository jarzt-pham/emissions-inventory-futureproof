import { Module } from '@nestjs/common';
import { FactorService } from './services/factor.service';
import { FactorController } from './factor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fuel, FuelUnit, Unit } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Fuel, Unit, FuelUnit])],
  controllers: [FactorController],
  providers: [FactorService],
})
export class FactorModule {}
