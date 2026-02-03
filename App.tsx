import React from 'react';
import { HomeScreen } from './src/screens/HomeScreen';

/**
 * Main App Component
 *
 * Entry point for the Tide Information App.
 * Currently renders a single screen (HomeScreen).
 *
 * For future expansion:
 * - Add navigation using React Navigation
 * - Implement additional screens (Settings, Favorites, Forecast, etc.)
 * - Add state management provider (Context, Redux, etc.)
 * - Integrate real API services
 */
export default function App() {
  return <HomeScreen />;
}
