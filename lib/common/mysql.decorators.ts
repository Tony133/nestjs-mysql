import { Inject } from '@nestjs/common';
import { MysqlModuleOptions } from '../interfaces/mysql-options.interface';
import { getConnectionToken } from './mysql.utils';

export const InjectClient = (connection?: string) => {
  return Inject(getConnectionToken(connection));
};

export const InjectPool = (connection?: string) => {
  return Inject(getConnectionToken(connection));
};

export const InjectConnection: (
  connection?: MysqlModuleOptions | string,
) => ParameterDecorator = (connection?: MysqlModuleOptions | string) =>
  Inject(getConnectionToken(connection));
