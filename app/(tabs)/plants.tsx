import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import { PLANTS } from '@/constants/data';
import AddPlantSheet from '@/components/AddPlantSheet';

export default function PlantsScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [addSheetVisible, setAddSheetVisible] = useState(false);

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      router.push({ pathname: '/add-plant/analyzing', params: { photo: result.assets[0].uri } } as any);
    }
  };

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
              Mes plantes 🪴
            </Animated.Text>
            <Text style={styles.subtitle}>{PLANTS.length} plantes suivies</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddSheetVisible(true)}>
            <Ionicons name="add" size={22} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Plant cards */}
        <View style={styles.list}>
          {PLANTS.map(plant => (
            <TouchableOpacity
              key={plant.id}
              style={styles.card}
              onPress={() => router.push(`/plant/${plant.id}` as any)}
              activeOpacity={0.88}
            >
              <View style={styles.imageWrap}>
                <Image source={{ uri: plant.image }} style={styles.image} />
                {plant.careStatus && (
                  <View style={styles.badge}>
                    <Ionicons name="heart-outline" size={14} color={Colors.orange} />
                    <Text style={styles.badgeText}>{plant.careStatus}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.favBtn}>
                  <Ionicons name="heart-outline" size={18} color={Colors.textDark} />
                </TouchableOpacity>
              </View>

              <View style={styles.nameBlock}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.species}>{plant.species}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>🌿 2 mois</Text>
                <Text style={styles.metaText}>🏠 Intérieur</Text>
                <Text style={styles.metaText}>📸 3 photos</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      <AddPlantSheet
        visible={addSheetVisible}
        onClose={() => setAddSheetVisible(false)}
        onCamera={() => router.push('/add-plant/camera' as any)}
        onGallery={handleGallery}
      />

      {/* Top fade gradient */}
      <LinearGradient
        colors={['rgba(245,247,240,0.3)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 60 },

  /* Top fade */
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 35,
    zIndex: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
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
