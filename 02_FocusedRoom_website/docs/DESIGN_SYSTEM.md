# Focused Room - Design System

**Version**: 1.0.0  
**Status**: Production  
**Last Updated**: October 4, 2025

---

## 🎨 Overview

This design system defines the visual language, components, and patterns for the Focused Room website. It is directly derived from the Chrome extension's design tokens to ensure brand consistency across all touchpoints.

**Design Philosophy**:
- Modern-minimal aesthetic
- Calming/zen atmosphere
- Gamified elements (subtle, not overwhelming)
- Accessibility-first (WCAG 2.1 AA minimum)
- Performance-optimized (mobile-first)

**Inspirations**:
- Apple: Minimalism and attention to detail
- Notion: Clean, functional design
- Calm.com: Zen, meditation aesthetic
- Duolingo: Gamification elements
- Linear.app: Professional interface
- Figma: Design system approach

---

## 🎨 Color Palette

### Primary Colors

```css
:root {
  /* Primary Teal - Main brand color */
  --color-primary-500: #7A9E9F;   /* Default state */
  --color-primary-600: #6B8B8C;   /* Hover/active states */

  /* Accent Colors */
  --color-accent:      #38a169;   /* Success, streaks, positive feedback */
  --color-cta-accent:  #667eea;   /* Micro-accents, badges (use sparingly) */
  --color-danger:      #e53e3e;   /* Errors, warnings, friction */

  /* Neutral Palette */
  --color-neutral-100: #FAF9F5;   /* Card backgrounds, surfaces */
  --color-neutral-200: #F7FAFC;   /* Alternate surfaces */
  --color-border:      #E2E8F0;   /* Borders, dividers */

  /* Text Colors */
  --color-text-900:    #2d3748;   /* Primary text (headings) */
  --color-text-700:    #4a5568;   /* Secondary text (body) */
  --color-muted:       #718096;   /* Muted text (captions) */

  /* Backgrounds */
  --bg: #ffffff;
  --bg-dark: #0f1724;

  /* Effects */
  --gradient-primary:  linear-gradient(135deg, #7A9E9F 0%, #6B8B8C 100%);
  --radius: 12px;
  --shadow-soft: 0 8px 30px rgba(15, 23, 36, 0.08);
}
```

### Dark Mode

```css
[data-theme="dark"] {
  --color-bg: #0f1724;
  --color-surface: #111827;
  --color-text: #e6eef6;
  --color-muted: #9aa6b2;
  --color-border: #2b3942;
}
```

### Color Usage Guidelines

**Primary Teal (`#7A9E9F`)**:
- Use for: Primary CTAs, navigation active states, key UI elements
- Avoid: Large backgrounds (use sparingly for impact)
- Accessibility: Ensure 4.5:1 contrast ratio with white text

**Accent Green (`#38a169`)**:
- Use for: Success messages, streak indicators, positive feedback
- Avoid: CTAs (reserve for success states only)

**CTA Accent Purple (`#667eea`)**:
- Use for: Micro-interactions, badges, special highlights
- Use sparingly: Not a primary brand color

**Danger Red (`#e53e3e`)**:
- Use for: Error messages, friction warnings, destructive actions
- Never use: For decorative purposes

---

## 📐 Typography

### Font Stack

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
}
```

### Type Scale

```css
:root {
  /* Headings */
  --text-5xl: 3rem;      /* 48px - Hero H1 */
  --text-4xl: 2.25rem;   /* 36px - Section H2 */
  --text-3xl: 1.875rem;  /* 30px - Card H3 */
  --text-2xl: 1.5rem;    /* 24px - Subsection H4 */
  --text-xl:  1.25rem;   /* 20px - Large body */

  /* Body */
  --text-base: 1rem;     /* 16px - Default */
  --text-sm:   0.875rem; /* 14px - Small */
  --text-xs:   0.75rem;  /* 12px - Caption */

  /* Line Heights */
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose:  2;
}
```

### Usage Guidelines

**Headlines (H1-H4)**:
- Use system font stack for maximum performance
- H1: `--text-5xl`, bold (700), `--leading-tight`
- H2: `--text-4xl`, bold (700), `--leading-snug`
- H3: `--text-3xl`, semibold (600), `--leading-snug`
- H4: `--text-2xl`, semibold (600), `--leading-normal`

**Body Text**:
- Default: `--text-base`, normal (400), `--leading-relaxed`
- Large: `--text-xl` for emphasis
- Small: `--text-sm` for captions, metadata

**Monospace**:
- Use for: Code snippets, technical data
- Font: `--font-mono`

---

## 🔘 Components

### Buttons

#### Primary Button

```css
.btn-primary {
  background: var(--color-primary-500);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px; /* Pill shape */
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(122, 158, 159, 0.2);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 3px;
}
```

#### Secondary Button (Ghost)

```css
.btn-ghost {
  background: transparent;
  color: var(--color-primary-500);
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  border: 2px solid var(--color-primary-500);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-ghost:hover {
  background: var(--color-primary-500);
  color: white;
}
```

#### Button Sizes

```css
.btn-sm  { padding: 0.5rem 1rem; font-size: 0.875rem; }
.btn-md  { padding: 0.75rem 1.5rem; font-size: 1rem; }
.btn-lg  { padding: 1rem 2rem; font-size: 1.125rem; }
```

### Cards

```css
.card {
  background: var(--color-neutral-100);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(15, 23, 36, 0.12);
}
```

### Form Elements

```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(122, 158, 159, 0.1);
}

.input:invalid {
  border-color: var(--color-danger);
}
```

---

## 📱 Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;   /* Mobile landscape */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
}
```

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```css
/* Mobile (default) */
.hero { padding: 2rem 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .hero { padding: 3rem 2rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero { padding: 4rem 3rem; }
}
```

---

## ♿ Accessibility

### Focus States

All interactive elements **MUST** have visible focus states:

```css
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 3px;
  border-radius: 4px;
}
```

### Color Contrast

Minimum contrast ratios (WCAG 2.1 AA):
- Normal text: **4.5:1**
- Large text (18px+ or 14px+ bold): **3:1**
- UI components: **3:1**

### Skip Links

Every page must include a skip link:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary-500);
  color: white;
  padding: 0.5rem 1rem;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## 🎬 Animations

### Timing Functions

```css
:root {
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Animation Duration

```css
:root {
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
}
```

### Micro-interactions

```css
.hover-lift {
  transition: transform var(--duration-base) var(--ease-out);
}

.hover-lift:hover {
  transform: translateY(-4px);
}
```

### Respect User Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📏 Spacing Scale

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
}
```

---

## 🚀 Implementation Checklist

When implementing any UI component:

- [ ] Uses design tokens from this system
- [ ] Mobile-first responsive design
- [ ] WCAG 2.1 AA compliant (4.5:1 contrast minimum)
- [ ] Keyboard navigable with visible focus states
- [ ] Respects prefers-reduced-motion
- [ ] Semantic HTML (proper heading hierarchy)
- [ ] ARIA labels where needed
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Lighthouse score >90 (Performance, Accessibility)

---

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Maintained by**: Focused Room Development Team  
**Questions?**: Refer to `CURSOR_CONTEXT.md` or create an issue
