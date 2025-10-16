/**
 * FOCUSED ROOM - Card Component
 * 
 * A beautiful, reusable card component with soft shadows.
 * 
 * Features:
 * - Soft shadow (matches website --shadow-soft)
 * - 12px border radius (matches website)
 * - Optional press effect (lift animation)
 * - Multiple shadow sizes
 * - Support for light/dark mode
 * 
 * Psychology:
 * - Soft shadows create calm, zen aesthetic
 * - Lift animation on press feels premium
 * - Proper spacing creates visual hierarchy
 * 
 * Accessibility:
 * - If pressable, minimum 44x44px touch target
 * - Clear visual feedback on press
 * 
 * @format
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { theme } from '../../theme';

interface CardProps {
  /** Card content */
  children: React.ReactNode;
  
  /** Shadow size */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Custom padding */
  padding?: number;
  
  /** Press handler (makes card touchable) */
  onPress?: () => void;
  
  /** Custom style */
  style?: ViewStyle;
  
  /** Test ID */
  testID?: string;
}

/**
 * Card Component
 * 
 * Usage:
 * ```tsx
 * <Card shadow="md" padding={24}>
 *   <Text>Card content</Text>
 * </Card>
 * 
 * <Card onPress={handlePress} shadow="lg">
 *   <Text>Pressable card</Text>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  shadow = 'md',
  padding = theme.spacing[4],
  onPress,
  style,
  testID,
}) => {
  // Animation for lift effect
  const translateY = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(translateY, {
        toValue: -4,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(translateY, {
        toValue: 0,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const shadowStyle = getShadowStyle(shadow);

  const cardStyle = [
    styles.card,
    shadowStyle,
    { padding },
    style,
  ];

  // If pressable, wrap in TouchableOpacity
  if (onPress) {
    return (
      <Animated.View
        style={[
          { transform: [{ translateY }] },
        ]}
      >
        <TouchableOpacity
          style={cardStyle}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          testID={testID}
          accessibilityRole="button"
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Otherwise, just a View
  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
};

// Shadow styles
const getShadowStyle = (shadow: CardProps['shadow']): ViewStyle => {
  switch (shadow) {
    case 'none':
      return theme.shadows.none || {};
    case 'sm':
      return theme.shadows.sm || {};
    case 'md':
      return theme.shadows.md || {};
    case 'lg':
      return theme.shadows.lg || {};
    case 'xl':
      return theme.shadows.xl || {};
    default:
      return theme.shadows.md || {};
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radius.md, // 12px (matches website)
    overflow: 'hidden',
  },
});

export default Card;

