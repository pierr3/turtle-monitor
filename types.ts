export interface Reading {
  timestamp: number;
  temperature: number; // Celsius
  humidity: number; // Percentage
  id: string;
}

export interface DaySnapshot {
  date: string; // YYYY-MM-DD
  readings: {
    '03:00'?: Reading;
    '08:00'?: Reading;
    '14:00'?: Reading;
    '20:00'?: Reading;
  };
}

export interface AnalysisResult {
  summary: string;
  comfortLevel: 'Optimal' | 'Acceptable' | 'Poor';
  recommendations: string[];
}
