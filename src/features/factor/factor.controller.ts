import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FactorService } from './services/factor.service';
import { CreateFactorDto } from './dto/create-factor.dto';
import { UpdateFactorDto } from './dto/update-factor.dto';

@Controller('factor')
export class FactorController {
  constructor(private readonly factorService: FactorService) {}

  @Post()
  create(@Body() createFactorDto: CreateFactorDto) {
    return this.factorService.create(createFactorDto);
  }

  @Get()
  findAll() {
    return this.factorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFactorDto: UpdateFactorDto) {
    return this.factorService.update(+id, updateFactorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factorService.remove(+id);
  }
}
