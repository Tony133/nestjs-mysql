import { Module } from '@nestjs/common';
import { UsersModule } from '../src/apps/app-mysql/app/users/users.module';
import { MysqlModule } from '../../lib/mysql.module';
import { MysqlModuleOptions, MysqlOptionsFactory } from '../../lib';

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
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}

@Module({
  imports: [
    MysqlModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
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
export class AsyncOptionsExistingModule {}
