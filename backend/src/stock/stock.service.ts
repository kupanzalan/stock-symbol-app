import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cron from 'node-cron';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StockService {

  private readonly apiKey;
  private symbolsToTrack: string[] = [];
  private currentSymbolHistorical: string = '';
  private stockData: { [symbol: string]: number[] } = {};
  private movingAverage = 0;
  private cronJobInitialized = false;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('API_KEY');
  }

  addSymbolToTrack(symbol: string) {
    try {
      if (!this.symbolsToTrack.includes(symbol)) {
        this.symbolsToTrack.push(symbol);
      }
      this.currentSymbolHistorical = symbol;
  
      if (!this.cronJobInitialized && this.symbolsToTrack.length > 0) {
        this.initializeCronJob();
        this.cronJobInitialized = true;
      }
    } catch(error) {
      console.error(`An error occurred while adding symbol to track: ${error}`);
      throw error; 
    }   
  }

  private processCronJob() {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.currentSymbolHistorical) {
          await this.saveStockPrice(this.currentSymbolHistorical);
          resolve(undefined);
        } else {
          reject(new Error('Invalid symbol'));
        }
      } catch (error) {
        console.error(`An error occurred in cron job: ${error}`);
        reject(error);
      }
    });
  }
  
  private initializeCronJob() {
    cron.schedule('* * * * *', async () => {
      try {
        await this.processCronJob();
      } catch (error) {
        console.error(`An error occurred in cron job scheduling: ${error}`);
      }
    });
  }

  async currentStockPrice(symbol: string) {
    try {
      const response = await this.getStockInfo(symbol);
      const { c: currentPrice, t: lastUpdatedTime } = response;

      if (this.stockData.hasOwnProperty(symbol) && this.stockData[symbol]?.length >= 10) {
        this.movingAverage = this.calculateMovingAverage(this.stockData[symbol]);
      } else {
        this.movingAverage = 0;
      }

      return {
        symbol,
        currentPrice,
        lastUpdatedTime: new Date(lastUpdatedTime * 1000),
        movingAverage: this.movingAverage
      };
    } catch(error) {
      console.error(`An error occured while fetching stock: ${error}`);
      throw error;
    }   
  }

  private async saveStockPrice(symbol: string) {
    try {
      const response = await this.getStockInfo(symbol);
      const { c: currentPrice, t: lastUpdatedTime } = response;

      if (!this.stockData[symbol]) {
        this.stockData[symbol] = [];
      }
      this.stockData[symbol].push(currentPrice);

      if (this.stockData[symbol].length > 10) {
        this.stockData[symbol].shift();
        this.movingAverage = this.calculateMovingAverage(this.stockData[symbol]);
      }
    } catch(error) {
      console.error(`An error occurred while saving stock: ${error}`);
      throw error;
    }
  }

  async getStockInfo(symbol: string) {
    try {
      const response = await axios.get('https://finnhub.io/api/v1/quote', {
        params: {
          symbol: symbol, 
          token: this.apiKey,
        },
      });

      if (response.data.c === 0 && response.data.t === 0) {
        throw new Error(`Invalid symbol: ${symbol}`);
      }
      return response.data;
    } catch(error) {
      console.error(`An error occured while fetching stock: ${error}`);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        throw new Error(`Access denied. Please check your API key or permissions.`);
      } else {
        throw new Error(`An error occurred while fetching stock.`);
      }
    }
  }

  private calculateMovingAverage(prices: number[]): number {
    if (prices.length === 0) {
      return 0;
    }
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / prices.length;
  }
}