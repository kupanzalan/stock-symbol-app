import { ConfigService } from '@nestjs/config';
export declare class StockService {
    private configService;
    private readonly apiKey;
    private symbolsToTrack;
    private currentSymbolHistorical;
    private stockData;
    private movingAverage;
    private cronJobInitialized;
    constructor(configService: ConfigService);
    addSymbolToTrack(symbol: string): void;
    private processCronJob;
    private initializeCronJob;
    currentStockPrice(symbol: string): Promise<{
        symbol: string;
        currentPrice: any;
        lastUpdatedTime: Date;
        movingAverage: number;
    }>;
    private saveStockPrice;
    getStockInfo(symbol: string): Promise<any>;
    getStockPriceHistory(symbol: string): Promise<any>;
    private calculateMovingAverage;
}
