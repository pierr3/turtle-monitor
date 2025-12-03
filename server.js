/**
 * PiTemp Server
 * 
 * Instructions:
 * 1. Install dependencies: npm install
 * 2. Connect DHT11 or DHT22 sensor to GPIO 4 (Physical Pin 7)
 * 3. Build the frontend: npm run build
 * 4. Run: npm start
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- CONFIGURATION ---
const PORT = 3000;
const SENSOR_TYPE = 22; // 11 for DHT11, 22 for DHT22
const SENSOR_PIN = 4;   // GPIO 4 (Physical Pin 7)
const HISTORY_FILE = path.join(__dirname, 'history.json');
const HISTORY_SAVE_INTERVAL = 10 * 60 * 1000; // Save to file every 10 minutes
const SENSOR_READ_INTERVAL = 5000; // Read sensor every 5 seconds

// --- SETUP ---
app.use(cors());
app.use(express.json());
// Serve static files from the React build output directory
app.use(express.static(path.join(__dirname, 'dist')));

// Try to load sensor library (graceful fallback if not on Pi)
let sensorLib;
try {
  const sensorImport = await import('node-dht-sensor');
  sensorLib = sensorImport.default;
} catch (e) {
  console.warn("WARN: Failed to load 'node-dht-sensor'. Server running in virtual mode.");
  console.warn("Error details:", e.message);
}

// --- STATE ---
let currentReading = {
  id: 'init',
  timestamp: Date.now(),
  temperature: 0,
  humidity: 0
};

// Load history from disk
let history = [];
if (fs.existsSync(HISTORY_FILE)) {
  try {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE));
    console.log(`Loaded ${history.length} historical readings.`);
  } catch (e) {
    console.error("Failed to load history file, starting fresh.");
  }
}

// --- SENSOR LOOP ---
setInterval(() => {
  const now = Date.now();
  
  if (sensorLib) {
    try {
      // Read from hardware
      const readout = sensorLib.read(SENSOR_TYPE, SENSOR_PIN);
      // Basic sanity check to avoid sensor glitches (e.g. 0,0 readings)
      if (readout.temperature !== 0 || readout.humidity !== 0) {
        currentReading = {
          id: now.toString(),
          timestamp: now,
          temperature: parseFloat(readout.temperature.toFixed(1)),
          humidity: parseFloat(readout.humidity.toFixed(1))
        };
      }
    } catch (err) {
      console.error("Sensor Read Error:", err);
    }
  } else {
    // Virtual Mock for testing without hardware
    const prevTemp = currentReading.temperature || 20;
    const prevHum = currentReading.humidity || 50;
    
    // Slow random walk
    let newTemp = prevTemp + (Math.random() - 0.5) * 0.2;
    let newHum = prevHum + (Math.random() - 0.5) * 1.0;
    
    // Keep within realistic bounds
    if (newTemp < 15) newTemp = 15.5;
    if (newTemp > 35) newTemp = 34.5;
    if (newHum < 20) newHum = 21;
    if (newHum > 90) newHum = 89;

    currentReading = {
      id: now.toString(),
      timestamp: now,
      temperature: parseFloat(newTemp.toFixed(1)),
      humidity: parseFloat(newHum.toFixed(1))
    };
  }

  // --- SAVING LOGIC ---
  // We want to save periodically, BUT also ensure we catch the start of a new hour
  // to make the 3am/8am/etc snapshots accurate.
  
  const lastSaved = history.length > 0 ? history[history.length - 1] : null;
  let shouldSave = false;

  if (!lastSaved) {
    shouldSave = true;
  } else {
    const timeSinceLast = now - lastSaved.timestamp;
    const lastDate = new Date(lastSaved.timestamp);
    const nowDate = new Date(now);

    // Save if interval elapsed
    if (timeSinceLast >= HISTORY_SAVE_INTERVAL) {
      shouldSave = true;
    }
    // Force save if the hour changed (e.g., 7:59 -> 8:00)
    else if (nowDate.getHours() !== lastDate.getHours()) {
      shouldSave = true;
    }
  }

  if (shouldSave) {
    history.push(currentReading);
    // Keep file size managed (last 10000 points = approx 70 days of history)
    if (history.length > 10000) history.shift();
    
    // Write to disk async
    fs.writeFile(HISTORY_FILE, JSON.stringify(history), (err) => {
      if (err) console.error("Error saving history:", err);
    });
  }

}, SENSOR_READ_INTERVAL);


// --- API ENDPOINTS ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: sensorLib ? 'hardware' : 'virtual' });
});

app.get('/api/sensor', (req, res) => {
  res.json(currentReading);
});

app.get('/api/history', (req, res) => {
  res.json(history);
});

app.delete('/api/history', (req, res) => {
  history = [];
  fs.writeFile(HISTORY_FILE, JSON.stringify([]), () => {
    res.json({ success: true });
  });
});

// Catch-all: Send React App
app.get('*', (req, res) => {
    const index = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(index)) {
        res.sendFile(index);
    } else {
        res.status(404).send('PiTemp Server Running. Please run "npm run build" to generate the UI.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`---------------------------------------------------`);
  console.log(`PiTemp Server running at http://localhost:${PORT}`);
  console.log(`Sensor Mode: ${sensorLib ? 'Hardware (GPIO ' + SENSOR_PIN + ')' : 'Virtual Simulation'}`);
  console.log(`Background Monitoring: ACTIVE`);
  console.log(`---------------------------------------------------`);
});