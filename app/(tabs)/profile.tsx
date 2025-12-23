import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const { colors, toggleTheme, theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Ionicons name="person" size={28} color="#FFFFFF" />
        </View>
        <View>
          <Text style={[styles.name, { color: colors.text }]}>Guest User</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your account</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: colors.card }]}
          onPress={toggleTheme}
          activeOpacity={0.8}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.background }]}>
              <Ionicons name={theme === 'light' ? 'moon' : 'sunny'} size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Theme</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {theme === 'light' ? 'Light mode' : 'Dark mode'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
        <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.background }]}>
              <Ionicons name="notifications" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                Order updates and promotions
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.background }]}>
              <Ionicons name="help-circle" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Support</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                Get help with your order
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingRow: {
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
