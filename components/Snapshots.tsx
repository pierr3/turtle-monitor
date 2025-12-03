import React from 'react';
import { DaySnapshot, Reading } from '../types';
import { Clock, CalendarDays } from 'lucide-react';

interface SnapshotsProps {
  snapshots: DaySnapshot[];
}

const SnapshotCard: React.FC<{ reading?: Reading, time: string }> = ({ reading, time }) => {
  if (!reading) {
    return (
      <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 text-stone-300">
        <span className="text-[10px] font-black mb-1 opacity-50">{time}</span>
        <span className="text-xl font-bold">-</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border-2 border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <span className="text-[10px] font-black text-stone-400 mb-1 tracking-wider">{time}</span>
      <span className="text-xl font-black text-stone-800">{reading.temperature.toFixed(0)}°</span>
      <span className="text-[10px] font-bold text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full mt-1">{reading.humidity.toFixed(0)}%</span>
    </div>
  );
};

const Snapshots: React.FC<SnapshotsProps> = ({ snapshots }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border-2 border-stone-50 shadow-lg p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-amber-100 rounded-xl">
            <Clock className="text-amber-600" size={20} strokeWidth={3} />
        </div>
        <div>
            <h3 className="text-stone-800 font-black text-lg leading-none">Daily Log</h3>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mt-1">Key Timepoints</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {snapshots.length === 0 && (
            <div className="text-center py-12 opacity-50 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                <CalendarDays size={48} className="mx-auto text-stone-300 mb-3" />
                <p className="text-stone-400 text-sm font-bold">No records yet</p>
            </div>
        )}
        
        {snapshots.map((day) => (
          <div key={day.date} className="p-5 rounded-[2rem] bg-stone-50/50 border border-stone-100">
            <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-black uppercase tracking-wide">
                    {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">
                    {new Date(day.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <SnapshotCard reading={day.readings['03:00']} time="03:00" />
              <SnapshotCard reading={day.readings['08:00']} time="08:00" />
              <SnapshotCard reading={day.readings['14:00']} time="14:00" />
              <SnapshotCard reading={day.readings['20:00']} time="20:00" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Snapshots;