import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function ScanResultScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Camera preview zone */}
      <View style={styles.cameraZone}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600' }}
          style={styles.preview}
        />
        {/* Scan frame overlay */}
        <View style={styles.frameOverlay}>
          <View style={styles.corner} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.scanLabel}>
          <View style={styles.scanDot} />
          <Text style={styles.scanLabelText}>Analyse en cours…</Text>
        </View>
      </View>

      {/* Result card */}
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={styles.warningIcon}>
            <Ionicons name="warning" size={22} color={Colors.orange} />
          </View>
          <View style={styles.resultHeaderText}>
            <Text style={styles.resultTitle}>Anomalie détectée</Text>
            <Text style={styles.resultSubtitle}>Monstera deliciosa</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>94%</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.anomalyName}>Oïdium (mildiou blanc)</Text>
        <Text style={styles.anomalyDesc}>
          Champignon détecté sur 3 feuilles. Des taches blanches poudreuses sont visibles. Traitement recommandé dès que possible.
        </Text>

        <View style={styles.affectedRow}>
          <Ionicons name="leaf" size={14} color={Colors.textMuted} />
          <Text style={styles.affectedText}>3 feuilles affectées</Text>
          <View style={styles.severityBadge}>
            <Text style={styles.severityText}>Modéré</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/recommendation' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={18} color={Colors.textDark} />
          <Text style={styles.ctaBtnText}>Voir la recommandation IA</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textDark} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  cameraZone: {
    flex: 1,
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  frameOverlay: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    width: '70%',
    height: '50%',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.primary,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRadius: 4,
    top: 0,
    left: 0,
  },
  cornerTR: {
    top: 0,
    left: undefined,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  cornerBL: {
    top: undefined,
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  cornerBR: {
    top: undefined,
    bottom: 0,
    left: undefined,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabel: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  scanLabelText: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 32,
    gap: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.orange + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultHeaderText: { flex: 1 },
  resultTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textDark,
  },
  resultSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  confidenceBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  anomalyName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
  },
  anomalyDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 21,
  },
  affectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  affectedText: {
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
  },
  severityBadge: {
    backgroundColor: Colors.orange + '22',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.orange,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 4,
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
    flex: 1,
  },
});
