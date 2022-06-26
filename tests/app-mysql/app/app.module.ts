import { Module } from '@nestjs/common';
import { MysqlModule } from '../../../lib';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MysqlModule.forRoot({
      host: 'localhost',
      database: 'nest',
      password: 'root',
      user: 'root',
      port: 3306,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
