/**
 * Body Interaction Protocol v3.0
 *
 * "En este sistema, el botón no es la mano.
 *  Es el peso del cuerpo moviéndose."
 *
 * Scroll  → Acercarse (approach — reveal on intersection)
 * Tap     → Compromiso (commit — decision made)
 * Hold    → Esperar (wait — secrets unfold)
 * Swipe   → Girar (turn — navigate layers)
 * Idle    → Respirar (breathe — system rests)
 * Back    → Soltar (release — let go)
 */

(function() {
  'use strict';

  const BEAT = 857;
  const HALF = 428;

  // ─── Scroll = Acercarse ───
  // IntersectionObserver reveals elements as you approach them.
  function initAcercarse() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll('.revelar, .revelar--izq, .revelar--der, .revelar--escala').forEach(el => {
      observer.observe(el);
    });
  }

  // ─── Hold = Esperar ───
  // Long press reveals hidden content (data-secreto elements).
  function initEsperar() {
    let timer = null;

    document.querySelectorAll('[data-secreto]').forEach(el => {
      function startWait(e) {
        e.preventDefault();
        timer = setTimeout(() => {
          el.classList.add('secreto-visible');
          el.setAttribute('aria-expanded', 'true');
          // Dispatch event for custom listeners
          el.dispatchEvent(new CustomEvent('secreto-visible'));
        }, BEAT);
      }

      function cancelWait() {
        if (timer) { clearTimeout(timer); timer = null; }
      }

      el.addEventListener('touchstart', startWait, { passive: false });
      el.addEventListener('mousedown', startWait);
      el.addEventListener('touchend', cancelWait, { passive: true });
      el.addEventListener('touchmove', cancelWait, { passive: true });
      el.addEventListener('mouseup', cancelWait);
      el.addEventListener('mouseleave', cancelWait);
    });
  }

  // ─── Idle = Respirar ───
  // After 3 seconds of no input, the system breathes.
  function initRespirar() {
    let idleTimer = null;
    const body = document.body;

    function resetIdle() {
      body.classList.remove('respirando');
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        body.classList.add('respirando');
      }, 3000);
    }

    ['touchstart', 'scroll', 'click', 'keydown'].forEach(evt => {
      document.addEventListener(evt, resetIdle, { passive: true });
    });

    resetIdle();
  }

  // ─── Swipe = Girar ───
  // Horizontal swipe navigates between layers.
  function initGirar() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let startTarget = null;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      startTime = Date.now();
      startTarget = e.target;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      // Skip if swipe originated inside a carousel or interactive scroll region
      if (startTarget && startTarget.closest('.tablet-carousel, .tablet-track')) return;

      const diffX = startX - e.changedTouches[0].pageX;
      const diffY = startY - e.changedTouches[0].pageY;
      const elapsed = Date.now() - startTime;

      // Must be horizontal, fast, and intentional
      if (Math.abs(diffX) > 80 && Math.abs(diffX) > Math.abs(diffY) * 1.5 && elapsed < 400) {
        navigate(diffX > 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  // ─── Navigation ───
  // Detect current layer and navigate relative to it.
  function navigate(direction) {
    const layers = ['emisión/', 'cuerpo/', 'laboratorio/', 'control/', 'legado/'];
    const path = window.location.pathname;

    // Determine current index
    let currentIdx = -1;
    layers.forEach((layer, i) => {
      if (path.includes(layer)) currentIdx = i;
    });

    // If on root, swipe left goes to first layer
    if (currentIdx === -1 && path.match(/\/(index\.html)?$/)) {
      if (direction === 1) {
        transitionTo(layers[0]);
      }
      return;
    }

    const nextIdx = currentIdx + direction;
    if (nextIdx >= 0 && nextIdx < layers.length) {
      transitionTo('../' + layers[nextIdx]);
    } else if (nextIdx < 0) {
      transitionTo('../');
    }
  }

  function transitionTo(url) {
    document.body.style.transition = `opacity ${HALF}ms var(--retreat)`;
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = url; }, HALF);
  }

  // ─── Init ───
  function init() {
    initAcercarse();
    initEsperar();
    initRespirar();
    initGirar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
