import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

export default function ScannerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name="scan" size={64} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Scanner une plante</Text>
        <Text style={styles.desc}>
          Prends une photo de ta plante pour détecter les maladies et recevoir des recommandations IA
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/scan-result' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={20} color={Colors.textDark} />
          <Text style={styles.btnText}>Ouvrir la caméra</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textDark,
    textAlign: 'center',
  },
  desc: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
  },
});
