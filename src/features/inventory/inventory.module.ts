import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fuel, FuelUnit, Unit } from '../factor';
import { EmissionConsumption, EmissionSource } from './entities';
import { InventoryController } from './inventory.controller';
import { EmissionSourceService } from './services/emission-source';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fuel, Unit, EmissionSource, EmissionConsumption]),
  ],
  controllers: [InventoryController],
  providers: [EmissionSourceService],
})
export class InventoryModule {}
