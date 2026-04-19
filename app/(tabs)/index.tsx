import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import CalendarStrip from '@/components/CalendarStrip';
import TaskItem from '@/components/TaskItem';
import PlantPreviewSheet from '@/components/PlantPreviewSheet';
import { TASKS_BY_DAY, Task, PLANTS } from '@/constants/data';

const SCREEN_W = Dimensions.get('window').width;
const SLIDE_DIST = SCREEN_W * 0.35;
const ANIM_DURATION = 250;

type GroupConfig = {
  type: Task['type'];
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
};

const GROUPS: GroupConfig[] = [
  { type: 'water',   label: 'Arroser',  iconName: 'water', iconColor: '#2196F3', iconBg: Colors.waterIconBg },
  { type: 'observe', label: 'Observer', iconName: 'eye',   iconColor: '#2E7D32', iconBg: '#C8E6C9' },
];

function getTasksForDate(date: Date): Task[] {
  const day = date.getDay();
  return (TASKS_BY_DAY[day] ?? []).map(t => ({ ...t }));
}

export default function HomeScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [tasks, setTasks] = useState<Task[]>(getTasksForDate(today));

  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const previewPlant = previewTask ? PLANTS.find(p => p.id === previewTask.plantId) ?? null : null;

  const scrollY      = useRef(new Animated.Value(0)).current;
  const translateX   = useRef(new Animated.Value(0)).current;
  const opacity      = useRef(new Animated.Value(1)).current;
  const todayBtnOpacity = useRef(new Animated.Value(0)).current;

  const toggle = (id: string) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

  const doneCnt = tasks.filter(t => t.done).length;

  const handleDateChange = (newDate: Date, skipAnim?: boolean) => {
    const isToday = isSameDay(newDate, today);
    Animated.timing(todayBtnOpacity, {
      toValue: isToday ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const direction = newDate > selectedDate ? 1 : -1; // 1=future/right, -1=past/left

    // Animate out current content
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIM_DURATION / 2,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(translateX, {
        toValue: -direction * SLIDE_DIST * 0.4,
        duration: ANIM_DURATION / 2,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start(() => {
      // Swap content while invisible
      setSelectedDate(newDate);
      setTasks(getTasksForDate(newDate));
      translateX.setValue(direction * SLIDE_DIST);

      // Animate in new content
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start();
    });
  };

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const sectionLabel = isSameDay(selectedDate, today)
    ? 'Aujourd\'hui'
    : selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });

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
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Animated.Text style={[styles.greeting, { opacity: titleOpacity }]}>
              Bonjour 👋
            </Animated.Text>
            <Text style={styles.subtitle}>Tes plantes t'attendent</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textDark} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ── CALENDRIER ── */}
        <View style={styles.calendarCard}>
          <Animated.View style={[styles.todayBtn, { opacity: todayBtnOpacity }]} pointerEvents={isSameDay(selectedDate, today) ? 'none' : 'auto'}>
            <TouchableOpacity onPress={() => handleDateChange(new Date())} activeOpacity={0.7}>
              <Text style={styles.todayBtnText}>Aujourd'hui</Text>
            </TouchableOpacity>
          </Animated.View>
          <CalendarStrip onDateChange={handleDateChange} value={selectedDate} />
        </View>

        {/* ── BLOC TÂCHES ANIMÉ ── */}
        <Animated.View style={{ opacity, transform: [{ translateX }] }}>
          {/* Section header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{sectionLabel}</Text>
            {tasks.length > 0 && (
              <View style={styles.progressPill}>
                <Text style={styles.progressText}>{doneCnt}/{tasks.length} fait</Text>
              </View>
            )}
          </View>

          {/* Barre de progression */}
          {tasks.length > 0 && (
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(doneCnt / tasks.length) * 100}%` },
                ]}
              />
            </View>
          )}

          {/* Groupes */}
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucune tâche ce jour 🌿</Text>
            </View>
          ) : (
            <View style={styles.groups}>
              {GROUPS.map(group => {
                const groupTasks = tasks.filter(t => t.type === group.type);
                if (!groupTasks.length) return null;
                return (
                  <View key={group.type} style={styles.group}>
                    <View style={styles.groupHeader}>
                      <View style={[styles.groupIcon, { backgroundColor: group.iconBg }]}>
                        <Ionicons name={group.iconName} size={17} color={group.iconColor} />
                      </View>
                      <Text style={styles.groupLabel}>{group.label}</Text>
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{groupTasks.length}</Text>
                      </View>
                    </View>
                    <View style={styles.taskList}>
                      {groupTasks.map(t => (
                        <TaskItem
                          key={t.id}
                          task={t}
                          onToggle={toggle}
                          onPhotoPress={setPreviewTask}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </Animated.View>

        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      <PlantPreviewSheet
        plant={previewPlant}
        taskType={previewTask?.type}
        onClose={() => setPreviewTask(null)}
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
  content: { paddingHorizontal: 20, paddingTop: 60 },

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
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: FontFamily.titleDisplay,
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
  todayBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1,
    backgroundColor: '#E8F5E0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  todayBtnText: {
    fontFamily: FontFamily.calendarMedium,
    fontSize: 12,
    color: Colors.textDark,
  },

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
    borderRadius: 17,
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

  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 15,
    color: Colors.textMuted,
  },
});
