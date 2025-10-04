/**
 * Focused Room - Main JavaScript
 * Version: 1.0.0
 *
 * Features:
 * - Newsletter form validation and submission
 * - Accessibility helpers (skip link, ARIA updates)
 * - Progressive enhancement (no JS required for basic functionality)
 *
 * Requirements:
 * - Pure vanilla JS (no dependencies)
 * - Works with /api/subscribe endpoint (MILESTONE 2)
 * - Graceful error handling
 * - Accessible (ARIA, keyboard support)
 */

(function() {
    'use strict';

    // ============================================
    // 1. NEWSLETTER FORM VALIDATION & SUBMISSION
    // ============================================

    /**
     * Email validation regex (RFC 5322 compliant)
     */
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    /**
     * Validate email format
     * @param {string} email - Email address to validate
     * @returns {boolean} True if valid, false otherwise
     */
    function isValidEmail(email) {
      return EMAIL_REGEX.test(email);
    }

    /**
     * Show message to user (success or error)
     * @param {HTMLElement} form - Form element
     * @param {string} message - Message to display
     * @param {string} type - 'success' or 'error'
     */
    function showMessage(form, message, type) {
      // Remove any existing message
      const existingMessage = form.querySelector('.form-message');
      if (existingMessage) {
        existingMessage.remove();
      }

      // Create message element
      const messageEl = document.createElement('div');
      messageEl.className = `form-message form-message-${type}`;
      messageEl.setAttribute('role', 'alert');
      messageEl.setAttribute('aria-live', 'polite');
      messageEl.textContent = message;

      // Style the message
      Object.assign(messageEl.style, {
        marginTop: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: '500',
        backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
        color: type === 'success' ? '#155724' : '#721c24',
        border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
      });

      // Insert after form
      form.appendChild(messageEl);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (messageEl.parentElement) {
          messageEl.remove();
        }
      }, 5000);
    }

    /**
     * Set form loading state
     * @param {HTMLElement} form - Form element
     * @param {HTMLElement} button - Submit button
     * @param {boolean} loading - Loading state
     */
    function setFormLoading(form, button, loading) {
      if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Subscribing...';
        button.setAttribute('aria-busy', 'true');
      } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Send me the ebook';
        button.removeAttribute('aria-busy');
      }
    }

    /**
     * Submit newsletter form via fetch API
     * @param {HTMLFormElement} form - Form element
     * @param {string} email - Email address
     */
    async function submitNewsletter(form, email) {
      const button = form.querySelector('button[type="submit"]');

      try {
        // Set loading state
        setFormLoading(form, button, true);

        // Submit to API endpoint
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (response.ok) {
          // Success
          showMessage(form, data.message || 'Successfully subscribed! Check your email.', 'success');
          form.reset();
        } else {
          // API error
          showMessage(form, data.error || 'Subscription failed. Please try again.', 'error');
        }
      } catch (error) {
        // Network error
        console.error('Newsletter subscription error:', error);
        showMessage(form, 'Network error. Please check your connection and try again.', 'error');
      } finally {
        // Reset loading state
        setFormLoading(form, button, false);
      }
    }

    /**
     * Initialize newsletter form
     */
    function initNewsletterForm() {
      const form = document.getElementById('subscribe-form');
      if (!form) return;

      const emailInput = document.getElementById('sub-email');
      if (!emailInput) return;

      // Client-side validation on input
      emailInput.addEventListener('input', function() {
        const email = this.value.trim();

        if (email && !isValidEmail(email)) {
          this.setCustomValidity('Please enter a valid email address');
          this.setAttribute('aria-invalid', 'true');
        } else {
          this.setCustomValidity('');
          this.setAttribute('aria-invalid', 'false');
        }
      });

      // Form submission
      form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Validate email
        if (!email) {
          showMessage(form, 'Please enter your email address', 'error');
          emailInput.focus();
          return;
        }

        if (!isValidEmail(email)) {
          showMessage(form, 'Please enter a valid email address', 'error');
          emailInput.focus();
          return;
        }

        // Submit form
        await submitNewsletter(form, email);
      });
    }

    // ============================================
    // 2. ACCESSIBILITY HELPERS
    // ============================================

    /**
     * Initialize skip link
     * Ensures skip link works properly and is keyboard accessible
     */
    function initSkipLink() {
      const skipLink = document.querySelector('.skip-link');
      if (!skipLink) return;

      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          // Set focus to target
          target.setAttribute('tabindex', '-1');
          target.focus();

          // Remove tabindex after focus (for natural tab order)
          target.addEventListener('blur', function() {
            this.removeAttribute('tabindex');
          }, { once: true });

          // Scroll to target (smooth scroll if supported)
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    /**
     * Enhance form accessibility
     * Add ARIA labels and improve screen reader experience
     */
    function enhanceFormAccessibility() {
      const forms = document.querySelectorAll('form');

      forms.forEach(form => {
        // Ensure all inputs have associated labels
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
          if (!input.id) return;

          // Check if label exists
          const label = form.querySelector(`label[for="${input.id}"]`);

          // If no label but placeholder exists, add aria-label
          if (!label && input.placeholder) {
            input.setAttribute('aria-label', input.placeholder);
          }
        });
      });
    }

    /**
     * Keyboard navigation helper
     * Ensure all interactive elements are keyboard accessible
     */
    function initKeyboardNavigation() {
      // Add visible focus indicator class when using keyboard
      let isUsingKeyboard = false;

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          isUsingKeyboard = true;
          document.body.classList.add('keyboard-navigation');
        }
      });

      document.addEventListener('mousedown', function() {
        isUsingKeyboard = false;
        document.body.classList.remove('keyboard-navigation');
      });
    }

    // ============================================
    // 3. UTILITY FUNCTIONS
    // ============================================

    /**
     * Debounce function for performance
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    /**
     * Check if user prefers reduced motion
     * @returns {boolean} True if user prefers reduced motion
     */
    function prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

  // ============================================
  // 4. HERO CAROUSEL
  // ============================================

  /**
   * Initialize hero image carousel
   */
  function initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (slides.length === 0 || indicators.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayInterval;

    /**
     * Show specific slide
     * @param {number} index - Slide index to show
     */
    function showSlide(index) {
      // Remove active class from all slides and indicators
      slides.forEach(slide => {
        slide.classList.remove('active');
      });
      indicators.forEach(indicator => {
        indicator.classList.remove('active');
      });

      // Add active class to current slide and indicator
      slides[index].classList.add('active');
      indicators[index].classList.add('active');

      currentSlide = index;
    }

    /**
     * Go to next slide
     */
    function nextSlide() {
      const next = (currentSlide + 1) % totalSlides;
      showSlide(next);
    }

    /**
     * Start autoplay
     */
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }

    /**
     * Stop autoplay
     */
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        stopAutoplay();
        showSlide(index);
        startAutoplay(); // Restart autoplay after manual change
      });
    });

    // Pause autoplay on hover
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
    }

    // Start autoplay
    startAutoplay();
  }

  // ============================================
  // 5. INITIALIZATION
  // ============================================

  /**
   * Initialize all features when DOM is ready
   */
  function init() {
    // Initialize newsletter form
    initNewsletterForm();

    // Initialize accessibility helpers
    initSkipLink();
    enhanceFormAccessibility();
    initKeyboardNavigation();

    // Initialize hero carousel
    initHeroCarousel();

    // Log initialization (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('✅ Focused Room JavaScript initialized');
    }
  }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      // DOM is already ready
      init();
    }

    // Export functions for testing (if needed)
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = {
        isValidEmail,
        debounce,
        prefersReducedMotion
      };
    }

  })();
