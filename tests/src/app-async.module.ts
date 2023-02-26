import { Module } from '@nestjs/common';
import { AppModule } from './apps/app-mysql/app/app.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule.forRoot(), AppModule],
})
export class AsyncApplicationModule {}
