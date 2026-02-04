import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, Dimensions, View, Easing, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

interface TideBackgroundProps {
  /**
   * Tide level from 0-100
   * 0 = Low tide (waves at top)
   * 100 = High tide (waves at bottom)
   */
  tideLevel: number;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * TideBackground Component
 *
 * This component creates an animated background that visually represents tide levels
 * with realistic wave motion simulating ocean from an aerial view.
 *
 * The ocean waves move vertically based on the tideLevel prop:
 * - At low tide (0), the water level is positioned at the top of the screen
 * - At high tide (100), the water extends to the bottom of the screen
 *
 * Wave Animation Features:
 * - 4 overlapping SVG wave layers for depth and parallax effect
 * - Vertical wave movement simulating ocean rolling toward shore from aerial perspective
 * - Varying speeds per layer (8s, 10s, 12s, 14s) for realistic parallax motion
 * - Color palette: #d4f1ff (lightest), #a2d9ff, #0099ff, #005a99 (darkest)
 * - Opacities range from 0.6 to 1.0 for visual depth
 * - Seamless looping with ease-in-out timing functions
 * - Respects reduced-motion accessibility preferences
 *
 * Visual layers (from top to bottom):
 * 1. Ocean water - moves with tide level
 * 2. Animated SVG wave layers (4 layers with different colors) - simulate ocean motion
 * 3. Sand (beige gradient) - fills remaining space below water
 */
export const TideBackground: React.FC<TideBackgroundProps> = ({ tideLevel }) => {
  // State for reduced motion accessibility
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);

  // Animated value that controls the water height
  // This value represents the percentage of screen filled with water
  const waterHeightAnim = useRef(new Animated.Value(tideLevel)).current;

  // Check for reduced motion preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setIsReducedMotionEnabled(enabled);
    });
  }, []);

  useEffect(() => {
    // Animate to new tide level over 2 seconds with easing
    // This creates a smooth, natural tide movement
    Animated.timing(waterHeightAnim, {
      toValue: tideLevel,
      duration: 2000,
      useNativeDriver: false, // Cannot use native driver for layout animations
    }).start();
    // waterHeightAnim is a ref and should not be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tideLevel]);

  // Interpolate the animated value to actual screen position
  // Maps tideLevel (0-100) to screen pixels
  const waterHeight = waterHeightAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT], // 20% at low tide, 100% at high tide
  });

  // Create 4 wave animations for vertical parallax motion
  const wave1Anim = useRef(new Animated.Value(0)).current;
  const wave2Anim = useRef(new Animated.Value(0)).current;
  const wave3Anim = useRef(new Animated.Value(0)).current;
  const wave4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Skip animations if reduced motion is enabled
    if (isReducedMotionEnabled) {
      return;
    }

    // Wave 1: Lightest layer (#d4f1ff) - fastest at 8s
    const wave1Animation = Animated.loop(
      Animated.timing(wave1Anim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );

    // Wave 2: Light layer (#a2d9ff) - 10s cycle
    const wave2Animation = Animated.loop(
      Animated.timing(wave2Anim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );

    // Wave 3: Dark layer (#0099ff) - 12s cycle
    const wave3Animation = Animated.loop(
      Animated.timing(wave3Anim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );

    // Wave 4: Darkest layer (#005a99) - slowest at 14s
    const wave4Animation = Animated.loop(
      Animated.timing(wave4Anim, {
        toValue: 1,
        duration: 14000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );

    wave1Animation.start();
    wave2Animation.start();
    wave3Animation.start();
    wave4Animation.start();

    return () => {
      wave1Animation.stop();
      wave2Animation.stop();
      wave3Animation.stop();
      wave4Animation.stop();
    };
    // Animations are refs and should not be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReducedMotionEnabled]);

  // Interpolate wave positions for vertical movement
  // Each wave moves down the full screen height for seamless looping
  const wave1TranslateY = wave1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_HEIGHT],
  });

  const wave2TranslateY = wave2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_HEIGHT],
  });

  const wave3TranslateY = wave3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_HEIGHT],
  });

  const wave4TranslateY = wave4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_HEIGHT],
  });

  // Generate SVG path data for wave shapes
  // Creates a smooth sinusoidal wave pattern that repeats seamlessly
  const generateWavePath = (amplitude: number, frequency: number, yOffset: number) => {
    const points = [];
    const segments = 50;
    const width = SCREEN_WIDTH;

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = yOffset + amplitude * Math.sin((i / segments) * Math.PI * 2 * frequency);
      points.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
    }

    // Close the path to create a filled shape
    points.push(`L ${width},${SCREEN_HEIGHT}`);
    points.push(`L 0,${SCREEN_HEIGHT}`);
    points.push('Z');

    return points.join(' ');
  };

  return (
    <View style={styles.container}>
      {/* Sand layer - always at bottom */}
      <LinearGradient colors={['#F4E4C1', '#E6D5A8', '#D4C59A']} style={styles.sand} />

      {/* Ocean water layer - animated height */}
      <Animated.View
        style={[
          styles.waterContainer,
          {
            height: waterHeight,
          },
        ]}
      >
        {/* Main water gradient using the new color palette */}
        <LinearGradient
          colors={['#d4f1ff', '#a2d9ff', '#0099ff', '#005a99']}
          style={StyleSheet.absoluteFill}
        />

        {/* 4 overlapping SVG wave layers for vertical parallax motion */}
        {/* Wave 4: Darkest layer (#005a99) - slowest movement */}
        <Animated.View
          style={[
            styles.svgWaveLayer,
            {
              transform: [{ translateY: wave4TranslateY }],
              opacity: 1.0,
            },
          ]}
        >
          <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH * 2} style={styles.svgContainer}>
            <Path d={generateWavePath(15, 3, SCREEN_HEIGHT * 0.3)} fill="#005a99" />
          </Svg>
        </Animated.View>

        {/* Wave 3: Dark layer (#0099ff) */}
        <Animated.View
          style={[
            styles.svgWaveLayer,
            {
              transform: [{ translateY: wave3TranslateY }],
              opacity: 0.8,
            },
          ]}
        >
          <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH * 2} style={styles.svgContainer}>
            <Path d={generateWavePath(20, 2.5, SCREEN_HEIGHT * 0.35)} fill="#0099ff" />
          </Svg>
        </Animated.View>

        {/* Wave 2: Light layer (#a2d9ff) */}
        <Animated.View
          style={[
            styles.svgWaveLayer,
            {
              transform: [{ translateY: wave2TranslateY }],
              opacity: 0.7,
            },
          ]}
        >
          <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH * 2} style={styles.svgContainer}>
            <Path d={generateWavePath(25, 2, SCREEN_HEIGHT * 0.4)} fill="#a2d9ff" />
          </Svg>
        </Animated.View>

        {/* Wave 1: Lightest layer (#d4f1ff) - fastest movement */}
        <Animated.View
          style={[
            styles.svgWaveLayer,
            {
              transform: [{ translateY: wave1TranslateY }],
              opacity: 0.6,
            },
          ]}
        >
          <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH * 2} style={styles.svgContainer}>
            <Path d={generateWavePath(30, 1.5, SCREEN_HEIGHT * 0.45)} fill="#d4f1ff" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F4E4C1', // Fallback sand color
  },
  sand: {
    ...StyleSheet.absoluteFillObject,
  },
  waterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  svgWaveLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH * 2, // Double width for seamless looping
    height: SCREEN_HEIGHT,
  },
  svgContainer: {
    position: 'absolute',
  },
});
