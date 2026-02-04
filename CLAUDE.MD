# CLAUDE.MD - AI Assistant Instructions

## Project Overview

This is a tide tracking mobile app built with Expo/React Native. The app displays tide information for various beach locations with a minimalistic, calming UI featuring animated waves and tide data in iOS 26 Glass Design style.

**Tech Stack:**
- Expo (^54.0.33) + React Native (0.76.5)
- TypeScript (5.3.3)
- expo-blur for glass/frosted effects
- expo-linear-gradient for ocean and sand gradients
- Jest + React Native Testing Library for testing
- ESLint + Prettier for code quality

## Architecture

### Project Structure

```
tide_app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TideBackground.tsx    # Animated wave/sand background
│   │   ├── StationDisplay.tsx    # Station info with glass design
│   │   ├── StationSearch.tsx     # Search interface
│   │   └── index.ts              # Component exports
│   ├── screens/             # App screens
│   │   └── HomeScreen.tsx        # Main screen
│   ├── data/                # Data layer
│   │   └── mockData.ts           # Mock stations and tide data
│   ├── types/               # TypeScript definitions
│   │   └── index.ts              # Type definitions
│   └── __tests__/           # Test files
│       └── mockData.test.ts
├── App.tsx                  # Entry point
├── app.json                 # Expo configuration
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.json
└── .prettierrc.json
```

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
mockData.ts → HomeScreen state → Components
     ↓
  tideLevel (0-100)
     ↓
  TideBackground animation
