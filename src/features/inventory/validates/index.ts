import { Transform } from 'class-transformer';
import { IsNumber, IsNumberString } from 'class-validator';

export namespace ValidateUtils {
  export class FindOneParams {
    @IsNumber()
    id: number;
  }
}
