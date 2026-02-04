import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, TextInput, Text } from 'react-native';
import { TideBackground } from '../components/TideBackground';
import { StationDisplay } from '../components/StationDisplay';
import { StationSearch } from '../components/StationSearch';
import { MOCK_STATIONS, getMockTideData } from '../data/mockData';
import { TideStation, TideData } from '../types';

/**
 * HomeScreen - Main screen of the Tide App
 *
 * This screen combines all components to create the tide information interface:
 * 1. Animated background (waves + sand) - responds to tide level
 * 2. Station display (top) - shows current station and tide info
 * 3. Station search (bottom) - allows changing stations
 *
 * State Management:
 * - Currently using local state (useState)
 * - For production, consider using Context API or state management library
 *   like Redux, Zustand, or Jotai for more complex state needs
 *
 * Data Flow:
 * - Mock data is used initially (see src/data/mockData.ts)
 * - Replace getMockTideData with actual API calls for production
 * - Consider implementing real-time updates using WebSocket or polling
 */
export const HomeScreen: React.FC = () => {
  // Start with the first station as default
  const [currentStation, setCurrentStation] = useState<TideStation>(MOCK_STATIONS[0]);
  const [tideData, setTideData] = useState<TideData>(getMockTideData(MOCK_STATIONS[0].id));

  // Test tide level input (for debugging/testing wave animations)
  const [testTideLevel, setTestTideLevel] = useState<string>('');
  const [useTestTide, setUseTestTide] = useState(false);

  const handleTideLevelChange = (value: string) => {
    setTestTideLevel(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setUseTestTide(true);
    } else if (value === '') {
      setUseTestTide(false);
    }
  };

  // Determine which tide level to use (test override or actual data)
  const displayTideLevel = useTestTide && testTideLevel !== ''
    ? Math.min(100, Math.max(0, parseInt(testTideLevel, 10) || 0))
    : tideData.tideLevel;

  // Update tide data when station changes
  useEffect(() => {
    // In production, this would be an API call:
    // fetchTideData(currentStation.id, new Date())
    //   .then(setTideData)
    //   .catch(handleError);
    setTideData(getMockTideData(currentStation.id));
  }, [currentStation]);

  // Optional: Auto-refresh tide data every 5 minutes
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTideData(getMockTideData(currentStation.id));
  //   }, 5 * 60 * 1000); // 5 minutes
  //
  //   return () => clearInterval(interval);
  // }, [currentStation]);

  const handleStationSelect = (station: TideStation) => {
    setCurrentStation(station);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Animated background - controlled by tide level */}
      <TideBackground tideLevel={displayTideLevel} />

      {/* Safe area for notch/status bar */}
      <SafeAreaView style={styles.safeArea}>
        {/* Station name and info display - top */}
        <StationDisplay station={currentStation} tideData={tideData} />

        {/* Test tide level input - for testing wave animations */}
        <View style={styles.tideInputContainer}>
          <Text style={styles.tideInputLabel}>Test Tide Level (0-100):</Text>
          <TextInput
            style={styles.tideInput}
            value={testTideLevel}
            onChangeText={handleTideLevelChange}
            placeholder="Enter tide level"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={3}
          />
          {useTestTide && (
            <Text style={styles.tideInputActive}>Active: {displayTideLevel}%</Text>
          )}
        </View>

        {/* Station search - bottom */}
        <StationSearch
          stations={MOCK_STATIONS}
          onStationSelect={handleStationSelect}
          currentStation={currentStation}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  tideInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tideInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 8,
  },
  tideInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
  },
  tideInputActive: {
    marginLeft: 12,
    fontSize: 14,
    color: '#0099ff',
    fontWeight: '600',
  },
});
