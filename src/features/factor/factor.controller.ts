import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FactorService } from './services/factor.service';

const ENDPOINT = {
  VERSION: 'v1',
  ROOT: 'factors',
};

@Controller(`${ENDPOINT.VERSION}/${ENDPOINT.ROOT}`)
export class FactorController {
  constructor(private readonly factorService: FactorService) {}

  @Get()
  findAll() {
    return this.factorService.findAll();
  }
}
