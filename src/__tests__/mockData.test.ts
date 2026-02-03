import { MOCK_STATIONS, getMockTideData } from '../data/mockData';

describe('mockData', () => {
  describe('MOCK_STATIONS', () => {
    it('should return an array of tide stations', () => {
      expect(Array.isArray(MOCK_STATIONS)).toBe(true);
      expect(MOCK_STATIONS.length).toBeGreaterThan(0);
    });

    it('should return stations with required properties', () => {
      const station = MOCK_STATIONS[0];

      expect(station).toHaveProperty('id');
      expect(station).toHaveProperty('name');
      expect(station).toHaveProperty('location');
      expect(typeof station.id).toBe('string');
      expect(typeof station.name).toBe('string');
      expect(typeof station.location).toBe('string');
    });
  });

  describe('getMockTideData', () => {
    it('should return tide data for a valid station', () => {
      const tideData = getMockTideData(MOCK_STATIONS[0].id);

      expect(tideData).toBeDefined();
      expect(tideData).toHaveProperty('stationId');
      expect(tideData).toHaveProperty('timestamp');
      expect(tideData).toHaveProperty('tideLevel');
      expect(tideData).toHaveProperty('height');
      expect(tideData).toHaveProperty('type');
    });

    it('should return tide level between 0 and 100', () => {
      const tideData = getMockTideData(MOCK_STATIONS[0].id);

      expect(tideData.tideLevel).toBeGreaterThanOrEqual(0);
      expect(tideData.tideLevel).toBeLessThanOrEqual(100);
    });

    it('should return timestamp as Date object', () => {
      const tideData = getMockTideData(MOCK_STATIONS[0].id);

      expect(tideData.timestamp).toBeInstanceOf(Date);
    });
  });
});
