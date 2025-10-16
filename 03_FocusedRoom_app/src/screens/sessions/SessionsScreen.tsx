/**
 * FOCUSED ROOM - Sessions Screen
 * 
 * Manage deep work sessions.
 * 
 * @format
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export default function SessionsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card shadow="md" padding={theme.spacing[8]} style={styles.mainCard}>
          <Text style={styles.title}>⏱️</Text>
          <Text style={styles.heading}>Ready for Deep Work?</Text>
          <Text style={styles.description}>
            Start a focused session and block all distractions
          </Text>
          
          <View style={styles.buttonGroup}>
            <Button variant="primary" size="large" fullWidth>
              Start 25-min Pomodoro
            </Button>
            <Button variant="secondary" size="large" fullWidth>
              Start 50-min Session
            </Button>
            <Button variant="secondary" size="large" fullWidth>
              Custom Duration
            </Button>
          </View>
        </Card>

        <Card shadow="sm" padding={theme.spacing[6]}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <Text style={styles.placeholder}>
            Your recent sessions will appear here
          </Text>
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
  mainCard: {
    alignItems: 'center',
  },
  title: {
    fontSize: 64,
    marginBottom: theme.spacing[4],
  },
  heading: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
  },
  buttonGroup: {
    width: '100%',
    gap: theme.spacing[3],
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  placeholder: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
    paddingVertical: theme.spacing[8],
  },
});

