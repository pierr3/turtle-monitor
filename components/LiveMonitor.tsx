import React from 'react';
import { Reading } from '../types';
import { Droplets, Wifi, WifiOff } from 'lucide-react';
import { TEMP_HIGH, TEMP_LOW, HUMIDITY_HIGH } from '../constants';

interface LiveMonitorProps {
  current?: Reading;
  isConnected: boolean;
  isSimulated: boolean;
}

const LiveMonitor: React.FC<LiveMonitorProps> = ({ current, isConnected, isSimulated }) => {
  // Use a reliable cute turtle image URL. 
  // You can replace this src with a local path like "/turtle.png" if you host the file.
  const TURTLE_IMG = "/tortoise.png";

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-[3rem] border-4 border-emerald-100 shadow-xl animate-pulse">
        <img src={TURTLE_IMG} alt="Loading Turtle" className="w-32 h-32 opacity-50 mb-4 grayscale" />
        <span className="text-stone-400 font-extrabold tracking-widest text-xl">WAKING UP...</span>
      </div>
    );
  }

  // Fun Color Logic
  const getTempColor = (t: number) => {
    if (t > TEMP_HIGH) return 'text-orange-500';
    if (t < TEMP_LOW) return 'text-sky-500';
    return 'text-emerald-500';
  };

  const getHumColor = (h: number) => {
    if (h > HUMIDITY_HIGH) return 'text-blue-500';
    return 'text-stone-400';
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-4 border-stone-100 transition-all duration-500 hover:shadow-[0_30px_60px_-12px_rgba(16,185,129,0.15)]">
      
      {/* Fun Background Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      {/* Status Pill */}
      <div className="absolute top-8 right-8 flex items-center space-x-2 z-10">
        {isSimulated && (
          <span className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-[11px] font-black uppercase tracking-wider border border-stone-200 shadow-sm">
            Sim Mode
          </span>
        )}
        <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border shadow-sm ${isConnected ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-red-100 text-red-500 border-red-200'}`}>
          {isConnected ? <Wifi size={16} strokeWidth={3} /> : <WifiOff size={16} strokeWidth={3} />}
        </div>
      </div>

      <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center relative z-0">
        
        {/* Turtle Mascot - Bouncing Animation */}
        <div className="mb-6 animate-bounce-slow">
            <img src={TURTLE_IMG} alt="Happy Turtle" className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg" />
        </div>

        {/* Main Temperature Section */}
        <div className="mb-8 w-full">
            <span className="uppercase tracking-widest text-sm font-black text-stone-400 mb-2 block">Current Temp</span>
            
            <div className={`text-[8rem] sm:text-[10rem] leading-none font-black tracking-tighter drop-shadow-sm ${getTempColor(current.temperature)}`}>
                {current.temperature.toFixed(1)}°
            </div>
            
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-stone-100 rounded-full">
                <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Target: 22°C</span>
            </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-xs h-1.5 bg-stone-100 rounded-full mb-8"></div>

        {/* Humidity Section */}
        <div className="w-full">
             <div className="flex items-center justify-center space-x-2 mb-1">
                <Droplets size={20} className="text-blue-400 fill-current"/>
                <span className="uppercase tracking-widest text-sm font-black text-stone-400">Humidity</span>
            </div>
            <div className={`text-6xl sm:text-7xl font-black tracking-tight ${getHumColor(current.humidity)}`}>
                {current.humidity.toFixed(0)}<span className="text-4xl text-stone-300 align-top ml-1">%</span>
            </div>
        </div>

      </div>
      
      <div className="bg-stone-50 p-4 text-center border-t border-stone-100">
        <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">
            Last Reading: {new Date(current.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default LiveMonitor;