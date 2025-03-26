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
const config_1 = require("@nestjs/config");
let StockService = class StockService {
    constructor(configService) {
        this.configService = configService;
        this.symbolsToTrack = [];
        this.currentSymbolHistorical = '';
        this.stockData = {};
        this.movingAverage = 0;
        this.cronJobInitialized = false;
        this.apiKey = this.configService.get('API_KEY');
    }
    addSymbolToTrack(symbol) {
        try {
            if (!this.symbolsToTrack.includes(symbol)) {
                this.symbolsToTrack.push(symbol);
            }
            this.currentSymbolHistorical = symbol;
            if (!this.cronJobInitialized && this.symbolsToTrack.length > 0) {
                this.initializeCronJob();
                this.cronJobInitialized = true;
            }
        }
        catch (error) {
            console.error(`An error occurred while adding symbol to track: ${error}`);
            throw error;
        }
    }
    processCronJob() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.currentSymbolHistorical) {
                    await this.saveStockPrice(this.currentSymbolHistorical);
                    resolve(undefined);
                }
                else {
                    reject(new Error('Invalid symbol'));
                }
            }
            catch (error) {
                console.error(`An error occurred in cron job: ${error}`);
                reject(error);
            }
        });
    }
    initializeCronJob() {
        cron.schedule('* * * * *', async () => {
            try {
                await this.processCronJob();
            }
            catch (error) {
                console.error(`An error occurred in cron job scheduling: ${error}`);
            }
        });
    }
    async currentStockPrice(symbol) {
        try {
            const response = await this.getStockInfo(symbol);
            const { c: currentPrice, t: lastUpdatedTime } = response;
            if (this.stockData.hasOwnProperty(symbol) && this.stockData[symbol]?.length >= 10) {
                this.movingAverage = this.calculateMovingAverage(this.stockData[symbol]);
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
        }
        catch (error) {
            console.error(`An error occurred while saving stock: ${error}`);
            throw error;
        }
    }
    async getStockInfo(symbol) {
        try {
            const response = await axios_1.default.get('https://finnhub.io/api/v1/quote', {
                params: {
                    symbol: symbol,
                    token: this.apiKey,
                },
            });
            if (response.data.c === 0 && response.data.t === 0) {
                throw new Error(`Invalid symbol: ${symbol}`);
            }
            return response.data;
        }
        catch (error) {
            console.error(`An error occured while fetching stock: ${error}`);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 403) {
                throw new Error(`Access denied. Please check your API key or permissions.`);
            }
            else {
                throw new Error(`An error occurred while fetching stock.`);
            }
        }
    }
    async getStockPriceHistory(symbol) {
        try {
            const response = await axios_1.default.get(`https://api.example.com/stock/${symbol}/history`);
            console.log('History data from third-party API:', response.data);
            return response.data.map(item => ({
                date: item.date,
                price: item.price
            }));
        }
        catch (error) {
            throw new Error('Error fetching stock history');
        }
    }
    calculateMovingAverage(prices) {
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
    __metadata("design:paramtypes", [config_1.ConfigService])
], StockService);
//# sourceMappingURL=stock.service.js.map