import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import { Plant } from '@/constants/data';

type Props = {
  plant: Plant | null;
  taskType?: string;
  onClose: () => void;
};

const SCREEN_H = Dimensions.get('window').height;
const SHEET_H = 400;
const DISMISS_THRESHOLD = 80;

export default function PlantPreviewSheet({ plant, taskType, onClose }: Props) {
  const router = useRouter();
  const translateY = useRef(new Animated.Value(SHEET_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const visible = !!plant;

  useEffect(() => {
    if (visible) {
      translateY.setValue(SHEET_H);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SHEET_H,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
          dismiss();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          }).start();
        }
      },
    })
  ).current;

  if (!plant) return null;

  const nextCare = taskType === 'water' ? 'Arrosage dans 2 jours' : 'Observation dans 3 jours';

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={dismiss}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={dismiss} activeOpacity={1} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[styles.sheetWrapper, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.sheetGlass]} />
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Plant photo */}
        <View style={styles.photoWrap}>
          {plant.image ? (
            <Image source={{ uri: plant.image }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoFallback]}>
              <Ionicons name="leaf" size={32} color={Colors.textMuted} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{plant.name}</Text>
          <Text style={styles.species}>{plant.species}</Text>
          <Text style={styles.meta}>Ajoutée il y a 2 mois · Intérieur</Text>
        </View>

        {/* Next care */}
        <View style={styles.nextCareRow}>
          <View style={styles.nextCareIcon}>
            <Ionicons
              name={taskType === 'water' ? 'water' : 'eye'}
              size={16}
              color={taskType === 'water' ? '#2196F3' : '#2E7D32'}
            />
          </View>
          <Text style={styles.nextCareText}>{nextCare}</Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.85}
          onPress={() => {
            dismiss();
            setTimeout(() => router.push(`/plant/${plant.id}` as any), 280);
          }}
        >
          <Text style={styles.ctaText}>Voir la fiche complète</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.textDark} />
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  sheetWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 10,
    right: 10,
    height: SHEET_H,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  sheetGlass: {
    backgroundColor: Platform.OS === 'ios'
      ? 'rgba(255,255,255,0.65)'
      : 'rgba(255,255,255,0.96)',
    borderRadius: 44,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: 10,
    marginBottom: 12,
  },
  photoWrap: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 160,
  },
  photoFallback: {
    backgroundColor: Colors.sectionBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    width: '100%',
    marginBottom: 8,
  },
  name: {
    fontFamily: FontFamily.titleDisplay,
    fontSize: 22,
    color: Colors.textDark,
  },
  species: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  meta: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  nextCareRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  nextCareIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCareText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 14,
    color: Colors.textDark,
  },
  cta: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(181,241,91,0.9)',
    borderRadius: 16,
    height: 48,
  },
  ctaText: {
    fontFamily: FontFamily.calendarBold,
    fontSize: 15,
    color: Colors.textDark,
  },
});
