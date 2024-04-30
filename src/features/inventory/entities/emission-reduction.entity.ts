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

@Entity(INVENTORY_TABLE.EMISSION_REDUCTION.NAME)
export class EmissionReduction {
  @PrimaryGeneratedColumn({
    name: INVENTORY_TABLE.EMISSION_REDUCTION.COLUMNS.ID,
  })
  id: number;

  @Column({
    name: INVENTORY_TABLE.EMISSION_REDUCTION.COLUMNS.YEAR,
    type: 'year',
  })
  year: number;

  @Column({
    name: INVENTORY_TABLE.EMISSION_REDUCTION.COLUMNS.DESCRIPTION,
    type: 'text',
  })
  description: string;

  @Column({
    name: INVENTORY_TABLE.EMISSION_REDUCTION.COLUMNS.VALUE,
    type: 'float',
    precision: 10,
    scale: 3,
  })
  value: number;

  @ManyToOne(() => Fuel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: INVENTORY_TABLE.EMISSION_REDUCTION.COLUMNS.FUEL_ID })
  fuel: Fuel;

  @ManyToOne(() => Unit, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: INVENTORY_TABLE.EMISSION_REDUCTION.COLUMNS.UNIT_ID })
  unit: Unit;

  @ManyToOne(() => EmissionSource, (es) => es.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: INVENTORY_TABLE.EMISSION_REDUCTION.COLUMNS.EMISSION_SOURCE_ID,
  })
  emissionSource: EmissionSource;

  @CreateDateColumn({
    name: INVENTORY_TABLE.EMISSION_REDUCTION.COLUMNS.CREATED_AT,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: INVENTORY_TABLE.EMISSION_REDUCTION.COLUMNS.UPDATED_AT,
  })
  updatedAt: Date;

  create({
    year,
    description,
    value,
    fuel,
    unit,
    emissionSource,
  }: {
    year: number;
    description: string;
    value: number;
    fuel: Fuel;
    unit: Unit;
    emissionSource: EmissionSource;
  }) {
    this.year = year;
    this.description = description;
    this.value = value;
    this.fuel = fuel;
    this.unit = unit;
    this.emissionSource = emissionSource;
  }

  update({
    year,
    description,
    value,
    fuel,
    unit,
    emissionSource,
  }: {
    year: number;
    description: string;
    value: number;
    fuel: Fuel;
    unit: Unit;
    emissionSource: EmissionSource;
  }) {
    this.year = year;
    this.description = description;
    this.value = value;
    this.fuel = fuel;
    this.unit = unit;
    this.emissionSource = emissionSource;
  }
}
