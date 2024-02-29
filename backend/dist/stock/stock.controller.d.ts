import { StockService } from './stock.service';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    getStockInfo(symbol: string): Promise<{
        symbol: string;
        currentPrice: any;
        lastUpdatedTime: Date;
        movingAverage: number;
    }>;
    startPeriodicChecks(symbol: string): Promise<void>;
}
