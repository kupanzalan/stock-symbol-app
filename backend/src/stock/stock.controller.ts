import { Controller, Get, Param, Put, HttpException, HttpStatus } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/:symbol')
  async getStockInfo(@Param('symbol') symbol: string) {
    console.log('GET /symbol');
    try {
      const stockInfo = await this.stockService.currentStockPrice(symbol);
      return stockInfo;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put('/:symbol')
  async startPeriodicChecks(@Param('symbol') symbol: string) {
    console.log('PUT /symbol');
    try {
      return this.stockService.addSymbolToTrack(symbol);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}