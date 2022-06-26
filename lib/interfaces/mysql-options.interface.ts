export interface MysqlModuleOptions {
  name?: string;
  host?: string;
  database?: string;
  password?: string;
  socketPath?: string;
  localAddress?: string;
  user?: string;
  port?: number;
  charset?: string;
  retryAttempts?: number;
  retryDelay?: number;
  waitForConnections?: boolean;
  connectionLimit?: number;
  queueLimit?: number;
  connectTimeout?: number;
  timezone?: string;
  ssl?: string | object;
  insecureAuth?: boolean;
  debug?: boolean;
  typeCast?: boolean;
  trace?: boolean;
  stringifyObjects?: boolean;
  supportBigNumbers?: boolean;
  bigNumberStrings?: boolean;
  dateStrings?: boolean;
  multipleStatements?: boolean;
  localInfile?: boolean;
}
