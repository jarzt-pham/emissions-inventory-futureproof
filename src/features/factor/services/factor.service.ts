import { Injectable } from '@nestjs/common';
import { CreateFactorDto } from '../dto/create-factor.dto';
import { UpdateFactorDto } from '../dto/update-factor.dto';

@Injectable()
export class FactorService {
  create(createFactorDto: CreateFactorDto) {
    return 'This action adds a new factor';
  }

  findAll() {
    return `This action returns all factor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} factor`;
  }

  update(id: number, updateFactorDto: UpdateFactorDto) {
    return `This action updates a #${id} factor`;
  }

  remove(id: number) {
    return `This action removes a #${id} factor`;
  }
}
