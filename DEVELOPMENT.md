# Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web browser
```

## Project Architecture

### Component Hierarchy

```
App.tsx
└── HomeScreen
    ├── TideBackground (animated ocean/sand)
    ├── StationDisplay (glass card - top)
    └── StationSearch (glass search - bottom)
```

### Data Flow

```
mockData.ts → HomeScreen → Components
     ↓
  tideLevel (0-100)
     ↓
  TideBackground animation
```

## Key Components

### TideBackground

**Purpose**: Animated background showing ocean waves and sand

**Props**:
- `tideLevel` (0-100): Controls wave height

**Animation Logic**:
```typescript
// Maps tide level to screen position
waterHeight = interpolate(tideLevel, {
  0 → 20% screen height (low tide)
  100 → 100% screen height (high tide)
})
```

**Visual Layers**:
1. Sand gradient (bottom, static)
2. Ocean gradient (top, animated height)
3. Wave overlay (subtle movement)
4. Wave crest (white gradient at waterline)

### StationDisplay

**Purpose**: Shows current station and tide information

**Features**:
- iOS 26 glass design with BlurView
- Displays: station name, location, tide status, height, level
- Auto-updates when station changes

### StationSearch

**Purpose**: Search and select tide stations

**Features**:
- Glass-styled search input
- Live filtering of stations
- Dropdown results with blur effect
- Shows current station when not searching

## State Management

### Current Implementation

Using React's `useState` in HomeScreen:

```typescript
const [currentStation, setCurrentStation] = useState<TideStation>(MOCK_STATIONS[0]);
const [tideData, setTideData] = useState<TideData>(getMockTideData(MOCK_STATIONS[0].id));
```

### Future Considerations

For larger apps, consider:

**Option 1: Context API** (lightweight, built-in)
```typescript
const TideContext = createContext<TideContextType>(null);
```

**Option 2: Zustand** (simple, minimal boilerplate)
```typescript
const useTideStore = create((set) => ({
  station: MOCK_STATIONS[0],
  setStation: (station) => set({ station }),
}));
```

**Option 3: Redux Toolkit** (complex apps, DevTools)
```typescript
const tideSlice = createSlice({
  name: 'tide',
  initialState: { station: null, data: null },
  reducers: { ... },
});
```

## API Integration

### Current: Mock Data

Located in `src/data/mockData.ts`:

```typescript
export const getMockTideData = (stationId: string): TideData => {
  // Simulates tide using sine wave based on hour
  const tideLevel = Math.round(50 + 45 * Math.sin((hour * Math.PI) / 6));
  return { stationId, timestamp, tideLevel, height, type };
};
```

### Future: Real API

Example using NOAA API:

```typescript
// src/services/tideApi.ts
const NOAA_API = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';

export async function fetchTideData(
  stationId: string,
  date: Date
): Promise<TideData> {
  const params = new URLSearchParams({
    product: 'predictions',
    application: 'TideApp',
    begin_date: formatDate(date),
    end_date: formatDate(date),
    datum: 'MLLW',
    station: stationId,
    time_zone: 'gmt',
    units: 'metric',
    interval: 'hilo',
    format: 'json',
  });

  const response = await fetch(`${NOAA_API}?${params}`);
  if (!response.ok) throw new Error('Failed to fetch tide data');

  const data = await response.json();
  return transformNOAAData(data);
}

function transformNOAAData(data: NOAAResponse): TideData {
  // Transform NOAA format to app format
  // Calculate tideLevel based on high/low predictions
}
```

### Recommended APIs

1. **NOAA Tides & Currents** (Free, US/territories)
   - URL: https://tidesandcurrents.noaa.gov/api/
   - Coverage: US coastal areas
   - Data: 6-minute intervals, predictions, historical

2. **World Tides** (Paid, global)
   - URL: https://www.worldtides.info/
   - Coverage: Worldwide
   - Features: Predictions, extremes, current height

3. **Stormglass.io** (Paid, global)
   - URL: https://stormglass.io/
   - Coverage: Worldwide
   - Features: Tide, weather, moon phase

## Design System

### Colors

```typescript
const colors = {
  ocean: {
    light: '#4A90E2',
    mid: '#357ABD',
    dark: '#2C5F96',
  },
  sand: {
    light: '#F4E4C1',
    mid: '#E6D5A8',
    dark: '#D4C59A',
  },
  glass: {
    ios: 'rgba(255, 255, 255, 0.25)',
    android: 'rgba(255, 255, 255, 0.35)',
    web: 'rgba(255, 255, 255, 0.3)',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    accent: '#357ABD',
  },
};
```

### Typography

```typescript
const typography = {
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  body: {
    fontSize: 15,
    fontWeight: '500',
  },
};
```

### Glass Effect

```typescript
<BlurView
  intensity={Platform.OS === 'ios' ? 80 : 90}
  tint="light"
  style={{
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.25)',
      android: 'rgba(255, 255, 255, 0.35)',
      web: 'rgba(255, 255, 255, 0.3)',
    }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
  }}
/>
```

## Testing

### Manual Testing Checklist

- [ ] App starts without errors
- [ ] Background animates smoothly on tide level change
- [ ] Station display shows correct information
- [ ] Search filters stations correctly
- [ ] Selecting a station updates UI
- [ ] Glass effects render properly
- [ ] Works on iOS simulator
- [ ] Works on Android emulator
- [ ] Works in web browser

### Automated Testing (Future)

```bash
# Unit tests (Jest)
npm test

# E2E tests (Detox)
npm run test:e2e

# Coverage
npm run test:coverage
```

## Performance Optimization

### Animation Performance

- Use `useNativeDriver: true` for transform/opacity animations
- Avoid animating layout properties (height/width) when possible
- Use `shouldComponentUpdate` or `React.memo` for expensive components

### Current Optimizations

```typescript
// Native driver for wave animation (transforms)
Animated.timing(waveAnimation, {
  toValue: 1,
  duration: 3000,
  useNativeDriver: true, // ✅ 60fps on device
}).start();

// JavaScript driver for water height (layout)
Animated.timing(waterHeightAnim, {
  toValue: tideLevel,
  duration: 2000,
  useNativeDriver: false, // ❌ Required for height animation
}).start();
```

## Platform-Specific Notes

### iOS
- BlurView works natively with best performance
- Test on both simulator and device (blur looks different)
- Use iOS 16+ for best glass effects

### Android
- BlurView uses `setBlurEnabled` on Android 12+
- Earlier versions fall back to tinted background
- Test on various Android versions

### Web
- Uses CSS `backdrop-filter` for blur
- Some browsers don't support backdrop-filter
- Fallback: semi-transparent background

## Troubleshooting

### "Invariant Violation" errors

Clear cache and rebuild:
```bash
expo start -c
```

### Blur not working

Install native modules:
```bash
npx expo install expo-blur
npx expo prebuild --clean
```

### TypeScript errors

Regenerate types:
```bash
npx expo customize tsconfig.json
```

## Deployment

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Web Deployment

```bash
# Build for production
npx expo export:web

# Deploy to Vercel/Netlify/etc
# Upload the web-build folder
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NOAA API Documentation](https://api.tidesandcurrents.noaa.gov/api/prod/)
- [iOS Design Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## Contributing

See [README.md](./README.md) for contribution guidelines.
