# Tide Information App

A minimal, production-ready React Native + Expo tide information app with iOS 26 Glass Design, supporting iOS, Android, and Web from a single codebase.

## Features

- **Interactive Animated Background**: Ocean waves and sand that respond to tide levels
  - High tide: waves reach the bottom of the screen
  - Low tide: waves stay near the top
  - Smooth, deterministic animations
- **iOS 26 Glass Design**: Frosted/translucent surfaces with background blur, soft shadows, and subtle depth
- **Station Search**: Search and switch between tide stations
- **Cross-Platform**: Runs on iOS, Android, and Web
- **TypeScript**: Fully typed for better development experience

## Tech Stack

- **Expo** (~52.0.0)
- **React Native** (0.76.5)
- **TypeScript** (5.3.3)
- **expo-blur**: For glass/frosted effects
- **expo-linear-gradient**: For ocean and sand gradients

## Getting Started

### Prerequisites

- Node.js (16+)
- npm or yarn
- Expo CLI (installed automatically)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Different Platforms

```bash
# iOS (requires macOS with Xcode)
npm run ios

# Android (requires Android Studio)
npm run android

# Web
npm run web
```

## Project Structure

```
tide_app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TideBackground.tsx    # Animated wave/sand background
│   │   ├── StationDisplay.tsx    # Station info with glass design
│   │   └── StationSearch.tsx     # Search interface
│   ├── screens/             # App screens
│   │   └── HomeScreen.tsx        # Main screen
│   ├── data/                # Data layer
│   │   └── mockData.ts           # Mock stations and tide data
│   └── types/               # TypeScript definitions
│       └── index.ts              # Type definitions
├── App.tsx                  # Entry point
├── app.json                 # Expo configuration
└── package.json
```

## How It Works

### Tide Level Animation

The tide level is represented as a numeric value (0-100) that directly controls the wave animation:

- **0**: Low tide - waves positioned at top of screen (20% screen height)
- **100**: High tide - waves fill entire screen (100% screen height)

This mapping is implemented in `src/components/TideBackground.tsx`:

```typescript
const waterHeight = waterHeightAnim.interpolate({
  inputRange: [0, 100],
  outputRange: [SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT],
});
```

### Mock Data vs Real API

Currently using mock data from `src/data/mockData.ts`. The tide level is simulated using a sine wave based on the time of day.

**To integrate a real API:**

1. Replace `getMockTideData()` in `src/data/mockData.ts`
2. Use services like:
   - [NOAA Tides & Currents API](https://tidesandcurrents.noaa.gov/api/)
   - [World Tides API](https://www.worldtides.info/)
   - [Stormglass.io](https://stormglass.io/)

Example API integration point (see comments in `src/data/mockData.ts`):

```typescript
export const fetchTideData = async (stationId: string, date: Date): Promise<TideData> => {
  const response = await fetch(`https://api.example.com/tides/${stationId}`);
  const data = await response.json();
  return {
    stationId,
    timestamp: new Date(data.timestamp),
    tideLevel: calculateTideLevel(data.height, data.highTide, data.lowTide),
    height: data.height,
    type: data.type,
  };
};
```

## Design Principles

### iOS 26 Glass Design

The app follows modern iOS design principles:

- **Translucent Surfaces**: Using `expo-blur` for frosted glass effects
- **Soft Shadows**: Subtle depth with `shadowOffset`, `shadowOpacity`, `shadowRadius`
- **Layering**: Clear visual hierarchy with z-index and positioning
- **Platform Adaptation**: Different blur intensities and background opacities for iOS, Android, and Web

Implementation examples:
- `src/components/StationDisplay.tsx` - Glass card for station info
- `src/components/StationSearch.tsx` - Glass search interface

## Future Enhancements

### Recommended Additions

1. **Real Tide API Integration**: Replace mock data with actual tide services
2. **Date Selection**: Allow users to view tide forecasts for different dates
3. **Favorites**: Save favorite stations for quick access
4. **Notifications**: Alert users about upcoming high/low tides
5. **7-Day Forecast**: Show tide predictions for the week
6. **Sunrise/Sunset**: Display solar times relevant to tide activities
7. **Moon Phases**: Show lunar phases (affects tides)
8. **Navigation**: Use React Navigation for multiple screens
9. **State Management**: Implement Redux, Zustand, or Jotai for complex state
10. **Offline Support**: Cache tide data for offline viewing

### Code Quality

- **Testing**: Add Jest for unit tests, Detox for E2E testing
- **Linting**: Configure ESLint and Prettier
- **CI/CD**: Set up GitHub Actions or similar for automated testing/deployment

## Development Notes

### Platform Differences

- **iOS**: Best glass effect with native blur
- **Android**: Slightly higher blur intensity for visibility
- **Web**: Uses CSS backdrop-filter for blur effect

### Performance Considerations

- Animations use `Animated` API for 60fps performance
- Native driver used where possible (transforms, opacity)
- Layout animations use JavaScript driver (required for height/width changes)

## Troubleshooting

### Common Issues

**"Unable to resolve module expo-blur"**
```bash
npm install expo-blur expo-linear-gradient
```

**"Invariant Violation: requireNativeComponent: ExpoLinearGradient was not found"**
```bash
expo prebuild --clean
```

**Assets not loading**
- Ensure you're running the app with `npm start`
- Clear cache: `expo start -c`

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using Expo and React Native