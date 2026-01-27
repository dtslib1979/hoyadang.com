/**
 * Entrada — Ritual de Ingreso v3.0 (HOYADANG Edition - Optimized)
 *
 * "손을 펴세요." — Open your hands.
 *
 * OPTIMIZATIONS:
 * - Removed heavy canvas particle system
 * - Throttled scroll events
 * - GPU-accelerated animations only
 * - IntersectionObserver for all scroll-based effects
 */

(function() {
  'use strict';

  const INTRO_DURATION = 5000;

  function init() {
    // Force scroll to top on page load
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const intro = document.getElementById('intro');
    if (!intro) return;

    // Skip for returning visitors
    if (sessionStorage.getItem('hoyadang_entered') === 'true') {
      intro.classList.add('abierto');
      intro.style.display = 'none';
      initScrollEffects();
      return;
    }

    // Skip button
    const skipBtn = intro.querySelector('.intro-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => openShutter(intro), { once: true });
    }

    // Auto open after intro duration
    setTimeout(() => {
      if (!intro.classList.contains('abierto')) {
        openShutter(intro);
      }
    }, INTRO_DURATION);

    // Touch/click to skip
    intro.addEventListener('click', (e) => {
      if (e.target !== skipBtn) {
        openShutter(intro);
      }
    }, { once: true });
  }

  function openShutter(intro) {
    sessionStorage.setItem('hoyadang_entered', 'true');
    intro.classList.add('abierto');

    // Vibrate on supported devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setTimeout(() => {
      intro.style.display = 'none';
      initScrollEffects();
    }, 1500);
  }

  // Optimized Scroll Effects
  function initScrollEffects() {
    const revealElements = document.querySelectorAll('.revelar');
    const pisoDots = document.querySelectorAll('.piso-dot');
    const pasos = document.querySelectorAll('.paso, .espacio, .danza-section, .ending, .map-container');

    // Reveal observer - efficient batch processing
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Piso indicator observer - using IntersectionObserver instead of scroll
    if (pisoDots.length && pasos.length) {
      const pasoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Array.from(pasos).indexOf(entry.target);
            pisoDots.forEach((dot, i) => {
              dot.classList.toggle('active', i === index);
            });
          }
        });
      }, {
        threshold: 0,
        rootMargin: '-45% 0px -45% 0px'
      });

      pasos.forEach(paso => pasoObserver.observe(paso));
    }

    // Throttled scroll for body class only
    let ticking = false;
    let scrolled = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.pageYOffset > 100;
          if (isScrolled !== scrolled) {
            scrolled = isScrolled;
            document.body.classList.toggle('scrolled', scrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/**
 * Film Strip Carousel
 */
(function() {
  'use strict';

  function initFilmStrip() {
    const strip = document.querySelector('.film-strip');
    if (!strip) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    strip.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
    });

    strip.addEventListener('mouseleave', () => {
      isDown = false;
    });

    strip.addEventListener('mouseup', () => {
      isDown = false;
    });

    strip.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - strip.offsetLeft;
      const walk = (x - startX) * 2;
      strip.scrollLeft = scrollLeft - walk;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilmStrip);
  } else {
    initFilmStrip();
  }
})();

// Audio Player is now in index.html inline script
