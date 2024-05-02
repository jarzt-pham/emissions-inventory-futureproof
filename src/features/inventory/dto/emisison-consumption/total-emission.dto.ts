import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { ValidateUtils } from '../../validates';

export class TotalEmissionDto {
  from_year: number;
  total_converted_factor: number;
  emission_source_id: number;
}
