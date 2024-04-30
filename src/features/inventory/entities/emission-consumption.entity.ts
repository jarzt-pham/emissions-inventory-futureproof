import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmissionSource } from './emission-source.entity';
import { INVENTORY_TABLE } from '../tables';
import { Fuel, Unit } from '../../factor/entities';

@Entity(INVENTORY_TABLE.EMISSION_CONSUMPTION.NAME)
export class EmissionConsumption {
  @PrimaryGeneratedColumn({
    name: INVENTORY_TABLE.EMISSION_CONSUMPTION.COLUMNS.ID,
  })
  id: number;

  @Column({
    name: INVENTORY_TABLE.EMISSION_CONSUMPTION.COLUMNS.YEAR,
    type: 'year',
  })
  year: number;

  @Column({
    name: INVENTORY_TABLE.EMISSION_CONSUMPTION.COLUMNS.VALUE,
    type: 'float',
    precision: 10,
    scale: 3,
  })
  value: number;

  @ManyToOne(() => Fuel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: INVENTORY_TABLE.EMISSION_CONSUMPTION.COLUMNS.FUEL_ID })
  fuel: Fuel;

  @ManyToOne(() => Unit, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: INVENTORY_TABLE.EMISSION_CONSUMPTION.COLUMNS.UNIT_ID })
  unit: Unit;

  @ManyToOne(() => EmissionSource, (es) => es.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: INVENTORY_TABLE.EMISSION_CONSUMPTION.COLUMNS.EMISSION_SOURCE_ID,
  })
  emissionSource: EmissionSource;

  @CreateDateColumn({
    name: INVENTORY_TABLE.EMISSION_CONSUMPTION.COLUMNS.CREATED_AT,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: INVENTORY_TABLE.EMISSION_CONSUMPTION.COLUMNS.UPDATED_AT,
  })
  updatedAt: Date;

  create({
    year,
    value,
    fuel,
    unit,
    emissionSource,
  }: {
    year: number;
    value: number;
    fuel: Fuel;
    unit: Unit;
    emissionSource: EmissionSource;
  }) {
    this.year = year;
    this.value = value;
    this.fuel = fuel;
    this.unit = unit;
    this.emissionSource = emissionSource;
  }
}
