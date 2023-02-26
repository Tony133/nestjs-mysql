import { DynamicModule, Module } from '@nestjs/common';
import { MysqlModule } from '../../lib';

@Module({})
export class DatabaseModule {
  static async forRoot(): Promise<DynamicModule> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      module: DatabaseModule,
      imports: [
        MysqlModule.forRoot(
          {
            name: 'db1Connection',
            host: '127.0.0.1',
            database: 'test',
            password: 'root',
            user: 'root',
            port: 3306,
          },
          'db1Connection',
        ),
        MysqlModule.forRoot(
          {
            name: 'db2Connection',
            host: '127.0.0.1',
            database: 'test',
            password: 'root',
            user: 'root',
            port: 3306,
          },
          'db2Connection',
        ),
      ],
    };
  }
}
