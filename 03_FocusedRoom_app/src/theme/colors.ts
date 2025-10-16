/**
 * FOCUSED ROOM - Color System
 * 
 * Design Philosophy:
 * - Consistent with website (#7A9E9F primary) and Chrome extension
 * - Calming, zen aesthetic for focus and productivity
 * - Full dark mode support
 * - WCAG 2.1 AA compliant contrast ratios
 * 
 * Source: PRD_PART3.md Section 5.2, main.css (website), popup.css (extension)
 */

export const colors = {
  // Primary Colors (Teal - From website and extension)
  primary: {
    500: '#7A9E9F', // Main primary color
    600: '#6B8B8C', // Darker shade for hover/pressed states
    400: '#8BADAE', // Lighter shade
    300: '#A4C4C5', // Very light
    gradient: 'linear-gradient(135deg, #7A9E9F 0%, #6B8B8C 100%)',
  },

  // Accent Colors
  accent: {
    green: '#38a169',      // Success, completion, positive actions
    greenHover: '#2f855a', // Hover state
    purple: '#667eea',     // CTA accent, special actions
    purpleHover: '#5568d3', // Hover state
  },

  // Danger/Warning Colors
  danger: {
    500: '#e53e3e', // Error, destructive actions, blocked attempts
    600: '#c53030', // Hover state
    400: '#fc8181', // Lighter shade
  },

  warning: {
    500: '#ed8936',
    600: '#dd6b20',
  },

  // Neutral Colors (Light Mode)
  neutral: {
    50: '#FAF9F5',   // Lightest background (from website)
    100: '#F7FAFC',  // Card backgrounds
    200: '#EDF2F7',  // Subtle backgrounds
    300: '#E2E8F0',  // Borders (--color-border from website)
    400: '#CBD5E0',  // Disabled elements
    500: '#A0AEC0',  // Placeholder text
    600: '#718096',  // Muted text (--color-muted from website)
    700: '#4A5568',  // Secondary text (--color-text-700)
    800: '#2D3748',  // Primary text (--color-text-900)
    900: '#1A202C',  // Darkest text
  },

  // Dark Mode Colors
  dark: {
    bg: '#0f1724',       // Background (from website dark mode)
    surface: '#111827',   // Card backgrounds
    border: '#2b3942',    // Borders
    text: {
      primary: '#e6eef6',
      secondary: '#9aa6b2',
      muted: '#6b7280',
    },
  },

  // Semantic Colors
  success: '#38a169',
  error: '#e53e3e',
  info: '#667eea',
  
  // Background Colors
  background: {
    light: '#ffffff',
    lightAlt: '#FAF9F5', // Slightly warm white (from website)
    dark: '#0f1724',
    darkAlt: '#111827',
  },

  // Text Colors (Light Mode)
  text: {
    primary: '#2d3748',   // Main text
    secondary: '#4a5568', // Secondary text
    muted: '#718096',     // Muted/disabled text
    inverse: '#ffffff',   // Text on dark backgrounds
  },

  // Special Colors
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',

  // Gamification Colors (for levels, badges, achievements)
  gamification: {
    gold: '#F59E0B',      // Level 20, legendary
    silver: '#94A3B8',    // High levels
    bronze: '#D97706',    // Mid levels
    streak: '#F97316',    // Streak fire color
  },

  // Chart Colors (for reports/analytics)
  chart: {
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    teal: '#14B8A6',
  },
} as const;

// Type for accessing colors
export type Colors = typeof colors;

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Gradient presets
export const gradients = {
  primary: 'linear-gradient(135deg, #7A9E9F 0%, #6B8B8C 100%)',
  success: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
  danger: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
  cta: 'linear-gradient(135deg, #667eea 0%, #5568d3 100%)',
} as const;

export default colors;

