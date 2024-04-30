import { PartialType } from '@nestjs/mapped-types';
import { CreateEmissionSourceDto } from './create-emission-source.dto';
import { IsString } from 'class-validator';

export class UpdateEmissionSourceDto {
  @IsString()
  description: string;
}
