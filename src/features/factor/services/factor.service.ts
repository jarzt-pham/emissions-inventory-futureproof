import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateFactorDto } from '../dto/create-factor.dto';
import { UpdateFactorDto } from '../dto/update-factor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fuel } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FactorService {
  private readonly _logger = new Logger(FactorService.name);
  constructor(
    @InjectRepository(Fuel)
    private readonly _fuelRepository: Repository<Fuel>,
    private readonly _dataSource: DataSource,
  ) {}

  async findAll() {
    let dto: {
      fuel_id: number;
      fuel_name: string;
      unit_name: string;
      unit_id: number;
      emission_factor: number;
    }[] = [];

    try {
      dto = await this._dataSource
        .getRepository(Fuel)
        .createQueryBuilder('fuel')
        .innerJoin('fuel.fuelUnits', 'fuelUnits')
        .innerJoin('fuelUnits.unit', 'unit')
        .orderBy('fuel.id', 'ASC')
        .select([
          'fuel.id',
          'fuel.name',
          'unit.name',
          'unit.id',
          'fuelUnits.emission_factor',
        ])
        .getRawMany();
    } catch (error) {
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    if (dto.length === 0) {
      return [];
    }

    //mapper
    return dto.map((item) => ({
      fuel: {
        id: item.fuel_id,
        name: item.fuel_name,
      },
      unit: {
        id: item.unit_id,
        name: item.unit_name,
      },
      emission_factor: item.emission_factor,
    }));
  }
}
