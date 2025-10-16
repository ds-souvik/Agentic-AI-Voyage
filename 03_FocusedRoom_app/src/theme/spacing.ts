/**
 * FOCUSED ROOM - Spacing System
 * 
 * Design Philosophy:
 * - 4px base unit for consistency
 * - Matches website spacing scale
 * - Predictable, harmonious rhythm
 * 
 * Source: PRD_PART3.md Section 5.2, main.css (website)
 */

export const spacing = {
  // Base unit: 4px
  0: 0,
  1: 4,    // 0.25rem
  2: 8,    // 0.5rem
  3: 12,   // 0.75rem
  4: 16,   // 1rem (base)
  5: 20,   // 1.25rem
  6: 24,   // 1.5rem
  8: 32,   // 2rem
  10: 40,  // 2.5rem
  12: 48,  // 3rem
  16: 64,  // 4rem
  20: 80,  // 5rem
  24: 96,  // 6rem
  32: 128, // 8rem
} as const;

// Semantic spacing (for specific use cases)
export const semanticSpacing = {
  // Component padding
  buttonPaddingVertical: spacing[3],    // 12px
  buttonPaddingHorizontal: spacing[6],  // 24px
  cardPadding: spacing[4],              // 16px
  cardPaddingLarge: spacing[6],         // 24px
  inputPadding: spacing[3],             // 12px
  
  // Screen padding
  screenPadding: spacing[4],            // 16px
  screenPaddingLarge: spacing[6],       // 24px
  
  // Gaps
  gapTiny: spacing[1],                  // 4px
  gapSmall: spacing[2],                 // 8px
  gapMedium: spacing[4],                // 16px
  gapLarge: spacing[6],                 // 24px
  
  // Sections
  sectionGap: spacing[6],               // 24px between sections
  sectionGapLarge: spacing[8],          // 32px
  
  // Icon sizes
  iconTiny: 16,
  iconSmall: 20,
  iconMedium: 24,
  iconLarge: 32,
  iconXLarge: 48,
} as const;

export type Spacing = typeof spacing;
export type SemanticSpacing = typeof semanticSpacing;

export default spacing;

