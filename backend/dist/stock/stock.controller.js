"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const common_1 = require("@nestjs/common");
const stock_service_1 = require("./stock.service");
let StockController = class StockController {
    constructor(stockService) {
        this.stockService = stockService;
    }
    async getStockInfo(symbol) {
        console.log('GET /symbol');
        try {
            const stockInfo = await this.stockService.currentStockPrice(symbol);
            return stockInfo;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getStockPriceHistory(symbol) {
        console.log('GET /stock/history');
        try {
            const history = await this.stockService.getStockPriceHistory(symbol);
            console.log('History:', history);
            return history;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async startPeriodicChecks(symbol) {
        console.log('PUT /symbol');
        try {
            return this.stockService.addSymbolToTrack(symbol);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.StockController = StockController;
__decorate([
    (0, common_1.Get)('/:symbol'),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getStockInfo", null);
__decorate([
    (0, common_1.Get)('/history/:symbol'),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getStockPriceHistory", null);
__decorate([
    (0, common_1.Put)('/:symbol'),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "startPeriodicChecks", null);
exports.StockController = StockController = __decorate([
    (0, common_1.Controller)('/stock'),
    __metadata("design:paramtypes", [stock_service_1.StockService])
], StockController);
//# sourceMappingURL=stock.controller.js.map