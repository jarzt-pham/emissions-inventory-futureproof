import { Injectable, OnModuleInit } from '@nestjs/common';
import { runFactorSeed } from './db';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly _dataSource: DataSource) {}
  getHello(): string {
    return 'Hello World!';
  }

  onModuleInit() {
    runFactorSeed(this._dataSource);
  }
}
