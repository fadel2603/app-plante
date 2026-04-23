import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Text as SvgText } from 'react-native-svg';
import { FontFamily } from '@/constants/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');
const DISMISS_THRESHOLD = 80;
const GLOW_DURATION = 2400;
const GLOW_STAGGER = 600;

type Mode = 'voice' | 'keyboard' | 'camera' | 'photo';
type Props = { visible: boolean; onClose: () => void };

// ── Gradient title via SVG ──────────────────────────────────────────────────
function GradientTitle() {
  const w = SCREEN_W - 64;
  const fontSize = 36;
  const lineH = fontSize * 1.22;
  const totalH = lineH * 2 + 4;
  return (
    <Svg width={w} height={totalH} style={{ overflow: 'visible' }}>
      <Defs>
        <SvgGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%"   stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="35%"  stopColor="#CCCCCC" stopOpacity="1" />
          <Stop offset="65%"  stopColor="#CCCCCC" stopOpacity="1" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </SvgGradient>
      </Defs>
      <SvgText x={w / 2} y={lineH} textAnchor="middle"
        fill="url(#shimmer)" fontSize={fontSize} fontFamily="GasoekOne_400Regular">
        Comment puis-je
      </SvgText>
      <SvgText x={w / 2} y={lineH * 2 + 4} textAnchor="middle"
        fill="url(#shimmer)" fontSize={fontSize} fontFamily="GasoekOne_400Regular">
        {`t\u2019aider\u00A0?`}
      </SvgText>
    </Svg>
  );
}

