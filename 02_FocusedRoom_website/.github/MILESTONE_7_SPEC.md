# MILESTONE 7 - Performance & Accessibility Implementation Specification

**Version**: 1.0.0  
**Status**: Active Development  
**Start Date**: October 4, 2025  
**Target Completion**: October 18, 2025

---

## 🎯 Executive Summary

Transform the Focused Room website into a production-ready, high-converting marketing hub with world-class UI, exceptional performance (Lighthouse >90), and full accessibility compliance (WCAG 2.1 AA).

**Success Metrics**:
- Lighthouse: Performance ≥90, Accessibility ≥95, SEO ≥100
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- WCAG 2.1 AA: 100% compliance, 0 critical violations
- Test Coverage: 247/248 tests passing (99.6%)
- Conversion: Beautiful, on-brand UI that converts visitors

---

## 📐 Design System

**Mandatory Reference**: See `docs/DESIGN_SYSTEM.md` for complete specification.

**Core Tokens** (Never Deviate):
```css
--color-primary-500: #7A9E9F;  /* Main teal */
--color-accent: #38a169;       /* Success green */
--gradient-primary: linear-gradient(135deg, #7A9E9F 0%, #6B8B8C 100%);
```

**Brand Direction**:
- Modern-minimal, calming/zen, gamified
- Inspired by: Apple, Notion, Calm.com, Linear.app, Duolingo

---

## 🚀 Phased Deliverables (8 PRs)

### PR A: Hero + Asset Foundation
**Branch**: `feature/ui-hero`  
**Priority**: Critical  
**Estimated Effort**: 6-8 hours  
**Dependencies**: None

#### Scope
1. Create production-ready `main.css` with design tokens
2. Create `main.js` with form handling and accessibility helpers
3. Polish `index.html` hero section
4. Update `base.html` with accessibility structure

#### Files to Create/Modify
- ✅ CREATE: `app/static/css/main.css` (~500 lines)
- ✅ CREATE: `app/static/js/main.js` (~200 lines)
- ✅ MODIFY: `app/templates/base.html` (accessibility improvements)
- ✅ MODIFY: `app/templates/index.html` (hero polish)

#### Acceptance Criteria
- [ ] Hero section matches design spec (see below)
- [ ] Desktop screenshot (1920x1080)
- [ ] Mobile screenshot (375x667)
- [ ] Primary CTA redirects to `/download` with UTM params
- [ ] Newsletter form validates email client-side
- [ ] All tests pass: `pytest tests/ -q`
- [ ] No console errors in browser
- [ ] Focus states visible on all interactive elements

#### Hero Specification
**Layout**: Two-column on desktop, stacked on mobile

**Left Column**:
```html
<h1>Protect your focus. Build your future.</h1>
<p>Turn Chrome into a calm workspace — block distractions, use friction override, and track progress with gamified reports.</p>
<div class="hero-cta">
  <a class="btn-primary" href="/download?utm_source=site&utm_medium=cta&utm_campaign=launch">
    Install on Chrome — Free
  </a>
  <a class="btn-ghost" href="https://www.youtube.com/watch?v=si2F3tewq68">
    Watch demo
  </a>
</div>
<p class="privacy-note">No trackers • Data stays on your device</p>
```

**Right Column**:
- Polished screenshot or device mockup
- Alt text: "Focused Room Chrome extension screenshots showing distraction blocking interface"
- Placeholder: Generate SVG mockup if no image exists

#### Testing Commands
```bash
# Start dev server
python run.py

# Run all tests
pytest tests/ -q

# Check accessibility (manual)
# 1. Tab through all interactive elements
# 2. Verify focus visible
# 3. Test newsletter form submission
```

---

### PR B: Features + Carousel + Testimonials
**Branch**: `feature/ui-features`  
**Priority**: High  
**Estimated Effort**: 8-10 hours  
**Dependencies**: PR A merged

#### Scope
1. Add 4-card features section
2. Create screenshot carousel with modal lightbox
3. Add testimonials strip (3 cards)
4. Implement lazy loading for images

#### Features Section
**Cards** (4 total):
1. **Deep Work Sessions** - Customizable focus blocks with distraction blocking
2. **Smart Blocking** - AI-powered site categorization and flexible rules
3. **Friction Override** - Mindful pause before accessing blocked sites
4. **Gamified Analytics** - Track streaks, XP, and productivity insights

**Layout**:
- Desktop: 2x2 grid
- Tablet: 2x2 grid
- Mobile: Single column stack

#### Carousel Specification
- Lightweight implementation (vanilla JS, no libraries)
- Thumbnail navigation
- Click thumbnail → open modal with larger image
- Keyboard: Arrow keys navigate, Escape closes
- ARIA labels for screen readers

