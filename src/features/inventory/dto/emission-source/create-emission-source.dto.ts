import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEmissionSourceDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}
