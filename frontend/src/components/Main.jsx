import React, { useState } from 'react';
import axios from 'axios';
import texts from '../texts.json';

const Main = () => {

  const [symbol, setSymbol] = useState('');
  const [trackingSymbol, setTrackingSymbol] = useState('');
  const [stockInfo, setStockInfo] = useState(null);
  const [error, setError] = useState(null);

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
    } catch (error) {
      console.error(`Error fetching stock information: ${error}`);
      setError('Error fetching stock information. Please try again.');
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
    } catch (error) {
      console.error(`Error starting tracking: ${error}`);
      setError('Error starting tracking. Please try again.');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col items-center">
      <div>
        <h1 className="font-satoshi text-3xl text-slate-900 p-6">{texts.stockSymbolGetter}</h1>
      </div>
      <div className="mt-3 max-w-5xl">
        <p className="font-satoshi text-xl text-slate-900">{texts.usageInfo}</p>
        <p className="font-satoshi text-xl text-slate-900">{texts.noteInfo}</p>
      </div>
      <form
        onSubmit={handleFormSubmit}
        className="p-7 mt-8 w-full max-w-md bg-my-cool-color flex flex-col gap-3 glassmorphism ustify-center items-center">
        <label>
          <span className="font-satoshi text-xl text-slate-900">{texts.symbolName}</span>
        </label>
        <input 
          className="p-3 m-2 h-8 rounded-md" 
          type="text"
          value={symbol}
          onChange={handleSymbolChange} 
        />
        <div className="flex-end mx-3 mb-5 gap-4">
          <button type="submit" className="px-14 py-2 text-xl my-button-color hover:my-hover-color rounded-full text-slate-100">
            {texts.check}
          </button>
        </div>   
        <label>
          <span className="font-satoshi text-xl text-slate-900">{texts.trackingSymbol}</span>
        </label>
        <input
          className="p-3 m-2 h-8 rounded-md"
          type="text"
          value={trackingSymbol}
          onChange={handleTrackingSymbolChange}
        />
        <div className="flex-end mx-3 mb-5 gap-4">          
          <button
            type="button"
            onClick={handleStartTracking}
            className="px-14 py-2 text-xl my-button-color hover:my-hover-color rounded-full text-slate-100"
          >
            {texts.startTracking}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      {stockInfo && (
        <div className="flex mt-8">
        <div className="mr-8 font-satoshi text-2xl text-slate-900">
          <p>{texts.symbol}</p>
          <p>{texts.currentPrice}</p>
          <p>{texts.lastUpdatedTime}</p>
          <p>{texts.movingAverage}</p>
        </div>
        <div className="font-satoshi text-2xl text-slate-900">
          <p>{stockInfo.symbol}</p>
          <p>{stockInfo.currentPrice}$</p>
          <p>{formatTimestamp(stockInfo.lastUpdatedTime)}</p>
          <p>{stockInfo.movingAverage.toFixed(3)}$</p>
        </div>
      </div>
      )}
    </div>
  )
}

export default Main
