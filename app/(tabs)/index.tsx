import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import CalendarStrip from '@/components/CalendarStrip';
import TaskItem from '@/components/TaskItem';
import { TODAY_TASKS, Task } from '@/constants/data';

type GroupConfig = {
  type: Task['type'];
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
};

const GROUPS: GroupConfig[] = [
  {
    type: 'water',
    label: 'Arroser',
    iconName: 'water',
    iconColor: '#2196F3',
    iconBg: Colors.waterIconBg,   // #ACE2F2
  },
  {
    type: 'observe',
    label: 'Observer',
    iconName: 'eye',
    iconColor: '#2E7D32',
    iconBg: '#C8E6C9',            // vert clair
  },
];

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(TODAY_TASKS);

  const toggle = (id: string) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

  const doneCnt = tasks.filter(t => t.done).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.subtitle}>Tes plantes t'attendent</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textDark} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ── CALENDRIER dans card blanche ── */}
        <View style={styles.calendarCard}>
          <CalendarStrip />
        </View>

        {/* ── TÂCHES DU JOUR ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>{doneCnt}/{tasks.length} fait</Text>
          </View>
        </View>

        {/* Barre de progression */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${tasks.length ? (doneCnt / tasks.length) * 100 : 0}%` },
            ]}
          />
        </View>

        {/* ── GROUPES ── */}
        <View style={styles.groups}>
          {GROUPS.map(group => {
            const groupTasks = tasks.filter(t => t.type === group.type);
            if (!groupTasks.length) return null;
            return (
              <View key={group.type} style={styles.group}>
                {/* En-tête de groupe */}
                <View style={styles.groupHeader}>
                  <View style={[styles.groupIcon, { backgroundColor: group.iconBg }]}>
                    <Ionicons name={group.iconName} size={17} color={group.iconColor} />
                  </View>
                  <Text style={styles.groupLabel}>{group.label}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{groupTasks.length}</Text>
                  </View>
                </View>
                {/* Cards tâches */}
                <View style={styles.taskList}>
                  {groupTasks.map(t => (
                    <TaskItem key={t.id} task={t} onToggle={toggle} />
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,  // #F5F7F0
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: FontFamily.headerBold,
    fontSize: 28,
    color: Colors.textDark,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },

  /* Calendrier card blanche */
  calendarCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  /* Titre section */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: FontFamily.headerBold,
    fontSize: 20,
    color: Colors.textDark,
  },
  progressPill: {
    backgroundColor: Colors.primary + '40',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  progressText: {
    fontFamily: FontFamily.calendarBold,
    fontSize: 12,
    color: Colors.textDark,
  },

  /* Barre progression */
  progressBar: {
    height: 5,
    backgroundColor: Colors.white,
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },

  /* Groupes */
  groups: { gap: 16 },

  group: {
    backgroundColor: '#E8EDE4',
    borderRadius: 20,
    padding: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  groupIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,          // cercle
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupLabel: {
    fontFamily: FontFamily.nameSemiBold,
    fontSize: 16,
    color: Colors.textDark,
    flex: 1,
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontFamily: FontFamily.calendarBold,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  taskList: { gap: 8 },
});
