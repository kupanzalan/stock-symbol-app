export declare class StockService {
    private readonly apiKey;
    private symbolsToTrack;
    private currentSymbolHistorical;
    private stockData;
    private movingAverage;
    private cronJobInitialized;
    constructor();
    addSymbolToTrack(symbol: string): void;
    private initializeCronJob;
    currentStockPrice(symbol: string): Promise<{
        symbol: string;
        currentPrice: any;
        lastUpdatedTime: Date;
        movingAverage: number;
    }>;
    private saveStockPrice;
    getStockInfo(symbol: string): Promise<any>;
    private calculateMovingAverage;
}
