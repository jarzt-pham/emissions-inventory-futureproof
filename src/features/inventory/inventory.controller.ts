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
import { CreateEmissionReductionDto, UpdateEmissionReductionDto } from './dto/emission-reduction';

const ENDPOINT = {
  VERSION: 'v1',
  ROOT: 'inventory',
  EMISSiON_SOURCE: {
    ROOT: 'emission-sources',
    CONSUMPTION: 'consumptions',
    REDUCTION: 'reductions',
  },
};

@Controller(`${ENDPOINT.VERSION}/${ENDPOINT.ROOT}`)
export class InventoryController {
  constructor(
    private readonly emissionSourceService: EmissionSourceService,
    private readonly emissionConsumptionService: EmissionConsumptionService,
    private readonly emissionReductionService: EmissionReductionService,
  ) {}

  //emission-source
  @Post(ENDPOINT.EMISSiON_SOURCE.ROOT)
  createEmissionSource(
    @Body() createEmissionSourceDto: CreateEmissionSourceDto,
  ) {
    return this.emissionSourceService.create(createEmissionSourceDto);
  }

  @Get(ENDPOINT.EMISSiON_SOURCE.ROOT)
  findAllEmissionSource() {
    return this.emissionSourceService.findAll();
  }

  @Get(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id`)
  findOneEmissionSource(@Param('id') id: string) {
    return this.emissionSourceService.findOne(+id);
  }

  @Patch(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id`)
  updateEmissionSource(
    @Param('id') id: string,
    @Body() updateEmissionSourceDto: UpdateEmissionSourceDto,
  ) {
    return this.emissionSourceService.update(+id, updateEmissionSourceDto);
  }

  @Delete(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id`)
  @HttpCode(204)
  removeEmissionSource(@Param('id') id: string) {
    return this.emissionSourceService.remove(+id);
  }

  //emission-consumption
  @Post(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}`,
  )
  createEmissionConsumption(
    @Param('id') emissionSourceId: string,
    @Body() createEmissionConsumptionDto: CreateEmissionConsumptionDto,
  ) {
    return this.emissionConsumptionService.create({
      emissionSourceId: +emissionSourceId,
      createEmissionConsumptionDto,
    });
  }

  @Get(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}`,
  )
  findAllEmissionConsumption(
    @Param('id') emissionSourceId: string,
    @Query('from_year') fromYear: number,
    @Query('to_year') toYear: number,
  ) {
    return this.emissionConsumptionService.findAll({
      emissionSourceId: +emissionSourceId,
      fromYear,
      toYear,
    });
  }

  @Patch(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}/:emission_consumption_id`,
  )
  updateEmissionConsumption(
    @Param('id') emissionSourceId: string,
    @Param('emission_consumption_id') emissionConsumptionId: string,
    @Body() updateEmissionConsumptionDto: UpdateEmissionConsumptionDto,
  ) {
    return this.emissionConsumptionService.update({
      emissionSourceId: +emissionSourceId,
      emissionConsumptionId: +emissionConsumptionId,
      updateEmissionConsumptionDto,
    });
  }

  @Delete(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}/:emission_consumption_id`,
  )
  @HttpCode(204)
  removeEmissionConsumption(
    @Param('emission_consumption_id') emissionConsumptionId: string,
  ) {
    return this.emissionConsumptionService.remove(+emissionConsumptionId);
  }

  @Get(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}/total`,
  )
  totalEmission(
    @Param('id') emissionSourceId: string,
    @Query('year') year: number,
  ) {
    return this.emissionConsumptionService.totalEmissionConsumption({
      emissionSourceId: +emissionSourceId,
      year: year,
    });
  }

  //emission-consumption
  @Post(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.REDUCTION}`,
  )
  createEmissionReduction(
    @Param('id') emissionSourceId: string,
    @Body() createEmissionReductionDto: CreateEmissionReductionDto,
  ) {
    return this.emissionReductionService.create({
      emissionSourceId: +emissionSourceId,
      createEmissionReductionDto,
    });
  }

  @Get(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.REDUCTION}`,
  )
  findAllEmissionReduction(@Param('id') emissionSourceId: string) {
    return this.emissionReductionService.findAll({
      emissionSourceId: +emissionSourceId,
    });
  }

  @Patch(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.REDUCTION}/:emission_reduction_id`,
  )
  updateEmissionReduction(
    @Param('id') emissionSourceId: string,
    @Param('emission_reduction_id') emissionReductionId: string,
    @Body() updateEmissionReductionDto: UpdateEmissionReductionDto,
  ) {
    return this.emissionReductionService.update({
      emissionSourceId: +emissionSourceId,
      emissionReductionId: +emissionReductionId,
      updateEmissionReductionDto: updateEmissionReductionDto,
    });
  }

  @Delete(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.REDUCTION}/:emission_reduction_id`,
  )
  @HttpCode(204)
  removeEmissionReduction(
    @Param('emission_reduction_id') emissionReductionId: string,
  ) {
    return this.emissionReductionService.remove(+emissionReductionId);
  }
}
