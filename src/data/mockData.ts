import { TideStation, TideData } from '../types';

/**
 * Mock tide stations
 * In production, these would come from an API endpoint
 */
export const MOCK_STATIONS: TideStation[] = [
  {
    id: '1',
    name: 'Santa Monica Pier',
    location: 'Santa Monica, CA',
    coordinates: { latitude: 34.0095, longitude: -118.4988 },
  },
  {
    id: '2',
    name: 'Golden Gate Bridge',
    location: 'San Francisco, CA',
    coordinates: { latitude: 37.8199, longitude: -122.4783 },
  },
  {
    id: '3',
    name: 'La Jolla Cove',
    location: 'La Jolla, CA',
    coordinates: { latitude: 32.8509, longitude: -117.2713 },
  },
  {
    id: '4',
    name: 'Huntington Beach Pier',
    location: 'Huntington Beach, CA',
    coordinates: { latitude: 33.6553, longitude: -118.0025 },
  },
  {
    id: '5',
    name: 'Monterey Bay',
    location: 'Monterey, CA',
    coordinates: { latitude: 36.6002, longitude: -121.8947 },
  },
];

/**
 * Mock tide data generator
 * In production, this would be replaced with API calls to services like:
 * - NOAA Tides & Currents API
 * - World Tides API
 * - Stormglass.io
 *
 * The tideLevel (0-100) is calculated based on the current tide height
 * relative to the daily high and low tides.
 */
export const getMockTideData = (stationId: string): TideData => {
  // Simulate varying tide levels based on time of day
  const hour = new Date().getHours();

  // Create a simple sine wave pattern for realistic tide simulation
  // Tides typically have ~12.4 hour cycles (semi-diurnal)
  const tideLevel = Math.round(50 + 45 * Math.sin((hour * Math.PI) / 6));

  // Calculate height in meters (typically ranges from -1 to 3 meters)
  const height = (tideLevel / 100) * 4 - 1;

  // Determine tide type based on level and time
  let type: 'high' | 'low' | 'rising' | 'falling';
  if (tideLevel > 80) type = 'high';
  else if (tideLevel < 20) type = 'low';
  else if (hour < 12) type = 'rising';
  else type = 'falling';

  return {
    stationId,
    timestamp: new Date(),
    tideLevel,
    height: parseFloat(height.toFixed(2)),
    type,
  };
};

/**
 * API integration point for production:
 *
 * export const fetchTideData = async (stationId: string, date: Date): Promise<TideData> => {
 *   const response = await fetch(`https://api.example.com/tides/${stationId}?date=${date.toISOString()}`);
 *   const data = await response.json();
 *   return {
 *     stationId,
 *     timestamp: new Date(data.timestamp),
 *     tideLevel: calculateTideLevel(data.height, data.highTide, data.lowTide),
 *     height: data.height,
 *     type: data.type,
 *   };
 * };
 */
