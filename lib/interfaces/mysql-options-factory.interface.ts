import { MysqlModuleOptions } from './mysql-options.interface';

export interface MysqlOptionsFactory {
  createMysqlOptions(
    connectionName?: string,
  ): Promise<MysqlModuleOptions> | MysqlModuleOptions;
}
