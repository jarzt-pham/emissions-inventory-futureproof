import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';
import { ValidateUtils } from '../../validates';

export class CreateEmissionReductionDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  unit_id: number;

  @IsNotEmpty()
  @IsNumber()
  fuel_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Validate(ValidateUtils.IsYearGreaterThanCurrent)
  year: number;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
