import { OmitType } from '@nestjs/mapped-types';
import { CreateEmissionReductionDto } from './create-emission-reduction.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEmissionReductionDto extends OmitType(
  CreateEmissionReductionDto,
  ['description'] as const,
) {
  @IsOptional()
  @IsNumber()
  emission_source_id: number;

  @IsOptional()
  @IsString()
  description?: string;
}
