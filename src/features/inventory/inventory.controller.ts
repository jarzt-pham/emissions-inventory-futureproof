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

const ENDPOINT = {
  ROOT: 'inventory',
  EMISSiON_SOURCE: {
    ROOT: 'emission-sources',
    CONSUMPTION: 'consumptions',
  },
};

@Controller(ENDPOINT.ROOT)
export class InventoryController {
  constructor(
    private readonly emissionSourceService: EmissionSourceService,
    private readonly emissionConsumptionService: EmissionConsumptionService,
  ) {}

  @Post(ENDPOINT.EMISSiON_SOURCE.ROOT)
  create(@Body() createEmissionSourceDto: CreateEmissionSourceDto) {
    return this.emissionSourceService.create(createEmissionSourceDto);
  }

  @Get(ENDPOINT.EMISSiON_SOURCE.ROOT)
  findAll() {
    return this.emissionSourceService.findAll();
  }

  @Get(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id`)
  findOne(@Param('id') id: ValidateUtils.FindOneParams) {
    return this.emissionSourceService.findOne(+id);
  }

  @Patch(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id`)
  update(
    @Param('id') id: ValidateUtils.FindOneParams,
    @Body() updateEmissionSourceDto: UpdateEmissionSourceDto,
  ) {
    return this.emissionSourceService.update(+id, updateEmissionSourceDto);
  }

  @Delete(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id`)
  @HttpCode(204)
  remove(@Param('id') id: ValidateUtils.FindOneParams) {
    return this.emissionSourceService.remove(+id);
  }

  @Post(
    `${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id/${ENDPOINT.EMISSiON_SOURCE.CONSUMPTION}`,
  )
  createEmissionConsumption(
    // @Param('id') id: ValidateUtils.FindOneParams,
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
    // @Param('id') id: ValidateUtils.FindOneParams,
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
}
