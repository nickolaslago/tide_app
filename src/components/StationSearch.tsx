import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  Keyboard,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { TideStation } from '../types';

interface StationSearchProps {
  stations: TideStation[];
  onStationSelect: (station: TideStation) => void;
  currentStation: TideStation;
}

/**
 * StationSearch Component
 *
 * A glass-styled search interface positioned at the bottom of the screen.
 * Features:
 * - Frosted glass background (iOS 26 design)
 * - Search input with live filtering
 * - Dropdown results list
 * - Smooth animations
 *
 * The search is case-insensitive and matches both station name and location.
 */
export const StationSearch: React.FC<StationSearchProps> = ({
  stations,
  onStationSelect,
  currentStation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Filter stations based on search query
  const filteredStations = searchQuery.trim()
    ? stations.filter(
        (station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleStationSelect = (station: TideStation) => {
    onStationSelect(station);
    setSearchQuery('');
    setIsSearching(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {/* Results dropdown - shown when searching */}
      {isSearching && filteredStations.length > 0 && (
        <View style={styles.resultsContainer}>
          <BlurView
            intensity={Platform.OS === 'ios' ? 80 : 90}
            tint="light"
            style={styles.resultsBlur}
          >
            <FlatList
              data={filteredStations}
              keyExtractor={(item) => item.id}
              style={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleStationSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultLocation}>{item.location}</Text>
                </TouchableOpacity>
              )}
            />
          </BlurView>
        </View>
      )}

      {/* Search input container */}
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 90}
        tint="light"
        style={styles.searchContainer}
      >
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search stations..."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearching(true)}
            onBlur={() => {
              // Delay to allow tap on result
              setTimeout(() => setIsSearching(false), 200);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Show current station when not searching */}
        {!isSearching && (
          <View style={styles.currentStationContainer}>
            <Text style={styles.currentStationLabel}>Current Station</Text>
            <Text style={styles.currentStationName}>{currentStation.name}</Text>
          </View>
        )}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  resultsContainer: {
    marginBottom: 8,
    marginHorizontal: 20,
    maxHeight: 300,
    borderRadius: 20,
    overflow: 'hidden',
    // Glass shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  resultsBlur: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.25)',
      android: 'rgba(255, 255, 255, 0.35)',
      web: 'rgba(255, 255, 255, 0.3)',
    }),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  resultLocation: {
    fontSize: 14,
    color: '#4A4A4A',
    opacity: 0.8,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.25)',
      android: 'rgba(255, 255, 255, 0.35)',
      web: 'rgba(255, 255, 255, 0.3)',
    }),
    // iOS 26 Glass Design: Soft shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    // Subtle border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  clearIcon: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.4)',
    fontWeight: '600',
  },
  currentStationContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  currentStationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4A4A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  currentStationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
