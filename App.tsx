import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LiveMonitor from './components/LiveMonitor';
import HistoryChart from './components/HistoryChart';
import Snapshots from './components/Snapshots';
import { Reading, DaySnapshot } from './types';
import { generateMockReading, saveReading as saveLocalReading, getHistory as getLocalHistory, getSnapshots, clearHistory as clearLocalHistory } from './services/storageService';
import { fetchLiveReading, fetchServerHistory, clearServerHistory, checkHealth } from './services/apiService';
import { DEFAULT_MOCK_DELAY, POLL_INTERVAL } from './constants';
import { Trash2, Cpu, Laptop } from 'lucide-react';

const App: React.FC = () => {
  const [history, setHistory] = useState<Reading[]>([]);
  const [isSimulated, setIsSimulated] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    const init = async () => {
      const healthy = await checkHealth();
      if (healthy) {
        setIsSimulated(false);
        setIsConnected(true);
        const serverData = await fetchServerHistory();
        setHistory(serverData);
      } else {
        setIsSimulated(true);
        setHistory(getLocalHistory());
      }
    };
    init();
  }, []);

  const snapshots: DaySnapshot[] = useMemo(() => getSnapshots(history), [history]);
  const currentReading = history.length > 0 ? history[history.length - 1] : undefined;

  const toggleMode = async () => {
    const nextModeSimulated = !isSimulated;
    if (nextModeSimulated) {
       setIsSimulated(true);
       setServerError(null);
       setHistory(getLocalHistory());
    } else {
       const healthy = await checkHealth();
       if (healthy) {
         setIsSimulated(false);
         setIsConnected(true);
         setServerError(null);
         try {
            const data = await fetchServerHistory();
            setHistory(data);
         } catch(e) {
            console.error(e);
         }
       } else {
         setServerError("Could not connect to Raspberry Pi. Make sure you are on the same network.");
         setTimeout(() => setServerError(null), 5000);
       }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const poll = async () => {
      try {
        if (isSimulated) {
          const last = history.length > 0 ? history[history.length - 1] : undefined;
          const newReading = generateMockReading(last);
          const updated = saveLocalReading(newReading);
          setHistory(updated);
          setIsConnected(true);
        } else {
          const newReading = await fetchLiveReading();
          setIsConnected(true);
          setHistory(prev => {
             if (prev.length > 0 && prev[prev.length - 1].timestamp === newReading.timestamp) {
                 return prev;
             }
             return [...prev, newReading];
          });
        }
      } catch (err) {
        console.error("Polling error:", err);
        if (!isSimulated) setIsConnected(false);
      }
    };

    if (isSimulated) {
        interval = setInterval(poll, DEFAULT_MOCK_DELAY);
    } else {
        poll(); 
        interval = setInterval(poll, POLL_INTERVAL);
    }

    return () => clearInterval(interval);
  }, [isSimulated, history.length]);

  const handleClearHistory = useCallback(async () => {
    if (confirm(`Clear all ${isSimulated ? 'local' : 'server'} history?`)) {
      if (isSimulated) {
        clearLocalHistory();
        setHistory([]);
      } else {
        try {
            await clearServerHistory();
            setHistory([]);
        } catch(e) {
            alert("Failed to clear server history.");
        }
      }
    }
  }, [isSimulated]);

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-stone-700 pb-20 font-sans">
      {/* Fun Header */}
      <header className="sticky top-0 z-50 bg-[#FFFBEB]/90 backdrop-blur-md border-b-2 border-stone-100">
        <div className="max-w-md md:max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-default">
                 {/* Header Icon */}
                 <div className="bg-emerald-100 p-2 rounded-2xl border-2 border-emerald-200 group-hover:rotate-12 transition-transform duration-300">
                     <img 
                      src="/tortoise.png" 
                      className="w-6 h-6" 
                      alt="Turtle Logo"
                     />
                 </div>
                 <div>
                    <h1 className="text-xl font-black text-stone-800 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
                        TURTLE<span className="text-emerald-500">ROOM</span>
                    </h1>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Cozy Monitor</p>
                 </div>
            </div>
           
           <div className="flex items-center space-x-2">
             <button 
               onClick={handleClearHistory}
               className="p-3 rounded-2xl text-stone-400 hover:text-red-400 hover:bg-red-50 transition-colors"
               title="Clear History"
             >
                <Trash2 size={20} strokeWidth={2.5} />
             </button>
             <button 
                onClick={toggleMode}
                className={`p-2.5 rounded-2xl transition-all flex items-center space-x-2 px-4 shadow-sm border-2 ${!isSimulated ? 'bg-white text-emerald-500 border-emerald-200' : 'bg-stone-100 text-stone-500 border-stone-200'}`}
             >
                 {isSimulated ? <Laptop size={18} strokeWidth={2.5} /> : <Cpu size={18} strokeWidth={2.5} />}
                 <span className="text-xs font-black hidden sm:inline uppercase tracking-wider">{isSimulated ? 'Sim' : 'Pi'}</span>
             </button>
           </div>
        </div>
      </header>

      {serverError && (
          <div className="max-w-md md:max-w-3xl mx-auto mt-6 px-4">
            <div className="bg-red-50 border-2 border-red-100 text-red-400 p-4 rounded-3xl text-sm font-bold text-center">
                {serverError}
            </div>
          </div>
      )}

      <main className="max-w-md md:max-w-3xl mx-auto px-4 py-8 space-y-8">
        <LiveMonitor 
          current={currentReading} 
          isConnected={isConnected} 
          isSimulated={isSimulated}
        />
        <HistoryChart data={history} />
        <Snapshots snapshots={snapshots} />
      </main>

      <footer className="text-center py-10 text-stone-400 text-[11px] uppercase font-black tracking-widest opacity-60">
        <p>Keeping turtles happy since 2024</p>
      </footer>
    </div>
  );
};

export default App;