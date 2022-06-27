import {
  Global,
  Module,
  DynamicModule,
  Provider,
  Type,
  OnApplicationShutdown,
  Inject,
} from '@nestjs/common';
import {
  MysqlModuleAsyncOptions,
  MysqlModuleOptions,
  MysqlOptionsFactory,
} from './interfaces';
import { getConnectionToken, handleRetry } from './common/mysql.utils';
import { MYSQL_MODULE_OPTIONS } from './mysql.constants';
import { ModuleRef } from '@nestjs/core';
import { defer, lastValueFrom } from 'rxjs';
import * as mysql from 'mysql2/promise';

@Global()
@Module({})
export class MysqlCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(MYSQL_MODULE_OPTIONS)
    private readonly options: MysqlModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(
    options: MysqlModuleOptions,
    connection?: string,
  ): DynamicModule {
    const knexModuleOptions = {
      provide: MYSQL_MODULE_OPTIONS,
      useValue: options,
    };

    const connectionProvider: Provider = {
      provide: getConnectionToken(connection),
      useFactory: async () => await this.createConnectionFactory(options),
    };

    return {
      module: MysqlCoreModule,
      providers: [connectionProvider, knexModuleOptions],
      exports: [connectionProvider],
    };
  }

  public static forRootAsync(
    options: MysqlModuleAsyncOptions,
    connection: string,
  ): DynamicModule {
    const connectionProvider: Provider = {
      provide: getConnectionToken(connection),
      useFactory: async (options: MysqlModuleOptions) => {
        return await this.createConnectionFactory(options);
      },
      inject: [MYSQL_MODULE_OPTIONS],
    };

    return {
      module: MysqlCoreModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), connectionProvider],
      exports: [connectionProvider],
    };
  }

  async onApplicationShutdown(): Promise<any> {
    const connection = this.moduleRef.get<any>(
      getConnectionToken(this.options as MysqlModuleOptions) as Type<any>,
    );
    connection && (await connection.end);
  }

  public static createAsyncProviders(
    options: MysqlModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<MysqlOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  public static createAsyncOptionsProvider(
    options: MysqlModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MYSQL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // `as Type<MysqlOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<MysqlOptionsFactory>,
    ];

    return {
      provide: MYSQL_MODULE_OPTIONS,
      useFactory: async (
        optionsFactory: MysqlOptionsFactory,
      ): Promise<MysqlModuleOptions> => {
        return await optionsFactory.createMysqlOptions();
      },
      inject,
    };
  }

  private static async createConnectionFactory(
    options: MysqlModuleOptions,
  ): Promise<any> {
    return lastValueFrom(
      defer(async () => {
        const client = mysql.createConnection(options);
        return client;
      }).pipe(handleRetry(options.retryAttempts, options.retryDelay)),
    );
  }
}
