import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
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
      <TideBackground tideLevel={tideData.tideLevel} />

      {/* Safe area for notch/status bar */}
      <SafeAreaView style={styles.safeArea}>
        {/* Station name and info display - top */}
        <StationDisplay station={currentStation} tideData={tideData} />

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
});