#### Testimonials
**Structure**:
```html
<div class="testimonial">
  <p class="quote">"[testimonial text]"</p>
  <div class="author">
    <img src="[avatar]" alt="[name] avatar">
    <div>
      <p class="name">[Name]</p>
      <p class="role">[Role/Title]</p>
    </div>
  </div>
</div>
```

**Placeholder Data** (use until real testimonials):
- "This extension changed how I work. No more rabbit holes." — Alex Chen, Software Engineer
- "Simple, effective, and respects my privacy. Exactly what I needed." — Sarah Miller, Designer
- "The friction override is genius. Makes me pause before distractions." — James Park, Writer

#### Acceptance Criteria
- [ ] 4 feature cards with icons (use emoji/SVG)
- [ ] Carousel works on desktop + mobile
- [ ] Keyboard navigation functional
- [ ] Images use `loading="lazy"` and `srcset`
- [ ] All tests still pass
- [ ] Screenshots (desktop + mobile)

---

### PR C: Big Five UI Polish
**Branch**: `feature/ui-bigfive`  
**Priority**: High  
**Estimated Effort**: 10-12 hours  
**Dependencies**: PR A merged

#### Scope
1. Create paginated questionnaire (10 items per page)
2. Add progress bar (0-100%)
3. Client-side validation with friendly microcopy
4. Inline results summary with CTA

#### Pagination Specification
- Page 1: Questions 1-10
- Page 2: Questions 11-20
- Page 3: Questions 21-30
- Page 4: Questions 31-40 (or 44/50 depending on version)
- Navigation: "Next" / "Previous" / "Submit"

#### Progress Bar
```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 25%"></div>
  <span class="progress-text">10 of 40 questions</span>
</div>
```

#### Results Display
**After successful submission**:
```html
<div class="results-summary" role="region" aria-live="polite">
  <h2>Your Big Five Results</h2>
  <ul class="trait-list">
    <li>
      <span class="trait-name">Openness</span>
      <span class="trait-score">72/100</span>
      <div class="trait-bar"><div style="width: 72%"></div></div>
    </li>
    <!-- Repeat for all 5 traits -->
  </ul>
  <a class="btn-primary" href="#personalized-plan">Get Personalized Plan</a>
</div>
```

#### Acceptance Criteria
- [ ] Pagination works (10 items per page)
- [ ] Progress bar updates correctly
- [ ] Form validates before "Next"
- [ ] Results display in ARIA live region
- [ ] Database row created on submit (verify with curl)
- [ ] All existing tests pass
- [ ] Screenshots (each page + results)

---

### PR D: Accessibility Site-Wide
**Branch**: `feature/accessibility-aria`  
**Priority**: Critical  
**Estimated Effort**: 6-8 hours  
**Dependencies**: PRs A, B, C merged

#### Scope
1. Add skip link to all pages
2. Add landmark roles (`<main>`, `<nav>`, `<footer>`)
3. Ensure all images have meaningful alt text
4. Verify color contrast ≥4.5:1
5. Add ARIA labels for complex UI
6. Test keyboard navigation

#### Skip Link Implementation
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

#### Landmark Roles
```html
<header role="banner">...</header>
<nav role="navigation" aria-label="Main navigation">...</nav>
<main id="main-content" role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
```

#### Testing
Create `tests/test_accessibility.py`:
```python
class TestAccessibility:
    def test_all_images_have_alt_text(self):
        """Verify all images have non-empty alt attributes."""

    def test_color_contrast_ratios(self):
        """Verify WCAG AA contrast ratios (4.5:1)."""

    def test_form_labels_present(self):
        """Verify all form inputs have associated labels."""

    # ... 20 total tests
```

#### Acceptance Criteria
- [ ] Skip link visible on focus
- [ ] All landmarks present
- [ ] All images have alt text
- [ ] Color contrast ≥4.5:1 (verify with tool)
- [ ] 20+ accessibility tests passing
- [ ] axe-core report: 0 critical, ≤2 minor violations
- [ ] Manual keyboard test completed

---

### PR E: Performance Foundation
**Branch**: `feature/perf-caching`  
**Priority**: High  
**Estimated Effort**: 8-10 hours  
**Dependencies**: PRs A-D merged

#### Scope
1. Create `app/utils/performance.py` with caching decorators
2. Add Flask-Compress for gzip/brotli
3. Implement cache-control headers for static assets
4. Add asset versioning strategy

#### Flask-Caching Setup
```python
# app/utils/performance.py
from flask_caching import Cache

cache = Cache(config={
    'CACHE_TYPE': 'simple',  # Use 'redis' in production
    'CACHE_DEFAULT_TIMEOUT': 300
})

def init_cache(app):
    """Initialize Flask-Caching."""
    cache.init_app(app)
    return cache
```

