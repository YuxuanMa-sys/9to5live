import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Main content animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      // Logo rotation animation
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      // Loading dots animation
      const dotAnimation = () => {
        Animated.sequence([
          Animated.timing(dotAnim1, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim2, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim3, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Reset dots for continuous animation
          dotAnim1.setValue(0);
          dotAnim2.setValue(0);
          dotAnim3.setValue(0);
          dotAnimation();
        });
      };

      setTimeout(() => {
        dotAnimation();
      }, 800);
    };

    const timer = setTimeout(() => {
      startAnimation();
    }, 300);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [fadeAnim, scaleAnim, slideAnim, logoRotate, dotAnim1, dotAnim2, dotAnim3, onFinish]);

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Enhanced background with multiple layers */}
      <View style={styles.backgroundLayer1} />
      <View style={styles.backgroundLayer2} />
      <View style={styles.backgroundLayer3} />
      
      {/* Main content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* App Icon/Logo with rotation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ rotate: logoRotation }],
            },
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>9to5</Text>
          </View>
        </Animated.View>

        {/* App Name */}
        <Text style={styles.appName}>9to5Life</Text>
        
        {/* Tagline */}
        <Text style={styles.tagline}>Your Daily Life, Simplified</Text>
        
        {/* Enhanced loading indicator */}
        <View style={styles.loadingContainer}>
          <Animated.View 
            style={[
              styles.loadingDot,
              {
                opacity: dotAnim1,
                transform: [{ scale: dotAnim1 }],
              },
            ]} 
          />
          <Animated.View 
            style={[
              styles.loadingDot,
              styles.loadingDot2,
              {
                opacity: dotAnim2,
                transform: [{ scale: dotAnim2 }],
              },
            ]} 
          />
          <Animated.View 
            style={[
              styles.loadingDot,
              styles.loadingDot3,
              {
                opacity: dotAnim3,
                transform: [{ scale: dotAnim3 }],
              },
            ]} 
          />
        </View>
      </Animated.View>

      {/* Bottom text */}
      <Animated.View
        style={[
          styles.bottomText,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
  backgroundLayer2: {
    position: 'absolute',
    top: -height * 0.3,
    left: -width * 0.3,
    right: -width * 0.3,
    bottom: -height * 0.3,
    backgroundColor: COLORS.tertiary,
    borderRadius: height,
    opacity: 0.1,
  },
  backgroundLayer3: {
    position: 'absolute',
    top: height * 0.6,
    left: -width * 0.2,
    right: -width * 0.2,
    bottom: -height * 0.2,
    backgroundColor: COLORS.secondary,
    borderRadius: height,
    opacity: 0.08,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    marginBottom: SIZES.padding3 * 2,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.padding2,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SIZES.padding3 * 3,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    marginHorizontal: 6,
    shadowColor: COLORS.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingDot2: {
    backgroundColor: COLORS.secondaryWhite,
  },
  loadingDot3: {
    backgroundColor: COLORS.tertiaryWhite,
  },
  bottomText: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
