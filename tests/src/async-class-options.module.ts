import { Module } from '@nestjs/common';
import { MysqlOptionsFactory, MysqlModuleOptions, MysqlModule } from '../../lib';
import { UsersModule } from './apps/app-mysql/app/users/users.module';

class ConfigService implements MysqlOptionsFactory {
  createMysqlOptions(): MysqlModuleOptions {
    return {
      host: '127.0.0.1',
      database: 'test',
      password: 'root',
      user: 'root',
      port: 3306,
    };
  }
}

@Module({
  imports: [
    MysqlModule.forRootAsync({
      useClass: ConfigService,
    }),
    MysqlModule.forRoot({
      host: '127.0.0.1',
      database: 'test',
      password: 'root',
      user: 'root',
      port: 3306,
    }),
    UsersModule,
  ],
})
export class AsyncOptionsClassModule {}
