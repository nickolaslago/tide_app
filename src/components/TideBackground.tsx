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
 * with realistic wave motion simulating ocean from an aerial/overhead view.
 *
 * The ocean waves move vertically (top to bottom) based on the tideLevel prop:
 * - At low tide (0), the water level is positioned at the top of the screen
 * - At high tide (100), the water extends to the bottom of the screen
 *
 * Wave Animation Features:
 * - 4 overlapping SVG wave layers for depth and parallax effect
 * - Vertical wave movement (translateY) simulating water rolling onto sand
 * - Varying speeds per layer (8s, 10s, 12s, 14s) for realistic parallax motion
 * - Color gradient: darker at top (#005a99) to lighter at bottom (#d4f1ff)
 * - Opacities range from 0.8 to 0.9 for natural blending
 * - Seamless vertical looping with ease-in-out timing functions
 * - Wave shapes preserved throughout animation (no straight lines at borders)
 * - Respects reduced-motion accessibility preferences
 *
 * Visual layers (from top to bottom):
 * 1. Ocean water - moves with tide level, gradient from dark to light
 * 2. Animated SVG wave layers (4 layers with different colors) - simulate ocean rolling motion
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

  // Animation for the bottom edge wave (±5% flexibility)
  const bottomEdgeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Skip animations if reduced motion is enabled
    if (isReducedMotionEnabled) {
      return;
    }

    // Wave 1: Lightest layer (#d4f1ff) - fastest at 8s
    // Yo-yo animation: plays forward then reverse in a continuous loop
    const wave1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(wave1Anim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave1Anim, {
          toValue: 0,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Wave 2: Light layer (#a2d9ff) - 10s cycle
    // Yo-yo animation: plays forward then reverse in a continuous loop
    const wave2Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(wave2Anim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave2Anim, {
          toValue: 0,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Wave 3: Dark layer (#0099ff) - 12s cycle
    // Yo-yo animation: plays forward then reverse in a continuous loop
    const wave3Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(wave3Anim, {
          toValue: 1,
          duration: 12000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave3Anim, {
          toValue: 0,
          duration: 12000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Wave 4: Darkest layer (#005a99) - slowest at 14s
    // Yo-yo animation: plays forward then reverse in a continuous loop
    const wave4Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(wave4Anim, {
          toValue: 1,
          duration: 14000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave4Anim, {
          toValue: 0,
          duration: 14000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Bottom edge wave animation: creates ±5% flexibility in sand/sea division
    // Simulates waves lapping at the shore
    const bottomEdgeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bottomEdgeAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bottomEdgeAnim, {
          toValue: -1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bottomEdgeAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    wave1Animation.start();
    wave2Animation.start();
    wave3Animation.start();
    wave4Animation.start();
    bottomEdgeAnimation.start();

    return () => {
      wave1Animation.stop();
      wave2Animation.stop();
      wave3Animation.stop();
      wave4Animation.stop();
      bottomEdgeAnimation.stop();
    };
    // Animations are refs and should not be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReducedMotionEnabled]);

  // Calculate actual water height based on tide level (for percentage-based animations)
  // Water height ranges from 20% (low tide) to 100% (high tide) of screen
  const actualWaterHeight = SCREEN_HEIGHT * (0.2 + (tideLevel / 100) * 0.8);

  // Interpolate wave positions for vertical movement (top to bottom)
  // Each wave scrolls based on percentage of actual water height, not fixed screen height
  // This prevents excessive wave movement at low tide levels

  // Calculate max translation for lightest wave based on tide level
  // When tideLevel < 20, allow full movement (wave can reach top)
  // When tideLevel >= 20, constrain movement so wave doesn't reach top of screen
  const wave1MaxTranslation = tideLevel < 20
    ? -actualWaterHeight * 0.5
    : -actualWaterHeight * 0.15;

  const wave1TranslateY = wave1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, wave1MaxTranslation],
  });

  // Wave translations use percentage of actual water height for proportional movement
  const wave2TranslateY = wave2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -actualWaterHeight * 0.4],
  });

  const wave3TranslateY = wave3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -actualWaterHeight * 0.35],
  });

  const wave4TranslateY = wave4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -actualWaterHeight * 0.3],
  });

  // Bottom edge wave translation: ±5% of screen height for realistic wave lapping
  const bottomEdgeTranslateY = bottomEdgeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-SCREEN_HEIGHT * 0.05, 0, SCREEN_HEIGHT * 0.05],
  });

  // Generate SVG path for the bottom edge wave (sand to sea transition)
  // Creates wavy edges on BOTH top and bottom (no straight lines)
  // Made larger to cover ±5% animation range without showing sand
  const generateBottomEdgeWavePath = (
    amplitude: number,
    frequency: number,
    height: number
  ) => {
    const points = [];
    const segments = 60;
    const width = SCREEN_WIDTH;
    const topFreq = frequency * 1.2; // Different frequency for top edge

    // TOP edge - wavy (this is where it connects with the water)
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = amplitude + amplitude * Math.sin((i / segments) * Math.PI * 2 * topFreq);
      points.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
    }

    // BOTTOM edge - wavy (this extends into the sand)
    for (let i = segments; i >= 0; i--) {
      const x = (i / segments) * width;
      const y = height - amplitude + amplitude * Math.sin((i / segments) * Math.PI * 2 * frequency + Math.PI);
      points.push(`L ${x},${y}`);
    }

    points.push('Z');

    return points.join(' ');
  };

  // Generate SVG path data for horizontal wave shapes that tile vertically
  // Creates smooth sinusoidal waves on BOTH top and bottom edges (no straight lines)
  // Repeating pattern for seamless vertical looping
  const generateWavePath = (
    amplitude: number,
    frequency: number,
    yOffset: number,
    bottomAmplitude?: number,
    bottomFrequency?: number
  ) => {
    const points = [];
    const segments = 50;
    const width = SCREEN_WIDTH;
    const bAmp = bottomAmplitude ?? amplitude;
    const bFreq = bottomFrequency ?? frequency * 0.8; // Slightly different frequency for natural look

    // First wave - TOP edge at yOffset position (wavy)
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = yOffset + amplitude * Math.sin((i / segments) * Math.PI * 2 * frequency);
      points.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
    }

    // First wave - BOTTOM edge (wavy, not straight)
    const bottomY1 = yOffset + SCREEN_HEIGHT;
    for (let i = segments; i >= 0; i--) {
      const x = (i / segments) * width;
      const y = bottomY1 + bAmp * Math.sin((i / segments) * Math.PI * 2 * bFreq + Math.PI); // Phase shift for variation
      points.push(`L ${x},${y}`);
    }

    // Close the first wave shape
    points.push('Z');

    // Second wave (for seamless tiling) - TOP edge at yOffset + SCREEN_HEIGHT (wavy)
    const topY2 = yOffset + SCREEN_HEIGHT;
    points.push(`M 0,${topY2 + bAmp * Math.sin(Math.PI)}`); // Start matches bottom of first wave
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = topY2 + bAmp * Math.sin((i / segments) * Math.PI * 2 * bFreq + Math.PI);
      points.push(`L ${x},${y}`);
    }

    // Second wave - BOTTOM edge (wavy)
    const bottomY2 = yOffset + SCREEN_HEIGHT * 2;
    for (let i = segments; i >= 0; i--) {
      const x = (i / segments) * width;
      const y = bottomY2 + amplitude * Math.sin((i / segments) * Math.PI * 2 * frequency);
      points.push(`L ${x},${y}`);
    }

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
        {/* Main water gradient using the new color palette - darker at top, lighter at bottom */}
        <LinearGradient
          colors={['#005a99', '#0099ff', '#a2d9ff', '#d4f1ff']}
          style={StyleSheet.absoluteFill}
        />

        {/* 4 overlapping SVG wave layers for vertical parallax motion */}
        {/* Waves move downward simulating water rolling onto sand from overhead view */}
        {/* Animation uses yo-yo pattern: plays forward then reverse in continuous loop */}
        {/* Wave 4: Darkest layer (#005a99) - slowest movement, deepest water */}
        <Animated.View
          style={[
            styles.svgWaveLayer,
            {
              transform: [{ translateY: wave4TranslateY }],
              opacity: 0.9,
            },
          ]}
        >
          <Svg height={SCREEN_HEIGHT * 2} width={SCREEN_WIDTH} style={styles.svgContainer}>
            <Path d={generateWavePath(15, 3, 0)} fill="#005a99" />
          </Svg>
        </Animated.View>

        {/* Wave 3: Dark layer (#0099ff) */}
        <Animated.View
          style={[
            styles.svgWaveLayer,
            {
              transform: [{ translateY: wave3TranslateY }],
              opacity: 0.85,
            },
          ]}
        >
          <Svg height={SCREEN_HEIGHT * 2} width={SCREEN_WIDTH} style={styles.svgContainer}>
            <Path d={generateWavePath(20, 2.5, SCREEN_HEIGHT * 0.15)} fill="#0099ff" />
          </Svg>
        </Animated.View>

        {/* Wave 2: Light layer (#a2d9ff) */}
        <Animated.View
          style={[
            styles.svgWaveLayer,
            {
              transform: [{ translateY: wave2TranslateY }],
              opacity: 0.85,
            },
          ]}
        >
          <Svg height={SCREEN_HEIGHT * 2} width={SCREEN_WIDTH} style={styles.svgContainer}>
            <Path d={generateWavePath(25, 2, SCREEN_HEIGHT * 0.3)} fill="#a2d9ff" />
          </Svg>
        </Animated.View>
        {/* Wave 1: Lightest layer (#d4f1ff) - fastest movement, closest to shore */}
        {/* Constrained based on tide level: only reaches top when tideLevel < 20% */}
        <Animated.View
          style={[
            styles.svgWaveLayer,
            {
              transform: [{ translateY: wave1TranslateY }],
              opacity: 0.8,
            },
          ]}
        >
          <Svg height={SCREEN_HEIGHT * 2} width={SCREEN_WIDTH} style={styles.svgContainer}>
            <Path d={generateWavePath(30, 1.5, SCREEN_HEIGHT * 0.45)} fill="#d4f1ff" />
          </Svg>
        </Animated.View>

      </Animated.View>

      {/* Bottom edge wave - creates wavy transition from sea to sand */}
      {/* Larger size to cover ±5% animation range without showing sand */}
      {/* Positioned outside waterContainer, follows water height with ±5% animation */}
      <Animated.View
        style={[
          styles.bottomEdgeWaveContainer,
          {
            top: waterHeight,
            transform: [{ translateY: bottomEdgeTranslateY }],
          },
        ]}
      >
        <Svg height={SCREEN_HEIGHT * 0.35} width={SCREEN_WIDTH} style={styles.bottomEdgeWave}>
          <Path d={generateBottomEdgeWavePath(35, 3, SCREEN_HEIGHT * 0.35)} fill="#d4f1ff" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#005a99', // Match darkest wave layer to prevent visible seam
  },
  sand: {
    ...StyleSheet.absoluteFillObject,
  },
  waterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden', // Contain wave layers within water area
  },
  svgWaveLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 2, // Double height for seamless vertical looping
  },
  svgContainer: {
    position: 'absolute',
  },
  bottomEdgeWaveContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.35, // 35% of screen height to fully cover ±5% animation range
    marginTop: -SCREEN_HEIGHT * 0.12, // Overlap with water container for seamless connection
  },
  bottomEdgeWave: {
    position: 'absolute',
    top: 0,
  },
});
