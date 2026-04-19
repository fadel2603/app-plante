import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { PLANTS } from '@/constants/data';

const CARE_TIMELINE = [
  { date: 'Aujourd\'hui', action: 'Arrosage effectué', icon: 'water', color: '#4FC3F7' },
  { date: 'Il y a 3 jours', action: 'Observation : feuilles saines', icon: 'eye', color: '#81C784' },
  { date: 'Il y a 7 jours', action: 'Arrosage effectué', icon: 'water', color: '#4FC3F7' },
  { date: 'Il y a 10 jours', action: 'Fertilisation', icon: 'flask', color: '#FFB74D' },
  { date: 'Il y a 14 jours', action: 'Arrosage effectué', icon: 'water', color: '#4FC3F7' },
];

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const plant = PLANTS.find(p => p.id === id) ?? PLANTS[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: plant.image }} style={styles.hero} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={Colors.textDark} />
          </TouchableOpacity>
          {plant.careStatus && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{plant.careStatus}</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Plant info */}
          <View style={styles.infoRow}>
            <View style={styles.infoMain}>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.species}>{plant.species}</Text>
            </View>
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => router.push('/scan-result' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="scan" size={18} color={Colors.textDark} />
              <Text style={styles.scanBtnText}>Scanner</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="water" size={20} color="#4FC3F7" />
              <Text style={styles.statValue}>{plant.waterFrequency}</Text>
              <Text style={styles.statLabel}>Arrosage</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={20} color={Colors.orange} />
              <Text style={styles.statValue}>{plant.lastWatered}</Text>
              <Text style={styles.statLabel}>Dernier soin</Text>
            </View>
          </View>

          {/* Timeline */}
          <Text style={styles.timelineTitle}>Historique des soins</Text>
          {CARE_TIMELINE.map((item, i) => (
            <View key={i} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, { backgroundColor: item.color + '33' }]}>
                  <Ionicons name={item.icon as any} size={14} color={item.color} />
                </View>
                {i < CARE_TIMELINE.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineAction}>{item.action}</Text>
                <Text style={styles.timelineDate}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  heroWrapper: {
    position: 'relative',
  },
  hero: {
    width: '100%',
    height: 320,
    backgroundColor: Colors.border,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  body: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  infoMain: { flex: 1 },
  plantName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textDark,
  },
  species: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  scanBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textDark,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
    minHeight: 20,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineAction: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  timelineDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
