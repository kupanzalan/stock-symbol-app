import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './stock/stock.module';
import { MyConfigModule } from './config/config.module';

@Module({
  imports: [
    StockModule, 
    MyConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
