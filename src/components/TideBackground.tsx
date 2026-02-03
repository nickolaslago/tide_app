import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TideBackgroundProps {
  /**
   * Tide level from 0-100
   * 0 = Low tide (waves at top)
   * 100 = High tide (waves at bottom)
   */
  tideLevel: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * TideBackground Component
 *
 * This component creates an animated background that visually represents tide levels.
 * The ocean waves move vertically based on the tideLevel prop:
 * - At low tide (0), the waves are positioned at the top of the screen
 * - At high tide (100), the waves extend to the bottom of the screen
 *
 * The animation smoothly transitions between tide levels using React Native's
 * Animated API for performant, native-driven animations.
 *
 * Visual layers (from top to bottom):
 * 1. Ocean water (blue gradient) - moves with tide level
 * 2. Wave pattern (lighter blue, semi-transparent) - adds depth
 * 3. Sand (beige gradient) - fills remaining space below water
 */
export const TideBackground: React.FC<TideBackgroundProps> = ({ tideLevel }) => {
  // Animated value that controls the water height
  // This value represents the percentage of screen filled with water
  const waterHeightAnim = useRef(new Animated.Value(tideLevel)).current;

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

  // Create wave animation for visual interest
  const waveAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous wave animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    // waveAnimation is a ref and should not be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const waveTranslate = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

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
        {/* Main water gradient */}
        <LinearGradient
          colors={['#4A90E2', '#357ABD', '#2C5F96']}
          style={StyleSheet.absoluteFill}
        />

        {/* Animated wave overlay for depth */}
        <Animated.View
          style={[
            styles.waveOverlay,
            {
              transform: [{ translateY: waveTranslate }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Wave crest effect at the water line */}
        <View style={styles.waveCrest}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.5)', 'transparent']}
            style={styles.crestGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </View>
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
  waveOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  waveCrest: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  crestGradient: {
    flex: 1,
  },
});
