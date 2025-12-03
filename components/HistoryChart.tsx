import React from 'react';
import { Reading } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoryChartProps {
  data: Reading[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const displayData = data.slice(-100); 

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm border-2 border-stone-100 p-4 rounded-2xl shadow-xl">
          <p className="text-stone-400 text-xs mb-2 font-bold uppercase tracking-wider">{new Date(label).toLocaleTimeString()}</p>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm"></div>
            <p className="text-emerald-600 font-black text-xl">
                {payload[0].value}°C
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"></div>
            <p className="text-blue-500 font-bold text-sm">
                {payload[1].value}% Humidity
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-lg border-2 border-stone-50 p-8 h-96 w-full relative overflow-hidden">
      <div className="absolute top-8 left-8 z-10">
        <h3 className="text-stone-800 font-black text-lg">24h History</h3>
        <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">Temperature Trend</p>
      </div>
      
      <div className="h-full w-full pt-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={displayData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(t) => new Date(t).getHours() + 'h'}
              stroke="#d6d3d1"
              tick={{fontSize: 12, fontWeight: 700, fill: '#a8a29e'}}
              minTickGap={30}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#d6d3d1" 
              tick={{fontSize: 12, fontWeight: 700, fill: '#a8a29e'}}
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e7e5e4', strokeWidth: 2, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="temperature" 
              stroke="#10b981" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              name="Temp"
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="humidity" 
              stroke="#60a5fa" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorHum)" 
              name="Humidity"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;