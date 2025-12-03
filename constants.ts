export const APP_NAME = "PiTemp";
export const SNAPSHOT_TIMES = [3, 8, 14, 20]; // Hours of the day to capture
export const STORAGE_KEY = 'pitemp_history_v1';
export const MOCK_MODE_KEY = 'pitemp_mock_mode';

// Thresholds for visuals
export const TEMP_HIGH = 28;
export const TEMP_LOW = 18;
export const HUMIDITY_HIGH = 60;
export const HUMIDITY_LOW = 30;

// API Config
export const API_BASE_URL = ''; // Empty string means relative to current domain (served by same backend)

// Default polling interval
export const POLL_INTERVAL = 5000;
export const DEFAULT_MOCK_DELAY = 2000;