```

## Key Technical Concepts

### Tide Level Mapping

The tide level is represented as a numeric value (0-100):
- **0**: Low tide - waves at 20% screen height
- **100**: High tide - waves fill entire screen (100% height)

Implementation in `src/components/TideBackground.tsx:50-53`:
```typescript
const waterHeight = waterHeightAnim.interpolate({
  inputRange: [0, 100],
  outputRange: [SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT],
});
```

### iOS 26 Glass Design

The app uses translucent surfaces with background blur:
- `expo-blur` with BlurView component
- Platform-specific blur intensities (iOS: 80, Android: 90)
- Soft shadows and layering for depth
- Semi-transparent backgrounds with border highlights

## Development Workflow

### 1. Working on GitHub Issues

When working on issues, follow this process:

#### Issue Selection
- Check open issues in the GitHub repository
- Read issue descriptions, labels, and comments
- Prioritize based on labels: `bug`, `enhancement`, `good first issue`
- If no issue is specified, ask which one to work on
- Confirm requirements before starting

#### Branch Strategy
- Create branch named: `claude/{brief-description}-{session-id}`
- Branch must start with `claude/` and end with session ID
- NEVER push to main/master directly
- Always push with: `git push -u origin <branch-name>`

#### Implementation Process
1. Read relevant files before making any changes
2. Understand existing patterns and code style
3. Make focused changes - avoid over-engineering
4. Keep the minimalistic design aesthetic
5. Test changes thoroughly

#### Testing Requirements
- Start dev server: `npm start`
- Test on web: `npm run web`
- Test on Android emulator if available
- Verify the fix resolves the issue
- Check for regressions
- Run tests: `npm test`
- Run linting: `npm run lint`

#### Completion
- Commit with clear message: `Fix #[issue-number]: [description]`
- Push to the claude/* branch
- Suggest creating a pull request
- Update issue with progress if needed

### 2. Git Operations

**Pushing changes:**
```bash
# Always use -u flag for new branches
git push -u origin claude/feature-name-ABC123

# Retry on network failures (up to 4 times with exponential backoff)
# 2s, 4s, 8s, 16s between retries
```

**Fetching updates:**
```bash
# Fetch specific branch
git fetch origin claude/feature-name-ABC123

# Pull with retry logic
git pull origin claude/feature-name-ABC123
```

### 3. Code Quality Standards

#### Code Style
- Use functional components with hooks
- Prefer React Native Reanimated 2 for animations (when available)
- Keep components small and focused (< 200 lines)
- Use descriptive variable names
- Follow existing naming conventions
- TypeScript: use proper types, avoid `any`

#### Don't Over-Engineer
- Only make changes that are directly requested
- Don't add features beyond what's asked
- Don't refactor surrounding code unnecessarily
- Don't add comments where code is self-evident
- Don't create abstractions for one-time operations
- Don't add error handling for impossible scenarios

#### Security
- Avoid command injection, XSS, SQL injection
- Validate at system boundaries only (user input, external APIs)
- Trust internal code and framework guarantees
- If you introduce a vulnerability, fix it immediately

### 4. Animation Performance

**Use native driver when possible:**
```typescript
// ✅ Good - transforms/opacity with native driver
Animated.timing(animation, {
  toValue: 1,
  duration: 3000,
  useNativeDriver: true,
}).start();

// ❌ Required - layout properties need JS driver
Animated.timing(heightAnim, {
  toValue: 100,
  duration: 2000,
  useNativeDriver: false, // Required for height/width
}).start();
```

## Common Commands

```bash
# Development
npm start                    # Start Expo dev server
npm run web                  # Run on web
npm run ios                  # Run on iOS (macOS only)
npm run android              # Run on Android

# Code Quality
npm test                     # Run Jest tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate coverage report
npm run lint                 # Run ESLint
npm run lint:fix             # Fix ESLint issues
npm run format               # Format with Prettier
npm run format:check         # Check formatting

# Troubleshooting
npx expo start --clear       # Clear cache and start
npx expo-doctor              # Check for issues
npx expo install <package>   # Install Expo-compatible packages
```

## Design System

### Colors
```typescript
ocean: {
  light: '#4A90E2',
  mid: '#357ABD',
  dark: '#2C5F96',
}
sand: {
  light: '#F4E4C1',
  mid: '#E6D5A8',
  dark: '#D4C59A',
}
text: {
  primary: '#1A1A1A',
  secondary: '#4A4A4A',
  accent: '#357ABD',
}
```

### Glass Effect Pattern
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

## Current Implementation Status

### Mock Data vs Real API

**Current:** Using mock data from `src/data/mockData.ts`
- Tide level simulated with sine wave based on time of day
- 4 mock stations (Santa Monica, Venice Beach, Malibu, Manhattan Beach)

**Future API Integration:**
Replace `getMockTideData()` with real API:
- NOAA Tides & Currents API (free, US only)
- World Tides API (paid, global)
- Stormglass.io (paid, global)

### State Management

**Current:** React `useState` in HomeScreen
**Future:** Consider Context API, Zustand, or Redux Toolkit for larger features

## Troubleshooting

### Common Issues

**"Unable to resolve module expo-blur"**
```bash
npm install expo-blur expo-linear-gradient
```

**"Invariant Violation: requireNativeComponent"**
```bash
expo prebuild --clean
```

**Assets not loading**
```bash
expo start -c  # Clear cache
```

**TypeScript errors**
```bash
npx expo customize tsconfig.json
```

**Blur not working on Android**
- Requires Android 12+ for native blur
- Earlier versions fall back to tinted background

**Performance issues**
- Check if native driver is enabled for animations
- Use React.memo for expensive components
- Profile with React DevTools

## Important Files Reference

- `App.tsx:5-12` - Main app entry point
- `src/screens/HomeScreen.tsx:15-25` - Main screen with state management
- `src/components/TideBackground.tsx:50-53` - Tide level interpolation logic
- `src/components/StationDisplay.tsx:35-60` - Glass card styling
- `src/components/StationSearch.tsx:40-70` - Search functionality
- `src/data/mockData.ts:10-30` - Mock tide calculation
- `src/types/index.ts` - TypeScript type definitions

## Testing Strategy

### Manual Testing Checklist
- [ ] App starts without errors
- [ ] Background animates smoothly
- [ ] Station display shows correct info
- [ ] Search filters stations correctly
- [ ] Selecting station updates UI
- [ ] Glass effects render properly
- [ ] Works on iOS/Android/Web

### Automated Tests
- Unit tests with Jest in `src/__tests__/`
- Test coverage goal: > 80%
- Run before committing: `npm test`

## Communication Guidelines

### When to Ask Questions
- Issue requirements are unclear or ambiguous
- Multiple implementation approaches are possible
- You need context about expected app behavior
- You encounter errors and need clarification

### Progress Updates
- Keep user informed on progress
- Explain your approach before complex changes
- Suggest improvements if you spot better solutions
- Be proactive but don't over-engineer

### Code References
When referencing code, use format: `file_path:line_number`

Example: "The tide level is calculated in src/data/mockData.ts:25-28"

## Platform-Specific Notes

### iOS
- BlurView works natively with best performance
- Test on both simulator and device
- Glass effects require iOS 16+

### Android
- BlurView uses `setBlurEnabled` on Android 12+
- Earlier versions fall back to tinted background
- Test on multiple Android versions

### Web
- Uses CSS `backdrop-filter` for blur
- Fallback for unsupported browsers
- May have different performance characteristics

## Future Enhancements (Potential)

When these are requested, consider:
1. Real tide API integration
2. Date selection for forecasts
3. Favorite stations
4. Notifications for tide changes
5. 7-day forecast view
6. Sunrise/sunset times
7. Moon phases
8. React Navigation for multiple screens
9. Offline support with cached data
10. User preferences/settings

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NOAA API Documentation](https://api.tidesandcurrents.noaa.gov/api/prod/)
- [iOS Design Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Remember:**
- Read files before editing
- Test thoroughly before committing
- Keep changes focused and minimal
- Follow existing patterns
- Ask when unclear
- Use the claude/* branch naming convention
