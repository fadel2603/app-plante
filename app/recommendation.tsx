import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const STEPS = [
  {
    step: 1,
    title: 'Isoler la plante',
    desc: 'Éloigne le Monstera des autres plantes pour éviter la propagation du champignon.',
    icon: 'shield-checkmark',
  },
  {
    step: 2,
    title: 'Retirer les feuilles atteintes',
    desc: 'Coupe les 3 feuilles présentant des taches blanches avec des ciseaux désinfectés.',
    icon: 'cut',
  },
  {
    step: 3,
    title: 'Appliquer du bicarbonate',
    desc: 'Pulvérise un mélange d\'1 c.à.s. de bicarbonate de soude dans 1L d\'eau sur toutes les feuilles.',
    icon: 'flask',
  },
  {
    step: 4,
    title: 'Traitement fongicide',
    desc: 'Si les symptômes persistent après 7 jours, applique un fongicide à base de soufre.',
    icon: 'medical',
  },
  {
    step: 5,
    title: 'Prévention',
    desc: 'Améliore la circulation d\'air autour de la plante et évite d\'arroser le feuillage.',
    icon: 'sunny',
  },
];

export default function RecommendationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Handle */}
      <View style={styles.handle} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={14} color={Colors.textDark} />
            <Text style={styles.aiBadgeText}>Recommandation IA</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Traitement Oïdium</Text>
        <Text style={styles.subtitle}>
          Plan de traitement personnalisé pour ton Monstera deliciosa
        </Text>

        {/* Urgency */}
        <View style={styles.urgencyCard}>
          <Ionicons name="time" size={18} color={Colors.orange} />
          <Text style={styles.urgencyText}>Traitement à commencer dans les 48h</Text>
        </View>

        {/* Steps */}
        <Text style={styles.stepsTitle}>Plan de traitement</Text>
        {STEPS.map((item, i) => (
          <View key={i} style={styles.stepCard}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{item.step}</Text>
            </View>
            <View style={styles.stepIconWrap}>
              <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        {/* CTA */}
        <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.textDark} />
          <Text style={styles.doneBtnText}>Marquer comme lu</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Recommandations générées par IA. Consultez un botaniste en cas de doute.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    flex: 1,
    alignSelf: 'flex-start',
    flexGrow: 0,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textDark,
  },
  closeBtn: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  urgencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.orange + '18',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.orange,
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  stepsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 12,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textDark,
  },
  stepIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: { flex: 1 },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 19,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 12,
    marginBottom: 8,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
