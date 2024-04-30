import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { ValidateUtils } from '../../validates';

export class CreateEmissionConsumptionDto {
  @IsNotEmpty()
  @IsNumber()
  unit_id: number;

  @IsNotEmpty()
  @IsNumber()
  fuel_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Validate(ValidateUtils.IsYearLessThanCurrent)
  year: number;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
