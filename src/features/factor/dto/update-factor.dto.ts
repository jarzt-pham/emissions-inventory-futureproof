import { PartialType } from '@nestjs/mapped-types';
import { CreateFactorDto } from './create-factor.dto';

export class UpdateFactorDto extends PartialType(CreateFactorDto) {}
