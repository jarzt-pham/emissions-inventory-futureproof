import { CreateEmissionConsumptionDto } from './create-emission-consumption.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateEmissionConsumptionDto extends CreateEmissionConsumptionDto {
  @IsOptional()
  @IsNumber()
  emission_source_id: number;
}
