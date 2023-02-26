import { Module } from '@nestjs/common';
import { MysqlModule } from '../../../../../lib';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MysqlModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('MYSQL_HOST', 'localhost'),
        database: config.get<string>('MYSQL_DB', 'test'),
        password: config.get<string>('MYSQL_PASSWORD', 'root'),
        user: config.get<string>('MYSQL_USER', 'root'),
        port: config.get<number>('MYSQL_PORT', 3306),
      }),
    }),
    UsersModule,
  ],
})
export class AppModule {}
