import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import { Task, PLANTS } from '@/constants/data';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
};

export default function TaskItem({ task, onToggle }: Props) {
  const plant = PLANTS.find(p => p.id === task.plantId);

  return (
    <TouchableOpacity
      style={[styles.row, task.done && styles.rowDone]}
      onPress={() => onToggle(task.id)}
      activeOpacity={0.75}
    >
      {/* Photo plante — 60×60 arrondie */}
      <View style={styles.photoWrap}>
        {plant?.image ? (
          <Image source={{ uri: plant.image }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoFallback]}>
            <Ionicons name="leaf" size={22} color={Colors.textMuted} />
          </View>
        )}
      </View>

      {/* Nom + heure */}
      <View style={styles.info}>
        <Text style={[styles.plantName, task.done && styles.textDone]} numberOfLines={1}>
          {task.plantName}
        </Text>
        {task.time && (
          <Text style={[styles.time, task.done && styles.textDone]}>
            {task.time}
          </Text>
        )}
      </View>

      {/* Checkbox ronde — Figma: 35×35, border 1.8px #123601 */}
      <TouchableOpacity
        style={[styles.checkbox, task.done && styles.checkboxDone]}
        onPress={() => onToggle(task.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {task.done && (
          <Ionicons name="checkmark" size={16} color={Colors.textDark} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#2B2B2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  rowDone: { opacity: 0.55 },

  photoWrap: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  photo: {
    width: 60,
    height: 60,
  },
  photoFallback: {
    backgroundColor: Colors.sectionBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: { flex: 1 },
  plantName: {
    fontFamily: FontFamily.nameSemiBold,
    fontSize: 16,
    color: Colors.textDark,
    lineHeight: 22,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  time: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },

  checkbox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.8,
    borderColor: Colors.textDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  checkboxDone: {
    backgroundColor: Colors.checkDoneBg,  // #DBFFA5
  },
});
