import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import { PLANTS } from '@/constants/data';

const CARE_TIMELINE = [
  { date: 'Aujourd\'hui', action: 'Arrosage effectué', icon: 'water', color: '#4FC3F7' },
  { date: 'Il y a 3 jours', action: 'Observation : feuilles saines', icon: 'eye', color: '#81C784' },
  { date: 'Il y a 7 jours', action: 'Arrosage effectué', icon: 'water', color: '#4FC3F7' },
  { date: 'Il y a 10 jours', action: 'Fertilisation', icon: 'flask', color: '#FFB74D' },
  { date: 'Il y a 14 jours', action: 'Arrosage effectué', icon: 'water', color: '#4FC3F7' },
];

const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1545241047-6083a3684587?w=200',
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=200',
  'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200',
];

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const plant = PLANTS.find(p => p.id === id) ?? PLANTS[0];
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

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
              <Text style={styles.meta}>
                Ajoutée il y a 2 mois · Intérieur ·{' '}
                <Text style={styles.metaPhotos} onPress={() => setGalleryOpen(true)}>
                  3 📸
                </Text>
              </Text>
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

      {/* Gallery modal */}
      <Modal visible={galleryOpen} transparent animationType="slide" onRequestClose={() => setGalleryOpen(false)}>
        <View style={styles.galleryModal}>
          <View style={styles.galleryModalHeader}>
            <Text style={styles.galleryModalTitle}>Mes photos</Text>
            <TouchableOpacity onPress={() => setGalleryOpen(false)}>
              <Ionicons name="close" size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.galleryGrid}>
            {MOCK_PHOTOS.map((uri, i) => (
              <TouchableOpacity key={i} onPress={() => { setFullscreenPhoto(uri); }} activeOpacity={0.85}>
                <Image source={{ uri }} style={styles.galleryGridThumb} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Fullscreen photo */}
      <Modal visible={!!fullscreenPhoto} transparent animationType="fade" onRequestClose={() => setFullscreenPhoto(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFullscreenPhoto(null)}>
          {fullscreenPhoto && (
            <Image source={{ uri: fullscreenPhoto }} style={styles.fullscreenImg} resizeMode="contain" />
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={() => setFullscreenPhoto(null)}>
            <Ionicons name="close" size={22} color={Colors.white} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    fontFamily: FontFamily.titleDisplay,
    fontSize: 28,
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
    marginTop: 5,
  },
  metaPhotos: {
    color: Colors.textDark,
    fontFamily: FontFamily.calendarBold,
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
    fontFamily: FontFamily.calendarBold,
    fontSize: 13,
    color: Colors.textDark,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
    fontFamily: FontFamily.calendarBold,
    fontSize: 13,
    color: Colors.textDark,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  /* Gallery modal */
  galleryModal: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  galleryModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 12,
  },
  galleryModalTitle: {
    fontFamily: FontFamily.headerBold,
    fontSize: 20,
    color: Colors.textDark,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    padding: 16,
  },
  galleryGridThumb: {
    width: (SCREEN_W - 48) / 3,
    height: (SCREEN_W - 48) / 3,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },

  /* Timeline */
  timelineTitle: {
    fontFamily: FontFamily.headerBold,
    fontSize: 18,
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
    fontFamily: FontFamily.calendarBold,
    fontSize: 14,
    color: Colors.textDark,
  },
  timelineDate: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },

  /* Fullscreen modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImg: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
