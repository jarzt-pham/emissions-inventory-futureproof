import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EmissionUtilType } from '../services/emission-util';

export namespace ValidateUtils {
  @ValidatorConstraint()
  export class IsYearLessThanCurrent implements ValidatorConstraintInterface {
    validate(year: any, args: ValidationArguments) {
      if (isNaN(year)) {
        return false;
      }
      const yearValue = parseInt(year, 10);
      const currentYear = new Date().getFullYear();
      return yearValue >= 0 && yearValue <= currentYear;
    }

    defaultMessage(args: ValidationArguments) {
      return 'Invalid year, must be less than or equal to current year';
    }
  }

  @ValidatorConstraint()
  export class IsYearGreaterThanCurrent
    implements ValidatorConstraintInterface
  {
    validate(year: any, args: ValidationArguments) {
      if (isNaN(year)) {
        return false;
      }
      const yearValue = parseInt(year, 10);
      const currentYear = new Date().getFullYear();
      return yearValue >= 0 && yearValue > currentYear;
    }

    defaultMessage(args: ValidationArguments) {
      return 'Invalid year, must be greater than current year';
    }
  }

  export class FindOneParams {
    @IsNumberString()
    id: number;
  }

  export class EmissionSource {
    @IsNumberString()
    emission_source_id: number;
  }

  export class EmissionConsumption {
    @IsNumberString()
    emission_consumption_id: number;
  }

  export class EmissionReduction {
    @IsNumberString()
    emission_reduction_id: number;
  }

  export class FromYear {
    @IsNotEmpty()
    @IsNumberString()
    @Validate(IsYearLessThanCurrent)
    from_year: number;
  }

  export class PeriodYearInThePast {
    @IsNotEmpty()
    @IsNumberString()
    @Validate(IsYearLessThanCurrent)
    from_year: number;

    @IsNotEmpty()
    @IsNumberString()
    @Validate(IsYearLessThanCurrent)
    to_year: number;
  }

  export class PartialPeriodYearInThePast {
    @IsOptional()
    @IsNumberString()
    from_year: number;

    @IsNotEmpty()
    @IsNumberString()
    to_year: number;
  }

  export class PredictionPeriodYear {
    @IsNotEmpty()
    @IsNumberString()
    @Validate(IsYearGreaterThanCurrent)
    to_year: number;
  }
}
