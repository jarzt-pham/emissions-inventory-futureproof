import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEmissionSourceDto } from './dto/emission-source/create-emission-source.dto';
import { UpdateEmissionSourceDto } from './dto/emission-source/update-emission-source.dto';
import { ValidateUtils } from './validates';
import { EmissionSourceService } from './services/emission-source';

const ENDPOINT = {
  ROOT: 'inventory',
  EMISSiON_SOURCE: {
    ROOT: 'emission-sources',
  },
};

@Controller(ENDPOINT.ROOT)
export class InventoryController {
  constructor(private readonly emissionSourceService: EmissionSourceService) {}

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
    console.log({ id });

    return this.emissionSourceService.update(+id, updateEmissionSourceDto);
  }

  @Delete(`${ENDPOINT.EMISSiON_SOURCE.ROOT}/:id`)
  remove(@Param('id') id: ValidateUtils.FindOneParams) {
    console.log({ id });
    return this.emissionSourceService.remove(+id);
  }
}
