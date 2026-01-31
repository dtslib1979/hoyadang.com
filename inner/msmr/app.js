/**
 * MSMR Cut Pipeline — Frontend Controller
 * 好爺堂 Studio OS
 *
 * Architecture:
 * - GitHub Actions as serverless backend
 * - YouTube as video source (CDN)
 * - GitHub Artifacts for output storage
 *
 * Flow:
 * 1. User inputs YouTube URL + cut points
 * 2. Frontend validates and generates request_id
 * 3. Triggers GitHub Actions workflow via API
 * 4. Polls for completion status
 * 5. Provides download links to artifacts
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // Configuration
  // ═══════════════════════════════════════════════════════════════════════════

  const CONFIG = {
    // GitHub repository info
    owner: 'dtslib1979',
    repo: 'hoyadang.com',
    workflow: 'msmr-cut.yml',

    // Constraints
    maxCuts: 10,
    maxDuration: 3600, // 1 hour in seconds

    // Polling
    pollInterval: 5000, // 5 seconds
    pollTimeout: 360000, // 6 minutes (GitHub Actions limit consideration)

    // Storage keys
    storageKey: 'msmr_pending_jobs'
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════════════════════════════════════

  const state = {
    cuts: [],
    template: 'default',
    isProcessing: false,
    currentRequestId: null
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOM Elements
  // ═══════════════════════════════════════════════════════════════════════════

  const elements = {
    form: document.getElementById('msmrForm'),
    youtubeUrl: document.getElementById('youtubeUrl'),
    cutName: document.getElementById('cutName'),
    cutIn: document.getElementById('cutIn'),
    cutOut: document.getElementById('cutOut'),
    addCutBtn: document.getElementById('addCutBtn'),
    cutsContainer: document.getElementById('cutsContainer'),
    submitBtn: document.getElementById('submitBtn'),
    statusView: document.getElementById('statusView'),
    statusIcon: document.getElementById('statusIcon'),
    statusTitle: document.getElementById('statusTitle'),
    statusDesc: document.getElementById('statusDesc'),
    progressBar: document.getElementById('progressBar'),
    resultView: document.getElementById('resultView'),
    resultDesc: document.getElementById('resultDesc'),
    downloadLinks: document.getElementById('downloadLinks'),
    newJobBtn: document.getElementById('newJobBtn'),
    templates: document.querySelectorAll('.msmr-template')
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // Utilities
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Generate unique request ID
   */
  function generateRequestId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `msmr_${timestamp}_${random}`;
  }

  /**
   * Validate YouTube URL and extract video ID
   */
  function parseYouTubeUrl(url) {
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /[?&]v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  /**
   * Validate timestamp format (HH:MM:SS or MM:SS)
   */
  function validateTimestamp(timestamp) {
    const patterns = [
      /^(\d{1,2}):(\d{2}):(\d{2})$/, // HH:MM:SS
      /^(\d{1,2}):(\d{2})$/          // MM:SS
    ];

    for (const pattern of patterns) {
      if (pattern.test(timestamp)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Normalize timestamp to HH:MM:SS format
   */
  function normalizeTimestamp(timestamp) {
    if (/^\d{1,2}:\d{2}$/.test(timestamp)) {
      return `00:${timestamp.padStart(5, '0')}`;
    }
    const parts = timestamp.split(':');
    return parts.map(p => p.padStart(2, '0')).join(':');
  }

  /**
   * Convert timestamp to seconds
   */
  function timestampToSeconds(timestamp) {
    const parts = timestamp.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Cuts Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Add a new cut point
   */
  function addCut() {
    const name = elements.cutName.value.trim() || `clip_${String(state.cuts.length + 1).padStart(2, '0')}`;
    const inTime = elements.cutIn.value.trim();
    const outTime = elements.cutOut.value.trim();

    // Validate
    if (!inTime || !outTime) {
      showError('시작과 종료 시간을 입력하세요');
      return;
    }

    if (!validateTimestamp(inTime) || !validateTimestamp(outTime)) {
      showError('시간 형식이 올바르지 않습니다 (HH:MM:SS 또는 MM:SS)');
      return;
    }

    const inSeconds = timestampToSeconds(inTime);
    const outSeconds = timestampToSeconds(outTime);

    if (outSeconds <= inSeconds) {
      showError('종료 시간은 시작 시간보다 커야 합니다');
      return;
    }

    if (state.cuts.length >= CONFIG.maxCuts) {
      showError(`최대 ${CONFIG.maxCuts}개의 컷만 추가할 수 있습니다`);
      return;
    }

    // Add cut
    state.cuts.push({
      name: name.replace(/[^a-zA-Z0-9_-]/g, '_'),
      in: normalizeTimestamp(inTime),
      out: normalizeTimestamp(outTime)
    });

    // Clear inputs
    elements.cutName.value = '';
    elements.cutIn.value = '';
    elements.cutOut.value = '';

    // Update UI
    renderCuts();
    updateSubmitButton();
  }

  /**
   * Remove a cut by index
   */
  function removeCut(index) {
    state.cuts.splice(index, 1);
    renderCuts();
    updateSubmitButton();
  }

  /**
   * Render cuts list
   */
  function renderCuts() {
    elements.cutsContainer.innerHTML = state.cuts.map((cut, index) => `
      <div class="msmr-cut-item">
        <span class="msmr-cut-num">${String(index + 1).padStart(2, '0')}</span>
        <span class="msmr-cut-time">${cut.in} → ${cut.out}</span>
        <span class="msmr-cut-name">${cut.name}</span>
        <button type="button" class="msmr-cut-remove" data-index="${index}">×</button>
      </div>
    `).join('');

    // Add remove listeners
    elements.cutsContainer.querySelectorAll('.msmr-cut-remove').forEach(btn => {
      btn.addEventListener('click', () => removeCut(parseInt(btn.dataset.index)));
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UI Updates
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Show error message
   */
  function showError(message) {
    // Simple alert for now, could be upgraded to toast
    alert(message);
  }

  /**
   * Update submit button state
   */
  function updateSubmitButton() {
    const hasUrl = elements.youtubeUrl.value.trim().length > 0;
    const hasCuts = state.cuts.length > 0;
    elements.submitBtn.disabled = !(hasUrl && hasCuts);
  }

  /**
   * Show status view
   */
  function showStatus(icon, title, desc, showProgress = true) {
    elements.form.classList.add('hidden');
    elements.resultView.classList.add('hidden');
    elements.statusView.classList.remove('hidden');

    elements.statusIcon.textContent = icon;
    elements.statusTitle.textContent = title;
    elements.statusDesc.textContent = desc;
    elements.progressBar.style.display = showProgress ? 'block' : 'none';
  }

  /**
   * Show result view
   */
  function showResult(files, manifest) {
    elements.form.classList.add('hidden');
    elements.statusView.classList.add('hidden');
    elements.resultView.classList.remove('hidden');

    elements.resultDesc.textContent = `${files.length}개 클립 생성됨`;

    // Note: In production, you'd generate actual download links
    // GitHub Artifacts require authentication, so this would need
    // a proxy or the user would download from GitHub Actions UI
    elements.downloadLinks.innerHTML = `
      <div style="color: rgba(255,250,245,0.7); font-size: 12px; line-height: 1.6;">
        <p>클립이 GitHub Actions에서 생성되었습니다.</p>
        <p style="margin-top: 8px;">
          <a href="https://github.com/${CONFIG.owner}/${CONFIG.repo}/actions"
             target="_blank"
             style="color: var(--msmr-gold);">
            → GitHub Actions에서 다운로드
          </a>
        </p>
        <p style="margin-top: 8px; font-size: 11px; opacity: 0.7;">
          Artifact: msmr-output-${state.currentRequestId}
        </p>
      </div>
    `;
  }

  /**
   * Reset to initial state
   */
  function resetForm() {
    state.cuts = [];
    state.isProcessing = false;
    state.currentRequestId = null;

    elements.youtubeUrl.value = '';
    elements.cutName.value = '';
    elements.cutIn.value = '';
    elements.cutOut.value = '';

    renderCuts();
    updateSubmitButton();

    elements.form.classList.remove('hidden');
    elements.statusView.classList.add('hidden');
    elements.resultView.classList.add('hidden');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GitHub API Integration
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Trigger GitHub Actions workflow
   *
   * Note: This requires a GitHub token with workflow dispatch permissions.
   * In production, you'd want to proxy this through a secure backend.
   * For demo/internal use, the token can be stored locally.
   */
  async function triggerWorkflow(youtubeUrl, cuts, template, requestId) {
    // Check for stored token
    const token = localStorage.getItem('github_token');

    if (!token) {
      // Prompt for token on first use
      const inputToken = prompt(
        'GitHub Personal Access Token이 필요합니다.\n' +
        '(workflow 권한 필요)\n\n' +
        '토큰을 입력하세요:'
      );

      if (!inputToken) {
        throw new Error('토큰이 필요합니다');
      }

      localStorage.setItem('github_token', inputToken);
      return triggerWorkflow(youtubeUrl, cuts, template, requestId);
    }

    const response = await fetch(
      `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/actions/workflows/${CONFIG.workflow}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            youtube_url: youtubeUrl,
            cuts: JSON.stringify(cuts),
            template: template,
            request_id: requestId
          }
        })
      }
    );

    if (response.status === 401) {
      localStorage.removeItem('github_token');
      throw new Error('토큰이 만료되었습니다. 다시 시도하세요.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API 오류: ${response.status}`);
    }

    return true;
  }

  /**
   * Poll for workflow completion
   */
  async function pollWorkflowStatus(requestId, startTime) {
    const token = localStorage.getItem('github_token');

    if (Date.now() - startTime > CONFIG.pollTimeout) {
      throw new Error('타임아웃: 워크플로우가 너무 오래 걸립니다');
    }

    // Get recent workflow runs
    const response = await fetch(
      `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/actions/runs?per_page=10`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('상태 확인 실패');
    }

    const data = await response.json();

    // Find our run (by timing - runs created after we triggered)
    const ourRun = data.workflow_runs.find(run =>
      run.name === 'MSMR Cut Pipeline' &&
      new Date(run.created_at).getTime() >= startTime - 5000
    );

    if (!ourRun) {
      // Not started yet, keep polling
      await new Promise(resolve => setTimeout(resolve, CONFIG.pollInterval));
      return pollWorkflowStatus(requestId, startTime);
    }

    if (ourRun.status === 'completed') {
      if (ourRun.conclusion === 'success') {
        return { success: true, runId: ourRun.id };
      } else {
        throw new Error(`워크플로우 실패: ${ourRun.conclusion}`);
      }
    }

    // Still running
    showStatus('⏳', '처리 중...', `상태: ${ourRun.status}`, true);
    await new Promise(resolve => setTimeout(resolve, CONFIG.pollInterval));
    return pollWorkflowStatus(requestId, startTime);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Form Submission
  // ═══════════════════════════════════════════════════════════════════════════

  async function handleSubmit(e) {
    e.preventDefault();

    if (state.isProcessing) return;

    const youtubeUrl = elements.youtubeUrl.value.trim();
    const videoId = parseYouTubeUrl(youtubeUrl);

    if (!videoId) {
      showError('올바른 YouTube URL을 입력하세요');
      return;
    }

    if (state.cuts.length === 0) {
      showError('최소 1개의 컷을 추가하세요');
      return;
    }

    state.isProcessing = true;
    state.currentRequestId = generateRequestId();
    const startTime = Date.now();

    try {
      // Show processing status
      showStatus('🚀', '파이프라인 시작...', 'GitHub Actions 트리거 중', true);

      // Trigger workflow
      await triggerWorkflow(
        youtubeUrl,
        state.cuts,
        state.template,
        state.currentRequestId
      );

      showStatus('⏳', '처리 중...', '영상 다운로드 및 컷 생성 중', true);

      // Poll for completion
      const result = await pollWorkflowStatus(state.currentRequestId, startTime);

      // Success
      showResult(state.cuts.map(c => `${c.name}.mp4`), null);

    } catch (error) {
      console.error('MSMR Error:', error);
      showStatus('❌', '오류 발생', error.message, false);

      // Add retry button
      setTimeout(() => {
        if (confirm('다시 시도하시겠습니까?')) {
          resetForm();
        }
      }, 2000);
    }

    state.isProcessing = false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Event Listeners
  // ═══════════════════════════════════════════════════════════════════════════

  function initEventListeners() {
    // Form submit
    elements.form.addEventListener('submit', handleSubmit);

    // URL input change
    elements.youtubeUrl.addEventListener('input', updateSubmitButton);

    // Add cut button
    elements.addCutBtn.addEventListener('click', addCut);

    // Enter key on time inputs
    elements.cutOut.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addCut();
      }
    });

    // Template selection
    elements.templates.forEach(tmpl => {
      tmpl.addEventListener('click', () => {
        elements.templates.forEach(t => t.classList.remove('active'));
        tmpl.classList.add('active');
        state.template = tmpl.dataset.template;
      });
    });

    // New job button
    elements.newJobBtn.addEventListener('click', resetForm);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Initialize
  // ═══════════════════════════════════════════════════════════════════════════

  function init() {
    initEventListeners();
    renderCuts();
    updateSubmitButton();

    // Check for pending jobs on load
    const pending = localStorage.getItem(CONFIG.storageKey);
    if (pending) {
      try {
        const jobs = JSON.parse(pending);
        if (jobs.length > 0) {
          console.log('Pending jobs found:', jobs);
          // Could offer to resume checking status
        }
      } catch (e) {
        localStorage.removeItem(CONFIG.storageKey);
      }
    }
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
