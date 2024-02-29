"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cron = __importStar(require("node-cron"));
let StockService = class StockService {
    constructor() {
        this.apiKey = 'ciqlqj9r01qjff7cr300ciqlqj9r01qjff7cr30g';
        this.symbolsToTrack = [];
        this.currentSymbolHistorical = '';
        this.stockData = {};
        this.movingAverage = 0;
        this.cronJobInitialized = false;
    }
    addSymbolToTrack(symbol) {
        console.log('Tracking symbols');
        if (!this.symbolsToTrack.includes(symbol)) {
            this.symbolsToTrack.push(symbol);
        }
        this.currentSymbolHistorical = symbol;
        console.log('Most recent symbol to calculate: ', symbol);
        if (!this.cronJobInitialized && this.symbolsToTrack.length > 0) {
            this.initializeCronJob();
            this.cronJobInitialized = true;
        }
    }
    initializeCronJob() {
        cron.schedule('*/3 * * * * *', () => {
            console.log('Still goiing with: ', this.currentSymbolHistorical);
            if (this.currentSymbolHistorical) {
                this.saveStockPrice(this.currentSymbolHistorical);
            }
        });
    }
    async currentStockPrice(symbol) {
        console.log('\n');
        console.log('Current stock prices... for the symbol of ----------: ', symbol);
        console.log('\n');
        try {
            const response = await this.getStockInfo(symbol);
            console.log('Axios Response:', response);
            const { c: currentPrice, t: lastUpdatedTime } = response;
            if (this.stockData.hasOwnProperty(symbol) && this.stockData[symbol]?.length >= 10) {
                this.movingAverage = this.calculateMovingAverage(this.stockData[symbol]);
                console.log('Moving Average:', this.movingAverage);
            }
            else {
                this.movingAverage = 0;
            }
            return {
                symbol,
                currentPrice,
                lastUpdatedTime: new Date(lastUpdatedTime * 1000),
                movingAverage: this.movingAverage
            };
        }
        catch (error) {
            console.error(`An error occured while fetching stock: ${error}`);
            throw error;
        }
    }
    async saveStockPrice(symbol) {
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
        }
        catch (error) {
            console.error(`An error occurred while saving stock: ${error}`);
            throw error;
        }
    }
    async getStockInfo(symbol) {
        console.log('Getting stock info...');
        try {
            const response = await axios_1.default.get('https://finnhub.io/api/v1/quote', {
                params: {
                    symbol: symbol,
                    token: this.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(`An error occured while fetching stock: ${error}`);
            throw error;
        }
    }
    calculateMovingAverage(prices) {
        console.log('\n');
        console.log('Calculating moving average using: ', prices);
        console.log('\n');
        if (prices.length === 0) {
            return 0;
        }
        const sum = prices.reduce((acc, price) => acc + price, 0);
        return sum / prices.length;
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StockService);
//# sourceMappingURL=stock.service.js.map