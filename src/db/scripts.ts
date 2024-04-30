import { DataSource, QueryRunner } from 'typeorm';

import unit from './seeds/unit.json';
import fuel from './seeds/fuel.json';
import fuel_unit from './seeds/fuel-unit.json';
import { FACTOR_TABLE, Fuel, FuelUnit, Unit } from 'src/features';

const createDeleteQuery = (tableName: string) => `DELETE from ${tableName}`;
const createAlterIncrementQuery = (tableName: string, start: number = 1) =>
  `ALTER TABLE ${tableName} AUTO_INCREMENT = ${start};`;

const truncateFactorTable = async (dataSource: DataSource) => {
  const runTruncateFailed = false;

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    let fuelUnitDto: FuelUnit[] = await queryRunner.query(
      `SELECT * from fuel_unit;`,
    );

    if (fuelUnitDto.length > 0) {
      await queryRunner.commitTransaction();
      return runTruncateFailed;
    }
    queryRunner.query(createDeleteQuery(FACTOR_TABLE.FUEL_UNIT.NAME));
    queryRunner.query(createDeleteQuery(FACTOR_TABLE.FUEL.NAME));
    queryRunner.query(createDeleteQuery(FACTOR_TABLE.UNIT.NAME));

    queryRunner.query(createAlterIncrementQuery(FACTOR_TABLE.FUEL_UNIT.NAME));
    queryRunner.query(createAlterIncrementQuery(FACTOR_TABLE.FUEL.NAME));
    queryRunner.query(createAlterIncrementQuery(FACTOR_TABLE.UNIT.NAME));

    await queryRunner.commitTransaction();
    return true;
  } catch (err) {
    console.log({ err });
    await queryRunner.rollbackTransaction();
    return runTruncateFailed;
  } finally {
    await queryRunner.release();
  }
};

export const runFactorSeed = async (dataSource: DataSource) => {
  const isTruncate = await truncateFactorTable(dataSource);
  if (!isTruncate) return;

  const queryRunner = dataSource.createQueryRunner();

  const fuelsSeedData = fuel.map((f) => {
    const fuel = new Fuel();
    fuel.create({
      name: f.name,
    });

    return fuel;
  });

  const unitsSeedData = unit.map((f) => {
    const unit = new Unit();
    unit.create({
      name: f.name,
    });

    return unit;
  });

  queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const fuelDto = await queryRunner.manager.save(fuelsSeedData);
    const unitDto = await queryRunner.manager.save(unitsSeedData);

    const fuelMap = new Map();
    fuelDto.forEach((f) => {
      fuelMap.set(f.name, f);
    });

    const unitMap = new Map();
    unitDto.forEach((e) => {
      unitMap.set(e.name, e);
    });

    const fuelUnitSeedData = fuel_unit.map((f) => {
      const fuelUnit = new FuelUnit();
      fuelUnit.create({
        fuel: fuelMap.get(f.fuel),
        unit: unitMap.get(f.unit),
        emissionFactor: +f.value,
      });

      return fuelUnit;
    });

    await queryRunner.manager.save(fuelUnitSeedData);

    await queryRunner.commitTransaction();
  } catch (err) {
    console.log({ err });
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};
