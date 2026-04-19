import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

const { width: W } = Dimensions.get('window');

const STEPS = [
  'Analyse de l\'image en cours...',
  'Identification de l\'espèce...',
  'Recherche des caractéristiques...',
  'Génération du profil de soin...',
];

const STEP_DURATION = [1500, 1500, 1500, 1000];

export default function AnalyzingScreen() {
  const { photo } = useLocalSearchParams<{ photo: string }>();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const textOpacity = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous spinner
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1800, useNativeDriver: true })
    ).start();

    // Step sequence
    let currentStep = 0;
    const advance = () => {
      if (currentStep >= STEPS.length - 1) {
        // Done — navigate to result
        setTimeout(() => {
          router.replace({ pathname: '/add-plant/result', params: { photo } } as any);
        }, 600);
        return;
      }
      Animated.sequence([
        Animated.timing(textOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        currentStep++;
        setStepIndex(currentStep);
        setTimeout(advance, STEP_DURATION[currentStep]);
      });
    };

    const timer = setTimeout(advance, STEP_DURATION[0]);
    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background photo */}
      {photo && <Image source={{ uri: photo }} style={styles.bg} blurRadius={8} />}
      <View style={styles.bgDim} />

      {/* Center content */}
      <View style={styles.center}>
        {/* Spinner */}
        <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]} />
        <View style={styles.spinnerDot} />

        {/* Step text */}
        <Animated.Text style={[styles.stepText, { opacity: textOpacity }]}>
          {STEPS[stepIndex]}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bgDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  spinnerRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: Colors.primary,
    borderRightColor: 'rgba(181,241,91,0.3)',
  },
  spinnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginBottom: -30,
  },
  stepText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 52,
    letterSpacing: 0.3,
  },
});