#### Compression Middleware
```python
from flask_compress import Compress

compress = Compress()

def init_compress(app):
    """Initialize Flask-Compress."""
    compress.init_app(app)
    return compress
```

#### Cache Headers for Static Assets
```python
@main_bp.after_request
def add_cache_headers(response):
    """Add cache-control headers for static assets."""
    if request.path.startswith('/static/'):
        # Cache for 1 year (immutable with versioning)
        response.cache_control.public = True
        response.cache_control.max_age = 31536000
        response.cache_control.immutable = True
    return response
```

#### Asset Versioning
```python
# config.py
import os
ASSET_VERSION = os.environ.get('ASSET_VERSION', 'v1.0.0')

# base.html
<link rel="stylesheet" href="{{ url_for('static', filename='css/main.css') }}?v={{ config.ASSET_VERSION }}">
```

#### Dependencies to Add
```
flask-caching==2.1.0
flask-compress==1.14
brotli==1.1.0
```

#### Acceptance Criteria
- [ ] Caching decorators work
- [ ] Compression enabled (verify with curl)
- [ ] Static assets have cache headers
- [ ] Asset versioning prevents stale cache
- [ ] All tests pass
- [ ] Performance tests added (25+ tests)

---

### PR F: Image Optimization
**Branch**: `feature/perf-images`  
**Priority**: Medium  
**Estimated Effort**: 6-8 hours  
**Dependencies**: PR E merged

#### Scope
1. Generate/optimize images (WebP + PNG fallback)
2. Implement `srcset` for responsive images
3. Add lazy loading for below-fold images
4. Create OG image (1200×630)

#### Image Requirements
**Sizes Needed**:
- Hero screenshot: 1200×800 (desktop), 800×600 (tablet), 400×300 (mobile)
- Feature icons: 80×80 (SVG preferred)
- OG image: 1200×630 (PNG + WebP)
- Testimonial avatars: 80×80 (round)

#### Responsive Images
```html
<img
  src="/static/assets/hero-screenshot-800.webp"
  srcset="
    /static/assets/hero-screenshot-400.webp 400w,
    /static/assets/hero-screenshot-800.webp 800w,
    /static/assets/hero-screenshot-1200.webp 1200w
  "
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  loading="lazy"
  alt="Focused Room Chrome extension interface"
>
```

#### Design Prompt for OG Image
```
Create a 1200×630px OG image for "Focused Room" Chrome extension:
- Background: Soft gradient from #7A9E9F to #6B8B8C
- Center: "Protect Your Focus. Build Your Future." in bold white sans-serif
- Bottom: Chrome extension icon + "Focused Room" wordmark
- Style: Modern, minimal, professional
- Color palette: Use design system tokens
- Export: PNG (optimized) + WebP
```

#### Acceptance Criteria
- [ ] All images optimized (WebP + PNG)
- [ ] `srcset` implemented for hero
- [ ] Lazy loading for below-fold images
- [ ] OG image exists and loads correctly
- [ ] Lighthouse score improvement documented

---

### PR G: Lighthouse CI
**Branch**: `feature/lighthouse-ci`  
**Priority**: Critical  
**Estimated Effort**: 4-6 hours  
**Dependencies**: PRs A-F merged

#### Scope
1. Create `.lighthouserc.json` configuration
2. Update `.github/workflows/ci.yml` to run Lighthouse
3. Set performance budgets and thresholds
4. Add Lighthouse report artifacts

#### Lighthouse Configuration
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:5000/"],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240,
          "cpuSlowdownMultiplier": 1
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

#### GitHub Actions Job
```yaml
lighthouse:
  runs-on: ubuntu-latest
  needs: test
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    - run: |
        pip install -r requirements.txt
        python run.py &
        sleep 5
    - uses: treosh/lighthouse-ci-action@v10
      with:
        configPath: './.lighthouserc.json'
        uploadArtifacts: true
```

#### Acceptance Criteria
- [ ] Lighthouse CI runs on every PR
- [ ] Thresholds enforced (P≥80, A≥90, SEO≥90)
- [ ] Report artifact uploaded
- [ ] PR comment shows scores
- [ ] Documentation updated

---

### PR H: Final Polish
**Branch**: `feature/ui-polish`  
**Priority**: Medium  
**Estimated Effort**: 8-10 hours  
**Dependencies**: PRs A-G merged

#### Scope
1. Add microinteractions (hover, focus, loading states)
2. Implement dark mode with theme toggle
3. Add progress circle for Big Five
4. Polish animations and transitions
5. Final QA and bug fixes

#### Microinteractions
**Button Hover**:
```css
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(122, 158, 159, 0.2);
}
```

