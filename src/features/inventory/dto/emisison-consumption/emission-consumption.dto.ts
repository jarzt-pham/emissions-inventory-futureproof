import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { ValidateUtils } from '../../validates';

export class EmissionConsumptionDto {
  id: number;
  year: number;
  consumed_value: number;
  emission_factor: number;
  converted_factor: number;

  fuel_id: number;
  fuel_name: string;

  unit_id: number;
  unit_name: string;

  emission_source_id: number;

  created_at: Date;
  updated_at: Date;
}
