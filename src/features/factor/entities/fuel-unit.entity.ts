import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Fuel } from './fuel.entity';
import { Unit } from './unit.entity';
import { FACTOR_TABLE } from '../tables';

@Entity({
  name: FACTOR_TABLE.FUEL_UNIT.NAME,
})
export class FuelUnit {
  @PrimaryColumn({ name: FACTOR_TABLE.FUEL_UNIT.COLUMNS.FUEL_ID })
  fuelId: number;

  @ManyToOne(() => Fuel, (fuel) => fuel.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: FACTOR_TABLE.FUEL_UNIT.COLUMNS.FUEL_ID })
  fuel: Fuel;

  @PrimaryColumn({ name: FACTOR_TABLE.FUEL_UNIT.COLUMNS.UNIT_ID })
  unitId: number;

  @ManyToOne(() => Unit, (unit) => unit.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: FACTOR_TABLE.FUEL_UNIT.COLUMNS.UNIT_ID })
  unit: Unit;

  @Column({
    name: FACTOR_TABLE.FUEL_UNIT.COLUMNS.EMISSION_FACTOR,
    type: 'decimal',
    precision: 4,
    scale: 3,
  })
  emissionFactor: number;

  @CreateDateColumn({ name: FACTOR_TABLE.UNIT.COLUMNS.CREATED_AT })
  createdAt: Date;

  @UpdateDateColumn({ name: FACTOR_TABLE.UNIT.COLUMNS.UPDATED_AT })
  updatedAt: Date;

  create({
    fuel,
    unit,
    emissionFactor,
  }: {
    fuel: Fuel;
    unit: Unit;
    emissionFactor: number;
  }) {
    this.fuel = fuel;
    this.unit = unit;
    this.emissionFactor = emissionFactor;
  }
}
