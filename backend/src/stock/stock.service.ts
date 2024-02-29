import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { response } from 'express';
import * as cron from 'node-cron';

@Injectable()
export class StockService {

  private readonly apiKey = 'ciqlqj9r01qjff7cr300ciqlqj9r01qjff7cr30g';
  private symbolsToTrack: string[] = [];
  private currentSymbolHistorical: string = '';
  private stockData: { [symbol: string]: number[] } = {};
  private movingAverage = 0;
  private cronJobInitialized = false;

  constructor() {}

  addSymbolToTrack(symbol: string) {
    console.log('Tracking symbols');
    if (!this.symbolsToTrack.includes(symbol)) {
      this.symbolsToTrack.push(symbol);
    }
    // this.currentSymbol = symbol;
    this.currentSymbolHistorical = symbol;
    console.log('Most recent symbol to calculate: ', symbol);

    if (!this.cronJobInitialized && this.symbolsToTrack.length > 0) {
      this.initializeCronJob();
      this.cronJobInitialized = true;
    }
  }

  private initializeCronJob() {
    cron.schedule('*/3 * * * * *', () => {
      console.log('Still goiing with: ', this.currentSymbolHistorical);
      if (this.currentSymbolHistorical) {
        this.saveStockPrice(this.currentSymbolHistorical);
      }
    });
  }

  async currentStockPrice(symbol: string) {
    console.log('\n');
    console.log('Current stock prices... for the symbol of ----------: ', symbol);
    console.log('\n');
    // this.currentSymbol = symbol;
    try {
      const response = await this.getStockInfo(symbol);

      console.log('Axios Response:', response);
      const { c: currentPrice, t: lastUpdatedTime } = response;

      if (response.d === null) {
        throw new Error(`Stock symbol '${symbol}' not found or invalid.`);
      }

      if (this.stockData.hasOwnProperty(symbol) && this.stockData[symbol]?.length >= 10) {
        this.movingAverage = this.calculateMovingAverage(this.stockData[symbol]);
        console.log('Moving Average:', this.movingAverage);
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
    console.log('\n');
    console.log('Saving stock prices... fooooooor: ', symbol);
    console.log('\n');
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
        console.log('Moving Average:', this.movingAverage);
      }

      console.log('\n');
      console.log('Historical prices: ', this.stockData);
      console.log('Current symbol: ', symbol);
      console.log('Current symbols to track: ', this.symbolsToTrack);
      console.log('\n');

    } catch(error) {
      console.error(`An error occurred while saving stock: ${error}`);
      throw error;
    }
  }

  async getStockInfo(symbol: string) {
    console.log('Getting stock info...');
    try {
      const response = await axios.get('https://finnhub.io/api/v1/quote', {
        params: {
          symbol: symbol, 
          token: this.apiKey,
        },
      });

      return response.data;
    } catch(error) {
      console.error(`An error occured while fetching stock: ${error}`);
      throw error;
    }
  }

  private calculateMovingAverage(prices: number[]): number {
    console.log('\n');
    console.log('Calculating moving average using: ', prices);
    console.log('\n');
    if (prices.length === 0) {
      return 0;
    }

    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / prices.length;
  }
}