import { HttpException, NotFoundException } from '@nestjs/common';
import { Fuel, Unit } from '../entities';

export namespace FuelException {
  export const NotExist = (id: number) => {
    const msg = `Factor with id ${id} does not exist.`;
    throw new NotFoundException(msg);
  };
}

export namespace UnitException {
  export const NotExist = (id: number) => {
    const msg = `Unit with id ${id} does not exist.`;
    throw new NotFoundException(msg);
  };
}

export namespace FuelUnitException {
  export const NotExist = ({ fuel, unit }: { fuel: Fuel; unit: Unit }) => {
    const msg = `The Emission Factor of Fuel ${fuel.name} and Unit ${unit.name} does not exist.`;
    throw new NotFoundException(msg);
  };
}
