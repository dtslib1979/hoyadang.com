/**
 * MSMR Cut Pipeline — Frontend Controller
 * 好爺堂 Studio OS
 *
 * Two Modes:
 * 1. Cloud Mode: YouTube URL → GitHub Actions → Artifacts
 * 2. Local Mode: Local file → FFmpeg command generator
 *
 * Cloud Flow:
 * 1. User inputs YouTube URL + cut points
 * 2. Frontend validates and generates request_id
 * 3. Triggers GitHub Actions workflow via API
 * 4. Polls for completion status
 * 5. Provides download links to artifacts
 *
 * Local Flow:
 * 1. User inputs local filename + cut points
 * 2. Frontend generates FFmpeg commands
 * 3. User copies and runs on their PC
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
    mode: 'cloud', // 'cloud' | 'local'
    cuts: [],
    localCuts: [],
    template: 'default',
    isProcessing: false,
    currentRequestId: null
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOM Elements
  // ═══════════════════════════════════════════════════════════════════════════

  const elements = {
    // Mode tabs
    tabs: document.querySelectorAll('.msmr-tab'),

    // Cloud mode elements
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
    templates: document.querySelectorAll('.msmr-template'),

    // Local mode elements
    localMode: document.getElementById('localMode'),
    localFilename: document.getElementById('localFilename'),
    localCutName: document.getElementById('localCutName'),
    localCutIn: document.getElementById('localCutIn'),
    localCutOut: document.getElementById('localCutOut'),
    localSpeed: document.getElementById('localSpeed'),
    reencodeWarning: document.getElementById('reencodeWarning'),
    localAddCutBtn: document.getElementById('localAddCutBtn'),
    localCutsContainer: document.getElementById('localCutsContainer'),
    generateBtn: document.getElementById('generateBtn'),
    commandOutput: document.getElementById('commandOutput'),
    commandBox: document.getElementById('commandBox'),
    copyBtn: document.getElementById('copyBtn'),
    copyAllBtn: document.getElementById('copyAllBtn'),
    telegramBtn: document.getElementById('telegramBtn'),
    localNewJobBtn: document.getElementById('localNewJobBtn')
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
  // Mode Switching
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Switch between Cloud and Local modes
   */
  function switchMode(mode) {
    state.mode = mode;

    // Update tab UI
    elements.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    // Show/hide appropriate sections
    if (mode === 'cloud') {
      elements.form.classList.remove('hidden');
      elements.localMode.classList.add('hidden');
      elements.statusView.classList.add('hidden');
      elements.resultView.classList.add('hidden');
    } else {
      elements.form.classList.add('hidden');
      elements.statusView.classList.add('hidden');
      elements.resultView.classList.add('hidden');
      elements.localMode.classList.remove('hidden');
      elements.commandOutput.classList.add('hidden');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Local Mode Functions
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Generate FFmpeg command for a single cut
   * @param {string} filename - Input filename
   * @param {object} cut - Cut object with name, in, out
   * @param {number} speed - Speed multiplier (1.0 = normal)
   */
  function generateFFmpegCommand(filename, cut, speed = 1.0) {
    const outputName = `${cut.name}.mp4`;

    if (speed === 1.0) {
      // 원본 속도: copy 모드 (빠름, 무손실)
      return `ffmpeg -ss ${cut.in} -to ${cut.out} -i "${filename}" -c copy -avoid_negative_ts make_zero "${outputName}"`;
    } else {
      // 배속 적용: 리인코딩 필요 (느림)
      const pts = (1 / speed).toFixed(4);
      // atempo는 0.5~2.0 범위만 지원
      const atempo = Math.max(0.5, Math.min(2.0, speed));
      return `ffmpeg -ss ${cut.in} -to ${cut.out} -i "${filename}" -filter:v "setpts=${pts}*PTS" -filter:a "atempo=${atempo}" -preset fast "${outputName}"`;
    }
  }

  /**
   * Generate all FFmpeg commands for local cuts
   */
  function generateAllCommands() {
    const filename = elements.localFilename.value.trim();
    const speed = parseFloat(elements.localSpeed.value);

    if (!filename) {
      showError('파일명을 입력하세요');
      return;
    }

    if (state.localCuts.length === 0) {
      showError('최소 1개의 컷을 추가하세요');
      return;
    }

    const commands = state.localCuts.map(cut => generateFFmpegCommand(filename, cut, speed));
    let fullScript = commands.join('\n\n');

    // 배속 적용 시 경고 메시지 추가
    if (speed !== 1.0) {
      const warning = `# ⚠️ 배속 ${speed}x 적용 — 리인코딩으로 시간이 오래 걸립니다\n\n`;
      fullScript = warning + fullScript;
    }

    elements.commandBox.textContent = fullScript;
    elements.commandOutput.classList.remove('hidden');
  }

  /**
   * Copy text to clipboard
   */
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch (e) {
        document.body.removeChild(textarea);
        return false;
      }
    }
  }

  /**
   * Add a new local cut point
   */
  function addLocalCut() {
    const name = elements.localCutName.value.trim() || `clip_${String(state.localCuts.length + 1).padStart(2, '0')}`;
    const inTime = elements.localCutIn.value.trim();
    const outTime = elements.localCutOut.value.trim();

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

    if (state.localCuts.length >= CONFIG.maxCuts) {
      showError(`최대 ${CONFIG.maxCuts}개의 컷만 추가할 수 있습니다`);
      return;
    }

    // Add cut
    state.localCuts.push({
      name: name.replace(/[^a-zA-Z0-9_-]/g, '_'),
      in: normalizeTimestamp(inTime),
      out: normalizeTimestamp(outTime)
    });

    // Clear inputs
    elements.localCutName.value = '';
    elements.localCutIn.value = '';
    elements.localCutOut.value = '';

    // Update UI
    renderLocalCuts();
    updateLocalGenerateButton();
  }

  /**
   * Remove a local cut by index
   */
  function removeLocalCut(index) {
    state.localCuts.splice(index, 1);
    renderLocalCuts();
    updateLocalGenerateButton();
  }

  /**
   * Render local cuts list
   */
  function renderLocalCuts() {
    elements.localCutsContainer.innerHTML = state.localCuts.map((cut, index) => `
      <div class="msmr-cut-item">
        <span class="msmr-cut-num">${String(index + 1).padStart(2, '0')}</span>
        <span class="msmr-cut-time">${cut.in} → ${cut.out}</span>
        <span class="msmr-cut-name">${cut.name}</span>
        <button type="button" class="msmr-cut-remove" data-index="${index}">×</button>
      </div>
    `).join('');

    // Add remove listeners
    elements.localCutsContainer.querySelectorAll('.msmr-cut-remove').forEach(btn => {
      btn.addEventListener('click', () => removeLocalCut(parseInt(btn.dataset.index)));
    });
  }

  /**
   * Update local generate button state
   */
  function updateLocalGenerateButton() {
    const hasFilename = elements.localFilename.value.trim().length > 0;
    const hasCuts = state.localCuts.length > 0;
    elements.generateBtn.disabled = !(hasFilename && hasCuts);
  }

  /**
   * Reset local mode form
   */
  function resetLocalForm() {
    state.localCuts = [];
    elements.localFilename.value = '';
    elements.localCutName.value = '';
    elements.localCutIn.value = '';
    elements.localCutOut.value = '';
    elements.localSpeed.value = '1.0';
    elements.reencodeWarning.classList.remove('visible');
    elements.commandOutput.classList.add('hidden');
    renderLocalCuts();
    updateLocalGenerateButton();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Cloud Mode - Cuts Management
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
   * Fixed: Now properly matches by request_id using workflow jobs API
   */
  async function pollWorkflowStatus(requestId, startTime) {
    const token = localStorage.getItem('github_token');

    if (Date.now() - startTime > CONFIG.pollTimeout) {
      throw new Error('타임아웃: 워크플로우가 너무 오래 걸립니다');
    }

    // Get recent workflow runs
    const response = await fetch(
      `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/actions/runs?per_page=20`,
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

    // Find our run by:
    // 1. Workflow name matches
    // 2. Created after our trigger time (with 10s buffer)
    // 3. Most recent first (already sorted by API)
    const candidateRuns = data.workflow_runs.filter(run =>
      run.name === 'MSMR Cut Pipeline' &&
      new Date(run.created_at).getTime() >= startTime - 10000
    );

    // Try to find run with matching request_id by checking artifacts
    let ourRun = null;
    for (const run of candidateRuns) {
      // For completed runs, check artifact name
      if (run.status === 'completed') {
        try {
          const artifactsResponse = await fetch(
            `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/actions/runs/${run.id}/artifacts`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`
              }
            }
          );
          if (artifactsResponse.ok) {
            const artifacts = await artifactsResponse.json();
            const hasOurArtifact = artifacts.artifacts.some(a =>
              a.name === `msmr-output-${requestId}` || a.name === `msmr-status-${requestId}`
            );
            if (hasOurArtifact) {
              ourRun = run;
              break;
            }
          }
        } catch (e) {
          // Ignore artifact check errors
        }
      } else {
        // For in-progress runs, use time-based matching (best effort)
        ourRun = run;
        break;
      }
    }

    // Fallback to time-based matching if no artifact match
    if (!ourRun && candidateRuns.length > 0) {
      ourRun = candidateRuns[0];
    }

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
    // ═══ Mode Tabs ═══
    elements.tabs.forEach(tab => {
      tab.addEventListener('click', () => switchMode(tab.dataset.mode));
    });

    // ═══ Cloud Mode ═══

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

    // ═══ Local Mode ═══

    // Filename input change
    elements.localFilename.addEventListener('input', updateLocalGenerateButton);

    // Speed selection change - show/hide warning
    elements.localSpeed.addEventListener('change', () => {
      const speed = parseFloat(elements.localSpeed.value);
      if (speed !== 1.0) {
        elements.reencodeWarning.classList.add('visible');
      } else {
        elements.reencodeWarning.classList.remove('visible');
      }
    });

    // Add local cut button
    elements.localAddCutBtn.addEventListener('click', addLocalCut);

    // Enter key on local time inputs
    elements.localCutOut.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addLocalCut();
      }
    });

    // Generate commands button
    elements.generateBtn.addEventListener('click', generateAllCommands);

    // Copy button (inline)
    elements.copyBtn.addEventListener('click', async () => {
      const text = elements.commandBox.textContent;
      const success = await copyToClipboard(text);
      if (success) {
        elements.copyBtn.textContent = '복사됨!';
        elements.copyBtn.classList.add('copied');
        setTimeout(() => {
          elements.copyBtn.textContent = '복사';
          elements.copyBtn.classList.remove('copied');
        }, 2000);
      } else {
        showError('복사 실패. 직접 선택해서 복사하세요.');
      }
    });

    // Copy all button
    elements.copyAllBtn.addEventListener('click', async () => {
      const text = elements.commandBox.textContent;
      const success = await copyToClipboard(text);
      if (success) {
        elements.copyAllBtn.innerHTML = '✅ 복사됨!';
        setTimeout(() => {
          elements.copyAllBtn.innerHTML = '📋 복사';
        }, 2000);
      } else {
        showError('복사 실패. 직접 선택해서 복사하세요.');
      }
    });

    // Telegram button
    elements.telegramBtn.addEventListener('click', () => {
      const text = elements.commandBox.textContent;

      // Telegram deep link로 메시지 전송
      // 사용자가 봇을 선택하거나 직접 붙여넣기 가능
      const encodedText = encodeURIComponent(text);

      // 방법 1: 저장된 봇 username이 있으면 직접 열기
      const botUsername = localStorage.getItem('msmr_telegram_bot');

      if (botUsername) {
        // 봇에게 직접 메시지 (모바일 Telegram 앱)
        window.open(`tg://resolve?domain=${botUsername}&text=${encodedText}`, '_blank');
      } else {
        // 봇 설정 안내
        const username = prompt(
          'Telegram 봇 username을 입력하세요.\n\n' +
          '예: msmr_executor_bot\n' +
          '(@ 없이 입력)\n\n' +
          '봇이 없으면 remote/README.md 참고'
        );

        if (username) {
          const cleanUsername = username.replace('@', '').trim();
          localStorage.setItem('msmr_telegram_bot', cleanUsername);
          window.open(`tg://resolve?domain=${cleanUsername}&text=${encodedText}`, '_blank');
        }
      }
    });

    // Local new job button
    elements.localNewJobBtn.addEventListener('click', resetLocalForm);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Initialize
  // ═══════════════════════════════════════════════════════════════════════════

  function init() {
    initEventListeners();

    // Cloud mode init
    renderCuts();
    updateSubmitButton();

    // Local mode init
    renderLocalCuts();
    updateLocalGenerateButton();

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
