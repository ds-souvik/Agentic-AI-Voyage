/**
 * FOCUSED ROOM - Typography System
 * 
 * Design Philosophy:
 * - System fonts for native feel and performance
 * - Consistent with website font stack
 * - Responsive type scale (rem-based)
 * - Optimized line heights for readability
 * 
 * Source: PRD_PART3.md Section 5.2, main.css (website)
 */

export const typography = {
  // Font Families (System Font Stack - matches website)
  fonts: {
    sans: {
      ios: 'San Francisco',
      android: 'Roboto',
      // Fallback system fonts
      fallback: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
    },
    mono: {
      ios: 'SF Mono',
      android: 'Roboto Mono',
      fallback: 'SF Mono, Monaco, Cascadia Code, Courier New, monospace',
    },
  },

  // Font Sizes (rem-based, matches website)
  // Base: 16px
  sizes: {
    '5xl': 48,   // 3rem - Large headers
    '4xl': 36,   // 2.25rem - Section headers
    '3xl': 30,   // 1.875rem - Page titles
    '2xl': 24,   // 1.5rem - Card titles
    'xl': 20,    // 1.25rem - Large text
    'lg': 18,    // 1.125rem - Emphasized text
    'base': 16,  // 1rem - Body text
    'sm': 14,    // 0.875rem - Small text
    'xs': 12,    // 0.75rem - Captions, labels
  },

  // Line Heights (matches website)
  lineHeights: {
    tight: 1.25,      // Headings
    snug: 1.375,      // Subheadings
    normal: 1.5,      // Body text
    relaxed: 1.625,   // Comfortable reading
    loose: 2,         // Very spacious
  },

  // Font Weights
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

// Pre-defined text styles (ready to use)
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.snug,
  },
  h4: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.snug,
  },
  h5: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.normal,
  },

  // Body text
  bodyLarge: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.relaxed,
  },
  body: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.relaxed,
  },
  bodySmall: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.normal,
  },

  // UI text
  button: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.wide,
  },
  caption: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.normal,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.tight,
  },
  
  // Special text
  display: {
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.weights.extrabold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tighter,
  },
  code: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.normal,
    // fontFamily: typography.fonts.mono (apply separately)
  },
} as const;

export type Typography = typeof typography;
export type TextStyles = typeof textStyles;

export default typography;

