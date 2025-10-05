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

  /* ============================================
     BIG FIVE PERSONALITY TEST
     ============================================ */

  (function() {
    'use strict';

    // Big Five Questions (44-item IPIP questionnaire)
    const BIG_FIVE_QUESTIONS = [
      // Extraversion (8 items)
      { id: 1, text: "I am the life of the party.", trait: "extraversion", reverse: false },
      { id: 2, text: "I don't talk a lot.", trait: "extraversion", reverse: true },
      { id: 3, text: "I feel comfortable around people.", trait: "extraversion", reverse: false },
      { id: 4, text: "I keep in the background.", trait: "extraversion", reverse: true },
      { id: 5, text: "I start conversations.", trait: "extraversion", reverse: false },
      { id: 6, text: "I have little to say.", trait: "extraversion", reverse: true },
      { id: 7, text: "I talk to a lot of different people at parties.", trait: "extraversion", reverse: false },
      { id: 8, text: "I don't like to draw attention to myself.", trait: "extraversion", reverse: true },

      // Agreeableness (9 items)
      { id: 9, text: "I feel little concern for others.", trait: "agreeableness", reverse: true },
      { id: 10, text: "I am interested in people.", trait: "agreeableness", reverse: false },
      { id: 11, text: "I insult people.", trait: "agreeableness", reverse: true },
      { id: 12, text: "I sympathize with others' feelings.", trait: "agreeableness", reverse: false },
      { id: 13, text: "I am not interested in other people's problems.", trait: "agreeableness", reverse: true },
      { id: 14, text: "I have a soft heart.", trait: "agreeableness", reverse: false },
      { id: 15, text: "I am not really interested in others.", trait: "agreeableness", reverse: true },
      { id: 16, text: "I take time out for others.", trait: "agreeableness", reverse: false },
      { id: 17, text: "I feel others' emotions.", trait: "agreeableness", reverse: false },

      // Conscientiousness (9 items)
      { id: 18, text: "I am always prepared.", trait: "conscientiousness", reverse: false },
      { id: 19, text: "I leave my belongings around.", trait: "conscientiousness", reverse: true },
      { id: 20, text: "I pay attention to details.", trait: "conscientiousness", reverse: false },
      { id: 21, text: "I make a mess of things.", trait: "conscientiousness", reverse: true },
      { id: 22, text: "I get chores done right away.", trait: "conscientiousness", reverse: false },
      { id: 23, text: "I often forget to put things back in their proper place.", trait: "conscientiousness", reverse: true },
      { id: 24, text: "I like order.", trait: "conscientiousness", reverse: false },
      { id: 25, text: "I shirk my duties.", trait: "conscientiousness", reverse: true },
      { id: 26, text: "I follow a schedule.", trait: "conscientiousness", reverse: false },

      // Neuroticism (8 items)
      { id: 27, text: "I get stressed out easily.", trait: "neuroticism", reverse: false },
      { id: 28, text: "I am relaxed most of the time.", trait: "neuroticism", reverse: true },
      { id: 29, text: "I worry about things.", trait: "neuroticism", reverse: false },
      { id: 30, text: "I seldom feel blue.", trait: "neuroticism", reverse: true },
      { id: 31, text: "I am easily disturbed.", trait: "neuroticism", reverse: false },
      { id: 32, text: "I get upset easily.", trait: "neuroticism", reverse: false },
      { id: 33, text: "I change my mood a lot.", trait: "neuroticism", reverse: false },
      { id: 34, text: "I have frequent mood swings.", trait: "neuroticism", reverse: false },

      // Openness (10 items)
      { id: 35, text: "I have a rich vocabulary.", trait: "openness", reverse: false },
      { id: 36, text: "I have difficulty understanding abstract ideas.", trait: "openness", reverse: true },
      { id: 37, text: "I have a vivid imagination.", trait: "openness", reverse: false },
      { id: 38, text: "I am not interested in abstract ideas.", trait: "openness", reverse: true },
      { id: 39, text: "I have excellent ideas.", trait: "openness", reverse: false },
      { id: 40, text: "I do not have a good imagination.", trait: "openness", reverse: true },
      { id: 41, text: "I am quick to understand things.", trait: "openness", reverse: false },
      { id: 42, text: "I use difficult words.", trait: "openness", reverse: false },
      { id: 43, text: "I spend time reflecting on things.", trait: "openness", reverse: false },
      { id: 44, text: "I am full of ideas.", trait: "openness", reverse: false }
    ];

    // Trait descriptions for results
    const TRAIT_DESCRIPTIONS = {
      openness: {
        name: "Openness to Experience",
        icon: "🎨",
        high: "You are imaginative, curious, and open to new experiences. You enjoy exploring novel ideas and appreciate art and beauty.",
        low: "You prefer routine and familiar experiences. You are practical and down-to-earth in your approach to life."
      },
      conscientiousness: {
        name: "Conscientiousness",
        icon: "✅",
        high: "You are organized, responsible, and goal-oriented. You plan ahead and follow through on your commitments.",
        low: "You are spontaneous and flexible. You prefer to go with the flow rather than stick to rigid schedules."
      },
      extraversion: {
        name: "Extraversion",
        icon: "⚡",
        high: "You are outgoing, energetic, and enjoy being around people. You thrive in social situations and seek excitement.",
        low: "You are reserved and prefer solitary activities. You feel most comfortable in quiet, low-key environments."
      },
      agreeableness: {
        name: "Agreeableness",
        icon: "🤝",
        high: "You are compassionate, cooperative, and value harmony. You are considerate of others' feelings and needs.",
        low: "You are analytical and skeptical. You prioritize logic over emotions and are comfortable with conflict."
      },
      neuroticism: {
        name: "Emotional Stability",
        icon: "🧘",
        high: "You are calm, emotionally stable, and resilient. You handle stress well and maintain composure under pressure.",
        low: "You are sensitive and emotionally reactive. You experience emotions intensely and may worry frequently."
      }
    };

    // State management
    let currentPage = 0;
    let answers = new Array(44).fill(null);
    let userEmail = null;
    const questionsPerPage = 5;
    const totalPages = Math.ceil(BIG_FIVE_QUESTIONS.length / questionsPerPage);

    // DOM elements
    const startTestBtn = document.getElementById('start-test-btn');
    const startTestTriggers = document.querySelectorAll('.start-test-trigger');
    const questionnaireSection = document.getElementById('questionnaire-section');
    const questionContainer = document.getElementById('question-container');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const emailModal = document.getElementById('email-modal');
    const emailForm = document.getElementById('email-gate-form');
    const resultsSection = document.getElementById('results-section');

    // Initialize - Attach event listeners to all start test buttons
    if (startTestBtn) {
      startTestBtn.addEventListener('click', startTest);
    }
    startTestTriggers.forEach(btn => {
      btn.addEventListener('click', startTest);
    });

    function startTest() {
      // Scroll to questionnaire
      questionnaireSection.style.display = 'block';
      questionnaireSection.scrollIntoView({ behavior: 'smooth' });

      // Initialize questionnaire
      renderQuestionPage(0);
      updateProgress();

      // Set up navigation
      prevBtn.addEventListener('click', goToPreviousPage);
      nextBtn.addEventListener('click', goToNextPage);
      submitBtn.addEventListener('click', showEmailModal);
    }

    function renderQuestionPage(pageIndex) {
      const startIdx = pageIndex * questionsPerPage;
      const endIdx = Math.min(startIdx + questionsPerPage, BIG_FIVE_QUESTIONS.length);
      const pageQuestions = BIG_FIVE_QUESTIONS.slice(startIdx, endIdx);

      const pageHTML = `
        <div class="question-page active">
          ${pageQuestions.map((q, idx) => `
            <div class="question-item">
              <div class="question-text">${startIdx + idx + 1}. ${q.text}</div>
              <div class="question-options">
                ${[1, 2, 3, 4, 5].map(value => `
                  <label class="option-label">
                    <input
                      type="radio"
                      name="question-${q.id}"
                      value="${value}"
                      class="option-input"
                      data-question-id="${q.id}"
                      ${answers[q.id - 1] === value ? 'checked' : ''}
                    >
                    <span class="option-button">${value}</span>
                  </label>
                `).join('')}
              </div>
              <div class="option-scale">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      questionContainer.innerHTML = pageHTML;

      // Add event listeners to radio buttons
      const radioButtons = questionContainer.querySelectorAll('.option-input');
      radioButtons.forEach(radio => {
        radio.addEventListener('change', handleAnswerChange);
      });

      // Update trait indicators
      updateTraitIndicators(pageQuestions[0].trait);
    }

    function handleAnswerChange(e) {
      const questionId = parseInt(e.target.dataset.questionId);
      const value = parseInt(e.target.value);
      answers[questionId - 1] = value;

      // Save to localStorage
      localStorage.setItem('bigfive_answers', JSON.stringify(answers));

      updateProgress();
    }

    function updateProgress() {
      const answeredCount = answers.filter(a => a !== null).length;
      const percentage = Math.round((answeredCount / BIG_FIVE_QUESTIONS.length) * 100);

      progressFill.style.width = `${percentage}%`;
      progressPercentage.textContent = `${percentage}%`;
      currentQuestionSpan.textContent = answeredCount;
      totalQuestionsSpan.textContent = BIG_FIVE_QUESTIONS.length;

      // Enable/disable navigation buttons
      prevBtn.disabled = currentPage === 0;

      const currentPageAnswered = isCurrentPageAnswered();
      nextBtn.disabled = !currentPageAnswered;

      // Show submit button on last page if all answered
      if (currentPage === totalPages - 1 && answeredCount === BIG_FIVE_QUESTIONS.length) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
      } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
      }
    }

    function isCurrentPageAnswered() {
      const startIdx = currentPage * questionsPerPage;
      const endIdx = Math.min(startIdx + questionsPerPage, BIG_FIVE_QUESTIONS.length);

      for (let i = startIdx; i < endIdx; i++) {
        if (answers[i] === null) {
          return false;
        }
      }
      return true;
    }

    function updateTraitIndicators(currentTrait) {
      const indicators = document.querySelectorAll('.trait-indicator');
      indicators.forEach(indicator => {
        const trait = indicator.dataset.trait;
        if (trait === currentTrait) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }

    function goToPreviousPage() {
      if (currentPage > 0) {
        currentPage--;
        renderQuestionPage(currentPage);
        updateProgress();
        questionnaireSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function goToNextPage() {
      if (currentPage < totalPages - 1 && isCurrentPageAnswered()) {
        currentPage++;
        renderQuestionPage(currentPage);
        updateProgress();
        questionnaireSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function showEmailModal() {
      // First, show preview of results to create desire
      showPreviewResults();

      // Then show email modal after a brief delay
      setTimeout(() => {
        emailModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Close modal on overlay click
        const overlay = document.getElementById('modal-overlay');
        overlay.addEventListener('click', closeEmailModal);
      }, 500);
    }

    function closeEmailModal() {
      emailModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    function showPreviewResults() {
      // Calculate scores for preview
      const scores = calculateScores();

      // Hide questionnaire
      questionnaireSection.style.display = 'none';

      // Show results section in preview mode
      resultsSection.style.display = 'block';
      resultsSection.classList.add('preview-mode');
      resultsSection.scrollIntoView({ behavior: 'smooth' });

      // Display preview (scores visible, descriptions blurred)
      displayPreviewResults(scores);
    }

    function displayPreviewResults(scores) {
      // Display trait breakdowns (preview mode - scores only)
      const resultsTraits = document.querySelector('.results-traits');
      if (!resultsTraits) return;

      // Custom unlock messages for each trait to create intrigue
      const unlockMessages = {
        openness: {
          title: "Unlock Your Creative Potential",
          items: [
            "Why you think differently than 80% of people",
            "Your hidden innovation superpowers",
            "How to leverage your curiosity for success"
          ]
        },
        conscientiousness: {
          title: "Decode Your Work Style",
          items: [
            "The productivity system designed for YOUR brain",
            "Why traditional advice might be failing you",
            "Your secret weapon for achieving goals"
          ]
        },
        extraversion: {
          title: "Master Your Energy",
          items: [
            "Where you get your power (and how to protect it)",
            "Your ideal work environment revealed",
            "Why you thrive (or drain) in social settings"
          ]
        },
        agreeableness: {
          title: "Understand Your Relationships",
          items: [
            "How you naturally influence others",
            "Your conflict resolution superpower",
            "Why people respond to you the way they do"
          ]
        },
        neuroticism: {
          title: "Harness Your Emotions",
          items: [
            "Your stress response pattern decoded",
            "How to turn sensitivity into strength",
            "The resilience strategy built for you"
          ]
        }
      };

      const traitsHTML = Object.entries(scores).map(([trait, data]) => {
        const desc = TRAIT_DESCRIPTIONS[trait];
        const score = trait === 'neuroticism' ? 100 - data.score : data.score;
        const unlockMsg = unlockMessages[trait];

        return `
          <div class="result-trait-card preview-locked">
            <div class="result-trait-header">
              <div>
                <span style="font-size: 2rem; margin-right: 0.5rem;">${desc.icon}</span>
                <span class="result-trait-name">${desc.name}</span>
              </div>
              <div class="result-trait-score">${score}%</div>
            </div>
            <div class="result-trait-bar">
              <div class="result-trait-fill" style="width: ${score}%"></div>
            </div>
            <div class="preview-blur-overlay">
              <div class="unlock-message">
                <span class="lock-icon">🔒</span>
                <p class="unlock-title"><strong>${unlockMsg.title}</strong></p>
                <ul class="unlock-benefits">
                  ${unlockMsg.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <p class="unlock-cta">Enter your email to discover your full ${desc.name.toLowerCase()} profile</p>
              </div>
            </div>
          </div>
        `;
      }).join('');

      resultsTraits.innerHTML = traitsHTML;

      // Hide AI insights section in preview
      const aiInsights = document.querySelector('.results-ai-insights');
      if (aiInsights) {
        aiInsights.style.display = 'none';
      }

      // Hide radar chart in preview
      const chartContainer = document.querySelector('.results-chart-container');
      if (chartContainer) {
        chartContainer.style.display = 'none';
      }
    }

    // Handle email form submission
    if (emailForm) {
      emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const emailInput = document.getElementById('email-input');
        userEmail = emailInput.value.trim();

        if (!userEmail || !isValidEmail(userEmail)) {
          alert('Please enter a valid email address');
          return;
        }

        // Close modal
        closeEmailModal();

        // Calculate and submit results
        await submitResults();
      });
    }

    async function submitResults() {
      try {
        // Calculate scores
        const scores = calculateScores();

        // Submit to backend
        const response = await fetch('/big-five', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            answers: answers,
            email: userEmail
          })
        });

        if (!response.ok) {
          throw new Error('Failed to submit results');
        }

        const data = await response.json();

        // Hide questionnaire, show results
        questionnaireSection.style.display = 'none';
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });

        // Display results
        displayResults(data);

        // Clear localStorage
        localStorage.removeItem('bigfive_answers');

      } catch (error) {
        console.error('Error submitting results:', error);
        alert('There was an error processing your results. Please try again.');
      }
    }

    function calculateScores() {
      const traitScores = {
        openness: [],
        conscientiousness: [],
        extraversion: [],
        agreeableness: [],
        neuroticism: []
      };

      // Group answers by trait
      BIG_FIVE_QUESTIONS.forEach((q, idx) => {
        const answer = answers[idx];
        if (answer !== null) {
          const score = q.reverse ? (6 - answer) : answer;
          traitScores[q.trait].push(score);
        }
      });

      // Calculate averages and percentiles
      const results = {};
      Object.keys(traitScores).forEach(trait => {
        const scores = traitScores[trait];
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const normalized = ((average - 1) / 4) * 100; // Convert to 0-100 scale

        results[trait] = {
          score: Math.round(normalized),
          percentile: Math.round(normalized)
        };
      });

      return results;
    }

    function displayResults(data) {
      // Remove preview mode
      resultsSection.classList.remove('preview-mode');

      // Show radar chart
      const chartContainer = document.querySelector('.results-chart-container');
      if (chartContainer) {
        chartContainer.style.display = 'block';
      }

      // Show AI insights
      const aiInsights = document.querySelector('.results-ai-insights');
      if (aiInsights) {
        aiInsights.style.display = 'block';
      }

      // Display radar chart
      displayRadarChart(data.scores);

      // Display trait breakdowns (full version with descriptions)
      displayTraitBreakdowns(data.scores);

      // Display AI insights
      displayAIInsights(data.suggestions || 'Generating your personalized insights...');
    }

    function displayRadarChart(scores) {
      const canvas = document.getElementById('personality-chart');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      // Check if Chart.js is loaded
      if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, skipping radar chart');
        canvas.parentElement.innerHTML = '<p>Chart visualization unavailable</p>';
        return;
      }

      const chartData = {
        labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional Stability'],
        datasets: [{
          label: 'Your Personality Profile',
          data: [
            scores.openness.score,
            scores.conscientiousness.score,
            scores.extraversion.score,
            scores.agreeableness.score,
            100 - scores.neuroticism.score // Invert neuroticism to emotional stability
          ],
          backgroundColor: 'rgba(122, 158, 159, 0.2)',
          borderColor: 'rgba(122, 158, 159, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(122, 158, 159, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(122, 158, 159, 1)'
        }]
      };

      new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    function displayTraitBreakdowns(scores) {
      const resultsTraits = document.getElementById('results-traits');
      if (!resultsTraits) return;

      const traitsHTML = Object.entries(scores).map(([trait, data]) => {
        const desc = TRAIT_DESCRIPTIONS[trait];
        const score = trait === 'neuroticism' ? 100 - data.score : data.score;
        const isHigh = score >= 50;
        const description = isHigh ? desc.high : desc.low;

        return `
          <div class="result-trait-card">
            <div class="result-trait-header">
              <div>
                <span style="font-size: 2rem; margin-right: 0.5rem;">${desc.icon}</span>
                <span class="result-trait-name">${desc.name}</span>
              </div>
              <div class="result-trait-score">${score}%</div>
            </div>
            <div class="result-trait-bar">
              <div class="result-trait-fill" style="width: ${score}%"></div>
            </div>
            <p class="result-trait-description">${description}</p>
          </div>
        `;
      }).join('');

      resultsTraits.innerHTML = traitsHTML;
    }

    function displayAIInsights(suggestions) {
      const aiInsightsContent = document.getElementById('ai-insights-content');
      if (!aiInsightsContent) return;

      aiInsightsContent.innerHTML = `<p>${suggestions}</p>`;
    }

    // Restore progress from localStorage on page load
    const savedAnswers = localStorage.getItem('bigfive_answers');
    if (savedAnswers) {
      try {
        answers = JSON.parse(savedAnswers);
      } catch (e) {
        console.error('Error parsing saved answers:', e);
      }
    }

  })();
