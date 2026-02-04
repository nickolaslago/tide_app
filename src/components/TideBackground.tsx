import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions, View, Easing } from 'react-native';
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
 * This component creates an animated background that visually represents tide levels
 * with realistic wave motion that gently comes in and recedes on the beach.
 *
 * The ocean waves move vertically based on the tideLevel prop:
 * - At low tide (0), the waves are positioned at the top of the screen
 * - At high tide (100), the waves extend to the bottom of the screen
 *
 * Wave Animation Features:
 * - Multiple wave layers (3) for organic, natural appearance
 * - Smooth easeInOut motion simulating waves coming in and receding
 * - Staggered timing between waves for realistic, non-uniform motion
 * - Gradual opacity changes: waves fade in as they approach, fade out as they recede
 * - 3-4 second animation cycles for peaceful, calming effect
 *
 * Visual layers (from top to bottom):
 * 1. Ocean water (blue gradient) - moves with tide level
 * 2. Animated wave layers (white/light blue foam) - simulate wave motion
 * 3. Static wave crest - adds depth at the water line
 * 4. Sand (beige gradient) - fills remaining space below water
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

  // Create multiple wave animations for organic, realistic motion
  const wave1Anim = useRef(new Animated.Value(0)).current;
  const wave2Anim = useRef(new Animated.Value(0)).current;
  const wave3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wave 1: Primary wave with 3.5 second cycle
    const wave1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(wave1Anim, {
          toValue: 1,
          duration: 1750, // Coming in (half of 3.5s)
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave1Anim, {
          toValue: 0,
          duration: 1750, // Receding (half of 3.5s)
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Wave 2: Secondary wave, slightly delayed (0.5s) and faster
    const wave2Animation = Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(wave2Anim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave2Anim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Wave 3: Tertiary wave, more delayed (1s) for organic appearance
    const wave3Animation = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(wave3Anim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave3Anim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    wave1Animation.start();
    wave2Animation.start();
    wave3Animation.start();

    return () => {
      wave1Animation.stop();
      wave2Animation.stop();
      wave3Animation.stop();
    };
    // Animations are refs and should not be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Interpolate wave positions and opacities
  // Waves move up (come in) and down (recede) on the beach
  const wave1Translate = wave1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -30, 0], // Moves up 30px then back
  });

  const wave1Opacity = wave1Anim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0.3, 0.7, 0.7, 0.2], // Fades in as it comes, fades out as it recedes
  });

  const wave2Translate = wave2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -25, 0],
  });

  const wave2Opacity = wave2Anim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0.2, 0.6, 0.6, 0.15],
  });

  const wave3Translate = wave3Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -20, 0],
  });

  const wave3Opacity = wave3Anim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0.15, 0.5, 0.5, 0.1],
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

        {/* Multiple wave layers for organic, realistic motion */}
        {/* Wave 3: Background wave (most subtle) */}
        <Animated.View
          style={[
            styles.waveLayer,
            {
              transform: [{ translateY: wave3Translate }],
              opacity: wave3Opacity,
              bottom: 15,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.4)', 'rgba(200, 230, 255, 0.2)', 'transparent']}
            style={styles.waveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        {/* Wave 2: Middle wave */}
        <Animated.View
          style={[
            styles.waveLayer,
            {
              transform: [{ translateY: wave2Translate }],
              opacity: wave2Opacity,
              bottom: 10,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.5)', 'rgba(220, 240, 255, 0.3)', 'transparent']}
            style={styles.waveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        {/* Wave 1: Foreground wave (most prominent) */}
        <Animated.View
          style={[
            styles.waveLayer,
            {
              transform: [{ translateY: wave1Translate }],
              opacity: wave1Opacity,
              bottom: 5,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.6)', 'rgba(240, 250, 255, 0.4)', 'transparent']}
            style={styles.waveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        {/* Static wave crest effect at the water line for depth */}
        <View style={styles.waveCrest}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'transparent']}
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
  waveLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 50, // Increased height for better wave appearance
  },
  waveGradient: {
    flex: 1,
  },
  waveCrest: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
  },
  crestGradient: {
    flex: 1,
  },
});
