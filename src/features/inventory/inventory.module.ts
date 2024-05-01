import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fuel, FuelUnit, Unit } from '../factor';
import { EmissionConsumption, EmissionReduction, EmissionSource } from './entities';
import { InventoryController } from './inventory.controller';
import { EmissionSourceService } from './services/emission-source';
import { EmissionConsumptionService } from './services/emission-consumption/emission-consumption.service';
import { EmissionReductionService } from './services/emission-reduction';
import { EmissionUtilService } from './services/emission-util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fuel, Unit, EmissionSource, EmissionConsumption, EmissionReduction]),
  ],
  controllers: [InventoryController],
  providers: [EmissionSourceService, EmissionConsumptionService, EmissionReductionService, EmissionUtilService],
})
export class InventoryModule {}
