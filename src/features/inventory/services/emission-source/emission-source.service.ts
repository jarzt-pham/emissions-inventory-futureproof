import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmissionSourceDto } from '../../dto/emission-source/create-emission-source.dto';
import { UpdateEmissionSourceDto } from '../../dto/emission-source/update-emission-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmissionConsumption, EmissionSource } from '../../entities';
import { Repository } from 'typeorm';
import { EmissionSourceDto } from '../../dto/emission-source';
import { EmissionSourceException } from '../../exceptions';

@Injectable()
export class EmissionSourceService {
  private readonly logger = new Logger(EmissionSourceService.name);
  constructor(
    @InjectRepository(EmissionSource)
    private readonly _emissionSourceRepo: Repository<EmissionSource>,
  ) {}
  async create(createEmissionSourceDto: CreateEmissionSourceDto) {
    const createPayload = EmissionSourceService.fromDtoToModel(
      createEmissionSourceDto,
    );

    const entity = new EmissionSource();
    entity.create({
      description: createPayload.description,
    });

    let savedEntity: EmissionSource;
    try {
      savedEntity = await this._emissionSourceRepo.save(entity);
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException();
    }

    if (!savedEntity) {
      return new InternalServerErrorException();
    }

    return EmissionSourceService.fromModelToDto(savedEntity);
  }

  async findAll() {
    let emissionSources: EmissionSource[] = [];
    try {
      emissionSources = await this._emissionSourceRepo.find();
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException();
    }

    if (!emissionSources || emissionSources.length === 0) {
      return [];
    }

    return emissionSources.map((es) =>
      EmissionSourceService.fromModelToDto(es),
    );
  }

  async findOne(id: number) {
    await this.isExist(id);

    let entity: EmissionSource;
    try {
      entity = await this._emissionSourceRepo.findOneBy({ id });
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException();
    }

    return EmissionSourceService.fromModelToDto(entity);
  }

  async update(id: number, updateEmissionSourceDto: UpdateEmissionSourceDto) {
    const entity = await this._emissionSourceRepo.findOneBy({ id });

    entity.update(updateEmissionSourceDto);

    try {
      await this._emissionSourceRepo.update(+id, entity);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    return EmissionSourceService.fromModelToDto(entity);
  }

  async remove(id: number) {
    await this.isExist(id);

    try {
      await this._emissionSourceRepo.delete(id);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    return;
  }

  async isExist(id: number) {
    let entity: EmissionSource;
    try {
      entity = await this._emissionSourceRepo.findOneBy({ id });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }

    if (!entity) throw EmissionSourceException.NotExist(id);
    return entity;
  }

  static fromModelToDto(model: EmissionSource) {
    return new EmissionSourceDto({
      id: model.id,
      description: model.description,
      created_at: model.createdAt,
      updated_at: model.updatedAt,
    });
  }

  static fromDtoToModel(dto: Partial<EmissionSourceDto>) {
    return {
      description: dto.description,
    };
  }
}
