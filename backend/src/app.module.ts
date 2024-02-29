import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './stock/stock.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    StockModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
