import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FACTOR_TABLE } from '../tables';
import { FuelUnit } from './fuel-unit.entity';

@Entity(FACTOR_TABLE.UNIT.NAME)
export class Unit {
  @PrimaryGeneratedColumn({ name: FACTOR_TABLE.UNIT.COLUMNS.ID })
  id: number;

  @Column({ name: FACTOR_TABLE.UNIT.COLUMNS.NAME })
  name: string;

  @OneToMany(() => FuelUnit, (fuelUnit) => fuelUnit.unit)
  fuelUnits: FuelUnit[];

  @CreateDateColumn({ name: FACTOR_TABLE.UNIT.COLUMNS.CREATED_AT })
  createdAt: Date;

  @UpdateDateColumn({ name: FACTOR_TABLE.UNIT.COLUMNS.UPDATED_AT })
  updatedAt: Date;

  create({ name }: { name: string }) {
    this.name = name;
  }
}
