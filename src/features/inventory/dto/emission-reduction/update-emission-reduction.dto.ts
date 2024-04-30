import { PartialType } from '@nestjs/mapped-types';
import { CreateEmissionReductionDto } from './create-emission-reduction.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateEmissionReductionDto extends CreateEmissionReductionDto {
  @IsOptional()
  @IsNumber()
  emission_source_id: number;
}
