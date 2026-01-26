/**
 * TANGO PARTNER SYSTEM v1.0
 * "탱고는 혼자 못 춘다. 폰이 파트너가 된다."
 *
 * Architecture:
 *   I.   TangoPartner — Device motion (tilt = lead/follow)
 *   II.  Abrazo — Two-finger embrace
 *   III. TangoConnection — P2P WebRTC connection
 *   IV.  MovementSync — Real-time movement synchronization
 *   V.   TangoAudio — Music integration with sync
 *   VI.  FloorNavigation — Paired navigation between floors
 *   VII. DanceMemory — Session traces (ghosts)
 *   VIII.BeatGuide — 70 BPM visual guide
 */

(function() {
  'use strict';

  const BEAT = 857;  // 70 BPM
  const HALF = 428;

  // ═══════════════════════════════════════════════════════════
  // I. TangoPartner — Device Motion
  // ═══════════════════════════════════════════════════════════

  class TangoPartner {
    constructor() {
      this.permission = false;
      this.enabled = false;
      this.calibration = { gamma: 0, beta: 45 };
    }

    async requestPermission() {
      // iOS 13+ requires explicit permission
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          this.permission = permission === 'granted';
        } catch (e) {
          console.warn('Motion permission denied:', e);
          this.permission = false;
        }
      } else {
        // Android and older iOS don't need permission
        this.permission = true;
      }
      return this.permission;
    }

    start() {
      if (!this.permission) return;
      this.enabled = true;

      window.addEventListener('deviceorientation', (e) => this.onMove(e), { passive: true });

      // Calibrate after 1 second of holding
      setTimeout(() => this.calibrate(), 1000);
    }

    calibrate() {
      // Store current position as "neutral"
      window.addEventListener('deviceorientation', (e) => {
        this.calibration.gamma = e.gamma || 0;
        this.calibration.beta = e.beta || 45;
      }, { once: true });
    }

    onMove(e) {
      if (!this.enabled) return;

      const gamma = (e.gamma || 0) - this.calibration.gamma;  // Left/right tilt
      const beta = (e.beta || 45) - this.calibration.beta;     // Forward/back tilt

      // Clamp values
      const leadX = Math.max(-30, Math.min(30, gamma)) * 0.5;
      const leadY = Math.max(-30, Math.min(30, beta)) * 0.3;

      // Set CSS variables for UI response
      document.documentElement.style.setProperty('--lead-x', leadX + 'px');
      document.documentElement.style.setProperty('--lead-y', leadY + 'px');

      // Calculate intensity for magenta
      const intensity = Math.min(Math.sqrt(gamma * gamma + beta * beta) / 40, 1);
      document.documentElement.style.setProperty('--motion-intensity', intensity);

      // Broadcast to partner if connected
      if (window.tangoConnection && window.tangoConnection.isConnected()) {
        window.tangoConnection.send({
          type: 'motion',
          gamma: gamma,
          beta: beta,
          timestamp: Date.now()
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // II. Abrazo — Two-Finger Embrace
  // ═══════════════════════════════════════════════════════════

  class Abrazo {
    constructor() {
      this.active = false;
      this.init();
    }

    init() {
      document.addEventListener('touchstart', (e) => this.onTouch(e), { passive: true });
      document.addEventListener('touchmove', (e) => this.onTouch(e), { passive: true });
      document.addEventListener('touchend', () => this.onRelease(), { passive: true });
    }

    onTouch(e) {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];

        // Distance between two fingers
        const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

        // Intimacy: closer = higher (0-1)
        const intimacy = 1 - Math.min(distance / 300, 1);

        // Center point
        const centerX = (t1.clientX + t2.clientX) / 2;
        const centerY = (t1.clientY + t2.clientY) / 2;

        // Set CSS variables
        document.documentElement.style.setProperty('--abrazo', intimacy);
        document.documentElement.style.setProperty('--abrazo-x', centerX + 'px');
        document.documentElement.style.setProperty('--abrazo-y', centerY + 'px');

        if (!this.active) {
          this.active = true;
          document.body.classList.add('abrazando');
        }

        // Haptic feedback on close embrace
        if (intimacy > 0.7 && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }

    onRelease() {
      if (this.active) {
        this.active = false;
        document.body.classList.remove('abrazando');

        // Fade out abrazo variable
        document.documentElement.style.setProperty('--abrazo', '0');
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // III. TangoConnection — P2P WebRTC
  // ═══════════════════════════════════════════════════════════

  class TangoConnection {
    constructor() {
      this.peer = null;
      this.conn = null;
      this.myId = null;
      this.partnerId = null;
      this.isLead = false;
      this.callbacks = {};
    }

    async init() {
      // Dynamically load PeerJS
      if (!window.Peer) {
        await this.loadPeerJS();
      }

      return new Promise((resolve) => {
        this.peer = new Peer();

        this.peer.on('open', (id) => {
          this.myId = id;
          console.log('Tango ID:', id);
          this.showInviteCode(id);
          resolve(id);
        });

        this.peer.on('connection', (conn) => {
          this.conn = conn;
          this.isLead = true;  // First to connect is lead
          this.setupConnection();
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
        });
      });
    }

    loadPeerJS() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    connect(partnerId) {
      if (!this.peer) return;

      this.partnerId = partnerId;
      this.conn = this.peer.connect(partnerId);
      this.isLead = false;  // Joiner is follower

      this.conn.on('open', () => {
        this.setupConnection();
      });
    }

    setupConnection() {
      document.body.classList.add('paired');
      document.body.classList.add(this.isLead ? 'leading' : 'following');

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      // Update UI
      this.hideInviteCode();
      this.showPairedUI();

      // Listen for messages
      this.conn.on('data', (data) => this.onData(data));

      this.conn.on('close', () => this.onDisconnect());

      // Start sync
      if (window.tangoSync) {
        window.tangoSync.start();
      }

      // Notify callbacks
      if (this.callbacks.onPaired) {
        this.callbacks.onPaired(this.isLead);
      }
    }

    send(data) {
      if (this.conn && this.conn.open) {
        this.conn.send(data);
      }
    }

    onData(data) {
      switch (data.type) {
        case 'motion':
          if (window.tangoSync) {
            window.tangoSync.onPartnerMotion(data);
          }
          break;
        case 'nav-intent':
          if (window.tangoNav) {
            window.tangoNav.onPartnerIntent(data);
          }
          break;
      }

      // Generic callback
      if (this.callbacks.onData) {
        this.callbacks.onData(data);
      }
    }

    onDisconnect() {
      document.body.classList.remove('paired', 'leading', 'following', 'in-sync', 'drifting');
      this.conn = null;
      this.partnerId = null;

      // Show invite UI again
      this.showInviteCode(this.myId);
    }

    isConnected() {
      return this.conn && this.conn.open;
    }

    showInviteCode(id) {
      const codeEl = document.getElementById('inviteCode');
      const labelEl = document.querySelector('.huella-label');

      if (codeEl) {
        codeEl.textContent = id ? id.substring(0, 8).toUpperCase() : '';
        codeEl.style.display = id ? 'block' : 'none';
      }

      if (labelEl && !this.isConnected()) {
        labelEl.textContent = '파트너를 초대하세요';
      }
    }

    hideInviteCode() {
      const codeEl = document.getElementById('inviteCode');
      if (codeEl) {
        codeEl.style.display = 'none';
      }
    }

    showPairedUI() {
      const labelEl = document.querySelector('.huella-label');
      if (labelEl) {
        labelEl.textContent = this.isLead ? '리드 중' : '팔로우 중';
      }
    }

    on(event, callback) {
      this.callbacks[event] = callback;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // IV. MovementSync — Synchronization
  // ═══════════════════════════════════════════════════════════

  class MovementSync {
    constructor(connection) {
      this.conn = connection;
      this.myMotion = { gamma: 0, beta: 0 };
      this.partnerMotion = { gamma: 0, beta: 0 };
      this.syncScore = 0;
      this.syncHistory = [];
    }

    start() {
      // Update sync score regularly
      setInterval(() => this.updateSyncState(), 100);
    }

    onPartnerMotion(data) {
      this.partnerMotion = {
        gamma: data.gamma,
        beta: data.beta,
        timestamp: data.timestamp
      };
      this.calculateSync();
    }

    setMyMotion(gamma, beta) {
      this.myMotion = { gamma, beta };
    }

    calculateSync() {
      const diffGamma = Math.abs(this.myMotion.gamma - this.partnerMotion.gamma);
      const diffBeta = Math.abs(this.myMotion.beta - this.partnerMotion.beta);

      // Sync score: 0 = out of sync, 1 = perfect sync
      const rawSync = 1 - Math.min((diffGamma + diffBeta) / 60, 1);

      // Smooth the score
      this.syncScore = this.syncScore * 0.7 + rawSync * 0.3;

      // Update CSS variable
      document.documentElement.style.setProperty('--sync', this.syncScore);

      // Track history for analysis
      this.syncHistory.push(this.syncScore);
      if (this.syncHistory.length > 100) {
        this.syncHistory.shift();
      }
    }

    updateSyncState() {
      const body = document.body;

      if (!this.conn.isConnected()) {
        body.classList.remove('in-sync', 'drifting');
        return;
      }

      if (this.syncScore > 0.7) {
        body.classList.add('in-sync');
        body.classList.remove('drifting');
      } else if (this.syncScore < 0.3) {
        body.classList.add('drifting');
        body.classList.remove('in-sync');
      } else {
        body.classList.remove('in-sync', 'drifting');
      }
    }

    getAverageSync() {
      if (this.syncHistory.length === 0) return 0;
      return this.syncHistory.reduce((a, b) => a + b, 0) / this.syncHistory.length;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // V. TickerMessages — CNN Ticker state messages
  // ═══════════════════════════════════════════════════════════

  class TickerMessages {
    constructor() {
      this.ticker = document.querySelector('.ticker-text');
    }

    update(state) {
      if (!this.ticker) return;

      const messages = {
        solo: '<b>TANGO MAGENTA RADIO</b><span class="sep"></span>파트너를 초대하세요<span class="sep"></span>Buenos Aires / Seoul<span class="sep"></span>',
        waiting: '<b>연결 중...</b><span class="sep"></span>파트너를 기다리는 중<span class="sep"></span>',
        paired: '<b>CONNECTED</b><span class="sep"></span>호흡을 맞춰보세요<span class="sep"></span>Buenos Aires / Seoul<span class="sep"></span>',
        inSync: '<b>★ PERFECT SYNC ★</b><span class="sep"></span>아름다운 탱고입니다<span class="sep"></span>Buenos Aires / Seoul<span class="sep"></span>',
        drifting: '<b>TANGO MAGENTA</b><span class="sep"></span>리듬을 느껴보세요...<span class="sep"></span>'
      };

      const msg = messages[state] || messages.solo;
      this.ticker.innerHTML = msg + msg;  // Duplicate for scroll
    }
  }

  // ═══════════════════════════════════════════════════════════
  // VI. FloorNavigation — Paired Navigation
  // ═══════════════════════════════════════════════════════════

  class FloorNavigation {
    constructor(connection) {
      this.conn = connection;
      this.currentFloor = this.detectCurrentFloor();
      this.myIntent = null;
      this.partnerIntent = null;
      this.floorUrls = {
        1: 'emisión/',
        2: 'cuerpo/',
        3: 'laboratorio/',
        4: 'control/',
        5: 'legado/'
      };
    }

    detectCurrentFloor() {
      const path = window.location.pathname;
      if (path.includes('emisión')) return 1;
      if (path.includes('cuerpo')) return 2;
      if (path.includes('laboratorio')) return 3;
      if (path.includes('control')) return 4;
      if (path.includes('legado')) return 5;
      return 0;  // Home
    }

    tryNavigate(direction) {
      const targetFloor = this.currentFloor + direction;

      // Solo mode: direct navigation (1-2 only)
      if (!this.conn.isConnected()) {
        if (targetFloor >= 1 && targetFloor <= 2) {
          this.navigate(direction);
        } else {
          this.showLockedMessage();
        }
        return;
      }

      // Paired mode: signal intent
      this.myIntent = {
        direction: direction,
        floor: targetFloor,
        time: Date.now()
      };

      this.conn.send({
        type: 'nav-intent',
        direction: direction,
        floor: targetFloor
      });

      this.checkNavigate();
    }

    onPartnerIntent(data) {
      this.partnerIntent = {
        direction: data.direction,
        floor: data.floor,
        time: Date.now()
      };

      this.checkNavigate();
    }

    checkNavigate() {
      if (!this.myIntent || !this.partnerIntent) return;

      // Check if intents match and are recent
      const timeDiff = Math.abs(this.myIntent.time - this.partnerIntent.time);

      if (this.myIntent.direction === this.partnerIntent.direction && timeDiff < 2000) {
        // Navigate together!
        this.navigate(this.myIntent.direction);
      } else {
        // Mismatch
        this.showMismatch();
      }

      // Reset intents
      this.myIntent = null;
      this.partnerIntent = null;
    }

    navigate(direction) {
      const targetFloor = this.currentFloor + direction;

      if (targetFloor < 0 || targetFloor > 5) return;

      document.body.style.opacity = '0';
      document.body.style.transition = `opacity ${HALF}ms ease`;

      setTimeout(() => {
        if (targetFloor === 0) {
          window.location.href = '../';
        } else {
          const base = this.currentFloor === 0 ? '' : '../';
          window.location.href = base + this.floorUrls[targetFloor];
        }
      }, HALF);
    }

    showLockedMessage() {
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }

      // Flash the locked overlay
      document.querySelectorAll('.tarjeta[data-floor]').forEach(card => {
        card.style.animation = 'none';
        card.offsetHeight;  // Trigger reflow
        card.style.animation = 'locked-shake 0.3s ease';
      });
    }

    showMismatch() {
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50, 30, 50]);
      }

      document.body.classList.add('mismatch');
      setTimeout(() => document.body.classList.remove('mismatch'), 300);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // VII. DanceMemory — Session Traces
  // ═══════════════════════════════════════════════════════════

  class DanceMemory {
    constructor() {
      this.traces = JSON.parse(localStorage.getItem('tango_traces') || '[]');
      this.currentSession = [];
      this.recording = false;
    }

    start() {
      this.recording = true;
      this.renderGhosts();

      // Record touch movements
      document.addEventListener('touchmove', (e) => {
        if (!this.recording) return;

        this.currentSession.push({
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
          t: Date.now()
        });
      }, { passive: true });

      // Save on exit
      window.addEventListener('beforeunload', () => this.save());
    }

    renderGhosts() {
      if (this.traces.length === 0) return;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('ghost-traces');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('preserveAspectRatio', 'none');

      // Render last 3 sessions
      this.traces.slice(-3).forEach((session, i) => {
        if (session.length < 5) return;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = session.map((p, j) =>
          `${j === 0 ? 'M' : 'L'} ${p.x * 100} ${p.y * 100}`
        ).join(' ');

        path.setAttribute('d', d);
        path.setAttribute('class', 'ghost-path');
        path.style.opacity = 0.02 * (i + 1);
        path.style.animationDelay = (i * 3) + 's';

        svg.appendChild(path);
      });

      document.body.appendChild(svg);
    }

    save() {
      if (this.currentSession.length < 20) return;

      // Downsample to 50 points
      const sampled = this.downsample(this.currentSession, 50);
      this.traces.push(sampled);

      // Keep only last 10 sessions
      if (this.traces.length > 10) {
        this.traces = this.traces.slice(-10);
      }

      localStorage.setItem('tango_traces', JSON.stringify(this.traces));
    }

    downsample(arr, n) {
      const result = [];
      const step = arr.length / n;
      for (let i = 0; i < n; i++) {
        result.push(arr[Math.floor(i * step)]);
      }
      return result;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // VIII. Touch Position Tracker
  // ═══════════════════════════════════════════════════════════

  class TouchTracker {
    constructor() {
      this.init();
    }

    init() {
      document.querySelectorAll('.tarjeta').forEach(card => {
        card.addEventListener('touchstart', (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
          const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;

          card.style.setProperty('--touch-x', x + '%');
          card.style.setProperty('--touch-y', y + '%');
        }, { passive: true });
      });
    }
  }

  // ═══════════════════════════════════════════════════════════
  // Initialization
  // ═══════════════════════════════════════════════════════════

  async function init() {
    // Core systems
    window.tangoPartner = new TangoPartner();
    window.tangoAbraso = new Abrazo();
    window.tangoConnection = new TangoConnection();
    window.tangoMemory = new DanceMemory();
    window.tangoTicker = new TickerMessages();
    new TouchTracker();

    // Initialize connection
    await window.tangoConnection.init();

    // Initialize sync
    window.tangoSync = new MovementSync(window.tangoConnection);

    // Initialize navigation
    window.tangoNav = new FloorNavigation(window.tangoConnection);

    // Update ticker on pair
    window.tangoConnection.on('onPaired', (isLead) => {
      console.log('Paired as:', isLead ? 'Lead' : 'Follow');

      // Start motion tracking
      window.tangoPartner.start();

      // Update ticker message
      window.tangoTicker.update('paired');
    });

    // Watch for sync state changes
    const syncObserver = new MutationObserver(() => {
      if (document.body.classList.contains('in-sync')) {
        window.tangoTicker.update('inSync');
      } else if (document.body.classList.contains('drifting')) {
        window.tangoTicker.update('drifting');
      } else if (document.body.classList.contains('paired')) {
        window.tangoTicker.update('paired');
      } else {
        window.tangoTicker.update('solo');
      }
    });
    syncObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Start ghost rendering
    window.tangoMemory.start();

    // Handle partner code input
    const partnerInput = document.querySelector('.partner-code');
    if (partnerInput) {
      partnerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const code = partnerInput.value.trim().toLowerCase();
          if (code) {
            window.tangoConnection.connect(code);
          }
        }
      });
    }

    console.log('TANGO PARTNER SYSTEM initialized');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
