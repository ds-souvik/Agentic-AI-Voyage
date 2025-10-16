/**
 * FOCUSED ROOM - Complete Theme System
 * 
 * This is the master theme file that combines all design tokens:
 * - Colors (primary teal #7A9E9F, accent green, etc.)
 * - Typography (system fonts, type scale)
 * - Spacing (4px base unit)
 * - Shadows (soft, subtle)
 * - Animations (smooth, meaningful)
 * - Border radius
 * 
 * Design Philosophy:
 * - Consistent with website and Chrome extension
 * - Modern-minimal, calming/zen aesthetic
 * - Full dark mode support
 * - WCAG 2.1 AA accessible
 * 
 * Usage:
 * ```tsx
 * import { theme } from '@/theme';
 * 
 * const styles = StyleSheet.create({
 *   button: {
 *     backgroundColor: theme.colors.primary[500],
 *     padding: theme.spacing[4],
 *     borderRadius: theme.radius.lg,
 *     ...theme.shadows.md,
 *   },
 * });
 * ```
 * 
 * Source: PRD_PART3.md Section 5, main.css (website), popup.css (extension)
 */

import colors, { withOpacity, gradients } from './colors';
import typography, { textStyles } from './typography';
import spacing, { semanticSpacing } from './spacing';
import shadows from './shadows';
import animations, { easing, duration } from './animations';

// Border Radius (matches website --radius: 12px)
export const radius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,     // Default radius (matches website)
  lg: 16,
  xl: 24,
  full: 9999, // Pill shape (buttons, badges)
} as const;

// Z-Index layers
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Complete theme object
export const theme = {
  // Design tokens
  colors,
  typography,
  spacing,
  shadows,
  animations,
  radius,
  zIndex,

  // Semantic spacing
  semanticSpacing,

  // Text styles (pre-configured)
  textStyles,

  // Helpers
  withOpacity,
  gradients,
  easing,
  duration,
} as const;

// Dark mode theme (extends base theme with dark colors)
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: {
      ...theme.colors.background,
      light: theme.colors.dark.bg,
      lightAlt: theme.colors.dark.surface,
    },
    text: {
      ...theme.colors.text,
      primary: theme.colors.dark.text.primary,
      secondary: theme.colors.dark.text.secondary,
      muted: theme.colors.dark.text.muted,
    },
    neutral: {
      ...theme.colors.neutral,
      50: theme.colors.dark.surface,
      100: theme.colors.dark.surface,
      300: theme.colors.dark.border,
    },
  },
} as const;

// Type exports
export type Theme = typeof theme;
export type DarkTheme = typeof darkTheme;

// Default export
export default theme;

// Re-export individual modules for direct access
export { colors, typography, spacing, shadows, animations, textStyles, semanticSpacing };

