/**
 * FOCUSED ROOM - Reports Screen
 * 
 * Analytics and insights.
 * 
 * @format
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export default function ReportsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card shadow="md" padding={theme.spacing[6]}>
          <Text style={styles.cardTitle}>This Week's Focus 📈</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>18h 32m</Text>
              <Text style={styles.statLabel}>Total Focus Time</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>234</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
            </View>
          </View>

          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>📊</Text>
            <Text style={styles.chartLabel}>Chart coming soon</Text>
          </View>
        </Card>

        <Card shadow="sm" padding={theme.spacing[6]}>
          <Text style={styles.cardTitle}>Streak Calendar 🔥</Text>
          <View style={styles.streakGrid}>
            {[...Array(21)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.streakDay,
                  i < 20 && styles.streakDayActive,
                ]}
              >
                <Text style={styles.streakDayText}>
                  {i < 20 ? '✓' : '•'}
                </Text>
              </View>
            ))}
          </View>
          <Badge variant="streak" animate showIcon style={styles.streakBadge}>
            23-day streak
          </Badge>
        </Card>

        <Card shadow="sm" padding={theme.spacing[6]}>
          <Text style={styles.cardTitle}>Top Achievements 🏆</Text>
          <View style={styles.achievementsList}>
            <Text style={styles.achievementItem}>🎖️ Marathon Master (+50 pts)</Text>
            <Text style={styles.achievementItem}>🔥 Week Warrior (+30 pts)</Text>
            <Text style={styles.achievementItem}>🎯 100 Sessions (+25 pts)</Text>
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
  cardTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  statBox: {
    flex: 1,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    fontSize: 48,
    marginBottom: theme.spacing[2],
  },
  chartLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  streakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  streakDay: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDayActive: {
    backgroundColor: '#F97316',
  },
  streakDayText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.white,
    fontWeight: theme.typography.weights.bold as any,
  },
  streakBadge: {
    alignSelf: 'center',
  },
  achievementsList: {
    gap: theme.spacing[3],
  },
  achievementItem: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    paddingVertical: theme.spacing[2],
  },
});

