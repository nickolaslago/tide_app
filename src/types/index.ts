/**
 * Represents a tide station/location
 */
export interface TideStation {
  id: string;
  name: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Represents tide data for a specific time
 * tideLevel: 0-100 where 0 is lowest tide and 100 is highest tide
 * This numeric value directly controls the wave animation position:
 * - 0 (low tide): waves stay near top of screen
 * - 100 (high tide): waves reach bottom of screen
 */
export interface TideData {
  stationId: string;
  timestamp: Date;
  tideLevel: number; // 0-100
  height: number; // in meters
  type: 'high' | 'low' | 'rising' | 'falling';
}
