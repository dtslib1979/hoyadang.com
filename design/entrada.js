/**
 * Entrada — Ritual de Ingreso v2.0 (HOYADANG Edition)
 *
 * "손을 펴세요." — Open your hands.
 *
 * Timeline:
 *   0.0s  — Kitchen darkness (film black)
 *   1.5s  — "Abrí las manos." (Open your hands)
 *   3.0s  — "손을 펴세요." (Korean)
 *   5.0s  — Shutter opens, system awakens
 *
 * Skip: Button available for returning users.
 * Session: Once entered, ritual is instant on revisit.
 */

(function() {
  'use strict';

  const BEAT = 1000;      // 60 BPM
  const BREATH = 3000;
  const INTRO_DURATION = 5000;

  function init() {
    const intro = document.getElementById('intro');
    if (!intro) return;

    // Skip for returning visitors
    if (sessionStorage.getItem('hoyadang_entered') === 'true') {
      intro.classList.add('abierto');
      setTimeout(() => {
        intro.style.display = 'none';
        initMasaRibbon();
        initScrollEffects();
      }, 100);
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
      initMasaRibbon();
      initScrollEffects();
    }, 1500);
  }

  // Masa Ribbon — Dough thread animation
  function initMasaRibbon() {
    const container = document.getElementById('masaContainer');
    const mainPath = document.getElementById('masaMain');
    const ambient = document.getElementById('masaAmbient');
    const thread1 = document.getElementById('masaThread1');
    const thread2 = document.getElementById('masaThread2');

    if (!container || !mainPath) return;

    const paths = [
      { el: mainPath, lag: 0 },
      { el: ambient, lag: 0 },
      { el: thread1, lag: 0.02 },
      { el: thread2, lag: 0.04 }
    ];

    // Initialize path lengths
    paths.forEach(p => {
      if (!p.el) return;
      p.len = p.el.getTotalLength();
      p.el.style.strokeDasharray = p.len;
      p.el.style.strokeDashoffset = p.len;
    });

    const INITIAL_DRAW = 0.2;

    // Show ribbon
    setTimeout(() => {
      container.classList.add('visible');

      // Staggered initial draw
      paths.forEach((p, i) => {
        if (!p.el) return;
        const delay = i * 150;
        const drawAmount = INITIAL_DRAW * Math.max(0.5, 1 - p.lag * 2);
        setTimeout(() => {
          p.el.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';
          p.el.style.strokeDashoffset = p.len * (1 - drawAmount);
        }, delay);
      });

      // Reset to fast transitions
      setTimeout(() => {
        paths.forEach(p => {
          if (p.el) p.el.style.transition = 'stroke-dashoffset 0.1s linear';
        });
      }, 3000);
    }, 500);

    // Scroll-linked reveal
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrollTop / docHeight, 1);

        paths.forEach(p => {
          if (!p.el) return;
          const progress = Math.max(INITIAL_DRAW,
            INITIAL_DRAW + Math.max(0, scrollProgress - p.lag) * (1 - INITIAL_DRAW));
          p.el.style.strokeDashoffset = p.len * (1 - progress);
        });

        // Add alive class when scrolled
        if (scrollProgress > 0.05) {
          mainPath.classList.add('alive');
          if (thread1) thread1.classList.add('alive');
          if (thread2) thread2.classList.add('alive');
        } else {
          mainPath.classList.remove('alive');
          if (thread1) thread1.classList.remove('alive');
          if (thread2) thread2.classList.remove('alive');
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll Effects
  function initScrollEffects() {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.revelar');
    const pisoIndicator = document.querySelector('.piso-indicator');
    const pisoDots = document.querySelectorAll('.piso-dot');
    const pasos = document.querySelectorAll('.paso, .espacio, .danza-section, .ending');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // Body scrolled state
    let scrolled = false;
    window.addEventListener('scroll', () => {
      const isScrolled = window.pageYOffset > 100;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        document.body.classList.toggle('scrolled', scrolled);
      }

      // Update piso indicator
      if (pisoDots.length && pasos.length) {
        let activeIndex = 0;
        pasos.forEach((paso, i) => {
          const rect = paso.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2) {
            activeIndex = i;
          }
        });
        pisoDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIndex);
        });
      }
    }, { passive: true });
  }

  // Hand motion tracking (device orientation)
  function initHandMotion() {
    if (!window.DeviceOrientationEvent) return;

    function handleOrientation(event) {
      const x = event.gamma || 0; // -90 to 90
      const y = event.beta || 0;  // -180 to 180

      document.documentElement.style.setProperty('--hand-x', `${x * 0.5}px`);
      document.documentElement.style.setProperty('--hand-y', `${y * 0.3}px`);
    }

    // Request permission on iOS 13+
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.body.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(console.error);
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      initHandMotion();
    });
  } else {
    init();
    initHandMotion();
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
