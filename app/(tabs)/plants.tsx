import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import { PLANTS } from '@/constants/data';

export default function PlantsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — Figma: "Mes plantes 🪴" Gabarito SemiBold 29px */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Mes plantes 🪴</Text>
            <Text style={styles.subtitle}>{PLANTS.length} plantes suivies</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={22} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Plant cards — Figma: bg white, border #ececec, rounded-24, shadow 4 4 28 4 rgba(0,0,0,0.07) */}
        <View style={styles.list}>
          {PLANTS.map(plant => (
            <TouchableOpacity
              key={plant.id}
              style={styles.card}
              onPress={() => router.push(`/plant/${plant.id}` as any)}
              activeOpacity={0.88}
            >
              {/* Hero image — Figma: 250px height, rounded-20 */}
              <View style={styles.imageWrap}>
                <Image source={{ uri: plant.image }} style={styles.image} />
                {/* Badge "Soin en cours" — Figma: bg #F8EACF, text #EB7C05, Satoshi Medium 16px */}
                {plant.careStatus && (
                  <View style={styles.badge}>
                    <Ionicons name="heart-outline" size={14} color={Colors.orange} />
                    <Text style={styles.badgeText}>{plant.careStatus}</Text>
                  </View>
                )}
                {/* Favourite button — Figma: 36×36 circle top right */}
                <TouchableOpacity style={styles.favBtn}>
                  <Ionicons name="heart-outline" size={18} color={Colors.textDark} />
                </TouchableOpacity>
              </View>

              {/* Name + species — centered, Figma: y=266, centered in card */}
              <View style={styles.nameBlock}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.species}>{plant.species}</Text>
              </View>

              {/* Meta row — Figma: 3 text items with emoji */}
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>🌿 2 mois</Text>
                <Text style={styles.metaText}>🏠 Intérieur</Text>
                <Text style={styles.metaText}>📸 3 photos</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  // Figma: Gabarito SemiBold ~32px for screen title
  title: {
    fontFamily: FontFamily.titleDisplay,
    fontSize: 32,
    color: Colors.textDark,
  },
  subtitle: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 4,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: { gap: 16 },

  // Figma: bg white, border #ececec, rounded-24, shadow 4 4 28 4 rgba(0,0,0,0.07), padding 8
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 28,
    elevation: 4,
    gap: 16,
  },
  // Figma: image 250px height, rounded-20
  imageWrap: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.sectionBg,
    borderRadius: 20,
  },
  // Figma: badge bg #F8EACF, text #EB7C05, rounded-8, top-left
  badge: {
    position: 'absolute',
    top: 13,
    left: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.orangeBg,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: FontFamily.labelMedium,
    fontSize: 14,
    color: Colors.orange,
  },
  // Figma: favourite button top-right, bg #A6A7A7, rounded-full, 36×36
  favBtn: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(166,167,167,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Figma: centered, Gabarito SemiBold 29px + Urbanist Italic 16px
  nameBlock: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  plantName: {
    fontFamily: FontFamily.nameSemiBold,
    fontSize: 29,
    color: Colors.textDark,
    textAlign: 'center',
  },
  species: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 16,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
  },
  // Figma: 3 meta texts centered, gap ~89px, Urbanist 19px
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  metaText: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
