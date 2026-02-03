// Jest setup file
// Note: @testing-library/react-native v12.4+ includes built-in matchers

// Mock expo modules for component tests
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));
