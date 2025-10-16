/**
 * FOCUSED ROOM - Badge Component
 * 
 * Beautiful badges for streaks, points, levels, and achievements.
 * 
 * Variants:
 * - streak: Fire icon with pulse animation (orange)
 * - level: Current level badge (teal gradient)
 * - points: Point count (green)
 * - achievement: Achievement indicator (gold)
 * - neutral: Generic badge (gray)
 * 
 * Psychology:
 * - Streak badge pulses to draw attention (motivating)
 * - Fire emoji creates urgency ("don't break it!")
 * - Gold/bronze colors tap into achievement psychology
 * - Pill shape feels friendly, not harsh
 * 
 * Accessibility:
 * - Screen reader announces content
 * - High contrast colors
 * - Meaningful labels
 * 
 * @format
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
  Easing,
} from 'react-native';
import { theme } from '../../theme';

interface BadgeProps {
  /** Badge variant */
  variant?: 'streak' | 'level' | 'points' | 'achievement' | 'neutral';
  
  /** Badge text/content */
  children: string | number;
  
  /** Show icon (for streak variant) */
  showIcon?: boolean;
  
  /** Size */
  size?: 'small' | 'medium' | 'large';
  
  /** Animate (pulse for streak) */
  animate?: boolean;
  
  /** Custom style */
  style?: ViewStyle;
  
  /** Test ID */
  testID?: string;
}

/**
 * Badge Component
 * 
 * Usage:
 * ```tsx
 * // Streak badge (with fire icon and pulse)
 * <Badge variant="streak" animate showIcon>
 *   23 days
 * </Badge>
 * 
 * // Level badge
 * <Badge variant="level">
 *   Flow Architect
 * </Badge>
 * 
 * // Points badge
 * <Badge variant="points">
 *   234 pts
 * </Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  showIcon = false,
  size = 'medium',
  animate = false,
  style,
  testID,
}) => {
  // Pulse animation for streak badges
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animate && variant === 'streak') {
      // Continuous pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animate, variant]);

  const variantStyle = getVariantStyle(variant);
  const sizeStyle = getSizeStyle(size);

  // Get icon for variant
  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (variant) {
      case 'streak':
        return '🔥 ';
      case 'level':
        return '🎯 ';
      case 'points':
        return '⭐ ';
      case 'achievement':
        return '🏆 ';
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.badge,
        variantStyle.container,
        sizeStyle.container,
        animate && variant === 'streak' && { transform: [{ scale: pulseAnim }] },
        style,
      ]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`${variant} badge: ${children}`}
    >
      <Text style={[styles.text, variantStyle.text, sizeStyle.text]}>
        {getIcon()}
        {children}
      </Text>
    </Animated.View>
  );
};

// Variant styles
const getVariantStyle = (
  variant: BadgeProps['variant']
): { container: ViewStyle; text: any } => {
  switch (variant) {
    case 'streak':
      return {
        container: {
          backgroundColor: '#F97316', // Orange (streak fire color)
        },
        text: {
          color: theme.colors.white,
          fontWeight: theme.typography.weights.bold,
        },
      };

    case 'level':
      return {
        container: {
          backgroundColor: theme.colors.primary[500], // Teal
        },
        text: {
          color: theme.colors.white,
          fontWeight: theme.typography.weights.semibold,
        },
      };

    case 'points':
      return {
        container: {
          backgroundColor: theme.colors.accent.green, // Green
        },
        text: {
          color: theme.colors.white,
          fontWeight: theme.typography.weights.semibold,
        },
      };

    case 'achievement':
      return {
        container: {
          backgroundColor: '#F59E0B', // Gold
        },
        text: {
          color: theme.colors.white,
          fontWeight: theme.typography.weights.bold,
        },
      };

    case 'neutral':
    default:
      return {
        container: {
          backgroundColor: theme.colors.neutral[200],
        },
        text: {
          color: theme.colors.text.secondary,
          fontWeight: theme.typography.weights.medium,
        },
      };
  }
};

// Size styles
const getSizeStyle = (
  size: BadgeProps['size']
): { container: ViewStyle; text: any } => {
  switch (size) {
    case 'small':
      return {
        container: {
          paddingVertical: theme.spacing[1],
          paddingHorizontal: theme.spacing[2],
        },
        text: {
          fontSize: theme.typography.sizes.xs,
        },
      };

    case 'medium':
      return {
        container: {
          paddingVertical: theme.spacing[2],
          paddingHorizontal: theme.spacing[3],
        },
        text: {
          fontSize: theme.typography.sizes.sm,
        },
      };

    case 'large':
      return {
        container: {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
        },
        text: {
          fontSize: theme.typography.sizes.base,
        },
      };

    default:
      return {
        container: {
          paddingVertical: theme.spacing[2],
          paddingHorizontal: theme.spacing[3],
        },
        text: {
          fontSize: theme.typography.sizes.sm,
        },
      };
  }
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.radius.full, // Pill shape (9999px)
    alignSelf: 'flex-start', // Don't stretch to fill container
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    letterSpacing: 0.3,
  },
});

export default Badge;

