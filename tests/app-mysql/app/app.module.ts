import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlModule } from '../../../lib';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MysqlModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('MYSQL_HOST'),
        database: config.get<string>('MYSQL_DB'),
        password: config.get<string>('MYSQL_PASSWORD'),
        user: config.get<string>('MYSQL_USER'),
        port: config.get<number>('MYSQL_PORT'),
      }),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
