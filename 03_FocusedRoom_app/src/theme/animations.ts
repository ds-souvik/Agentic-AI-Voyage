/**
 * FOCUSED ROOM - Animation System
 * 
 * Design Philosophy:
 * - Subtle, meaningful animations
 * - Matches website timing functions
 * - Respects reduced motion preferences
 * - Enhances UX without being distracting
 * 
 * Source: PRD_PART3.md Section 5.2, main.css (website)
 */

// Easing functions (matches website)
export const easing = {
  // Standard easing (most common)
  easeOut: [0.4, 0, 0.2, 1] as const,     // Fast start, slow end
  easeIn: [0.4, 0, 1, 1] as const,        // Slow start, fast end
  easeInOut: [0.4, 0, 0.2, 1] as const,   // Smooth both ends
  
  // Special easing
  linear: [0, 0, 1, 1] as const,
  spring: [0.68, -0.55, 0.265, 1.55] as const, // Bouncy
} as const;

// Duration (in milliseconds, matches website)
export const duration = {
  instant: 0,
  fast: 150,     // Quick interactions (button press)
  base: 200,     // Standard transitions
  slow: 300,     // Deliberate animations
  slower: 500,   // Page transitions
  slowest: 700,  // Special effects
} as const;

// Pre-configured animations for common use cases
export const animations = {
  // Fade animations
  fadeIn: {
    duration: duration.base,
    easing: easing.easeOut,
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    duration: duration.base,
    easing: easing.easeIn,
    from: { opacity: 1 },
    to: { opacity: 0 },
  },

  // Scale animations
  scaleIn: {
    duration: duration.base,
    easing: easing.easeOut,
    from: { scale: 0.9, opacity: 0 },
    to: { scale: 1, opacity: 1 },
  },
  scaleOut: {
    duration: duration.fast,
    easing: easing.easeIn,
    from: { scale: 1, opacity: 1 },
    to: { scale: 0.9, opacity: 0 },
  },

  // Slide animations
  slideInFromRight: {
    duration: duration.base,
    easing: easing.easeOut,
    from: { translateX: 300, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
  },
  slideInFromLeft: {
    duration: duration.base,
    easing: easing.easeOut,
    from: { translateX: -300, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
  },
  slideInFromBottom: {
    duration: duration.base,
    easing: easing.easeOut,
    from: { translateY: 300, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },

  // Button press (spring animation)
  buttonPress: {
    duration: duration.fast,
    easing: easing.spring,
    from: { scale: 1 },
    to: { scale: 0.95 },
  },
  buttonRelease: {
    duration: duration.fast,
    easing: easing.spring,
    from: { scale: 0.95 },
    to: { scale: 1 },
  },

  // Card hover (lift effect)
  cardLift: {
    duration: duration.base,
    easing: easing.easeOut,
    from: { translateY: 0 },
    to: { translateY: -4 },
  },

  // Streak fire pulse (for streak badge)
  pulse: {
    duration: duration.slower,
    easing: easing.easeInOut,
    from: { scale: 1, opacity: 1 },
    to: { scale: 1.1, opacity: 0.8 },
    repeat: -1, // Infinite
    reverse: true,
  },
} as const;

// Accessibility: Reduced motion
export const shouldReduceMotion = (userPrefersReducedMotion: boolean) => {
  return userPrefersReducedMotion ? 0 : 1;
};

export type Easing = typeof easing;
export type Duration = typeof duration;
export type Animations = typeof animations;

export default {
  easing,
  duration,
  animations,
  shouldReduceMotion,
};

