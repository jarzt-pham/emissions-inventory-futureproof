import { HttpException } from '@nestjs/common';
import { Fuel, Unit } from 'src/features/factor';
import { EmissionSource } from 'src/features/inventory/entities';

export namespace EmissionConsumptionException {
  export const ExistConsumption = ({
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
    const msg = `Emission consumption with year ${year}, unit ${unit.name}, fuel ${fuel.name}, and emission source ${emissionSource.id} already exists.`;
    throw new HttpException(msg, 400);
  };

  export const EmissionFactorIsNotFound = ({
    unit,
    fuel,
  }: {
    unit: Unit;
    fuel: Fuel;
  }) => {
    const msg = `Fuel ${fuel.name} has id ${unit.id} did not use unit ${unit.name} has id ${unit.id}.`;
    throw new HttpException(msg, 400);
  };
}
