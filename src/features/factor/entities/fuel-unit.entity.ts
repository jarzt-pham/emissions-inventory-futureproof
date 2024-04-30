import { CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Fuel } from './fuel.entity';
import { Unit } from './unit.entity';
import { FACTOR_TABLE } from '../tables';

export class FuelUnit {
  @ManyToOne(() => Fuel, (fuel) => fuel.id)
  @JoinColumn({ name: FACTOR_TABLE.FUEL_UNIT.COLUMNS.FUEL_ID })
  fuelId: number;

  @ManyToOne(() => Unit, (unit) => unit.id)
  @JoinColumn({ name: FACTOR_TABLE.FUEL_UNIT.COLUMNS.UNIT_ID })
  unitId: number;

  @CreateDateColumn({ name: FACTOR_TABLE.UNIT.COLUMNS.CREATED_AT })
  createdAt: Date;

  @UpdateDateColumn({ name: FACTOR_TABLE.UNIT.COLUMNS.UPDATED_AT })
  updatedAt: Date;
}
