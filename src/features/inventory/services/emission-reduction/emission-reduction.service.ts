import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmissionReductionDto } from '../../dto/emission-reduction/create-emission-reduction.dto';
import { UpdateEmissionReductionDto } from '../../dto/emission-reduction/update-emission-reduction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmissionReduction, EmissionSource } from '../../entities';
import { Fuel, Unit } from 'src/features/factor';
import { EmissionConsumptionService } from '../emission-consumption/emission-consumption.service';
import { EmissionReductionException } from '../../exceptions';
import { EmissionSourceService } from '../emission-source';

@Injectable()
export class EmissionReductionService {
  private readonly logger = new Logger(EmissionReductionService.name);

  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(EmissionReduction)
    private readonly _emissionReductionRepo: Repository<EmissionReduction>,
    private readonly _emissionConsumptionService: EmissionConsumptionService,
    private readonly _emissionSourceService: EmissionSourceService,
  ) {}

  async isReductionExistInYear({
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
    let isExist: EmissionReduction;
    try {
      isExist = await this._emissionReductionRepo.findOne({
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
      return EmissionReductionException.ExistInYear({
        emissionSource: isExist.emissionSource,
        fuel: isExist.fuel,
        unit: isExist.unit,
        year: isExist.year,
      });

    return isExist;
  }

  async isExist(id: number) {
    let emissionReduction: EmissionReduction;
    try {
      emissionReduction = await this._emissionReductionRepo.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    if (!emissionReduction) EmissionReductionException.NotExist(id);

    return emissionReduction;
  }

  async create({
    emissionSourceId,
    createEmissionReductionDto,
  }: {
    emissionSourceId: number;
    createEmissionReductionDto: CreateEmissionReductionDto;
  }) {
    //mapper
    const createPayload = {
      description: createEmissionReductionDto.description,
      year: createEmissionReductionDto.year,
      value: createEmissionReductionDto.value,
      fuelId: createEmissionReductionDto.fuel_id,
      unitId: createEmissionReductionDto.unit_id,
    };

    await this.isReductionExistInYear({
      emissionSourceId,
      payload: createPayload,
    });

    const { emissionSource, fuel, unit } =
      await this._emissionConsumptionService.isFactorMetricExist({
        fuelId: createPayload.fuelId,
        unitId: createPayload.unitId,
        emissionSourceId,
      });

    //create entity
    const entity = new EmissionReduction();
    entity.create({
      description: createEmissionReductionDto.description,
      year: createEmissionReductionDto.year,
      value: createEmissionReductionDto.value,
      fuel,
      unit,
      emissionSource,
    });

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let savedEntity: EmissionReduction;
    try {
      savedEntity = await this._emissionReductionRepo.save(entity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return {
      id: savedEntity.id,
      description: savedEntity.description,
      effect_year: savedEntity.year,
      reduced_value: savedEntity.value,
      fuel: {
        id: savedEntity.fuel.id,
        name: savedEntity.fuel.name,
      },
      unit: {
        id: savedEntity.unit.id,
        name: savedEntity.unit.name,
      },
    };
  }

  async findAll({ emissionSourceId }: { emissionSourceId: number }) {
    let emissionReductionDto: {
      id: number;
      description: string;
      year: number;

      reduced_value: number;
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
      emissionReductionDto = await this._dataSource
        .getRepository(EmissionReduction)
        .createQueryBuilder('emissionReduction')
        .innerJoin('emissionReduction.fuel', 'fuel')
        .innerJoin('emissionReduction.unit', 'unit')
        .innerJoin('emissionReduction.emissionSource', 'emissionSource')
        .innerJoin('fuel.fuelUnits', 'fuelUnits')
        .where('emissionReduction.emissionSource.id = :emissionSourceId', {
          emissionSourceId,
        })
        .orderBy('emissionReduction.year', 'ASC')
        .select([
          'emissionReduction.id as id',
          'emissionReduction.description as description',
          'emissionReduction.year as year',
          'emissionReduction.value as reduced_value',

          'emissionReduction.created_at as created_at',
          'emissionReduction.updated_at as updated_at',

          'fuel.id as fuel_id',
          'fuel.name as fuel_name',

          'unit.id as unit_id',
          'unit.name as unit_name',

          'emissionSource.id as emission_source_id',

          'fuelUnits.emission_factor as emission_factor',
          'emissionReduction.value * fuelUnits.emission_factor as converted_factor',
        ])
        .execute();
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    if (!emissionReductionDto || emissionReductionDto.length === 0) {
      return [];
    }

    return emissionReductionDto.map((ec) => ({
      id: ec.id,
      description: ec.description,
      year: ec.year,

      value: {
        reduced: ec.reduced_value,
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

  findOne(id: number) {
    return `This action returns a #${id} emissionReduction`;
  }

  async update({
    emissionSourceId,
    emissionReductionId,
    updateEmissionReductionDto,
  }: {
    emissionSourceId: number;
    emissionReductionId: number;
    updateEmissionReductionDto: UpdateEmissionReductionDto;
  }) {
    //mapper
    const updatePayload = {
      description: updateEmissionReductionDto.description,
      year: updateEmissionReductionDto.year,
      value: updateEmissionReductionDto.value,
      fuelId: updateEmissionReductionDto.fuel_id,
      unitId: updateEmissionReductionDto.unit_id,
      emissionSourceId: updateEmissionReductionDto?.emission_source_id,
    };

    await this.isReductionExistInYear({
      emissionSourceId,
      payload: updatePayload,
    });

    let emissionReduction = await this.isExist(emissionReductionId);

    const { emissionSource, fuel, unit } =
      await this._emissionConsumptionService.isFactorMetricExist({
        fuelId: updatePayload.fuelId,
        unitId: updatePayload.unitId,
        emissionSourceId,
      });

    let emissionSourceClone = emissionSource;
    if (updatePayload?.emissionSourceId) {
      emissionSourceClone = await this._emissionSourceService.isExist(
        updatePayload.emissionSourceId,
      );
    }

    emissionReduction.update({
      description: updatePayload.description,
      year: updatePayload.year,
      value: updatePayload.value,
      fuel,
      unit,
      emissionSource: emissionSourceClone,
    });

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this._emissionReductionRepo.update(
        emissionReductionId,
        emissionReduction,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return {
      id: emissionReduction.id,
      description: emissionReduction.description,
      year: emissionReduction.year,
      value: emissionReduction.value,

      fuel: {
        id: emissionReduction.fuel.id,
        name: emissionReduction.fuel.name,
      },
      unit: {
        id: emissionReduction.unit.id,
        name: emissionReduction.unit.name,
      },
    };
  }

  async remove(id: number) {
    await this.isExist(id);

    try {
      await this._emissionReductionRepo.delete(id);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    return;
  }
}
