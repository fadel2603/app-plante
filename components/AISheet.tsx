import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  PanResponder,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.9;
const DISMISS_THRESHOLD = 80;

type Message = { id: string; role: 'user' | 'ai'; text: string };

const ACTIONS = [
  { icon: 'camera' as const, label: 'Scanner' },
  { icon: 'mic' as const, label: 'Vocal' },
  { icon: 'images' as const, label: 'Galerie' },
];

type Props = { visible: boolean; onClose: () => void };

export default function AISheet({ visible, onClose }: Props) {
  const translateY = useRef(new Animated.Value(SHEET_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const orbRot = useRef(new Animated.Value(0)).current;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(orbRot, { toValue: 1, duration: 15000, useNativeDriver: true })
    ).start();
  }, []);

  useEffect(() => {
    if (visible) {
      translateY.setValue(SHEET_H);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 180 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (!isTyping) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0.3, duration: 280, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0.3, duration: 280, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0.3, duration: 280, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isTyping]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: SHEET_H, duration: 300, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => { if (g.dy > 0) translateY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) dismiss();
        else Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }).start();
      },
    })
  ).current;

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: 'Je vais analyser ça pour vous. Pouvez-vous me donner plus de détails sur votre plante ?',
      }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1000 + Math.random() * 700);
  };

  const orbRotDeg = orbRot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const isEmpty = messages.length === 0;

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={dismiss}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={dismiss} activeOpacity={1} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kavWrapper}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {/* Background gradient: black top → blue bottom */}
          <LinearGradient
            colors={['#000000', '#000000', '#0a1a3d', '#1a3a6b', '#2563eb', '#3b82f6']}
            locations={[0, 0.35, 0.52, 0.68, 0.84, 1]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          {/* Handle + close */}
          <View {...panResponder.panHandlers} style={styles.dragZone}>
            <View style={styles.handle} />
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={dismiss}>
            <Ionicons name="close" size={17} color="rgba(255,255,255,0.45)" />
          </TouchableOpacity>

          {/* ── WELCOME ── */}
          {isEmpty && (
            <View style={styles.welcomeArea}>
              {/* Orb */}
              <View style={styles.siriOrb}>
                <Animated.View style={[styles.siriGrad, { transform: [{ rotate: orbRotDeg }] }]}>
                  <LinearGradient
                    colors={['#60a5fa', '#2563eb', '#000000', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
                <View style={styles.siriOverlay}>
                  <Sparkles size={22} color="#fff" strokeWidth={1.5} />
                </View>
              </View>

              <Text style={styles.welcomeTitle}>Comment puis-je{'\n'}t'aider ?</Text>
              <Text style={styles.welcomeSub}>Pose n'importe quelle question{'\n'}sur tes plantes</Text>

              <View style={styles.actionsRow}>
                {ACTIONS.map(a => (
                  <TouchableOpacity key={a.label} style={styles.actionBtn} activeOpacity={0.7}>
                    <Ionicons name={a.icon} size={20} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.actionLabel}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ── CHAT ── */}
          {!isEmpty && (
            <ScrollView
              ref={scrollRef}
              style={styles.messages}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(msg => (
                <View key={msg.id} style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
                  {msg.role === 'ai' && (
                    <View style={styles.aiDot}>
                      <Sparkles size={10} color="#60a5fa" strokeWidth={2} />
                    </View>
                  )}
                  <Text style={[styles.bubbleText, msg.role === 'user' && styles.bubbleTextUser]}>
                    {msg.text}
                  </Text>
                </View>
              ))}
              {isTyping && (
                <View style={[styles.bubble, styles.bubbleAI]}>
                  <View style={styles.aiDot}>
                    <Sparkles size={10} color="#60a5fa" strokeWidth={2} />
                  </View>
                  <View style={styles.typingDots}>
                    {[dot1, dot2, dot3].map((d, i) => (
                      <Animated.View key={i} style={[styles.dot, { opacity: d }]} />
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          )}

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Pose ta question..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              selectionColor="#3b82f6"
            />
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="mic" size={20} color="rgba(255,255,255,0.35)" />
            </TouchableOpacity>
            {input.trim() ? (
              <TouchableOpacity style={styles.sendBtn} onPress={() => send(input)} activeOpacity={0.8}>
                <Ionicons name="arrow-up" size={15} color="#fff" />
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  kavWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  sheet: {
    height: SHEET_H,
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    overflow: 'hidden',
  },

  dragZone: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: 16, right: 20,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },

  /* Welcome */
  welcomeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  siriOrb: {
    width: 90, height: 90, borderRadius: 45,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 10,
  },
  siriGrad: {
    position: 'absolute',
    width: 140, height: 140,
    top: -25, left: -25,
  },
  siriOverlay: {
    position: 'absolute',
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(0,0,20,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  welcomeTitle: {
    fontFamily: FontFamily.titleDisplay,
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 8,
  },
  welcomeSub: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 46,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
  },
  actionLabel: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },

  /* Chat */
  messages: { flex: 1, paddingHorizontal: 16 },
  messagesContent: { gap: 10, paddingVertical: 16 },
  bubble: {
    maxWidth: '85%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 6,
  },
  bubbleAI: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    borderBottomLeftRadius: 6,
  },
  aiDot: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: 'rgba(96,165,250,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1, flexShrink: 0,
  },
  bubbleText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.88)',
    flex: 1, lineHeight: 20,
  },
  bubbleTextUser: { color: '#ffffff' },
  typingDots: { flexDirection: 'row', gap: 5, alignItems: 'center', height: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },

  /* Input */
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 14,
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.calendarMedium,
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    maxHeight: 80,
    paddingTop: 0,
  },
  sendBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#2563eb',
    alignItems: 'center', justifyContent: 'center',
  },
});
