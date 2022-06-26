import { Module } from '@nestjs/common';
import { MysqlModule } from '../../../lib';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MysqlModule.forRootAsync(
      {
        useFactory: () => ({
          host: 'localhost',
          database: 'test1',
          password: 'root',
          user: 'root',
          port: 3306,
        }),
      },
      'db1Connection',
    ),
    MysqlModule.forRootAsync(
      {
        useFactory: () => ({
          host: 'localhost',
          database: 'test2',
          password: 'root',
          user: 'root',
          port: 3307,
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
