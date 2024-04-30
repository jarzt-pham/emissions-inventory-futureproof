import { Transform } from 'class-transformer';
import { IsNumber, IsNumberString, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export namespace ValidateUtils {
  export class FindOneParams {
    @IsNumber()
    id: number;
  }

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
  export class IsYearGreaterThanCurrent implements ValidatorConstraintInterface {
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
}
