/**
 * FOCUSED ROOM - Home Screen
 * 
 * Main dashboard showing:
 * - Current streak
 * - Today's stats
 * - Quick action: Start Session
 * - Recent achievements
 * - Recommended article
 * 
 * Psychology:
 * - Streak prominently displayed (don't break it!)
 * - Stats create sense of progress
 * - Start button is primary CTA (clear next action)
 * - Achievements provide positive reinforcement
 * 
 * @format
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '../../theme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Good morning, Souvik! ☀️</Text>
          <Text style={styles.subtitle}>Ready to focus?</Text>
        </View>

        {/* Streak Card */}
        <Card shadow="md" padding={theme.spacing[6]} style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Badge variant="streak" animate showIcon size="large">
              23-DAY STREAK
            </Badge>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
          <Text style={styles.streakMessage}>
            Don't break it today! 💪
          </Text>
        </Card>

        {/* Today's Stats */}
        <Card shadow="sm" padding={theme.spacing[6]}>
          <Text style={styles.cardTitle}>Today's Focus</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2h 34m</Text>
              <Text style={styles.statLabel}>Focused</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>234</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Level 8</Text>
              <Text style={styles.statLabel}>Flow Architect</Text>
            </View>
          </View>
        </Card>

        {/* Start Session CTA */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={() => console.log('Start session')}
        >
          🎯 Start Deep Work Session
        </Button>

        {/* Recent Achievement */}
        <Card shadow="md" padding={theme.spacing[6]}>
          <Text style={styles.cardTitle}>Latest Achievement 🏆</Text>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementIcon}>🎖️</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementName}>Marathon Master</Text>
              <Text style={styles.achievementDesc}>
                Completed a 100-minute session
              </Text>
              <Badge variant="achievement" size="small">
                +50 points
              </Badge>
            </View>
          </View>
        </Card>

        {/* Recommended Reading */}
        <Card shadow="sm" padding={theme.spacing[6]}>
          <Text style={styles.cardTitle}>Recommended Reading 📚</Text>
          <Text style={styles.articleTitle}>
            The Science of Deep Work
          </Text>
          <Text style={styles.articleMeta}>8 min read • Today</Text>
          <Button
            variant="secondary"
            size="small"
            onPress={() => console.log('Read article')}
          >
            Read Now
          </Button>
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
  greetingSection: {
    marginBottom: theme.spacing[2],
  },
  greeting: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
  },
  streakCard: {
    alignItems: 'center',
  },
  streakHeader: {
    marginBottom: theme.spacing[4],
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.radius.full,
    marginBottom: theme.spacing[3],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: theme.radius.full,
  },
  streakMessage: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium as any,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  achievementContent: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  achievementIcon: {
    fontSize: 48,
  },
  achievementText: {
    flex: 1,
    gap: theme.spacing[2],
  },
  achievementName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  achievementDesc: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  articleTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  articleMeta: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing[4],
  },
});

