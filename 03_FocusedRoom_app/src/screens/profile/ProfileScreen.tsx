/**
 * FOCUSED ROOM - Profile Screen
 * 
 * User profile and settings.
 * 
 * @format
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <Card shadow="md" padding={theme.spacing[6]} style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SG</Text>
          </View>
          <Text style={styles.name}>Souvik Ganguly</Text>
          <Badge variant="level" size="medium">
            🎯 Flow Architect (Level 8)
          </Badge>
          
          <View style={styles.statsRow}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>1,234</Text>
              <Text style={styles.profileStatLabel}>Points</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>🔥 23</Text>
              <Text style={styles.profileStatLabel}>Day Streak</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>8.2</Text>
              <Text style={styles.profileStatLabel}>hrs/week</Text>
            </View>
          </View>
        </Card>

        {/* Personality Insights */}
        <Card shadow="sm" padding={theme.spacing[6]}>
          <Text style={styles.sectionTitle}>Your Personality Insights 🧠</Text>
          <View style={styles.personalityBox}>
            <Text style={styles.personalityText}>
              <Text style={styles.bold}>High Conscientiousness (82%)</Text>
              {'\n'}
              You thrive with structure and clear goals. Try 90-minute sessions for deep work.
            </Text>
          </View>
          <Button variant="secondary" size="small">
            View Full Report
          </Button>
        </Card>

        {/* Quick Actions */}
        <Card shadow="sm" padding={theme.spacing[6]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsList}>
            <Button variant="ghost" fullWidth style={styles.actionButton}>
              ⚙️ Settings
            </Button>
            <Button variant="ghost" fullWidth style={styles.actionButton}>
              🏆 Achievements
            </Button>
            <Button variant="ghost" fullWidth style={styles.actionButton}>
              🚫 Manage Blocked Apps
            </Button>
            <Button variant="ghost" fullWidth style={styles.actionButton}>
              📤 Export Data
            </Button>
          </View>
        </Card>

        {/* Milestones */}
        <Card shadow="sm" padding={theme.spacing[6]}>
          <Text style={styles.sectionTitle}>Recent Milestones 🎉</Text>
          <View style={styles.milestonesList}>
            <Text style={styles.milestoneItem}>• 100 sessions completed</Text>
            <Text style={styles.milestoneItem}>• 3-week streak (longest yet!)</Text>
            <Text style={styles.milestoneItem}>• Reached Level 8</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[4],
  },
  profileCard: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  avatarText: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.white,
  },
  name: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing[6],
    marginTop: theme.spacing[6],
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing[1],
  },
  profileStatLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  personalityBox: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing[4],
  },
  personalityText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  bold: {
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  actionsList: {
    gap: theme.spacing[2],
  },
  actionButton: {
    justifyContent: 'flex-start',
  },
  milestonesList: {
    gap: theme.spacing[3],
  },
  milestoneItem: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
});

