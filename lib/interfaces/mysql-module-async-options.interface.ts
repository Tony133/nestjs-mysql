import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { MysqlModuleOptions } from './mysql-options.interface';
import { MysqlOptionsFactory } from './mysql-options-factory.interface';

export interface MysqlModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  inject?: any[];
  useClass?: Type<MysqlOptionsFactory>;
  useExisting?: Type<MysqlOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MysqlModuleOptions> | MysqlModuleOptions;
}
