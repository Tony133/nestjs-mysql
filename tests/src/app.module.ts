import { Module } from '@nestjs/common';
import { MysqlModule } from '../../lib/mysql.module';
import { UsersModule } from './apps/app-mysql/app/users/users.module';

@Module({
  imports: [
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
export class ApplicationModule {}
