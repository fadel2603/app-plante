import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Modal,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
};

const SHEET_H = 220;
const DISMISS_THRESHOLD = 60;

export default function AddPlantSheet({ visible, onClose, onCamera, onGallery }: Props) {
  const translateY = useRef(new Animated.Value(SHEET_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
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

        <Text style={styles.title}>Ajouter une plante</Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => { dismiss(); setTimeout(onCamera, 280); }}
        >
          <View style={styles.optionIcon}>
            <Ionicons name="camera" size={22} color={Colors.textDark} />
          </View>
          <Text style={styles.optionText}>Prendre une photo</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => { dismiss(); setTimeout(onGallery, 280); }}
        >
          <View style={styles.optionIcon}>
            <Ionicons name="images" size={22} color={Colors.textDark} />
          </View>
          <Text style={styles.optionText}>Choisir dans la galerie</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
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
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: 10,
    marginBottom: 14,
  },
  title: {
    fontFamily: FontFamily.headerBold,
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  option: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 16,
    color: Colors.textDark,
    flex: 1,
  },
});
