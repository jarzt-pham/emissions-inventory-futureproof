import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEmissionSourceDto } from './dto/emission-source/create-emission-source.dto';
import { UpdateEmissionSourceDto } from './dto/emission-source/update-emission-source.dto';
import { ValidateUtils } from './validates';
import { EmissionSourceService } from './services/emission-source';
import {
  CreateEmissionConsumptionDto,
  UpdateEmissionConsumptionDto,
} from './dto/emisison-consumption';
import { EmissionConsumptionService } from './services/emission-consumption/emission-consumption.service';
import { EmissionReductionService } from './services/emission-reduction';
import {
  CreateEmissionReductionDto,
  UpdateEmissionReductionDto,
} from './dto/emission-reduction';
import {
  EmissionUtilService,
  EmissionUtilType,
} from './services/emission-util';

const ENDPOINT = {
  VERSION: 'v1',
  ROOT: 'inventory',
  EMISSiON_SOURCE: {
    ROOT: 'emission-sources',
    CONSUMPTION: 'consumptions',
    REDUCTION: 'reductions',
    PREDICTION: 'predictions',
  },
};

@Controller(`${ENDPOINT.VERSION}/${ENDPOINT.ROOT}`)
export class InventoryController {
  constructor(
    private readonly _emissionSourceService: EmissionSourceService,
    private readonly _emissionConsumptionService: EmissionConsumptionService,
    private readonly _emissionReductionService: EmissionReductionService,
    private readonly _emissionUtil: EmissionUtilService,
  ) {}

  //emission-source
  @Post(ENDPOINT.EMISSiON_SOURCE.ROOT)
  createEmissionSource(
    @Body() createEmissionSourceDto: CreateEmissionSourceDto,
  ) {
    return this._emissionSourceService.create(createEmissionSourceDto);
  }

  @Get(ENDPOINT.EMISSiON_SOURCE.ROOT)
  findAllEmissionSource() {
    return this._emissionSourceService.findAll();
  }

  @Get(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id`)
  findOneEmissionSource(@Param() param: ValidateUtils.EmissionSource) {
    return this._emissionSourceService.findOne(+param.emission_source_id);
  }

  @Patch(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id`)
  updateEmissionSource(
    @Param() param: ValidateUtils.EmissionSource,
    @Body() updateEmissionSourceDto: UpdateEmissionSourceDto,
  ) {
    return this._emissionSourceService.update(
      +param.emission_source_id,
      updateEmissionSourceDto,
    );
  }

  @Delete(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id`)
  @HttpCode(204)
  removeEmissionSource(@Param() param: ValidateUtils.EmissionSource) {
    return this._emissionSourceService.remove(+param.emission_source_id);
  }

  //emission-consumption
  @Post(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}`,
  )
  createEmissionConsumption(
    @Param() param: ValidateUtils.EmissionSource,
    @Body() createEmissionConsumptionDto: CreateEmissionConsumptionDto,
  ) {
    return this._emissionConsumptionService.create({
      emissionSourceId: +param.emission_source_id,
      createEmissionConsumptionDto,
    });
  }

  @Get(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}`,
  )
  findAllEmissionConsumption(
    @Param() param: ValidateUtils.EmissionSource,
    @Query() query: ValidateUtils.PeriodYearInThePast,
  ) {
    return this._emissionConsumptionService.findAll({
      emissionSourceId: +param.emission_source_id,
      fromYear: +query.from_year,
      toYear: +query.to_year,
    });
  }

  @Patch(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}/:emission_consumption_id`,
  )
  updateEmissionConsumption(
    @Param()
    param: ValidateUtils.EmissionSource & ValidateUtils.EmissionConsumption,
    @Body() updateEmissionConsumptionDto: UpdateEmissionConsumptionDto,
  ) {
    return this._emissionConsumptionService.update({
      emissionSourceId: +param.emission_source_id,
      emissionConsumptionId: +param.emission_consumption_id,
      updateEmissionConsumptionDto,
    });
  }

  @Delete(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}/:emission_consumption_id`,
  )
  @HttpCode(204)
  removeEmissionConsumption(
    @Param()
    param: ValidateUtils.EmissionSource & ValidateUtils.EmissionConsumption,
  ) {
    return this._emissionConsumptionService.remove({
      emissionSourceId: +param.emission_source_id,
      emissionConsumptionId: +param.emission_consumption_id,
    });
  }

  @Get(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}/total`,
  )
  totalEmissionOfSource(
    @Param() param: ValidateUtils.EmissionSource,
    @Query() query: ValidateUtils.FromYear,
  ) {
    return this._emissionConsumptionService.totalEmissionConsumption({
      emissionSourceId: +param.emission_source_id,
      fromYear: +query.from_year,
    });
  }

  //emission-consumption
  @Post(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.REDUCTION}`,
  )
  createEmissionReduction(
    @Param() param: ValidateUtils.EmissionSource,
    @Body() createEmissionReductionDto: CreateEmissionReductionDto,
  ) {
    return this._emissionReductionService.create({
      emissionSourceId: +param.emission_source_id,
      createEmissionReductionDto,
    });
  }

  @Get(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.REDUCTION}`,
  )
  findAllEmissionReduction(@Param() param: ValidateUtils.EmissionSource) {
    return this._emissionReductionService.findAll({
      emissionSourceId: +param.emission_source_id,
    });
  }

  @Patch(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.REDUCTION}/:emission_reduction_id`,
  )
  updateEmissionReduction(
    @Param()
    param: ValidateUtils.EmissionSource & ValidateUtils.EmissionReduction,
    @Body() updateEmissionReductionDto: UpdateEmissionReductionDto,
  ) {
    return this._emissionReductionService.update({
      emissionSourceId: +param.emission_source_id,
      emissionReductionId: +param.emission_reduction_id,
      updateEmissionReductionDto: updateEmissionReductionDto,
    });
  }

  @Delete(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.REDUCTION}/:emission_reduction_id`,
  )
  @HttpCode(204)
  removeEmissionReduction(
    @Param()
    param: ValidateUtils.EmissionSource & ValidateUtils.EmissionReduction,
  ) {
    return this._emissionReductionService.remove({
      emissionReductionId: +param.emission_reduction_id,
      emissionSourceId: +param.emission_source_id,
    });
  }

  //emission-util
  @Get(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:emission_source_id/${ENDPOINT.EMISSiON_SOURCE.PREDICTION}`,
  )
  predictedByAI(
    @Param() param: ValidateUtils.EmissionSource,
    @Param('by')
    by: EmissionUtilType.PredictionByEnum = EmissionUtilType.PredictionByEnum
      .AI,
    @Query() query: ValidateUtils.PredictionPeriodYear,
  ) {
    const toYearInput = query.to_year
      ? +query.to_year
      : new Date().getFullYear();

    return this._emissionUtil.predictionBy(toYearInput, {
      by: by,
      emissionSourceId: +param.emission_source_id,
    });
  }

  //total-whole-inventory
  @Get(`total-emission`)
  async totalEmissionMetrics(
    @Query('by')
    by: EmissionUtilType.PredictionByEnum = EmissionUtilType.PredictionByEnum
      .AI,
    @Query() query?: ValidateUtils.PartialPeriodYearInThePast,
  ) {
    const toYearInput = query.to_year
      ? +query.to_year
      : new Date().getFullYear();

    return this._emissionUtil.totalEmissionMetrics({
      prediction: {
        by,
        toYear: toYearInput,
      },
    });
  }
}
