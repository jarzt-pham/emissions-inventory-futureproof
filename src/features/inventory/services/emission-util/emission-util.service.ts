import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmissionConsumption } from '../../entities';
import { DataSource, Repository } from 'typeorm';
import { SimpleLinearRegression } from 'ml-regression';
import { PredictionUtil } from './prediction.util';
import { EmissionUtilException } from '../../exceptions';

export type PredictionDTO = {
  year: number;
  prediction: number;
};

@Injectable()
export class EmissionUtilService {
  private readonly logger = new Logger(EmissionUtilService.name);

  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(EmissionConsumption)
    private readonly _emissionConsumptionRepo: Repository<EmissionConsumption>,
  ) {}

  private readonly _CURRENT_YEAR = new Date().getFullYear();

  async getTotalEmissionEachYearFromSource(emissionSourceId: number): Promise<{
    consumptions: { year: number; consumption: number }[];
    consumptionMap: Map<number, number>;
  }> {
    let totalEmissionEachYearDto: {
      year: number;
      total_converted_factor: number;
      emission_source_id: number;
    }[];
    try {
      totalEmissionEachYearDto = await this._dataSource
        .getRepository(EmissionConsumption)
        .createQueryBuilder('emissionConsumption')
        .innerJoin('emissionConsumption.fuel', 'fuel')
        .innerJoin('emissionConsumption.unit', 'unit')
        .innerJoin('emissionConsumption.emissionSource', 'emissionSource')
        .innerJoin('fuel.fuelUnits', 'fuelUnits')
        .where('emissionConsumption.emissionSource.id = :emissionSourceId', {
          emissionSourceId,
        })
        .select([
          'emissionSource.id as emission_source_id',
          'emissionConsumption.year as year',
          'sum(emissionConsumption.value * fuelUnits.emission_factor) as total_converted_factor',
        ])
        .groupBy('emissionSource.id')
        .addGroupBy('emissionConsumption.year')
        .execute();
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    if (!totalEmissionEachYearDto || totalEmissionEachYearDto.length === 0) {
      return {
        consumptions: [],
        consumptionMap: new Map<number, number>(),
      };
    }

    const totalEmissionEachYearMap = new Map<number, number>();
    totalEmissionEachYearDto.forEach((item) => {
      totalEmissionEachYearMap.set(item.year, item.total_converted_factor);
    });

    return {
      consumptions: totalEmissionEachYearDto.map((item) => ({
        year: item.year,
        consumption: item.total_converted_factor,
      })),
      consumptionMap: totalEmissionEachYearMap,
    };
  }

  isConsumedValueLastYearExist(consumptionMap: Map<number, number>): boolean {
    const isExist = consumptionMap.has(this._CURRENT_YEAR - 1);
    if (!isExist) throw EmissionUtilException.ConsumedValueLastYearNotExist();
    return isExist;
  }

  async predictedByAI({
    emissionSourceId,
    toYear,
  }: {
    emissionSourceId: number;
    toYear: number;
  }): Promise<PredictionDTO[]> {
    const { consumptions, consumptionMap } =
      await this.getTotalEmissionEachYearFromSource(emissionSourceId);

    this.isConsumedValueLastYearExist(consumptionMap);

    const year = consumptions.map((item) => item.year);
    const consumption = consumptions.map((item) => item.consumption);

    const regression = new SimpleLinearRegression(year, consumption);

    let predictedConsumptions: { year: number; prediction: number }[] = [];
    for (let year = this._CURRENT_YEAR; year <= toYear; year++) {
      const predictedConsumption = regression.predict(year);

      predictedConsumptions.push({ year, prediction: predictedConsumption });
    }

    return predictedConsumptions.map((item) => ({
      year: item.year,
      prediction: +item.prediction.toFixed(3),
    }));
  }

  async predictedByManual({
    emissionSourceId,
    toYear,
  }: {
    emissionSourceId: number;
    toYear: number;
  }): Promise<PredictionDTO[]> {
    const { consumptions, consumptionMap } =
      await this.getTotalEmissionEachYearFromSource(emissionSourceId);

    this.isConsumedValueLastYearExist(consumptionMap);

    const averageGrowthRate =
      PredictionUtil.calculateAverageEmissionGrowthRate(consumptions);

    const predictedConsumptions: PredictionDTO[] = [];
    for (let year = this._CURRENT_YEAR; year <= toYear; year++) {
      const lastYearConsumedValue = +consumptionMap.get(year - 1);

      const currentYearConsumedValue =
        PredictionUtil.calculatePredictedConsumption(
          lastYearConsumedValue,
          averageGrowthRate,
        );

      consumptionMap.set(year, currentYearConsumedValue);

      predictedConsumptions.push({
        year,
        prediction: consumptionMap.get(year),
      });
    }

    return predictedConsumptions.map((item) => ({
      year: item.year,
      prediction: +item.prediction.toFixed(3),
    }));
  }
}
