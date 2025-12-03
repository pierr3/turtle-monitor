import { Reading } from '../types';
import { API_BASE_URL } from '../constants';

export const checkHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const fetchLiveReading = async (): Promise<Reading> => {
  const res = await fetch(`${API_BASE_URL}/api/sensor`);
  if (!res.ok) throw new Error('Failed to fetch sensor data');
  return res.json();
};

export const fetchServerHistory = async (): Promise<Reading[]> => {
  const res = await fetch(`${API_BASE_URL}/api/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};

export const clearServerHistory = async (): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/history`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear history');
};