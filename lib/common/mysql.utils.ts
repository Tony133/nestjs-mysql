import { MysqlModuleOptions } from '../interfaces';
import { DEFAULT_CONNECTION_NAME } from '../mysql.constants';
import { Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';
import { Logger } from '@nestjs/common';
import { CircularDependencyException } from '../exceptions/circular-dependency.exception';

const logger = new Logger('MysqlModule');

/**
 * This function generates an injection token for an Database
 * @param {Function} This parameter can either be a Databases
 * @param {string} [connection='default'] Connection name
 * @returns {string} The Entity injection token
 */
export function getDbToken(
  database: Function,
  connection: MysqlModuleOptions | string = DEFAULT_CONNECTION_NAME,
) {
  if (database === null || database === undefined) {
    throw new CircularDependencyException('@InjectClient()');
  }
  const connectionPrefix = getConnectionPrefix(connection);
  return `${connectionPrefix}${database.name}`;
}

export function getConnectionToken(
  connection: MysqlModuleOptions | string = DEFAULT_CONNECTION_NAME,
): string | Function {
  if (typeof connection === 'string') {
    return connection;
  }
  return `${connection.name || DEFAULT_CONNECTION_NAME}`;
}

/**
 * This function returns a Connection prefix based on the connection name
 * @param {MysqlModuleOptions | string} [connection='default'] This optional parameter is either
 * a MysqlModuleOptions or a string.
 * @returns {string | Function} The Connection injection token.
 */
export function getConnectionPrefix(
  connection: MysqlModuleOptions | string = DEFAULT_CONNECTION_NAME,
): string {
  if (connection === DEFAULT_CONNECTION_NAME) {
    return '';
  }
  if (typeof connection === 'string') {
    return connection + '_';
  }
  if (connection.name === DEFAULT_CONNECTION_NAME || !connection.name) {
    return '';
  }
  return connection.name + '_';
}

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error: Error) => {
            logger.error(
              `Unable to connect to the database. Retrying (${
                errorCount + 1
              })...`,
              error.stack,
            );
            if (errorCount + 1 >= retryAttempts) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(retryDelay),
        ),
      ),
    );
}

export function getConnectionName(options: MysqlModuleOptions) {
  return options && options.name ? options.name : DEFAULT_CONNECTION_NAME;
}

export const generateString = () => randomUUID();