// ── One animated bottom-glow wave layer ────────────────────────────────────
// Each layer is a gradient anchored at the bottom at a different height;
// opacity pulses in/out to simulate a wave propagating upward.
function GlowLayer({
  opacity,
  layerHeight,
  peakColor,
}: {
  opacity: Animated.Value;
  layerHeight: number;
  peakColor: string;
}) {
  return (
    <Animated.View
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: layerHeight, opacity }}
      pointerEvents="none"
    >
      <LinearGradient
        colors={['transparent', peakColor]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

export default function AISheet({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();

  // Sheet slide-up
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Bottom-glow wave layers (4 staggered pulses)
  const glow0 = useRef(new Animated.Value(0)).current;
  const glow1 = useRef(new Animated.Value(0)).current;
  const glow2 = useRef(new Animated.Value(0)).current;
  const glow3 = useRef(new Animated.Value(0)).current;
  const glows = [glow0, glow1, glow2, glow3];

  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<Mode>('voice');
  const [input, setInput] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Slide-in on open
  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_H);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 26,
          stiffness: 220,
          mass: 1,
        }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  // Bottom glow pulse — only animates in voice mode
  useEffect(() => {
    const loops: Animated.CompositeAnimation[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (mode === 'voice') {
      glows.forEach((g, i) => {
        g.setValue(0);
        const t = setTimeout(() => {
          const loop = Animated.loop(
            Animated.sequence([
              Animated.timing(g, {
                toValue: 1,
                duration: GLOW_DURATION * 0.55,
                useNativeDriver: true,
              }),
              Animated.timing(g, {
                toValue: 0,
                duration: GLOW_DURATION * 0.45,
                useNativeDriver: true,
              }),
            ])
          );
          loops.push(loop);
          loop.start();
        }, i * GLOW_STAGGER);
        timers.push(t);
      });
    }

    return () => {
      timers.forEach(clearTimeout);
      loops.forEach(l => l.stop());
    };
  }, [mode]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: SCREEN_H, duration: 340, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start(() => {
      setMode('voice');
      setInput('');
      setPhotoUri(null);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => { if (g.dy > 0) translateY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) dismiss();
        else Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 26, stiffness: 220 }).start();
      },
    })
  ).current;

  const handleCameraPress = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setMode('camera');
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        setPhotoUri(photo.uri);
        setMode('photo');
      }
    } catch {}
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={dismiss} statusBarTranslucent>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} pointerEvents="none" />

      <Animated.View style={[styles.root, { transform: [{ translateY }] }]}>
        {/* Pure black base */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />

        {/* Base static glow (always visible) */}
        <View style={styles.baseGlow} pointerEvents="none">
          <LinearGradient
            colors={['transparent', 'rgba(181,241,91,0.06)', 'rgba(181,241,91,0.18)']}
            locations={[0, 0.55, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Animated pulse wave layers — staggered, different heights */}
        <GlowLayer opacity={glow0} layerHeight={SCREEN_H * 0.38} peakColor="rgba(181,241,91,0.32)" />
        <GlowLayer opacity={glow1} layerHeight={SCREEN_H * 0.50} peakColor="rgba(181,241,91,0.24)" />
        <GlowLayer opacity={glow2} layerHeight={SCREEN_H * 0.62} peakColor="rgba(181,241,91,0.18)" />
        <GlowLayer opacity={glow3} layerHeight={SCREEN_H * 0.72} peakColor="rgba(181,241,91,0.12)" />

        {/* ── CAMERA STATE ── */}
        {mode === 'camera' && (
          <View style={StyleSheet.absoluteFill}>
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
            <TouchableOpacity
              style={[styles.closeBtn, { top: insets.top + 12 }]}
              onPress={() => setMode('voice')}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
            <View style={[styles.cameraBottom, { paddingBottom: insets.bottom + 36 }]}>
              <TouchableOpacity onPress={handleCapture} activeOpacity={0.85}>
                <View style={styles.captureBtnRing}>
                  <View style={styles.captureBtnCore} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── VOICE / KEYBOARD / PHOTO STATES ── */}
        {mode !== 'camera' && (
          <>
            {/* Photo background */}
            {mode === 'photo' && photoUri && (
              <>
                <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <View style={[StyleSheet.absoluteFill, styles.photoDim]} />
              </>
            )}

            {/* Drag handle */}
            <View {...panResponder.panHandlers} style={styles.dragZone}>
              <View style={styles.handle} />
            </View>

            {/* Close */}
            <TouchableOpacity
              style={[styles.closeBtn, { top: insets.top + 8 }]}
              onPress={dismiss}
              activeOpacity={0.75}
            >
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.kav}
            >
              {/* ── WELCOME TEXT (replaces orb) ── */}
              <View style={styles.heroArea}>
                <Text style={styles.greeting}>
                  {mode === 'photo' ? 'À propos de cette plante' : 'Bonjour Fadel'}
                </Text>
                <GradientTitle />
              </View>

              {/* Status text */}
              <Text style={styles.statusText}>
                {mode === 'voice'
                  ? 'Vous pouvez commencer à parler'
                  : mode === 'photo'
                  ? 'Posez votre question ci-dessous'
                  : ''}
              </Text>

              {/* Text input — keyboard + photo modes */}
              {(mode === 'keyboard' || mode === 'photo') && (
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.inputField}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Une question ?"
                    placeholderTextColor="rgba(255,255,255,0.38)"
                    multiline
                    autoFocus={mode === 'keyboard'}
                    selectionColor="#B5F15B"
                  />
                  {input.trim() ? (
                    <TouchableOpacity style={styles.sendBtn} activeOpacity={0.8}>
                      <Ionicons name="arrow-up" size={16} color="#000" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}

              {/* Bottom action buttons */}
              <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 28 }]}>
                <TouchableOpacity
                  style={[styles.actionBtn, mode === 'keyboard' && styles.actionBtnActive]}
                  onPress={() => setMode(mode === 'keyboard' ? 'voice' : 'keyboard')}
                  activeOpacity={0.75}
                >
                  {/* QWERTY laptop-style keyboard icon */}
                  <Ionicons name="keyboard-outline" size={26} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, mode === 'photo' && styles.actionBtnActive]}
                  onPress={handleCameraPress}
                  activeOpacity={0.75}
                >
                  <Ionicons name="camera-outline" size={26} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  root: {
    position: 'absolute',
    inset: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },

  /* Base glow (always on) */
  baseGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_H * 0.45,
  },

  /* Drag handle */
  dragZone: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },

  /* Close button */
  closeBtn: {
    position: 'absolute',
    left: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  kav: { flex: 1 },

  /* Hero text area (replaces orb) */
  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  greeting: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 17,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },

  /* Status text — more prominent */
  statusText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 18,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },

  /* Text input */
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(181,241,91,0.10)',
    borderRadius: 100,
    paddingLeft: 22,
    paddingRight: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(181,241,91,0.22)',
  },
  inputField: {
    flex: 1,
    fontFamily: FontFamily.calendarMedium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    maxHeight: 80,
    paddingTop: 0,
    paddingRight: 8,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#B5F15B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Bottom action buttons — 72px */
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 8,
  },
  actionBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnActive: {
    backgroundColor: 'rgba(181,241,91,0.18)',
    borderColor: 'rgba(181,241,91,0.4)',
  },

  /* Photo dim */
  photoDim: {
    backgroundColor: 'rgba(0,0,0,0.52)',
  },

  /* Camera */
  cameraBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureBtnRing: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 3,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnCore: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ffffff',
  },
});
