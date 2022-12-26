import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlModule } from '../../../lib';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MysqlModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          host: config.get<string>('MYSQL_HOST_CONNECT_DB_ONE'),
          database: config.get<string>('MYSQL_DB_CONNECT_DB_ONE'),
          password: config.get<string>('MYSQL_PASSWORD_CONNECT_DB_ONE'),
          user: config.get<string>('MYSQL_USER_CONNECT_DB_ONE'),
          port: config.get<number>('MYSQL_PORT_CONNECT_DB_ONE'),
        }),
      },
      'db1Connection',
    ),
    MysqlModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          host: config.get<string>('MYSQL_HOST_CONNECT_DB_TWO'),
          database: config.get<string>('MYSQL_DB_CONNECT_DB_TWO'),
          password: config.get<string>('MYSQL_PASSWORD_CONNECT_DB_TWO'),
          user: config.get<string>('MYSQL_USER_CONNECT_DB_TWO'),
          port: config.get<number>('MYSQL_PORT_CONNECT_DB_TWO'),
        }),
      },
      'db2Connection',
    ),
    UsersModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
