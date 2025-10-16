/**
 * FOCUSED ROOM - Shadow System
 * 
 * Design Philosophy:
 * - Subtle, soft shadows for calm aesthetic
 * - Consistent elevation system
 * - Matches website shadow-soft
 * 
 * Source: PRD_PART3.md Section 5.2, main.css (website --shadow-soft)
 */

import { Platform } from 'react-native';

// iOS uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
// Android uses elevation

export const shadows = {
  // No shadow
  none: Platform.select({
    ios: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    android: {
      elevation: 0,
    },
  }),

  // Subtle shadow (cards, buttons at rest)
  sm: Platform.select({
    ios: {
      shadowColor: '#0f1724',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),

  // Medium shadow (elevated cards)
  md: Platform.select({
    ios: {
      shadowColor: '#0f1724',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),

  // Large shadow (modals, dropdowns) - matches website --shadow-soft
  lg: Platform.select({
    ios: {
      shadowColor: '#0f1724',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 30,
    },
    android: {
      elevation: 8,
    },
  }),

  // Extra large shadow (bottom sheets, important modals)
  xl: Platform.select({
    ios: {
      shadowColor: '#0f1724',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.1,
      shadowRadius: 40,
    },
    android: {
      elevation: 12,
    },
  }),
} as const;

export type Shadows = typeof shadows;

export default shadows;

