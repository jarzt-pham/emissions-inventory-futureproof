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
import { Between, DataSource, Repository } from 'typeorm';
import { Fuel, FuelUnit, Unit } from 'src/features/factor';
import { EmissionConsumptionException } from './exceptions';
import { EmissionConsumptionDto } from '../../dto/emisison-consumption/emission-consumption.dto';
import { TotalEmissionDto } from '../../dto/emisison-consumption';

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
  ) {}

  async isConsumptionExistInYear({
    emissionSourceId,
    payload,
  }: {
    emissionSourceId: number;
    payload: CreateEmissionConsumptionDto;
  }) {
    const createPayload = EmissionConsumptionService.fromDtoToModel(payload);
    //One year only consists of one emission consumption (unit, fuel, emission source)
    let isExist: EmissionConsumption;
    try {
      isExist = await this._emissionConsumptionRepo.findOne({
        where: {
          year: createPayload.year,
          unit: {
            id: createPayload.unitId,
          },
          fuel: {
            id: createPayload.fuelId,
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
      return EmissionConsumptionException.ExistConsumption({
        emissionSource: isExist.emissionSource,
        fuel: isExist.fuel,
        unit: isExist.unit,
        year: isExist.year,
      });

    return isExist;
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

    if (!fuel) throw new NotFoundException(`Fuel with id ${fuelId} not found`);
    if (!unit) throw new NotFoundException(`Unit with id ${unitId} not found`);
    if (!emissionSource)
      throw new NotFoundException(
        `Emission source with id ${emissionSourceId} not found`,
      );

    // check unit and fuel have data in fuel unit
    const isFuelUnitExist = fuelUnits.some(
      (fu) => fu.fuelId === fuelId && fu.fuelId === fuelId,
    );

    if (!isFuelUnitExist)
      throw EmissionConsumptionException.EmissionFactorIsNotFound({
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
    const createPayload = EmissionConsumptionService.fromDtoToModel(
      createEmissionConsumptionDto,
    );

    //One year only consists of one emission consumption (unit, fuel, emission source)
    await this.isConsumptionExistInYear({
      emissionSourceId,
      payload: createEmissionConsumptionDto,
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

    return EmissionConsumptionService.fromModelToDto(savedEntity);
  }

  async findAll({
    emissionSourceId,
    fromYear,
    toYear,
  }: {
    emissionSourceId: number;
    fromYear: number;
    toYear: number;
  }): Promise<EmissionConsumptionDto[]> {
    let emissionConsumptionDto: {
      id: number;
      year: number;
      consumption_value: number;
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
        .innerJoin('fuel.fuelUnits', 'fuelUnits')
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
          'emissionConsumption.value as consumption_value',

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
      consumption_value: ec.consumption_value,
      emission_factor: ec.emission_factor,
      converted_factor: ec.converted_factor,
      fuel_id: ec.fuel_id,
      fuel_name: ec.fuel_name,
      unit_id: ec.unit_id,
      unit_name: ec.unit_name,
      emission_source_id: ec.emission_source_id,
      created_at: ec.created_at,
      updated_at: ec.updated_at,
    }));
  }

  async totalEmissionConsumption({
    emissionSourceId,
    year,
  }: {
    emissionSourceId: number;
    year: number;
  }): Promise<TotalEmissionDto> {
    let totalEmissionDto: {
      year: number;
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
        .innerJoin('fuel.fuelUnits', 'fuelUnits')
        .where('emissionConsumption.emissionSource.id = :emissionSourceId', {
          emissionSourceId,
        })
        .andWhere('emissionConsumption.year = :year', { year })
        .select([
          'emissionSource.id as emission_source_id',
          'emissionConsumption.year as year',
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
        year,
        total_converted_factor: null,
        emission_source_id: emissionSourceId,
      };

    return {
      year: totalEmissionDto.year,
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
    const updatePayload = EmissionConsumptionService.fromDtoToModel(
      updateEmissionConsumptionDto,
    );

    // only one emission consumption in one year
    await this.isConsumptionExistInYear({
      emissionSourceId,
      payload: updateEmissionConsumptionDto,
    });

    //check factor metric
    const { emissionSource, fuel, unit } = await this.isFactorMetricExist({
      fuelId: updateEmissionConsumptionDto.fuel_id,
      unitId: updateEmissionConsumptionDto.unit_id,
      emissionSourceId,
    });

    //check exist
    let emissionConsumption: EmissionConsumption;
    try {
      emissionConsumption = await this._emissionConsumptionRepo.findOne({
        where: {
          id: emissionConsumptionId,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    if (!emissionConsumption)
      throw new NotFoundException(
        `Emission consumption with id ${emissionConsumptionId} not found`,
      );

    emissionConsumption.update({
      emissionSource,
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

    return EmissionConsumptionService.fromModelToDto(emissionConsumption);
  }

  remove(id: number) {
    return `This action removes a #${id} emissionConsumption`;
  }

  static fromDtoToModel(dto: CreateEmissionConsumptionDto) {
    return {
      year: dto.year,
      value: dto.value,
      unitId: dto.unit_id,
      fuelId: dto.fuel_id,
    };
  }
  static fromModelToDto(model: EmissionConsumption) {
    return {
      id: model.id,
      year: model.year,
      value: model.value,
      unit_id: model.unit.id,
      unit_name: model.unit.name,
      fuel_id: model.fuel.id,
      fuel_name: model.fuel.name,
      emission_source_id: model.emissionSource.id,
    };
  }
}