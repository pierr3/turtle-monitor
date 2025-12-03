import { fileURLToPath } from 'url';

console.log("--- DHT Sensor Debug Tool ---");

try {
    const sensorImport = await import('node-dht-sensor');
    const sensor = sensorImport.default;

    console.log("Library loaded successfully.");

    // Common pins to test
    // If you are using GPIO 4 (Physical Pin 7), use 4.
    const TEST_PINS = [4, 7, 17, 27, 22];
    const SENSOR_TYPE = 11; // DHT22

    console.log(`Testing Sensor Type: DHT${SENSOR_TYPE}`);

    for (const pin of TEST_PINS) {
        try {
            console.log(`\nAttempting to read from GPIO ${pin} (BCM)...`);
            sensor.read(SENSOR_TYPE, pin, function (err, temperature, humidity) {
                if (!err) {
                    console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
                }
            });
            // console.log(`SUCCESS! -> Temp: ${res.temperature.toFixed(1)}°C, Humidity: ${res.humidity.toFixed(1)}%`);
        } catch (err) {
            console.log(`Failed to read on GPIO ${pin}: ${err.message}`);
        }
    }

    console.log("\n--- End Debug ---");
    console.log("Note: 'node-dht-sensor' uses BCM pin numbering, not physical pin numbers.");
    console.log("Physical Pin 7 is BCM GPIO 4.");

} catch (e) {
    console.error("CRITICAL: Could not load node-dht-sensor library.");
    console.error(e);
}
