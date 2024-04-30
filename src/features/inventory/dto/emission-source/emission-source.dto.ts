import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsNumberString } from 'class-validator';

export class EmissionSourceDto {
  id: number;
  description: string;

  created_at: Date;
  updated_at: Date;

  constructor({
    id,
    description,
    created_at,
    updated_at,
  }: {
    id: number;
    description: string;
    created_at: Date;
    updated_at: Date;
  }) {
    this.id = id;
    this.description = description;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
