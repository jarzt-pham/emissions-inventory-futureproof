import { HttpException, NotFoundException } from '@nestjs/common';
import { Fuel, Unit } from 'src/features/factor';
import { EmissionSource } from 'src/features/inventory/entities';

export namespace EmissionSourceException {
  export const NotExist = (id: number) => {
    const msg = `Emission source with id ${id} does not exist.`;
    throw new NotFoundException(msg);
  };
}

export namespace EmissionConsumptionException {
  export const ExistInYear = ({
    year,
    unit,
    fuel,
    emissionSource,
  }: {
    year: number;
    unit: Unit;
    fuel: Fuel;
    emissionSource: EmissionSource;
  }) => {
    const msg = `Emission consumption with year ${year}, unit ${unit.name}, fuel ${fuel.name} from emission source ${emissionSource.id} already exists.`;
    throw new HttpException(msg, 400);
  };

  export const NotExist = (id: number) => {
    const msg = `Emission consumption with id ${id} does not exist.`;
    throw new NotFoundException(msg);
  };
}

export namespace EmissionReductionException {
  export const ExistInYear = ({
    year,
    unit,
    fuel,
    emissionSource,
  }: {
    year: number;
    unit: Unit;
    fuel: Fuel;
    emissionSource: EmissionSource;
  }) => {
    const msg = `Emission reduction with year ${year}, unit ${unit.name}, fuel ${fuel.name} from emission source ${emissionSource.id} already exists.`;
    throw new HttpException(msg, 400);
  };

  export const NotExist = (id: number) => {
    const msg = `Emission reduction with id ${id} does not exist.`;
    throw new NotFoundException(msg);
  };
}

export namespace EmissionUtilException {
  export const ConsumedValueLastYearNotExist = () => {
    const msg = `The consumed value of last year does not exist.`;
    throw new NotFoundException(msg);
  };
}
