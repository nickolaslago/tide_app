import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { TideStation, TideData } from '../types';

interface StationDisplayProps {
  station: TideStation;
  tideData: TideData;
}

/**
 * StationDisplay Component
 *
 * Displays the current station name and tide information using iOS 26 Glass Design:
 * - Frosted/translucent background using BlurView
 * - Soft shadows for depth
 * - Clean typography
 * - Subtle layering
 *
 * The component adapts across platforms while maintaining the glass aesthetic.
 */
export const StationDisplay: React.FC<StationDisplayProps> = ({
  station,
  tideData,
}) => {
  const getTideStatusText = () => {
    switch (tideData.type) {
      case 'high':
        return 'High Tide';
      case 'low':
        return 'Low Tide';
      case 'rising':
        return 'Rising';
      case 'falling':
        return 'Falling';
    }
  };

  const getTideStatusEmoji = () => {
    switch (tideData.type) {
      case 'high':
        return '⬆️';
      case 'low':
        return '⬇️';
      case 'rising':
        return '📈';
      case 'falling':
        return '📉';
    }
  };

  return (
    <View style={styles.container}>
      {/* Glass effect container */}
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 90}
        tint="light"
        style={styles.glassContainer}
      >
        {/* Station name - large and prominent */}
        <Text style={styles.stationName}>{station.name}</Text>

        {/* Location subtitle */}
        <Text style={styles.location}>{station.location}</Text>

        {/* Tide information */}
        <View style={styles.tideInfo}>
          <View style={styles.tideRow}>
            <Text style={styles.tideLabel}>Status:</Text>
            <Text style={styles.tideValue}>
              {getTideStatusEmoji()} {getTideStatusText()}
            </Text>
          </View>

          <View style={styles.tideRow}>
            <Text style={styles.tideLabel}>Height:</Text>
            <Text style={styles.tideValue}>{tideData.height}m</Text>
          </View>

          <View style={styles.tideRow}>
            <Text style={styles.tideLabel}>Level:</Text>
            <Text style={styles.tideValue}>{tideData.tideLevel}%</Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  glassContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 24,
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.25)',
      android: 'rgba(255, 255, 255, 0.35)',
      web: 'rgba(255, 255, 255, 0.3)',
    }),
    // iOS 26 Glass Design: Subtle shadows for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    // Subtle border for definition
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stationName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
    marginBottom: 20,
    opacity: 0.8,
  },
  tideInfo: {
    gap: 12,
  },
  tideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tideLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  tideValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#357ABD',
  },
});
