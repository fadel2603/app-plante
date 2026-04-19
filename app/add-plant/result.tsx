import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddPlantFormSheet from '@/components/AddPlantFormSheet';

// Simulated AI result
const AI_RESULT = {
  name: 'Monstera',
  latinName: 'Monstera deliciosa',
  location: 'Intérieur',
  careLevel: 'Facile',
  confidence: 96,
};

const { height: H } = Dimensions.get('window');

export default function ResultScreen() {
  const { photo } = useLocalSearchParams<{ photo: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
      Animated.timing(cardTranslateY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Hero photo */}
      {photo && <Image source={{ uri: photo }} style={styles.bg} />}
      <View style={styles.bgGradient} />

      {/* Back */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 12 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={22} color="white" />
      </TouchableOpacity>

      {/* Result card */}
      <Animated.View
        style={[
          styles.card,
          { bottom: insets.bottom + 16, opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] },
        ]}
      >
        {/* Confidence badge */}
        <View style={styles.confidenceBadge}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
          <Text style={styles.confidenceText}>Identifié à {AI_RESULT.confidence}%</Text>
        </View>

        {/* Name */}
        <Text style={styles.name}>{AI_RESULT.name}</Text>
        <Text style={styles.latinName}>{AI_RESULT.latinName}</Text>

        {/* Badges row */}
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Ionicons name="home-outline" size={13} color={Colors.textDark} />
            <Text style={styles.badgeText}>{AI_RESULT.location}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="leaf-outline" size={13} color={Colors.textDark} />
            <Text style={styles.badgeText}>{AI_RESULT.careLevel}</Text>
          </View>
        </View>

        <Text style={styles.question}>Est-ce bien cette plante ?</Text>

        {/* Confirm */}
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.85}
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="checkmark" size={18} color={Colors.textDark} />
          <Text style={styles.confirmText}>Confirmer et ajouter</Text>
        </TouchableOpacity>

        {/* Retry */}
        <TouchableOpacity
          style={styles.retryBtn}
          activeOpacity={0.7}
          onPress={() => router.replace('/add-plant/camera' as any)}
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </Animated.View>

      <AddPlantFormSheet
        visible={showForm}
        detectedName={AI_RESULT.name}
        detectedLocation={AI_RESULT.location}
        photoUri={photo ?? null}
        onClose={() => setShowForm(false)}
        onConfirm={() => {
          setShowForm(false);
          router.replace('/(tabs)/plants' as any);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primary + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  confidenceText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 12,
    color: Colors.textDark,
  },
  name: {
    fontFamily: FontFamily.titleDisplay,
    fontSize: 34,
    color: Colors.textDark,
    textAlign: 'center',
  },
  latinName: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 15,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 14,
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 13,
    color: Colors.textDark,
  },
  question: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  confirmBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    height: 52,
    marginBottom: 10,
  },
  confirmText: {
    fontFamily: FontFamily.calendarBold,
    fontSize: 16,
    color: Colors.textDark,
  },
  retryBtn: {
    paddingVertical: 8,
  },
  retryText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 14,
    color: Colors.textMuted,
  },
});
