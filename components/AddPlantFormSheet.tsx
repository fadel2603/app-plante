import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

type Props = {
  visible: boolean;
  detectedName: string;
  detectedLocation: string;
  photoUri: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

const SHEET_H = 460;
const DISMISS_THRESHOLD = 80;

export default function AddPlantFormSheet({
  visible,
  detectedName,
  detectedLocation,
  photoUri,
  onClose,
  onConfirm,
}: Props) {
  const translateY = useRef(new Animated.Value(SHEET_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [name, setName] = useState(detectedName);
  const [location, setLocation] = useState<'Intérieur' | 'Extérieur'>(
    detectedLocation === 'Extérieur' ? 'Extérieur' : 'Intérieur'
  );

  useEffect(() => {
    if (visible) {
      setName(detectedName);
      translateY.setValue(SHEET_H);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: SHEET_H, duration: 250, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => { if (g.dy > 0) translateY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
          dismiss();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={dismiss}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={dismiss} activeOpacity={1} />
      </Animated.View>

      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.glass]} />

        <View style={styles.handle} />
        <Text style={styles.title}>Personnaliser</Text>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Name field */}
          <Text style={styles.label}>Nom de la plante</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex : Mon Monstera"
            placeholderTextColor={Colors.textMuted}
          />

          {/* Location toggle */}
          <Text style={styles.label}>Emplacement</Text>
          <View style={styles.toggleRow}>
            {(['Intérieur', 'Extérieur'] as const).map(loc => (
              <TouchableOpacity
                key={loc}
                style={[styles.toggleBtn, location === loc && styles.toggleBtnActive]}
                onPress={() => setLocation(loc)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={loc === 'Intérieur' ? 'home-outline' : 'sunny-outline'}
                  size={15}
                  color={location === loc ? Colors.textDark : Colors.textMuted}
                />
                <Text style={[styles.toggleText, location === loc && styles.toggleTextActive]}>
                  {loc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Photo preview */}
          {photoUri && (
            <>
              <Text style={styles.label}>Photo</Text>
              <View style={styles.photoRow}>
                <Image source={{ uri: photoUri }} style={styles.photoThumb} />
                <TouchableOpacity style={styles.addPhotoBtn} activeOpacity={0.7}>
                  <Ionicons name="add" size={22} color={Colors.textDark} />
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Confirm button */}
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={onConfirm}>
          <Ionicons name="leaf" size={18} color={Colors.textDark} />
          <Text style={styles.confirmText}>Ajouter à mes plantes</Text>
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
  sheet: {
    position: 'absolute',
    bottom: 12,
    left: 10,
    right: 10,
    height: SHEET_H,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  glass: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.96)',
    borderRadius: 44,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: 10, marginBottom: 12,
  },
  title: {
    fontFamily: FontFamily.headerBold,
    fontSize: 18,
    color: Colors.textDark,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  scroll: { width: '100%', flex: 1 },
  label: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontFamily: FontFamily.calendarMedium,
    fontSize: 15,
    color: Colors.textDark,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 14,
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: Colors.textDark,
    fontFamily: FontFamily.calendarBold,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: Colors.border,
  },
  addPhotoBtn: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 4,
  },
  confirmText: {
    fontFamily: FontFamily.calendarBold,
    fontSize: 16,
    color: Colors.textDark,
  },
});
