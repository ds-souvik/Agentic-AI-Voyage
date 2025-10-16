/**
 * FOCUSED ROOM - Learn Screen
 * 
 * Blog articles and tips.
 * 
 * @format
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export default function LearnScreen() {
  const articles = [
    {
      title: 'The Science of Deep Work',
      excerpt: 'Learn why focused work is your superpower',
      readTime: '8 min',
    },
    {
      title: 'Breaking the Override Habit',
      excerpt: 'Stop giving in to distractions',
      readTime: '6 min',
    },
    {
      title: 'Building a 30-Day Streak',
      excerpt: 'Consistency over intensity',
      readTime: '5 min',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📚 The Focus Formula</Text>
          <Text style={styles.subtitle}>
            Weekly articles to help you master focus
          </Text>
        </View>

        {articles.map((article, index) => (
          <Card key={index} shadow="sm" padding={theme.spacing[6]}>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleExcerpt}>{article.excerpt}</Text>
            <View style={styles.articleFooter}>
              <Text style={styles.readTime}>{article.readTime} read</Text>
              <Button
                variant="ghost"
                size="small"
                onPress={() => console.log('Read article')}
              >
                Read Now →
              </Button>
            </View>
          </Card>
        ))}

        <Card shadow="md" padding={theme.spacing[6]} style={styles.newsletterCard}>
          <Text style={styles.newsletterTitle}>💌 Get Weekly Tips</Text>
          <Text style={styles.newsletterText}>
            Subscribe to our newsletter for focus tips delivered to your inbox
          </Text>
          <Button variant="primary" size="medium" fullWidth>
            Subscribe
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
  header: {
    marginBottom: theme.spacing[2],
  },
  title: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  articleTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  articleExcerpt: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
    lineHeight: 24,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  newsletterCard: {
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
  },
  newsletterTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.white,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  newsletterText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing[4],
    opacity: 0.9,
  },
});

