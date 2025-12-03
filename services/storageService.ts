import { Reading, DaySnapshot } from '../types';
import { STORAGE_KEY, SNAPSHOT_TIMES } from '../constants';

// Helper to generate a unique ID
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock data generator for simulation
export const generateMockReading = (prev?: Reading): Reading => {
  const now = Date.now();
  if (!prev) {
    return {
      id: generateId(),
      timestamp: now,
      temperature: 22.5,
      humidity: 45,
    };
  }

  // Drift values slightly to simulate real sensor noise
  const tempDrift = (Math.random() - 0.5) * 0.5;
  const humDrift = (Math.random() - 0.5) * 2;

  return {
    id: generateId(),
    timestamp: now,
    temperature: parseFloat((prev.temperature + tempDrift).toFixed(1)),
    humidity: parseFloat(Math.max(0, Math.min(100, prev.humidity + humDrift)).toFixed(1)),
  };
};

export const getHistory = (): Reading[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveReading = (reading: Reading) => {
  const history = getHistory();
  // Keep last 5000 readings to avoid localStorage overflow in a demo
  const updated = [...history, reading].slice(-5000);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// Clear history
export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Process history into daily snapshots
export const getSnapshots = (readings: Reading[]): DaySnapshot[] => {
  const grouped: Record<string, Reading[]> = {};

  readings.forEach(r => {
    const date = new Date(r.timestamp).toISOString().split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(r);
  });

  const snapshots: DaySnapshot[] = Object.keys(grouped).sort().reverse().map(date => {
    const dayReadings = grouped[date];
    const result: DaySnapshot = { date, readings: {} };

    SNAPSHOT_TIMES.forEach(targetHour => {
      // Find the reading closest to this hour on this day
      let closest: Reading | undefined;
      let minDiff = Infinity;

      dayReadings.forEach(r => {
        const d = new Date(r.timestamp);
        const hour = d.getHours();
        const minute = d.getMinutes();
        
        // Calculate difference in minutes from target hour:00
        const diff = Math.abs((hour * 60 + minute) - (targetHour * 60));
        
        // Only accept if within 60 minutes of the target time
        if (diff < 60 && diff < minDiff) {
          minDiff = diff;
          closest = r;
        }
      });

      if (closest) {
        const timeKey = `${targetHour.toString().padStart(2, '0')}:00` as keyof DaySnapshot['readings'];
        result.readings[timeKey] = closest;
      }
    });

    return result;
  });

  return snapshots;
};
