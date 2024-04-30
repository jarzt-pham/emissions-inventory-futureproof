import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactorModule } from './features';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({}), FactorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
