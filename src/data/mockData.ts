import { TideStation, TideData, TideEvent } from '../types';

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
 * Calculate tide events (high and low tides) for a given date
 * Tides typically occur roughly every 12.4 hours (semi-diurnal pattern)
 */
const calculateTideEvents = (now: Date): { current: TideEvent; next: TideEvent } => {
  // Simplified tide calculation: assume high tides at ~6 AM and ~6 PM
  // and low tides at ~12 AM and ~12 PM
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Define today's tide times (in hours)
  const tideSchedule = [
    { hour: 0, minute: 30, type: 'low' as const, height: 0.5 },
    { hour: 6, minute: 15, type: 'high' as const, height: 2.8 },
    { hour: 12, minute: 45, type: 'low' as const, height: 0.3 },
    { hour: 18, minute: 30, type: 'high' as const, height: 2.9 },
  ];

  // Find current and next tide events
  let currentEvent: TideEvent | null = null;
  let nextEvent: TideEvent | null = null;

  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  for (let i = 0; i < tideSchedule.length; i++) {
    const tide = tideSchedule[i];
    const tideTimeInMinutes = tide.hour * 60 + tide.minute;

    if (tideTimeInMinutes <= currentTimeInMinutes) {
      const eventTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        tide.hour,
        tide.minute,
        0,
        0
      );
      currentEvent = {
        time: eventTime,
        type: tide.type,
        height: tide.height,
      };
    } else if (!nextEvent) {
      const eventTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        tide.hour,
        tide.minute,
        0,
        0
      );
      nextEvent = {
        time: eventTime,
        type: tide.type,
        height: tide.height,
      };
    }
  }

  // If no next event found today, use tomorrow's first tide
  if (!nextEvent) {
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      tideSchedule[0].hour,
      tideSchedule[0].minute,
      0,
      0
    );
    nextEvent = {
      time: tomorrow,
      type: tideSchedule[0].type,
      height: tideSchedule[0].height,
    };
  }

  // If no current event (before first tide of day), use yesterday's last tide
  if (!currentEvent) {
    const lastTide = tideSchedule[tideSchedule.length - 1];
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
      lastTide.hour,
      lastTide.minute,
      0,
      0
    );
    currentEvent = {
      time: yesterday,
      type: lastTide.type,
      height: lastTide.height,
    };
  }

  return { current: currentEvent, next: nextEvent };
};

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
  const now = new Date();

  // Simulate varying tide levels based on time of day
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Create a simple sine wave pattern for realistic tide simulation
  // Tides typically have ~12.4 hour cycles (semi-diurnal)
  const timeInHours = hour + minute / 60;
  const tideLevel = Math.round(50 + 45 * Math.sin((timeInHours * Math.PI) / 6));

  // Calculate height in meters (typically ranges from -1 to 3 meters)
  const height = (tideLevel / 100) * 4 - 1;

  // Determine tide type based on level and time
  let type: 'high' | 'low' | 'rising' | 'falling';
  if (tideLevel > 80) type = 'high';
  else if (tideLevel < 20) type = 'low';
  else if (hour < 12) type = 'rising';
  else type = 'falling';

  // Calculate tide events
  const tideEvents = calculateTideEvents(now);

  return {
    stationId,
    timestamp: now,
    tideLevel,
    height: parseFloat(height.toFixed(2)),
    type,
    currentTideEvent: tideEvents.current,
    nextTideEvent: tideEvents.next,
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
