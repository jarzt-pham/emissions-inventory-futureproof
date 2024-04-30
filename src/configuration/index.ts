import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export namespace Configuration {
  export const Infrastructure = {
    TYPE: 'mysql' as any,
    HOST: process.env.DATABASE_HOST ?? 'localhost',
    USERNAME: process.env.DATABASE_USER ?? 'root',
    PASSWORD: process.env.DATABASE_PASSWORD ?? 'Dev@1234',
    PORT: +process.env.DATABASE_PORT ?? 3306,
    DATABASE: process.env.DATABASE_NAME ?? 'emission_inventory',
  };

  export const TypeOrmConfiguration: TypeOrmModuleOptions = {
    type: Infrastructure.TYPE,
    host: Infrastructure.HOST,
    port: Infrastructure.PORT,
    username: Infrastructure.USERNAME,
    password: Infrastructure.PASSWORD,
    database: Infrastructure.DATABASE,
    synchronize: true,
    autoLoadEntities: true,
  };
}
