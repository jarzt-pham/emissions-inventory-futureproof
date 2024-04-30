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

@Entity(FACTOR_TABLE.FUEL.NAME)
export class Fuel {
  @PrimaryGeneratedColumn({ name: FACTOR_TABLE.FUEL.COLUMNS.ID })
  id: number;

  @Column({ name: FACTOR_TABLE.FUEL.COLUMNS.NAME })
  name: string;

  @OneToMany(() => FuelUnit, (fuelUnit) => fuelUnit.fuelId)
  fuelUnits: FuelUnit[];
  
  @CreateDateColumn({ name: FACTOR_TABLE.FUEL.COLUMNS.CREATED_AT })
  createdAt: Date;

  @UpdateDateColumn({ name: FACTOR_TABLE.FUEL.COLUMNS.UPDATED_AT })
  updatedAt: Date;
}
