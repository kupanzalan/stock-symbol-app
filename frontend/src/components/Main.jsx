import React, { useState } from 'react';
import axios from 'axios';
import texts from '../texts.json';
import Chart from './Chart';

const Main = () => {

  const [symbol, setSymbol] = useState('');
  const [trackingSymbol, setTrackingSymbol] = useState('');
  const [stockInfo, setStockInfo] = useState(null);
  const [error, setError] = useState(null);
  const [symbolToTrack, setSymbolToTrack] = useState(null);

  const dummyPriceHistory = [
    { date: '2025-03-01', price: 150 },
    { date: '2025-03-02', price: 160 },
    { date: '2025-03-03', price: 170 },
    { date: '2025-03-04', price: 165 },
    { date: '2025-03-05', price: 180 }
  ];

  const dummyPriceHistoryZeros = [
    { date: '2025-03-01', price: 0 },
    { date: '2025-03-02', price: 0 },
    { date: '2025-03-03', price: 0 },
    { date: '2025-03-04', price: 0 },
    { date: '2025-03-05', price: 0 }
  ];

  // Assume this is the stock price history data (in reality, you will fetch it)
  // const [stockPriceHistory, setStockPriceHistory] = useState([]);

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  const handleTrackingSymbolChange = (e) => {
    setTrackingSymbol(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) {
      setError('Field can not be empty.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/stock/${symbol}`);
      setStockInfo(response.data);
      setError(null);

      // Here, you should fetch historical data for the stock to pass to the Chart component
      // const priceHistoryResponse = await axios.get(`http://localhost:3000/stock/history/${symbol}`);
      // setStockPriceHistory(priceHistoryResponse.data); 
    } catch (error) {
      console.error(`Error fetching stock information: ${error}`);
      if (error.response && error.response.status === 404) {
        setError('Stock symbol not found.');
      } else {
        setError('Error fetching stock information. Please try again.');
      }
    }
  }

  const handleStartTracking = async () => {
    if (!trackingSymbol.trim()) {
      setError('Field can not be empty.');
      return;
    }
    try {
      await axios.put(`http://localhost:3000/stock/${trackingSymbol}`);
      setError(null);
      setSymbolToTrack(trackingSymbol);
    } catch (error) {
      console.error(`Error starting tracking: ${error}`);
      if (error.response && error.response.status === 404) {
        setError('Stock symbol not found.');
      } else {
        setError('Error fetching stock information. Please try again.');
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col m-8 min-h-screen text-gray-100 px-4">
      <div className="flex flex-grow">
        <div className="w-full md:w-1/2 p-6">
          <h1 className="mt-8 text-6xl font-bold text-green-400 mb-6">{texts.stockSymbolGetter}</h1>
          <div className="mt-3 max-w-2xl text-center space-y-2">
            <p className="text-lg font-light text-gray-300">{texts.usageInfo}</p>
            <p className="text-sm font-light text-gray-400">{texts.noteInfo}</p>
          </div>
          <div className="flex items-center justify-center">
            <form
              onSubmit={handleFormSubmit}
              className="mt-8 w-full max-w-md bg-gray-800/50 shadow-lg rounded-2xl p-6 flex flex-col gap-4 border border-gray-700">
              <label>
                <span className="text-lg font-medium text-gray-300">{texts.symbolName}</span>
              </label>
              <input 
                className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 placeholder-gray-400 uppercase" 
                type="text"
                value={symbol}
                onChange={handleSymbolChange} 
                placeholder="AAPL, TSLA, AMZN..."
              />
              <button type="submit" className="w-full py-3 bg-green-400 text-white font-semibold rounded-lg text-lg hover:bg-green-600 transition">
                {texts.check}
              </button>
              <label>
                <span className="text-lg font-medium text-gray-300">{texts.trackingSymbol}</span>
              </label>
              <input
                className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 placeholder-gray-400 uppercase"
                type="text"
                value={trackingSymbol}
                onChange={handleTrackingSymbolChange}
                placeholder="Enter stock to track"
              />
              <button
                type="button"
                onClick={handleStartTracking}
                className="w-full py-3 bg-blue-400 text-white font-semibold rounded-lg text-lg hover:bg-blue-600 transition"
              >
                {texts.startTracking}
              </button>
            {error && <p className="text-red-500 font-medium text-center mt-2">{error}</p>}
            </form>
          </div>
      </div>

        <div className="w-full md:w-1/2 p-6">
        {symbolToTrack ? (
          <div className="mt-10 px-6 py-3 bg-gray-800/50 rounded-lg shadow-md hover:bg-gray-800 hover:shadow-lg transition duration-300 border border-gray-700">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.currentlyTracking}</p>
                <p className="text-2xl font-bold text-green-400 uppercase">{symbolToTrack}</p>
              </div>
            </div>
          </div>
        ) : 
          <div className="mt-10 px-6 py-3 bg-gray-800/50 rounded-lg shadow-md hover:bg-gray-800 hover:shadow-lg transition duration-300 border border-gray-700">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.currentlyTracking}</p>
                <p className="text-2xl font-bold text-green-400 uppercase">--</p>
              </div>
            </div>
          </div>
        }
        {stockInfo ? (
          <div className="mt-6 mb-8 p-6 bg-gray-800/50 shadow-lg rounded-xl hover:bg-gray-800 hover:shadow-lg transition duration-300 border border-gray-700">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.symbol}</p>
                <span className="font-bold text-green-400 uppercase">{stockInfo.symbol}</span>
              </div>
           
              <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.currentPrice}</p>
                <span className="font-bold text-blue-300">{stockInfo.currentPrice}$</span>
              </div>

                <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.lastUpdatedTime}</p>
              <span className="text-gray-400">{formatTimestamp(stockInfo.lastUpdatedTime)}</span>
              </div>

              <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.movingAverage}</p>
                <span className="text-purple-500 font-bold">{stockInfo.movingAverage.toFixed(3)}$</span>
              </div>
            </div>
          </div>
        ) : 
          <div className="mt-6 mb-8 p-6 bg-gray-800/50 shadow-lg rounded-xl hover:bg-gray-800 hover:shadow-lg transition duration-300 border border-gray-700">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.symbol}</p>
                <span className="font-bold text-green-400 uppercase">--</span>
              </div>
        
              <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.currentPrice}</p>
                <span className="font-bold text-blue-300">--</span>
              </div>

              <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.lastUpdatedTime}</p>
                <span className="text-gray-400">--</span>
              </div>

              <div className="flex justify-between">
                <p className="text-lg font-medium text-gray-300">{texts.movingAverage}</p>
                <span className="text-purple-500 font-bold">--</span>
              </div>
            </div>
          </div>
        }

        {/* Pass stockPriceHistory data to the Chart component */}
        {/* {stockPriceHistory.length > 0 && <Chart priceHistory={stockPriceHistory} />} */}
        {stockInfo ? <Chart priceHistory={dummyPriceHistory}></Chart> : <Chart priceHistory={dummyPriceHistoryZeros}></Chart>}
        </div>
      </div>
    </div>
  )
}

export default Main
