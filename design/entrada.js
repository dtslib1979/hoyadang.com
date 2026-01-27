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
        initFlourDust();
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
      initFlourDust();
      initScrollEffects();
    }, 1500);
  }

  // Flour Dust — 밀가루 먼지 파티클 애니메이션
  function initFlourDust() {
    const container = document.getElementById('flourDust');
    const canvas = document.getElementById('dustCanvas');
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let width, height;

    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -Math.random() * 0.5 - 0.1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.y += this.speedY;

        // Fade in and out
        if (this.y < height * 0.3) {
          this.opacity -= this.fadeSpeed;
        }

        // Reset if out of bounds or faded
        if (this.y < -10 || this.opacity <= 0) {
          this.reset();
          this.y = height + 10;
          this.opacity = 0;
        }

        // Fade in from bottom
        if (this.y > height * 0.7 && this.opacity < 0.6) {
          this.opacity += this.fadeSpeed * 2;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        // Gradient fill for soft look
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(255, 250, 245, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(245, 230, 211, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(212, 168, 83, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Recreate particles on resize
      const particleCount = Math.floor((width * height) / 15000);
      particles = [];
      for (let i = 0; i < Math.min(particleCount, 50); i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    window.addEventListener('resize', resize);

    // Show container after delay
    setTimeout(() => {
      container.classList.add('visible');
      animate();
    }, 500);

    // Pause animation when not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
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
