import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';


const Chart = ({ priceHistory }) => {
  
  if (!priceHistory || priceHistory.length === 0) {
    return <p className="text-red-500">No data available for chart rendering</p>;
  }

  console.log(priceHistory);

  const data = priceHistory.map(item => ({
    date: item.date,
    price: item.price,
  }));

  return (
    <div className="mt-6 pl-6 pr-6 pb-6 bg-gray-800/50 shadow-lg rounded-xl text-center hover:bg-gray-800 hover:shadow-lg transition duration-300 border border-gray-700">
      <p className="text-lg font-medium text-gray-300 mt-3 mb-3">Stock Price Chart</p>
      <div className="p-6 h-96 dark:bg-gray-800 rounded-tl-lg">
      <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/* Background grid lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            
            {/* X Axis */}
            <XAxis 
              dataKey="date" 
              angle={-45}  // Rotate the X-axis labels for better readability
              textAnchor="end" 
              tickMargin={10} // Space between ticks and labels
              stroke="#bbb" // Light color for X-axis lines
              fontSize={12} 
              height={70}
            />

            {/* Y Axis */}
            <YAxis 
              stroke="#bbb" 
              fontSize={12} 
              tickCount={6} // Limit the number of Y-axis ticks
            />
            
            {/* Tooltip customization */}
            <Tooltip 
              contentStyle={{
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '5px',
                padding: '10px',
              }}
              labelStyle={{
                color: '#fff',
                fontWeight: 'bold',
              }}
              itemStyle={{
                color: '#fff',
                fontSize: '14px',
              }}
            />
            
            {/* Legend to show which line represents price */}
            {/* <Legend 
              verticalAlign="top" 
              wrapperStyle={{
                paddingBottom: '20px',
              }}
            /> */}

            {/* Line representing stock price */}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              strokeWidth={2} 
              dot={{ fill: '#8884d8', stroke: '#fff', strokeWidth: 2, r: 4 }}  // Custom dot styling
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}  // Active dot when hovering
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

Chart.propTypes = {
  priceHistory: PropTypes.array.isRequired,
};

export default Chart;
