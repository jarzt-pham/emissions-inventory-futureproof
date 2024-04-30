import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { INVENTORY_TABLE } from '../tables';

@Entity({
  name: INVENTORY_TABLE.EMISSION_SOURCE.NAME,
})
export class EmissionSource {
  @PrimaryGeneratedColumn({ name: INVENTORY_TABLE.EMISSION_SOURCE.COLUMNS.ID })
  id: number;

  @Column({
    name: INVENTORY_TABLE.EMISSION_SOURCE.COLUMNS.DESCRIPTION,
    type: 'text',
  })
  description: string;

  @CreateDateColumn({
    name: INVENTORY_TABLE.EMISSION_SOURCE.COLUMNS.CREATED_AT,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: INVENTORY_TABLE.EMISSION_SOURCE.COLUMNS.UPDATED_AT,
  })
  updatedAt: Date;

  create({ description }: { description: string }) {
    this.description = description;
  }

  update({ description }: { description: string }) {
    this.description = description;
  }
}