**Card Hover**:
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(15, 23, 36, 0.12);
}
```

#### Dark Mode Toggle
```html
<button id="theme-toggle" aria-label="Toggle dark mode">
  <span class="icon-sun">☀️</span>
  <span class="icon-moon">🌙</span>
</button>
```

```javascript
// main.js
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);

  toggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}
```

#### Progress Circle (Big Five)
```html
<svg class="progress-circle" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" stroke-width="8"/>
  <circle cx="50" cy="50" r="45" fill="none" stroke="#7A9E9F" stroke-width="8"
    stroke-dasharray="283" stroke-dashoffset="70.75"
    style="transform: rotate(-90deg); transform-origin: center;"/>
</svg>
```

#### Acceptance Criteria
- [ ] All microinteractions smooth (60fps)
- [ ] Dark mode works and persists
- [ ] Theme toggle accessible
- [ ] Progress circle animates
- [ ] Respects prefers-reduced-motion
- [ ] Final Lighthouse: P≥90, A≥95, SEO≥100
- [ ] All 247 tests passing

---

## 🧪 Testing Strategy

### Unit Tests (25 performance + 20 accessibility)
```bash
pytest tests/test_performance.py -v
pytest tests/test_accessibility.py -v
```

### Manual Testing Checklist
- [ ] Tab through all interactive elements (keyboard nav)
- [ ] Test newsletter form submission
- [ ] Test Big Five questionnaire (all pages)
- [ ] Verify dark mode toggle
- [ ] Check mobile responsiveness (375px, 768px, 1024px)
- [ ] Test in Chrome, Firefox, Safari
- [ ] Screen reader test (macOS VoiceOver or NVDA)

### Lighthouse Audit
```bash
# Local Lighthouse
npx lighthouse http://localhost:5000/ --view

# CI Lighthouse
# Automated on every PR via GitHub Actions
```

### Accessibility Audit
```bash
# Install axe-core CLI
npm install -g @axe-core/cli

# Run audit
axe http://localhost:5000/ --stdout
```

---

## 📊 Success Metrics

### Performance Metrics
- ✅ Lighthouse Performance: ≥90
- ✅ First Contentful Paint: <1.8s
- ✅ Largest Contentful Paint: <2.5s
- ✅ Total Blocking Time: <200ms
- ✅ Cumulative Layout Shift: <0.1
- ✅ Speed Index: <3.4s

### Accessibility Metrics
- ✅ Lighthouse Accessibility: ≥95
- ✅ WCAG 2.1 AA: 100% compliance
- ✅ axe-core: 0 critical violations
- ✅ Keyboard navigation: Full support
- ✅ Screen reader compatible: Yes

### Code Quality
- ✅ Test coverage: 247/248 passing (99.6%)
- ✅ No regressions in existing tests
- ✅ All linters passing
- ✅ No console errors

---

## 🚫 Constraints & Guardrails

### Allowed Modifications
- ✅ `app/templates/*` - All templates
- ✅ `app/static/**/*` - All static assets
- ✅ `app/utils/performance.py` - New performance utilities
- ✅ `tests/test_performance.py`, `tests/test_accessibility.py` - New tests only
- ✅ `.github/workflows/ci.yml` - Lighthouse CI job
- ✅ `docs/*.md` - Documentation

### Forbidden Modifications
- ❌ `app/routes.py`, `app/models.py`, `app/__init__.py` - Core backend
- ❌ Existing tests - `test_bigfive.py`, `test_subscribe.py`, etc.
- ❌ `../01_FocusedRoom/*` - Extension code
- ❌ Any secrets or API keys

### Exception Process
If you need to modify a forbidden file:
1. Document the reason in PR description
2. Get explicit approval before making changes
3. Ensure no breaking changes to existing functionality

---

## 📅 Timeline

| Phase | PRs | Duration | Completion |
|-------|-----|----------|------------|
| Week 1 | A, B | 5 days | Oct 9 |
| Week 2 | C, D, E | 5 days | Oct 16 |
| Week 3 | F, G, H | 4 days | Oct 18 |

**Total**: 14 days (with 2-day buffer)

---

## 🎯 Definition of Done

MILESTONE 7 is complete when:

- [ ] All 8 PRs merged to main
- [ ] Lighthouse scores: P≥90, A≥95, SEO≥100
- [ ] WCAG 2.1 AA: 100% compliance
- [ ] 247/248 tests passing (99.6%)
- [ ] Dark mode fully functional
- [ ] All documentation updated
- [ ] Production deployment successful
- [ ] No regressions in backend functionality

---

**Maintained by**: Focused Room Development Team  
**Last Updated**: October 4, 2025  
**Next Review**: After PR A merge
