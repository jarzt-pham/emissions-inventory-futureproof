import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmissionConsumptionDto } from '../../dto/emisison-consumption/create-emission-consumption.dto';
import { UpdateEmissionConsumptionDto } from '../../dto/emisison-consumption/update-emission-consumption.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmissionConsumption, EmissionSource } from '../../entities';
import { DataSource, Repository } from 'typeorm';
import {
  Fuel,
  FuelException,
  FuelUnit,
  FuelUnitException,
  Unit,
  UnitException,
} from 'src/features/factor';

import { TotalEmissionDto } from '../../dto/emisison-consumption';
import {
  EmissionConsumptionException,
  EmissionSourceException,
} from '../../exceptions';
import { EmissionSourceService } from '../emission-source';

@Injectable()
export class EmissionConsumptionService {
  private readonly logger = new Logger(EmissionConsumptionService.name);
  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(EmissionConsumption)
    private readonly _emissionConsumptionRepo: Repository<EmissionConsumption>,
    @InjectRepository(Fuel)
    private readonly _fuelRepo: Repository<Fuel>,
    @InjectRepository(Unit)
    private readonly _unitRepo: Repository<Unit>,
    @InjectRepository(EmissionSource)
    private readonly _emissionSourceRepo: Repository<EmissionSource>,
    private readonly _emissionSourceService: EmissionSourceService,
  ) {}

  async isConsumptionExistInYear({
    emissionSourceId,
    payload,
  }: {
    emissionSourceId: number;
    payload: {
      year: number;
      value: number;
      fuelId: number;
      unitId: number;
    };
  }) {
    //One year only consists of one emission consumption (unit, fuel, emission source)
    let isExist: EmissionConsumption;
    try {
      isExist = await this._emissionConsumptionRepo.findOne({
        where: {
          year: payload.year,
          unit: {
            id: payload.unitId,
          },
          fuel: {
            id: payload.fuelId,
          },
          emissionSource: {
            id: emissionSourceId,
          },
        },
        relations: ['unit', 'fuel', 'emissionSource'],
      });
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException();
    }

    if (isExist)
      return EmissionConsumptionException.ExistInYear({
        emissionSource: isExist.emissionSource,
        fuel: isExist.fuel,
        unit: isExist.unit,
        year: isExist.year,
      });

    return isExist;
  }

  async isExist(id: number) {
    let emissionConsumption: EmissionConsumption;
    try {
      emissionConsumption = await this._emissionConsumptionRepo.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    if (!emissionConsumption) throw EmissionConsumptionException.NotExist(id);

    return emissionConsumption;
  }

  async isFactorMetricExist({
    fuelId,
    unitId,
    emissionSourceId,
  }: {
    fuelId: number;
    unitId: number;
    emissionSourceId: number;
  }) {
    //check payload
    let fuel: Fuel,
      unit: Unit,
      emissionSource: EmissionSource,
      fuelUnits: FuelUnit[];
    try {
      [fuel, unit, emissionSource] = await Promise.all([
        this._fuelRepo.findOneBy({
          id: fuelId,
        }),
        this._unitRepo.findOne({
          where: {
            id: unitId,
          },
          relations: ['fuelUnits'],
        }),
        this._emissionSourceRepo.findOneBy({
          id: emissionSourceId,
        }),
      ]);

      fuelUnits = unit.fuelUnits;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    if (!fuel) throw FuelException.NotExist(fuelId);
    if (!unit) throw UnitException.NotExist(unitId);
    if (!emissionSource)
      throw EmissionSourceException.NotExist(emissionSourceId);

    // check unit and fuel have data in fuel unit
    const isFuelUnitExist = fuelUnits.some(
      (fu) => fu.fuelId === fuelId && fu.fuelId === fuelId,
    );

    if (!isFuelUnitExist)
      throw FuelUnitException.NotExist({
        fuel: fuel,
        unit: unit,
      });

    return {
      fuel,
      unit,
      emissionSource,
      fuelUnits,
    };
  }

  async create({
    emissionSourceId,
    createEmissionConsumptionDto,
  }: {
    emissionSourceId: number;
    createEmissionConsumptionDto: CreateEmissionConsumptionDto;
  }) {
    //mapper
    const createPayload = {
      year: createEmissionConsumptionDto.year,
      value: createEmissionConsumptionDto.value,
      fuelId: createEmissionConsumptionDto.fuel_id,
      unitId: createEmissionConsumptionDto.unit_id,
    };

    //One year only consists of one emission consumption (unit, fuel, emission source)
    await this.isConsumptionExistInYear({
      emissionSourceId,
      payload: createPayload,
    });

    //check factor metric
    const { emissionSource, fuel, unit } = await this.isFactorMetricExist({
      fuelId: createPayload.fuelId,
      unitId: createPayload.unitId,
      emissionSourceId,
    });

    //create entity
    const entity = new EmissionConsumption();
    entity.create({
      year: createPayload.year,
      value: createPayload.value,
      fuel,
      unit,
      emissionSource,
    });

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let savedEntity: EmissionConsumption;
    try {
      savedEntity = await this._emissionConsumptionRepo.save(entity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return {
      id: savedEntity.id,
      year: savedEntity.year,
      consumed_value: savedEntity.value,
      fuel: {
        id: savedEntity.fuel.id,
        name: savedEntity.fuel.name,
      },
      unit: {
        id: savedEntity.unit.id,
        name: savedEntity.unit.name,
      },
      created_at: savedEntity.createdAt,
      updated_at: savedEntity.updatedAt,
    };
  }

  async findAll({
    emissionSourceId,
    fromYear,
    toYear,
  }: {
    emissionSourceId: number;
    fromYear: number;
    toYear: number;
  }) {
    let emissionConsumptionDto: {
      id: number;
      year: number;
      consumed_value: number;
      emission_factor: number;
      converted_factor: number;

      fuel_id: number;
      fuel_name: string;

      unit_id: number;
      unit_name: string;

      emission_source_id: number;

      created_at: Date;
      updated_at: Date;
    }[] = [];

    try {
      emissionConsumptionDto = await this._dataSource
        .getRepository(EmissionConsumption)
        .createQueryBuilder('emissionConsumption')
        .innerJoin('emissionConsumption.fuel', 'fuel')
        .innerJoin('emissionConsumption.unit', 'unit')
        .innerJoin('emissionConsumption.emissionSource', 'emissionSource')
        .innerJoin(
          'fuel.fuelUnits',
          'fuelUnits',
          'fuelUnits.unitId = unit.id and fuelUnits.fuelId = fuel.id',
        )
        .where('emissionConsumption.emissionSource.id = :emissionSourceId', {
          emissionSourceId,
        })
        .andWhere('emissionConsumption.year BETWEEN :fromYear AND :toYear', {
          fromYear,
          toYear,
        })
        .orderBy('emissionConsumption.year', 'ASC')
        .select([
          'emissionConsumption.id as id',
          'emissionConsumption.year as year',
          'emissionConsumption.value as consumed_value',

          'emissionConsumption.created_at as created_at',
          'emissionConsumption.updated_at as updated_at',
          'fuel.id as fuel_id',
          'fuel.name as fuel_name',
          'unit.id as unit_id',
          'unit.name as unit_name',
          'emissionSource.id as emission_source_id',
          'fuelUnits.emission_factor as emission_factor',
          'emissionConsumption.value * fuelUnits.emission_factor as converted_factor',
        ])
        .execute();
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    if (!emissionConsumptionDto || emissionConsumptionDto.length === 0) {
      return [];
    }

    return emissionConsumptionDto.map((ec) => ({
      id: ec.id,
      year: ec.year,

      value: {
        consumed: ec.consumed_value,
        emission_factor: ec.emission_factor,
        converted_factor: ec.converted_factor,
      },

      fuel: {
        id: ec.fuel_id,
        name: ec.fuel_name,
      },
      unit: {
        id: ec.unit_id,
        name: ec.unit_name,
      },

      created_at: ec.created_at,
      updated_at: ec.updated_at,
    }));
  }

  async totalEmissionConsumption({
    emissionSourceId,
    fromYear,
  }: {
    emissionSourceId: number;
    fromYear: number;
  }): Promise<TotalEmissionDto> {
    let totalEmissionDto: {
      from_year: number;
      total_converted_factor: number;
      emission_source_id: number;
    };
    try {
      totalEmissionDto = await this._dataSource
        .getRepository(EmissionConsumption)
        .createQueryBuilder('emissionConsumption')
        .innerJoin('emissionConsumption.fuel', 'fuel')
        .innerJoin('emissionConsumption.unit', 'unit')
        .innerJoin('emissionConsumption.emissionSource', 'emissionSource')
        .innerJoin(
          'fuel.fuelUnits',
          'fuelUnits',
          'fuelUnits.unitId = unit.id and fuelUnits.fuelId = fuel.id',
        )
        .where('emissionConsumption.emissionSource.id = :emissionSourceId', {
          emissionSourceId,
        })
        .andWhere('emissionConsumption.year = :from_year', {
          from_year: fromYear,
        })
        .select([
          'emissionSource.id as emission_source_id',
          'emissionConsumption.year as from_year',
          'sum(emissionConsumption.value * fuelUnits.emission_factor) as total_converted_factor',
        ])
        .groupBy('emissionSource.id')
        .getRawOne();
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    if (!totalEmissionDto)
      return {
        from_year: fromYear,
        total_converted_factor: null,
        emission_source_id: emissionSourceId,
      };

    return {
      from_year: totalEmissionDto.from_year,
      total_converted_factor: totalEmissionDto.total_converted_factor,
      emission_source_id: totalEmissionDto.emission_source_id,
    };
  }

  async update({
    emissionSourceId,
    emissionConsumptionId,
    updateEmissionConsumptionDto,
  }: {
    emissionSourceId: number;
    emissionConsumptionId: number;
    updateEmissionConsumptionDto: UpdateEmissionConsumptionDto;
  }) {
    //mapper
    const updatePayload = {
      year: updateEmissionConsumptionDto.year,
      value: updateEmissionConsumptionDto.value,
      fuelId: updateEmissionConsumptionDto.fuel_id,
      unitId: updateEmissionConsumptionDto.unit_id,
      emissionSourceId: updateEmissionConsumptionDto?.emission_source_id,
    };

    // only one emission consumption in one year
    await this.isConsumptionExistInYear({
      emissionSourceId,
      payload: updatePayload,
    });

    let emissionConsumption = await this.isExist(emissionConsumptionId);

    let { emissionSource, fuel, unit } = await this.isFactorMetricExist({
      fuelId: updateEmissionConsumptionDto.fuel_id,
      unitId: updateEmissionConsumptionDto.unit_id,
      emissionSourceId,
    });

    let emissionSourceClone = emissionSource;
    if (updatePayload?.emissionSourceId) {
      emissionSourceClone = await this._emissionSourceService.isExist(
        updatePayload.emissionSourceId,
      );
    }

    emissionConsumption.update({
      emissionSource: emissionSourceClone,
      fuel,
      unit,
      value: updatePayload.value,
      year: updatePayload.year,
    });

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this._emissionConsumptionRepo.update(
        emissionConsumptionId,
        emissionConsumption,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return {
      id: emissionConsumption.id,
      year: emissionConsumption.year,
      value: emissionConsumption.value,

      fuel: {
        id: emissionConsumption.fuel.id,
        name: emissionConsumption.fuel.name,
      },

      unit: {
        id: emissionConsumption.unit.id,
        name: emissionConsumption.unit.name,
      },
    };
  }

  async remove({
    emissionSourceId,
    emissionConsumptionId,
  }: {
    emissionSourceId: number;
    emissionConsumptionId: number;
  }) {
    await this._emissionSourceService.isExist(emissionSourceId);
    await this.isExist(emissionConsumptionId);

    try {
      await this._emissionConsumptionRepo.delete(emissionConsumptionId);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    return;
  }
}
