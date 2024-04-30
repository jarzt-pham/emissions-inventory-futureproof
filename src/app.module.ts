import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactorModule } from './features';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './configuration';

@Module({
  imports: [
    TypeOrmModule.forRoot(Configuration.TypeOrmConfiguration),
    FactorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
