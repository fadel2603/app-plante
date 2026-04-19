import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

type Route = {
  name: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconFocused: React.ComponentProps<typeof Ionicons>['name'];
};

const NAV_ROUTES: Route[] = [
  { name: 'index',  label: 'Accueil', icon: 'home-outline', iconFocused: 'home' },
  { name: 'plants', label: 'Plantes', icon: 'leaf-outline',  iconFocused: 'leaf' },
];

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 28,
  elevation: 14,
} as const;

const PILL_W    = 180;
const PILL_H    = 60;
const SCAN_SIZE = 60;
const RADIUS    = 100;
const BORDER    = 'rgba(255,255,255,1)';

export default function LiquidGlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const active = state.routes[state.index]?.name;
  const go = (name: string) => navigation.navigate(name);

  return (
    <View
      style={[styles.root, { bottom: insets.bottom + 16 }]}
      pointerEvents="box-none"
    >
      {/* ── PILL GAUCHE ── */}
      <View style={[styles.pillShadow, SHADOW]}>
        <View style={styles.pillClip}>
          <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.glassFill]} />
          <View style={styles.pillInner}>
            {NAV_ROUTES.map(route => {
              const focused = active === route.name;
              return (
                <TouchableOpacity
                  key={route.name}
                  onPress={() => go(route.name)}
                  activeOpacity={0.7}
                  style={styles.tabTouch}
                >
                  <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                    <Ionicons
                      name={focused ? route.iconFocused : route.icon}
                      size={22}
                      color={focused ? '#000000' : '#999999'}
                    />
                    <Text style={focused ? styles.labelActive : styles.labelInactive}>
                      {route.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* ── BOUTON SCAN DROIT ── */}
      <View style={[styles.scanShadow, SHADOW]}>
        <View style={styles.scanClip}>
          <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.glassFill]} />
          <TouchableOpacity
            onPress={() => go('scanner')}
            style={[styles.scanBtn, active === 'scanner' && styles.scanBtnActive]}
            activeOpacity={0.7}
          >
            <Ionicons name="scan" size={24} color={Colors.textDark} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 999,
  },

  /* ── Pill gauche ── */
  pillShadow: {
    width: PILL_W,
    height: PILL_H,
    borderRadius: RADIUS,
  },
  pillClip: {
    width: PILL_W,
    height: PILL_H,
    borderRadius: RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  glassFill: {
    backgroundColor: Platform.OS === 'ios'
      ? 'rgba(255,255,255,0.80)'
      : 'rgba(255,255,255,0.96)',
  },
  pillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: PILL_W,
    height: PILL_H,
    padding: 4,
    gap: 0,
  },
  tabTouch: {
    flex: 1,
    height: '100%',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    gap: 3,
  },
  tabItemActive: {
    backgroundColor: Colors.primary,  // #B5F15B
  },
  labelActive: {
    fontFamily: FontFamily.calendarBold,
    fontSize: 10,
    color: '#000000',
  },
  labelInactive: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 10,
    color: '#999999',
  },

  /* ── Bouton scan ── */
  scanShadow: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: RADIUS,
  },
  scanClip: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  scanBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnActive: {
    backgroundColor: Colors.primary,
  },
});
