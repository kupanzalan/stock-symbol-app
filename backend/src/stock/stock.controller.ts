import { Controller, Get, Param, Put } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/:symbol')
  async getStockInfo(@Param('symbol') symbol: string) {
    console.log('GET /symbol');
    const stockInfo = await this.stockService.currentStockPrice(symbol);
    return stockInfo;
  }

  @Put('/:symbol')
  async startPeriodicChecks(@Param('symbol') symbol: string) {
    console.log('PUT /symbol');
    return this.stockService.addSymbolToTrack(symbol);
  }
}