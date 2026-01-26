/**
 * Entrada — Ritual de Ingreso v4.0 (120-Point Edition)
 *
 * The entrance is not a click. It's a ceremony.
 * Extended with motion permission and body calibration.
 *
 * Timeline (New):
 *   0.0s  — Absolute darkness
 *   2.0s  — Motion permission button appears (iOS)
 *   [permission granted]
 *   3.0s  — "폰을 가슴에 대세요" (Calibration prompt)
 *   [device horizontal detected OR timeout]
 *   4.5s  — "천천히 숨을 쉬세요" (Breath prompt)
 *   [two taps OR timeout]
 *   6.0s  — Ritual fades out, system awakens
 *
 * Skip: Button available for returning users.
 * Session: Once entered, ritual is instant on revisit.
 */

(function() {
  'use strict';

  const BEAT = 857;
  const BREATH = 2571;
  const DARKNESS_DURATION = 2000;
  const STEP_TIMEOUT = 5000;

  let currentStage = 0;

  function init() {
    const ritual = document.querySelector('.ritual');
    if (!ritual) return;

    // Skip for returning visitors
    if (sessionStorage.getItem('tango_entered') === 'true') {
      ritual.classList.add('despierta');
      requestMotionPermission();  // Still request permission silently
      return;
    }

    // Skip button
    const skipBtn = ritual.querySelector('.ritual-saltar');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => awaken(ritual), { once: true });
    }

    // Start the ritual stages
    startRitual(ritual);
  }

  async function startRitual(ritual) {
    const texto = ritual.querySelector('.ritual-texto');
    const instruction = ritual.querySelector('.ritual-instruction') ||
                        createInstruction(ritual);
    const motionBtn = ritual.querySelector('.ritual-motion-btn') ||
                      createMotionButton(ritual);

    // Stage 1: Darkness
    await wait(DARKNESS_DURATION);
    if (ritual.classList.contains('despierta')) return;

    // Stage 2: Motion Permission (iOS only)
    if (needsMotionPermission()) {
      texto.textContent = '';
      instruction.textContent = '움직임 감지를 활성화하세요';
      instruction.style.opacity = '1';
      motionBtn.style.opacity = '1';

      const permissionGranted = await waitForMotionPermission(motionBtn);
      if (!permissionGranted) {
        // Continue anyway, but without motion features
        console.log('Motion permission denied, continuing without motion');
      }

      motionBtn.style.opacity = '0';
      await wait(500);
    } else {
      // Request permission silently for non-iOS
      await requestMotionPermission();
    }

    if (ritual.classList.contains('despierta')) return;

    // Stage 3: Calibration
    texto.textContent = '폰을 가슴에 대세요.';
    texto.style.opacity = '1';
    instruction.textContent = '';
    instruction.style.opacity = '0';

    const calibrated = await waitForCalibration();
    if (calibrated && navigator.vibrate) {
      navigator.vibrate(100);
    }

    if (ritual.classList.contains('despierta')) return;
    await wait(800);

    // Stage 4: Breath
    texto.textContent = '천천히 숨을 쉬세요.';
    instruction.textContent = '화면을 두 번 터치하세요';
    instruction.style.opacity = '0.5';

    await waitForBreath();
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }

    if (ritual.classList.contains('despierta')) return;
    await wait(500);

    // Stage 5: Awaken
    awaken(ritual);
  }

  function createInstruction(ritual) {
    const instruction = document.createElement('p');
    instruction.className = 'ritual-instruction';
    ritual.insertBefore(instruction, ritual.querySelector('.ritual-saltar'));
    return instruction;
  }

  function createMotionButton(ritual) {
    const btn = document.createElement('button');
    btn.className = 'ritual-motion-btn';
    btn.textContent = '시작하기';
    btn.style.opacity = '0';
    ritual.insertBefore(btn, ritual.querySelector('.ritual-saltar'));
    return btn;
  }

  function needsMotionPermission() {
    return typeof DeviceOrientationEvent !== 'undefined' &&
           typeof DeviceOrientationEvent.requestPermission === 'function';
  }

  async function requestMotionPermission() {
    if (needsMotionPermission()) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        return permission === 'granted';
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  function waitForMotionPermission(btn) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, STEP_TIMEOUT);

      btn.addEventListener('click', async () => {
        clearTimeout(timeout);
        const granted = await requestMotionPermission();
        resolve(granted);
      }, { once: true });
    });
  }

  function waitForCalibration() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, STEP_TIMEOUT);

      // Check if device is roughly horizontal (held to chest)
      const handler = (e) => {
        const beta = e.beta || 0;
        const gamma = e.gamma || 0;

        // Beta around 90 = horizontal, gamma near 0 = straight
        if (Math.abs(beta - 90) < 25 && Math.abs(gamma) < 20) {
          window.removeEventListener('deviceorientation', handler);
          clearTimeout(timeout);

          // Calibrate the partner system
          if (window.tangoPartner) {
            window.tangoPartner.calibration = { gamma: gamma, beta: beta };
          }

          resolve(true);
        }
      };

      window.addEventListener('deviceorientation', handler);
    });
  }

  function waitForBreath() {
    return new Promise((resolve) => {
      const timeout = setTimeout(resolve, STEP_TIMEOUT);

      let tapCount = 0;
      const handler = () => {
        tapCount++;
        if (tapCount >= 2) {
          document.removeEventListener('touchstart', handler);
          clearTimeout(timeout);
          resolve();
        }
      };

      document.addEventListener('touchstart', handler);
    });
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function awaken(ritual) {
    if (ritual.classList.contains('despierta')) return;

    ritual.classList.add('despierta');
    sessionStorage.setItem('tango_entered', 'true');

    // Start motion tracking
    if (window.tangoPartner) {
      window.tangoPartner.permission = true;
      window.tangoPartner.start();
    }

    // Clean up after transition
    ritual.addEventListener('transitionend', () => {
      ritual.setAttribute('aria-hidden', 'true');
    }, { once: true });
  }

  // Execute immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
