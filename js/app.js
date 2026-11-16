// SHRIMPLION — Authentic Krillion-Style Game Controller (Daily, Practice, Packs & Crew Modes)

(function () {
  let PROMPTS = window.SHRIMPLION_PROMPTS || [];
  let TIERS = window.SHRIMPLION_TIERS;
  let PACKS = window.SHRIMPLION_PACKS;
  let ZONES = window.SHRIMPLION_ZONES;
  let DAILY_SCHEDULE = window.SHRIMPLION_DAILY_SCHEDULE || {};
  const Matcher = window.ShrimplionMatcher;
  const AudioEngine = window.ShrimplionAudio;
  const Ocean = window.ShrimplionOcean;

  const RING_CIRC = 2 * Math.PI * 28; // r=28 => 175.93

  function syncDatasetGlobals() {
    PROMPTS = window.SHRIMPLION_PROMPTS || [];
    TIERS = window.SHRIMPLION_TIERS;
    PACKS = window.SHRIMPLION_PACKS;
    ZONES = window.SHRIMPLION_ZONES;
    DAILY_SCHEDULE = window.SHRIMPLION_DAILY_SCHEDULE || {};
    PROMPTS.forEach(p => Matcher.compilePromptIndex(p));
  }

  syncDatasetGlobals();

  // =========================================================================
  // DAILY SEED & DECK BUILDERS
  // =========================================================================
  function getTodayInfo() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;
    const anchor = new Date(2026, 0, 1);
    const todayMidnight = new Date(yyyy, now.getMonth(), now.getDate());
    const diveNumber = Math.max(1, Math.floor((todayMidnight - anchor) / 86400000) + 1);
    const seed = Number(`${yyyy}${mm}${dd}`) ^ 0x5f3759df;
    return { dateKey, diveNumber, seed };
  }

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffleWith(arr, rng) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function getDailyScheduleEntry(dateKey, fallbackDiveNum) {
    const scheduled = DAILY_SCHEDULE && DAILY_SCHEDULE[dateKey];
    if (scheduled && Array.isArray(scheduled.promptIds)) {
      const promptMap = new Map(PROMPTS.map(p => [p.id, p]));
      const resolved = scheduled.promptIds.map(id => promptMap.get(id)).filter(Boolean);
      if (resolved.length === 7) {
        return {
          diveNumber: scheduled.diveNumber || fallbackDiveNum,
          theme: scheduled.theme || 'Mariana Mixed Current',
          subtitle: scheduled.subtitle || 'Balanced voyage across all packs',
          prompts: resolved
        };
      }
    }
    const seed = Number(String(dateKey).replace(/-/g, '')) ^ 0x5f3759df;
    return {
      diveNumber: fallbackDiveNum || 1,
      theme: 'Pelagic Drift',
      subtitle: 'Balanced 7-signal dive across all 5 packs',
      prompts: getDailyPrompts(seed)
    };
  }

  function getDailyPrompts(seed, dateKey) {
    if (dateKey && DAILY_SCHEDULE && DAILY_SCHEDULE[dateKey]) {
      const entry = getDailyScheduleEntry(dateKey, 1);
      if (entry.prompts && entry.prompts.length === 7) return entry.prompts;
    }
    const rng = mulberry32(seed);
    const w = shuffleWith(PROMPTS.filter(p => p.pack === 'world'), rng);
    const s = shuffleWith(PROMPTS.filter(p => p.pack === 'science'), rng);
    const c = shuffleWith(PROMPTS.filter(p => p.pack === 'culture'), rng);
    const e = shuffleWith(PROMPTS.filter(p => p.pack === 'everyday'), rng);
    const n = shuffleWith(PROMPTS.filter(p => p.pack === 'current'), rng);
    const base = [w[0], s[0], c[0], e[0], n[0], w[1], s[1], n[1], c[1], e[1]].filter(Boolean);
    return shuffleWith(base, rng).slice(0, 7);
  }

  let recentPracticeIds = [];
  function getPackPrompts(packId) {
    let pool = packId === 'mixed' ? PROMPTS.slice() : PROMPTS.filter(p => p.pack === packId);
    if (packId === 'mixed') {
      const fresh = pool.filter(p => !recentPracticeIds.includes(p.id));
      if (fresh.length >= 7) pool = fresh;
      else recentPracticeIds = [];
    }
    const picked = shuffleWith(pool, Math.random).slice(0, 7);
    if (packId === 'mixed') recentPracticeIds.push(...picked.map(p => p.id));
    return picked;
  }

  // =========================================================================
  // STORAGE & STATS
  // =========================================================================
  const STATS_KEY = 'shrimplion_stats_v1';

  function loadStats() {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      divesPlayed: 0,
      dailyStreak: 0,
      lastDailyDate: null,
      bestDepth: 0,
      totalMeters: 0,
      tierCounts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    };
  }

  function saveStats(st) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(st)); } catch (_) {}
  }

  function loadDailyRecord(dateKey) {
    try {
      const raw = localStorage.getItem(`shrimplion_daily_${dateKey}`);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function saveDailyRecord(dateKey, rec) {
    try { localStorage.setItem(`shrimplion_daily_${dateKey}`, JSON.stringify(rec)); } catch (_) {}
  }

  function removeDailyRecord(dateKey) {
    try { localStorage.removeItem(`shrimplion_daily_${dateKey}`); } catch (_) {}
  }

  const SETTINGS_KEY = 'shrimplion_settings_v1';
  const PROMPT_BESTS_KEY = 'shrimplion_prompt_bests_v1';

  function loadSettings() {
    const legacyAuto = localStorage.getItem('shrimplion_autospell');
    const defaults = {
      autoSpell: legacyAuto !== 'false',
      timerSeconds: 25,
      keyTicks: true,
      subSkin: 'gold',
      reducedMotion: false
    };
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch (_) {
      return defaults;
    }
  }

  function saveSettings(next) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      localStorage.setItem('shrimplion_autospell', String(next.autoSpell));
    } catch (_) {}
  }

  function applyVisualSettings(stObj) {
    if (Ocean.setSubSkin) Ocean.setSubSkin(stObj.subSkin || 'gold');
    if (Ocean.setReducedMotion) Ocean.setReducedMotion(Boolean(stObj.reducedMotion));
  }

  function loadPromptBests() {
    try {
      const raw = localStorage.getItem(PROMPT_BESTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function savePromptBests(bests) {
    try { localStorage.setItem(PROMPT_BESTS_KEY, JSON.stringify(bests)); } catch (_) {}
  }

  function getDiverRank(totalMeters) {
    if (totalMeters >= 50000) return '👑 Hadal Trench Legend';
    if (totalMeters >= 25000) return '🦑 Abyssal Submarine Captain';
    if (totalMeters >= 12000) return '🧭 Pelagic Navigator';
    if (totalMeters >= 4000) return '🤿 Deep-Reef Scout';
    return '🛟 Surface Cadet';
  }

  function getZoneForDepth(m) {
    for (let i = ZONES.length - 1; i >= 0; i--) {
      if (m >= ZONES[i].min) return ZONES[i];
    }
    return ZONES[0];
  }

  // =========================================================================
  // TYPEWRITER SPEECH HELPER FOR "KRILL" MASCOT
  // =========================================================================
  let typewriterTimer = null;
  function typeKrillSpeech(el, text) {
    clearInterval(typewriterTimer);
    if (!el) return;
    el.textContent = '';
    let idx = 0;
    typewriterTimer = setInterval(() => {
      idx += 2;
      el.textContent = text.slice(0, idx);
      if (idx >= text.length) clearInterval(typewriterTimer);
    }, 18);
  }

  // =========================================================================
  // GAME STATE
  // =========================================================================
  const initialSettings = loadSettings();
  const state = {
    mode: 'daily',          // 'daily' | 'archive' | 'practice' | 'pack' | 'crew'
    packId: 'mixed',
    untimed: false,
    timerDuration: 25,
    prompts: [],
    sigIndex: 0,
    totalDepth: 0,
    results: [],
    rareCombo: 0,
    hintsLeft: 1,
    hintUsedOnSignal: false,
    autoSpell: initialSettings.autoSpell,
    settings: initialSettings,
    activeSuggestion: '',
    archiveDateKey: '',
    archiveDiveNumber: 0,
    archiveTheme: '',
    // Crew mode state
    crewNames: [],
    crewTurnIdx: 0,
    crewRoundPicks: [],     // picks on current signal across crewmates
    // Timer & Reveal
    timerEndMs: 0,
    rafId: null,
    countdownTimerId: null,
    lastWholeSec: -1,
    inReveal: false,
    revealOpenedAt: 0,
    lastShareText: '',
    lastDetailText: ''
  };

  function showScreen(name) {
    ['home', 'play', 'summary'].forEach(s => {
      document.getElementById(`screen-${s}`).classList.toggle('active', s === name);
    });
    document.getElementById('depth-minimap').classList.toggle('visible', name !== 'home');
    if (name === 'home') {
      document.getElementById('oxygen-vignette').classList.remove('urgent');
    }
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._tid);
    showToast._tid = setTimeout(() => t.classList.remove('show'), 2400);
  }

  // Live 60fps depth callback from pixel-ocean.js!
  window.onShrimplionDepthTick = function (liveMeters) {
    const odo = document.getElementById('live-odometer');
    if (odo) odo.textContent = `${liveMeters.toLocaleString()}m`;
    const zTag = document.getElementById('live-zone-tag');
    if (zTag) {
      const z = getZoneForDepth(liveMeters);
      zTag.textContent = `${z.badge} ${z.name}`;
    }
    const pct = Math.min(100, Math.max(0, (liveMeters / 7000) * 100));
    const fill = document.getElementById('minimap-fill');
    const dot = document.getElementById('minimap-sub-dot');
    if (fill) fill.style.height = `${pct}%`;
    if (dot) dot.style.top = `${pct}%`;
  };

  function updateDailyCountdown() {
    const el = document.getElementById('daily-countdown');
    if (!el) return;
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diffSec = Math.max(0, Math.floor((nextMidnight - now) / 1000));
    const h = String(Math.floor(diffSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
    const s = String(diffSec % 60).padStart(2, '0');
    el.textContent = `⏳ Next Daily Dive in ${h}:${m}:${s}`;
  }

  // =========================================================================
  // LANDING SCREEN
  // =========================================================================
  function renderHome() {
    cancelAnimationFrame(state.rafId);
    clearInterval(state.countdownTimerId);
    state.inReveal = false;
    AudioEngine.stopAmbience();
    Ocean.resetToSurfaceDock();

    const today = getTodayInfo();
    const stats = loadStats();
    const dailyRec = loadDailyRecord(today.dateKey);
    const dailyEntry = getDailyScheduleEntry(today.dateKey, today.diveNumber);
    const meta = window.ShrimplionDataset ? window.ShrimplionDataset.getMeta() : {
      source: 'bundled',
      totalPrompts: PROMPTS.length,
      totalCanonicalAnswers: 0
    };

    document.getElementById('streak-chip').textContent = `🔥 ${stats.dailyStreak}`;

    const themeEl = document.getElementById('daily-theme-pill');
    if (themeEl) {
      themeEl.textContent = `🌊 Current: ${dailyEntry.theme}`;
      themeEl.title = dailyEntry.subtitle || '';
    }
    const dsEl = document.getElementById('dataset-badge');
    if (dsEl) {
      const ansTxt = meta.totalCanonicalAnswers ? ` · ${meta.totalCanonicalAnswers.toLocaleString()} answers` : '';
      const srcTxt = meta.source === 'json' ? 'JSON' : 'Offline';
      dsEl.textContent = `📦 ${meta.totalPrompts || PROMPTS.length} prompts${ansTxt} (${srcTxt})`;
    }

    updateDailyCountdown();
    state.countdownTimerId = setInterval(updateDailyCountdown, 1000);

    const playBtn = document.getElementById('btn-play-daily');
    const resetDailyBtn = document.getElementById('btn-reset-daily');

    if (dailyRec) {
      playBtn.textContent = `VIEW DAILY DIVE #${today.diveNumber} (${dailyRec.totalDepth.toLocaleString()}m)`;
      if (resetDailyBtn) resetDailyBtn.style.display = 'block';
      typeKrillSpeech(
        document.getElementById('home-krill-speech'),
        `beep! You reached ${dailyRec.totalDepth.toLocaleString()}m on today’s dive (${dailyEntry.theme}). Try Archive, Practice, or Reset Today!`
      );
    } else {
      playBtn.textContent = `PLAY DAILY DIVE #${today.diveNumber}`;
      if (resetDailyBtn) resetDailyBtn.style.display = 'none';
      typeKrillSpeech(
        document.getElementById('home-krill-speech'),
        `beep. Today’s current is ${dailyEntry.theme} — obscure truths sink us toward 7,000m!`
      );
    }

    showScreen('home');
  }

  function resetDailyDive(startFresh = false) {
    const today = getTodayInfo();
    const prevRec = loadDailyRecord(today.dateKey);
    if (!prevRec) {
      showToast('No completed Daily Dive for today yet!');
      return;
    }

    removeDailyRecord(today.dateKey);
    const stats = loadStats();
    if (stats.lastDailyDate === today.dateKey) {
      stats.lastDailyDate = prevRec.prevLastDailyDate !== undefined ? prevRec.prevLastDailyDate : null;
      stats.dailyStreak = prevRec.prevDailyStreak !== undefined
        ? prevRec.prevDailyStreak
        : Math.max(0, (stats.dailyStreak || 1) - 1);
      saveStats(stats);
    }

    AudioEngine.resetSplash();
    showToast(`🔄 Daily Dive #${today.diveNumber} reset! Dive again.`);
    if (startFresh) {
      launchDive('daily');
    } else {
      renderHome();
    }
  }

  function toggleHomeDrawer(drawerName) {
    ['practice', 'packs', 'crew'].forEach(name => {
      const drawer = document.getElementById(`drawer-${name}`);
      const btn = document.getElementById(`btn-mode-${name}`);
      const isTarget = name === drawerName && !drawer.classList.contains('open');
      drawer.classList.toggle('open', isTarget);
      btn.classList.toggle('active-drawer', isTarget);
    });
  }

  // =========================================================================
  // LAUNCH MODES
  // =========================================================================
  function launchDive(mode, opts = {}) {
    const today = getTodayInfo();

    if (mode === 'daily') {
      const existing = loadDailyRecord(today.dateKey);
      if (existing) {
        Ocean.snapToDepth(existing.totalDepth);
        renderSummary({
          label: `Daily Dive #${existing.diveNumber || today.diveNumber}`,
          totalDepth: existing.totalDepth,
          emojis: existing.emojis,
          results: existing.results
        });
        return;
      }
      state.mode = 'daily';
      state.packId = 'mixed';
      state.untimed = false;
      state.timerDuration = 25;
      state.prompts = getDailyPrompts(today.seed, today.dateKey);
      state.crewNames = [];
    } else if (mode === 'archive') {
      const targetKey = opts.dateKey || today.dateKey;
      const entry = getDailyScheduleEntry(targetKey, today.diveNumber);
      state.mode = 'archive';
      state.packId = 'mixed';
      state.untimed = false;
      state.timerDuration = 25;
      state.archiveDateKey = targetKey;
      state.archiveDiveNumber = entry.diveNumber;
      state.archiveTheme = entry.theme;
      state.prompts = entry.prompts;
      state.crewNames = [];
    } else if (mode === 'practice') {
      const customSec = opts.timerSeconds !== undefined ? opts.timerSeconds : state.settings.timerSeconds;
      const isUntimed = opts.untimed !== undefined ? Boolean(opts.untimed) : Number(customSec) === 0;
      state.mode = 'practice';
      state.packId = 'mixed';
      state.untimed = isUntimed;
      state.timerDuration = isUntimed ? 25 : Math.max(10, Number(customSec) || 25);
      state.prompts = getPackPrompts('mixed');
      state.crewNames = [];
    } else if (mode === 'pack') {
      const customSec = state.settings.timerSeconds;
      state.mode = 'pack';
      state.packId = opts.packId || 'world';
      state.untimed = Number(customSec) === 0;
      state.timerDuration = state.untimed ? 25 : Math.max(10, Number(customSec) || 25);
      state.prompts = getPackPrompts(state.packId);
      state.crewNames = [];
    } else if (mode === 'crew') {
      const customSec = state.settings.timerSeconds;
      state.mode = 'crew';
      state.packId = 'mixed';
      state.untimed = Number(customSec) === 0;
      state.timerDuration = state.untimed ? 25 : Math.max(10, Number(customSec) || 25);
      state.prompts = getPackPrompts('mixed');
      state.crewNames = opts.crewNames && opts.crewNames.length >= 2
        ? opts.crewNames
        : ['Diver 1', 'Diver 2'];
    }

    state.sigIndex = 0;
    state.totalDepth = 0;
    state.results = [];
    state.rareCombo = 0;
    state.hintsLeft = 1;
    state.hintUsedOnSignal = false;
    state.activeSuggestion = '';
    state.crewTurnIdx = 0;
    state.crewRoundPicks = [];
    state.inReveal = false;

    renderComboPill();
    AudioEngine.sonarPing();
    AudioEngine.startAmbience(0);
    Ocean.triggerLaunchSplash();
    showScreen('play');
    startSignal();
  }

  function renderComboPill() {
    const pill = document.getElementById('combo-pill');
    if (!pill) return;
    if (state.rareCombo >= 2) {
      pill.style.display = 'inline-block';
      pill.textContent = `⚡ ×${state.rareCombo} COMBO`;
    } else {
      pill.style.display = 'none';
    }
  }

  function syncAutoSpellBtn() {
    const btn = document.getElementById('btn-toggle-autospell');
    if (!btn) return;
    btn.classList.toggle('active', state.autoSpell);
    btn.textContent = state.autoSpell ? '🪄 Auto-Spell: ON' : '🪄 Auto-Spell: OFF';
  }

  function syncHintBtn() {
    const btn = document.getElementById('btn-sonar-hint');
    if (!btn) return;
    btn.disabled = state.hintsLeft <= 0 || state.hintUsedOnSignal || state.mode === 'crew';
    btn.textContent = state.mode === 'crew'
      ? '📡 Hint (Solo)'
      : (state.hintsLeft > 0 ? `📡 Hint (${state.hintsLeft})` : '📡 Hint (0)');
  }

  function applySuggestion(term, autoSubmit = false) {
    const input = document.getElementById('dive-input');
    input.value = term;
    AudioEngine.uiClick();
    updateSpellPreview();
    if (autoSubmit) {
      onSubmitAnswer();
    } else {
      input.focus();
    }
  }

  function updateSpellPreview() {
    const bar = document.getElementById('spell-preview-bar');
    if (!bar) return;
    const raw = document.getElementById('dive-input').value;
    const promptObj = state.prompts[state.sigIndex];
    state.activeSuggestion = '';
    bar.innerHTML = '';

    if (!promptObj || !Matcher.suggestSpelling) return;
    const info = Matcher.suggestSpelling(promptObj, raw);

    if (info.status === 'exact') {
      bar.innerHTML = `<span class="spell-preview-pill is-exact">✓ Sonar lock ready: ${escapeHtml(info.canonical)}</span>`;
      return;
    }

    if (info.status === 'autocorrect') {
      state.activeSuggestion = info.canonical;
      if (state.autoSpell) {
        bar.innerHTML = `<span class="spell-preview-pill">🪄 Auto-spell: <strong>${escapeHtml(info.canonical)}</strong> (Enter locks in)</span>`;
      } else {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'spell-suggest-chip';
        chip.textContent = `Did you mean ${info.canonical}? (Tab)`;
        chip.addEventListener('click', () => applySuggestion(info.canonical, true));
        bar.appendChild(chip);
      }
      return;
    }

    if (info.status === 'suggest' && info.suggestions && info.suggestions.length > 0) {
      state.activeSuggestion = info.suggestions[0];
      const lbl = document.createElement('span');
      lbl.textContent = '💡 Did you mean:';
      bar.appendChild(lbl);
      info.suggestions.forEach(term => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'spell-suggest-chip';
        chip.textContent = term;
        chip.addEventListener('click', () => applySuggestion(term, true));
        bar.appendChild(chip);
      });
    }
  }

  function triggerSonarHint() {
    if (state.inReveal || state.hintsLeft <= 0 || state.hintUsedOnSignal || state.mode === 'crew') return;
    const promptObj = state.prompts[state.sigIndex];
    const compiled = Matcher.compilePromptIndex(promptObj);
    const pool = [...(compiled.byTier[4] || []), ...(compiled.byTier[5] || []), ...(compiled.byTier[6] || [])];
    if (pool.length === 0) return;

    const pick = pool[Math.floor(Math.random() * pool.length)];
    const cleanLen = pick.replace(/\s+/g, '').length;
    const firstChar = pick[0].toUpperCase();
    const wordCount = pick.trim().split(/\s+/).length;

    state.hintsLeft -= 1;
    state.hintUsedOnSignal = true;
    syncHintBtn();

    const box = document.getElementById('sonar-hint-box');
    box.style.display = 'block';
    box.innerHTML = `📡 <strong>Sonar Lead:</strong> Rare+ signal spotted — starts with <strong>"${escapeHtml(firstChar)}"</strong> (${cleanLen} letters${wordCount > 1 ? `, ${wordCount} words` : ''}).`;
    AudioEngine.hintSonar();
    document.getElementById('dive-input').focus();
  }

  // =========================================================================
  // SIGNAL GAMEPLAY LOOP
  // =========================================================================
  function renderSignalDots(justLockedIdx = -1) {
    const wrap = document.getElementById('signal-dots');
    wrap.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const d = document.createElement('div');
      d.className = 'sig-dot';
      if (i < state.results.length) {
        const t = TIERS[state.results[i].tier];
        d.textContent = t.emoji;
        d.style.borderColor = t.color;
        if (i === justLockedIdx) d.classList.add('popped');
      } else if (i === state.sigIndex) {
        d.classList.add('active');
        d.textContent = String(i + 1);
      } else {
        d.textContent = '·';
      }
      wrap.appendChild(d);
    }
  }

  function startSignal() {
    cancelAnimationFrame(state.rafId);
    state.inReveal = false;
    state.hintUsedOnSignal = false;
    state.activeSuggestion = '';

    document.getElementById('oxygen-vignette').classList.remove('urgent');
    document.getElementById('plunge-stamp-wrap').classList.remove('show');
    document.getElementById('plunge-card').classList.remove('active');
    document.getElementById('prompt-card').classList.remove('diving-minimized');

    renderSignalDots();
    syncAutoSpellBtn();
    syncHintBtn();

    const hintBox = document.getElementById('sonar-hint-box');
    if (hintBox) {
      hintBox.style.display = 'none';
      hintBox.textContent = '';
    }
    const spellBar = document.getElementById('spell-preview-bar');
    if (spellBar) spellBar.innerHTML = '';

    const promptObj = state.prompts[state.sigIndex];
    const packInfo = PACKS[promptObj.pack] || PACKS.mixed;

    document.getElementById('signal-eyebrow').textContent =
      `SIGNAL ${state.sigIndex + 1} / 7 · ${packInfo.icon} ${packInfo.name}`;
    document.getElementById('prompt-headline').textContent = promptObj.prompt;
    document.getElementById('prompt-subhint').textContent = promptObj.hint;
    document.getElementById('reject-text').textContent = '';

    // Crew turn banner
    const crewBanner = document.getElementById('crew-turn-banner');
    if (state.mode === 'crew') {
      const diverName = state.crewNames[state.crewTurnIdx];
      crewBanner.style.display = 'inline-block';
      crewBanner.textContent = `🤿 ${diverName.toUpperCase()}’S TURN (${state.crewTurnIdx + 1}/${state.crewNames.length}) — Don’t duplicate crew answers!`;
    } else {
      crewBanner.style.display = 'none';
    }

    const input = document.getElementById('dive-input');
    input.value = '';
    input.disabled = false;
    setTimeout(() => input.focus(), 30);

    const ringWrap = document.getElementById('ring-timer-wrap');
    const ringFg = document.getElementById('ring-fg');
    const ringNum = document.getElementById('ring-num');

    if (state.untimed) {
      ringWrap.classList.remove('heartbeat');
      ringFg.style.strokeDashoffset = '0';
      ringFg.style.stroke = '#38bdf8';
      ringNum.textContent = '∞';
      return;
    }

    state.timerEndMs = performance.now() + state.timerDuration * 1000;
    state.lastWholeSec = state.timerDuration;
    tickOxygenClock();
  }

  function tickOxygenClock() {
    if (state.inReveal || state.untimed) return;
    const remainMs = Math.max(0, state.timerEndMs - performance.now());
    const remainSec = remainMs / 1000;
    const whole = Math.ceil(remainSec);

    const frac = remainMs / (state.timerDuration * 1000);
    const ringFg = document.getElementById('ring-fg');
    const ringWrap = document.getElementById('ring-timer-wrap');
    const vignette = document.getElementById('oxygen-vignette');

    ringFg.style.strokeDashoffset = String(RING_CIRC * (1 - frac));
    document.getElementById('ring-num').textContent = String(whole);

    if (remainSec <= 5) {
      ringFg.style.stroke = '#fb7185';
      ringWrap.classList.add('heartbeat');
      vignette.classList.add('urgent');
      if (whole < state.lastWholeSec && whole > 0) {
        AudioEngine.lowOxygenTick(whole);
      }
    } else if (remainSec <= 10) {
      ringFg.style.stroke = '#facc15';
      ringWrap.classList.remove('heartbeat');
      vignette.classList.remove('urgent');
    } else {
      ringFg.style.stroke = '#38bdf8';
      ringWrap.classList.remove('heartbeat');
      vignette.classList.remove('urgent');
    }

    state.lastWholeSec = whole;

    if (remainMs <= 0) {
      ringWrap.classList.remove('heartbeat');
      vignette.classList.remove('urgent');
      handleAcceptedPick({ canonical: 'Out of Oxygen', tier: 0, fuzzy: false });
      return;
    }

    state.rafId = requestAnimationFrame(tickOxygenClock);
  }

  function onSubmitAnswer(e) {
    if (e) e.preventDefault();
    if (state.inReveal) return;

    const input = document.getElementById('dive-input');
    const promptObj = state.prompts[state.sigIndex];
    const evalRes = Matcher.evaluateAnswer(promptObj, input.value, { autoSpell: state.autoSpell });

    if (!evalRes.matched) {
      if (evalRes.empty) return;
      AudioEngine.rejectBuzz();
      Ocean.triggerRejectShake();
      document.getElementById('reject-text').textContent = `✕ ${evalRes.reason}`;
      updateSpellPreview();
      input.classList.remove('shake');
      void input.offsetWidth;
      input.classList.add('shake');
      input.select();
      return;
    }

    handleAcceptedPick(evalRes);
  }

  function onPassSignal() {
    if (state.inReveal) return;
    handleAcceptedPick({ canonical: 'Passed', tier: 0, fuzzy: false });
  }

  function handleAcceptedPick(evalRes) {
    cancelAnimationFrame(state.rafId);
    document.getElementById('ring-timer-wrap').classList.remove('heartbeat');
    document.getElementById('oxygen-vignette').classList.remove('urgent');

    // In Crew Mode, collect each diver's pick before resolving the plunge!
    if (state.mode === 'crew') {
      const diver = state.crewNames[state.crewTurnIdx];
      state.crewRoundPicks.push({
        diver,
        canonical: evalRes.canonical,
        tier: evalRes.tier,
        meters: TIERS[evalRes.tier].meters,
        fuzzy: Boolean(evalRes.fuzzy)
      });

      if (state.crewTurnIdx < state.crewNames.length - 1) {
        state.crewTurnIdx++;
        AudioEngine.sonarPing();
        showToast(`✅ ${diver} locked in! Pass to ${state.crewNames[state.crewTurnIdx]}`);
        startSignal();
        return;
      }

      // Resolve full crew picks for this signal!
      const picks = state.crewRoundPicks;
      state.crewTurnIdx = 0;
      state.crewRoundPicks = [];

      const validPicks = picks.filter(p => p.tier > 0);
      const uniqueLower = new Set(validPicks.map(p => p.canonical.toLowerCase()));
      const hasDuplicate = uniqueLower.size < validPicks.length;

      let finalMeters = 0;
      let bestTier = 0;
      let displayLabel = '';
      let crewQuip = '';

      if (hasDuplicate) {
        finalMeters = 0;
        bestTier = 0;
        displayLabel = picks.map(p => `${p.diver}: ${p.canonical}`).join(' · ');
        crewQuip = 'CREW COLLISION!! Two divers picked the exact same answer — 0m gained!';
      } else if (validPicks.length === picks.length) {
        const avgMeters = Math.round(picks.reduce((s, p) => s + p.meters, 0) / picks.length);
        finalMeters = avgMeters + 150; // Crew Sync Bonus!
        bestTier = Math.max(...picks.map(p => p.tier));
        displayLabel = picks.map(p => `${p.diver}: ${p.canonical}`).join(' · ');
        crewQuip = `CREW SYNC BONUS (+150m)! All ${picks.length} divers found unique answers!`;
      } else {
        finalMeters = Math.round(picks.reduce((s, p) => s + p.meters, 0) / picks.length);
        bestTier = Math.max(...picks.map(p => p.tier));
        displayLabel = picks.map(p => `${p.diver}: ${p.canonical}`).join(' · ');
        crewQuip = 'Partial crew lock-in — descending on reserve power!';
      }

      triggerPlungeReveal({
        displayAnswer: displayLabel,
        tier: bestTier,
        metersGained: Math.min(7000 - state.totalDepth, finalMeters),
        fuzzy: false,
        customQuip: crewQuip
      });
      return;
    }

    // Standard Solo Plunge (Daily / Archive / Practice / Pack)
    const tierInfo = TIERS[evalRes.tier];
    triggerPlungeReveal({
      displayAnswer: evalRes.canonical,
      tier: evalRes.tier,
      metersGained: tierInfo.meters,
      fuzzy: Boolean(evalRes.fuzzy),
      correctedFrom: evalRes.correctedFrom || '',
      customQuip: null
    });
  }

  function triggerPlungeReveal({ displayAnswer, tier, metersGained, fuzzy, correctedFrom, customQuip }) {
    state.inReveal = true;
    state.revealOpenedAt = performance.now();

    const promptObj = state.prompts[state.sigIndex];
    const tierInfo = TIERS[tier];
    const prevZone = getZoneForDepth(state.totalDepth);

    // Rare+ Combo Streak Bonus (only in solo modes when landing Tier 4+ consecutively)
    let comboBonus = 0;
    if (state.mode !== 'crew') {
      if (tier >= 4) {
        state.rareCombo += 1;
        if (state.rareCombo >= 2) {
          comboBonus = Math.min(150, (state.rareCombo - 1) * 50);
        }
      } else {
        state.rareCombo = 0;
      }
    }
    renderComboPill();

    const totalGain = Math.min(7000 - state.totalDepth, metersGained + comboBonus);
    state.totalDepth = Math.min(7000, state.totalDepth + totalGain);
    const nextZone = getZoneForDepth(state.totalDepth);

    state.results.push({
      promptId: promptObj.id,
      promptText: promptObj.prompt,
      answer: displayAnswer,
      tier,
      meters: totalGain,
      comboBonus,
      fuzzy
    });

    // 1. Trigger Pixel Ocean Plunge & Layered Submarine Web Audio!
    AudioEngine.diveScore(tier);
    if (fuzzy) AudioEngine.spellCorrectChime();
    if (comboBonus > 0) AudioEngine.comboChime(state.rareCombo);
    if (nextZone.name !== prevZone.name) AudioEngine.zoneTransitionFanfare();
    AudioEngine.updateAmbienceDepth(state.totalDepth);
    Ocean.plungeToDepth(state.totalDepth, tier);
    renderSignalDots(state.results.length - 1);

    // 2. Hide prompt card so player watches the sub rocket down through the pixel ocean!
    document.getElementById('prompt-card').classList.add('diving-minimized');

    // 3. Slam Spring-Physics Tier Stamp into upper window!
    const stampWrap = document.getElementById('plunge-stamp-wrap');
    const stampBadge = document.getElementById('tier-stamp-badge');
    const metersPop = document.getElementById('floating-meters-pop');

    stampBadge.textContent = `${tierInfo.emoji} ${tierInfo.name}`;
    stampBadge.style.background = '#070f22';
    stampBadge.style.color = tierInfo.color;
    stampBadge.style.borderColor = tierInfo.color;

    metersPop.textContent = comboBonus > 0
      ? `+${totalGain.toLocaleString()}m (⚡ +${comboBonus}m Combo)`
      : `+${totalGain.toLocaleString()}m`;
    metersPop.style.color = tierInfo.color;

    stampWrap.classList.remove('show');
    void stampWrap.offsetWidth;
    stampWrap.classList.add('show');

    // Personal Best per-prompt tracking (solo runs when tier >= 1)
    let isNewPB = false;
    if (tier >= 1 && state.mode !== 'crew') {
      const bests = loadPromptBests();
      const prev = bests[promptObj.id];
      if (!prev || tier > prev.bestTier) {
        bests[promptObj.id] = { bestTier: tier, bestAnswer: displayAnswer, bestMeters: totalGain };
        savePromptBests(bests);
        if (prev || tier >= 4) isNewPB = true;
      }
    }

    // 4. Populate Bottom Plunge Card + Krill Typewriter Reaction
    document.getElementById('plunge-answer-name').textContent = displayAnswer;
    const pbTag = document.getElementById('plunge-pb-tag');
    if (pbTag) pbTag.style.display = isNewPB ? 'inline-block' : 'none';
    document.getElementById('plunge-fuzzy-tag').textContent = fuzzy
      ? (correctedFrom ? `✨ Auto spell-checked (${correctedFrom})` : '✨ Typo forgiven')
      : '';

    const quipPool = tierInfo.quips || [tierInfo.tagline];
    let chosenQuip = customQuip || quipPool[Math.floor(Math.random() * quipPool.length)];
    if (comboBonus > 0 && !customQuip) {
      chosenQuip = `⚡ ×${state.rareCombo} SONAR COMBO (+${comboBonus}m bonus)! ${chosenQuip}`;
    } else if (nextZone.name !== prevZone.name && !customQuip) {
      chosenQuip = `${nextZone.badge} Entered ${nextZone.name}! ${chosenQuip}`;
    }
    typeKrillSpeech(document.getElementById('plunge-krill-speech'), chosenQuip);

    const compiled = Matcher.compilePromptIndex(promptObj);
    const pearls = compiled.byTier[6].filter(p => p.toLowerCase() !== displayAnswer.toLowerCase());
    const samplePearl = pearls[Math.floor(Math.random() * pearls.length)] || compiled.byTier[6][0];
    document.getElementById('plunge-pearl-hint').innerHTML =
      tier === 6
        ? `💎 <strong>ONE IN A SHRIMPLION!</strong> Another 1,000m gem: <em>${escapeHtml(samplePearl)}</em>`
        : `💎 <strong>1,000m Trench Pearl example:</strong> <em>${escapeHtml(samplePearl)}</em>`;

    const nextBtn = document.getElementById('btn-next-signal');
    nextBtn.textContent = state.sigIndex < 6 ? 'NEXT SIGNAL (ENTER) →' : 'SURFACE DIVE LOG ⚓';

    document.getElementById('plunge-card').classList.add('active');
    setTimeout(() => nextBtn.focus(), 60);
  }

  function advanceSignal() {
    if (!state.inReveal) return;
    if (performance.now() - state.revealOpenedAt < 250) return;

    if (state.sigIndex < 6) {
      state.sigIndex++;
      AudioEngine.sonarPing();
      startSignal();
    } else {
      completeDive();
    }
  }

  // =========================================================================
  // COMPLETE DIVE & SUMMARY
  // =========================================================================
  function completeDive() {
    state.inReveal = false;
    AudioEngine.diveComplete();

    const today = getTodayInfo();
    const stats = loadStats();
    stats.divesPlayed += 1;
    stats.totalMeters += state.totalDepth;
    if (state.totalDepth > stats.bestDepth) stats.bestDepth = state.totalDepth;
    state.results.forEach(r => {
      stats.tierCounts[r.tier] = (stats.tierCounts[r.tier] || 0) + 1;
    });

    const emojis = state.results.map(r => TIERS[r.tier].emoji).join('');

    if (state.mode === 'daily') {
      const prevLastDailyDate = stats.lastDailyDate;
      const prevDailyStreak = stats.dailyStreak;
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yKey = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
      if (stats.lastDailyDate === yKey) stats.dailyStreak += 1;
      else if (stats.lastDailyDate !== today.dateKey) stats.dailyStreak = 1;
      stats.lastDailyDate = today.dateKey;

      saveDailyRecord(today.dateKey, {
        diveNumber: today.diveNumber,
        dateKey: today.dateKey,
        prevLastDailyDate,
        prevDailyStreak,
        totalDepth: state.totalDepth,
        emojis,
        results: state.results
      });
    }

    saveStats(stats);
    document.getElementById('streak-chip').textContent = `🔥 ${stats.dailyStreak}`;

    let label = `Daily Dive #${today.diveNumber}`;
    if (state.mode === 'archive') label = `Archive · Daily Dive #${state.archiveDiveNumber} (${state.archiveTheme})`;
    else if (state.mode === 'practice') label = 'Practice Dive';
    else if (state.mode === 'pack') label = PACKS[state.packId].name;
    else if (state.mode === 'crew') label = `Crew Dive (${state.crewNames.join(' & ')})`;

    renderSummary({
      label,
      isDailyToday: state.mode === 'daily',
      totalDepth: state.totalDepth,
      emojis,
      results: state.results
    });
  }

  function renderSummary(data) {
    AudioEngine.stopAmbience();
    const zone = getZoneForDepth(data.totalDepth);
    document.getElementById('res-mode-label').textContent = data.label;
    document.getElementById('res-zone-badge').textContent = `${zone.badge} ${zone.name} (${zone.sci})`;
    document.getElementById('res-depth-big').textContent = `${data.totalDepth.toLocaleString()}m`;
    const resetSumBtn = document.getElementById('btn-reset-daily-summary');
    if (resetSumBtn) {
      const hasToday = Boolean(loadDailyRecord(getTodayInfo().dateKey));
      const isDailyLabel = data.isDailyToday || /^Daily Dive #/i.test(String(data.label || ''));
      resetSumBtn.style.display = hasToday && isDailyLabel ? 'inline-flex' : 'none';
    }

    // Animated 7-bar Dive Trajectory Chart
    const chart = document.getElementById('dive-bars-chart');
    chart.innerHTML = '';
    data.results.forEach(r => {
      const t = TIERS[r.tier];
      const col = document.createElement('div');
      col.className = 'dive-bar-col';
      const heightPct = Math.max(10, Math.round((r.meters / 1000) * 62));
      col.innerHTML = `
        <div class="dive-bar-fill" style="height:6px;background:${t.color}"></div>
        <span class="dive-bar-emoji" title="${escapeHtml(r.answer)} (+${r.meters}m)">${t.emoji}</span>
      `;
      chart.appendChild(col);
      requestAnimationFrame(() => {
        setTimeout(() => {
          col.querySelector('.dive-bar-fill').style.height = `${heightPct}px`;
        }, 60);
      });
    });

    state.lastShareText = [
      `🦐 SHRIMPLION — ${data.label}`,
      `⚓ ${data.totalDepth.toLocaleString()}m / 7,000m (${zone.name})`,
      data.emojis
    ].join('\n');

    state.lastDetailText = [
      `🦐 SHRIMPLION — ${data.label}`,
      `⚓ ${data.totalDepth.toLocaleString()}m / 7,000m (${zone.name})`,
      '',
      ...data.results.map((r, i) => `${i + 1}. ${r.promptText}\n   ${TIERS[r.tier].emoji} ${r.answer} (+${r.meters}m · ${TIERS[r.tier].name})`)
    ].join('\n');

    const logSearch = document.getElementById('log-search-input');
    if (logSearch) logSearch.value = '';

    // Render Expandable Answer Encyclopedia
    const logList = document.getElementById('log-list');
    logList.innerHTML = '';

    data.results.forEach((res, idx) => {
      const promptObj = PROMPTS.find(p => p.id === res.promptId);
      const tInfo = TIERS[res.tier];
      const card = document.createElement('div');
      card.className = 'log-card';

      const row = document.createElement('div');
      row.className = 'log-row';
      row.innerHTML = `
        <div>
          <div class="log-q">${idx + 1}. ${escapeHtml(res.promptText)}</div>
          <div class="log-a">${escapeHtml(res.answer)} · <span style="color:${tInfo.color};font-weight:800">${tInfo.emoji} ${tInfo.name}</span></div>
        </div>
        <div style="font-family:ui-monospace,monospace;font-weight:900;color:${tInfo.color};white-space:nowrap;">
          +${res.meters.toLocaleString()}m ▾
        </div>
      `;

      const drawer = document.createElement('div');
      drawer.className = 'log-drawer';

      if (promptObj) {
        const comp = Matcher.compilePromptIndex(promptObj);
        for (let t = 6; t >= 1; t--) {
          const ti = TIERS[t];
          const list = comp.byTier[t] || [];
          const grp = document.createElement('div');
          grp.className = 'tier-group';
          const chips = list.map(a => {
            const mine = a.toLowerCase() === res.answer.toLowerCase();
            return `<span class="ans-chip${mine ? ' mine' : ''}" data-ans="${escapeHtml(a.toLowerCase())}">${escapeHtml(a)}</span>`;
          }).join('');
          grp.innerHTML = `
            <div class="tier-group-head" style="color:${ti.color}">${ti.emoji} ${ti.name} (+${ti.meters}m) · ${list.length}</div>
            <div class="chip-cloud">${chips}</div>
          `;
          drawer.appendChild(grp);
        }
      }

      row.addEventListener('click', () => card.classList.toggle('open'));
      card.appendChild(row);
      card.appendChild(drawer);
      logList.appendChild(card);
    });

    showScreen('summary');
  }

  function filterSummaryLog(query) {
    const q = String(query || '').trim().toLowerCase();
    document.querySelectorAll('#log-list .log-card').forEach(card => {
      if (!q) {
        card.style.display = '';
        card.classList.remove('open');
        card.querySelectorAll('.ans-chip').forEach(ch => { ch.style.display = ''; });
        return;
      }
      let anyMatch = false;
      card.querySelectorAll('.ans-chip').forEach(ch => {
        const match = (ch.dataset.ans || '').includes(q);
        ch.style.display = match ? '' : 'none';
        if (match) anyMatch = true;
      });
      card.style.display = anyMatch ? '' : 'none';
      if (anyMatch) card.classList.add('open');
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // =========================================================================
  // STATS MODAL & EVENT BINDINGS
  // =========================================================================
  function openStats() {
    const st = loadStats();
    document.getElementById('st-rank').textContent = `🎖️ Callsign Rank: ${getDiverRank(st.totalMeters)}`;
    document.getElementById('st-dives').textContent = String(st.divesPlayed);
    document.getElementById('st-streak').textContent = String(st.dailyStreak);
    document.getElementById('st-best').textContent = `${st.bestDepth.toLocaleString()}m`;
    const avg = st.divesPlayed ? Math.round(st.totalMeters / st.divesPlayed) : 0;
    document.getElementById('st-avg').textContent = `${avg.toLocaleString()}m`;

    const dist = document.getElementById('st-dist');
    dist.innerHTML = '';
    const maxC = Math.max(1, ...Object.values(st.tierCounts));
    for (let t = 6; t >= 0; t--) {
      const ti = TIERS[t];
      const c = st.tierCounts[t] || 0;
      const w = Math.round((c / maxC) * 100);
      const r = document.createElement('div');
      r.className = 'dist-row';
      r.innerHTML = `
        <div class="dist-name">${ti.emoji} ${ti.name}</div>
        <div class="dist-bar-bg"><div class="dist-bar-fg" style="width:${w}%;background:${ti.color}"></div></div>
        <div style="width:26px;text-align:right;font-family:ui-monospace,monospace;font-weight:800">${c}</div>
      `;
      dist.appendChild(r);
    }
    document.getElementById('modal-stats').classList.add('open');
  }

  function syncSettingsModal() {
    const validTimers = ['15', '25', '35', '0'];
    const tStr = String(state.settings.timerSeconds);
    document.getElementById('set-autospell').checked = Boolean(state.autoSpell);
    document.getElementById('set-timer-sec').value = validTimers.includes(tStr) ? tStr : '25';
    const volPct = typeof AudioEngine.getVolume === 'function' ? Math.round(AudioEngine.getVolume() * 100) : 85;
    document.getElementById('audio-volume-slider').value = String(volPct);
    document.getElementById('set-vol-pct').textContent = `${volPct}%`;
    document.getElementById('set-muted').checked = typeof AudioEngine.isMuted === 'function' ? AudioEngine.isMuted() : false;
    document.getElementById('set-ambience').checked = typeof AudioEngine.isAmbientEnabled === 'function' ? AudioEngine.isAmbientEnabled() : true;
    document.getElementById('set-keyticks').checked = state.settings.keyTicks !== false;
    document.getElementById('set-sub-skin').value = state.settings.subSkin || 'gold';
    document.getElementById('set-reduced-motion').checked = Boolean(state.settings.reducedMotion);

    const wipeBtn = document.getElementById('btn-wipe-stats');
    if (wipeBtn) {
      wipeBtn.dataset.armed = '0';
      wipeBtn.textContent = '🗑️ Reset All Stats';
    }
  }

  function openSettings() {
    try {
      syncSettingsModal();
    } catch (_) {}
    const modal = document.getElementById('modal-settings');
    if (modal) modal.classList.add('open');
  }

  function openArchive() {
    const today = getTodayInfo();
    const listEl = document.getElementById('archive-list');
    listEl.innerHTML = '';

    const availableKeys = Object.keys(DAILY_SCHEDULE || {})
      .filter(k => k <= today.dateKey)
      .sort()
      .reverse()
      .slice(0, 21);

    if (availableKeys.length === 0) {
      listEl.innerHTML = '<div style="font-size:0.82rem;color:#94a3b8;">No archived daily dives available yet.</div>';
    } else {
      availableKeys.forEach(dateKey => {
        const entry = DAILY_SCHEDULE[dateKey];
        const saved = loadDailyRecord(dateKey);
        const isToday = dateKey === today.dateKey;
        const row = document.createElement('div');
        row.className = `archive-item${isToday ? ' is-today' : ''}`;
        row.innerHTML = `
          <div>
            <div class="archive-title">#${entry.diveNumber} · ${escapeHtml(entry.theme)} ${isToday ? '<span style="color:#38bdf8;font-size:0.7rem;">(TODAY)</span>' : ''}</div>
            <div class="archive-sub">${dateKey} · ${escapeHtml(entry.subtitle || '')}${saved ? ` · Saved: <strong>${saved.totalDepth.toLocaleString()}m</strong>` : ''}</div>
          </div>
          <button class="archive-play-btn" type="button">${isToday ? (saved ? 'View' : 'Play') : 'Replay →'}</button>
        `;
        row.querySelector('.archive-play-btn').addEventListener('click', () => {
          document.getElementById('modal-archive').classList.remove('open');
          launchDive(isToday ? 'daily' : 'archive', { dateKey });
        });
        listEl.appendChild(row);
      });
    }

    document.getElementById('modal-archive').classList.add('open');
  }

  function syncSoundBtn() {
    document.getElementById('btn-sound').textContent = AudioEngine.isMuted() ? '🔇' : '🔊';
  }

  function syncAmbienceBtn() {
    const btn = document.getElementById('btn-ambience');
    if (!btn || !AudioEngine.isAmbientEnabled) return;
    const on = AudioEngine.isAmbientEnabled();
    btn.textContent = on ? '🌊' : '🔕';
    btn.title = on ? 'Hydrophone Ocean Ambience: ON' : 'Hydrophone Ocean Ambience: OFF';
  }

  document.addEventListener('DOMContentLoaded', () => {
    Ocean.init(document.getElementById('ocean-canvas'));
    applyVisualSettings(state.settings);
    syncSoundBtn();
    syncAmbienceBtn();
    renderHome();

    document.getElementById('btn-top-home').addEventListener('click', () => { AudioEngine.uiClick(); renderHome(); });
    document.getElementById('btn-play-daily').addEventListener('click', () => launchDive('daily'));
    document.getElementById('btn-reset-daily').addEventListener('click', () => resetDailyDive(false));
    document.getElementById('btn-reset-daily-summary').addEventListener('click', () => resetDailyDive(true));

    // Mode drawers
    document.getElementById('btn-mode-practice').addEventListener('click', () => { AudioEngine.uiClick(); toggleHomeDrawer('practice'); });
    document.getElementById('btn-mode-packs').addEventListener('click', () => { AudioEngine.uiClick(); toggleHomeDrawer('packs'); });
    document.getElementById('btn-mode-crew').addEventListener('click', () => { AudioEngine.uiClick(); toggleHomeDrawer('crew'); });

    document.getElementById('btn-launch-practice-blitz').addEventListener('click', () => launchDive('practice', { untimed: false, timerSeconds: 15 }));
    document.getElementById('btn-launch-practice-timed').addEventListener('click', () => launchDive('practice', { untimed: false, timerSeconds: 25 }));
    document.getElementById('btn-launch-practice-untimed').addEventListener('click', () => launchDive('practice', { untimed: true }));

    document.querySelectorAll('[data-launch-pack]').forEach(btn => {
      btn.addEventListener('click', () => launchDive('pack', { packId: btn.dataset.launchPack }));
    });

    document.getElementById('btn-launch-crew').addEventListener('click', () => {
      const names = [1, 2, 3, 4]
        .map(n => document.getElementById(`crew-p${n}`).value.trim())
        .filter(Boolean);
      launchDive('crew', { crewNames: names.length >= 2 ? names : ['Diver 1', 'Diver 2'] });
    });

    // Gameplay & Auto Spell-Check + Sonar Hint
    const diveInput = document.getElementById('dive-input');
    diveInput.addEventListener('input', () => {
      if (state.settings.keyTicks) AudioEngine.keystrokeTick();
      updateSpellPreview();
    });
    diveInput.addEventListener('keydown', e => {
      if (e.key === 'Tab' && state.activeSuggestion) {
        e.preventDefault();
        applySuggestion(state.activeSuggestion, false);
      }
    });

    document.getElementById('btn-toggle-autospell').addEventListener('click', () => {
      state.autoSpell = !state.autoSpell;
      state.settings.autoSpell = state.autoSpell;
      saveSettings(state.settings);
      AudioEngine.uiClick();
      syncAutoSpellBtn();
      updateSpellPreview();
      showToast(state.autoSpell ? '🪄 Auto Spell-Check enabled!' : '🪄 Auto Spell-Check switched to manual suggestions');
      diveInput.focus();
    });

    document.getElementById('btn-sonar-hint').addEventListener('click', triggerSonarHint);
    document.getElementById('dive-form').addEventListener('submit', onSubmitAnswer);
    document.getElementById('btn-pass').addEventListener('click', onPassSignal);
    document.getElementById('btn-next-signal').addEventListener('click', advanceSignal);

    window.addEventListener('keydown', e => {
      if (e.key === 'Enter' && state.inReveal && document.getElementById('screen-play').classList.contains('active')) {
        e.preventDefault();
        advanceSignal();
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      }
    });

    // Results actions & Encyclopedia filter
    document.getElementById('btn-share').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(state.lastShareText);
        showToast('📋 Copied dive score to clipboard!');
      } catch (_) {
        showToast('📋 Score ready to share!');
      }
    });
    document.getElementById('btn-copy-details').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(state.lastDetailText || state.lastShareText);
        showToast('📝 Copied full signal-by-signal log!');
      } catch (_) {
        showToast('📝 Full log ready!');
      }
    });
    document.getElementById('log-search-input').addEventListener('input', e => {
      filterSummaryLog(e.target.value);
    });
    document.getElementById('btn-again-practice').addEventListener('click', () => launchDive('practice'));
    document.getElementById('btn-back-surface').addEventListener('click', renderHome);

    // Modals & Settings & Audio controls
    document.getElementById('btn-archive').addEventListener('click', () => { AudioEngine.uiClick(); openArchive(); });
    document.getElementById('btn-stats').addEventListener('click', () => { AudioEngine.uiClick(); openStats(); });
    document.getElementById('btn-settings').addEventListener('click', () => { AudioEngine.uiClick(); openSettings(); });
    document.getElementById('btn-help').addEventListener('click', () => {
      AudioEngine.uiClick();
      document.getElementById('modal-help').classList.add('open');
    });
    document.querySelectorAll('[data-close]').forEach(b => {
      b.addEventListener('click', () => b.closest('.modal-overlay').classList.remove('open'));
    });
    document.querySelectorAll('.modal-overlay').forEach(ov => {
      ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });
    });
    document.getElementById('btn-ambience').addEventListener('click', () => {
      AudioEngine.toggleAmbience();
      syncAmbienceBtn();
    });
    document.getElementById('btn-sound').addEventListener('click', () => {
      AudioEngine.toggleMute();
      syncSoundBtn();
    });

    // Settings Modal Controls
    document.getElementById('set-autospell').addEventListener('change', e => {
      state.autoSpell = e.target.checked;
      state.settings.autoSpell = state.autoSpell;
      saveSettings(state.settings);
      syncAutoSpellBtn();
      updateSpellPreview();
      AudioEngine.uiClick();
      showToast(state.autoSpell ? '🪄 Auto Spell-Check: ON' : '🪄 Auto Spell-Check: OFF');
    });
    document.getElementById('set-timer-sec').addEventListener('change', e => {
      state.settings.timerSeconds = Number(e.target.value);
      saveSettings(state.settings);
      AudioEngine.uiClick();
      showToast(state.settings.timerSeconds === 0 ? '⏱️ Practice/Pack timer set to Untimed' : `⏱️ Practice/Pack timer set to ${state.settings.timerSeconds}s`);
    });
    document.getElementById('audio-volume-slider').addEventListener('input', e => {
      const pct = Number(e.target.value);
      AudioEngine.setVolume(pct / 100);
      document.getElementById('set-vol-pct').textContent = `${pct}%`;
    });
    document.getElementById('set-muted').addEventListener('change', e => {
      if (e.target.checked !== AudioEngine.isMuted()) {
        AudioEngine.toggleMute();
        syncSoundBtn();
      }
      showToast(e.target.checked ? '🔇 Sound Muted' : '🔊 Sound Unmuted');
    });
    document.getElementById('set-ambience').addEventListener('change', e => {
      if (e.target.checked !== AudioEngine.isAmbientEnabled()) {
        AudioEngine.toggleAmbience();
        syncAmbienceBtn();
      }
      showToast(e.target.checked ? '🌊 Hydrophone Ambience: ON' : '🔕 Hydrophone Ambience: OFF');
    });
    document.getElementById('set-keyticks').addEventListener('change', e => {
      state.settings.keyTicks = e.target.checked;
      saveSettings(state.settings);
      AudioEngine.uiClick();
      showToast(state.settings.keyTicks ? '⌨️ Keystroke Ticks: ON' : '⌨️ Keystroke Ticks: OFF');
    });
    document.getElementById('set-sub-skin').addEventListener('change', e => {
      state.settings.subSkin = e.target.value;
      saveSettings(state.settings);
      applyVisualSettings(state.settings);
      AudioEngine.uiClick();
      showToast(`🤿 Hull repainted: ${e.target.options[e.target.selectedIndex].text}`);
    });
    document.getElementById('set-reduced-motion').addEventListener('change', e => {
      state.settings.reducedMotion = e.target.checked;
      saveSettings(state.settings);
      applyVisualSettings(state.settings);
      AudioEngine.uiClick();
      showToast(state.settings.reducedMotion ? '🎞️ Reduced Screen Shake: ON' : '🎞️ Full Impact Shake: ON');
    });
    document.getElementById('btn-settings-reset-daily').addEventListener('click', () => {
      document.getElementById('modal-settings').classList.remove('open');
      resetDailyDive(false);
    });
    document.getElementById('btn-wipe-stats').addEventListener('click', e => {
      const btn = e.currentTarget;
      if (btn.dataset.armed !== '1') {
        btn.dataset.armed = '1';
        btn.textContent = '⚠️ Click Again to Confirm';
        return;
      }
      localStorage.removeItem(STATS_KEY);
      localStorage.removeItem(PROMPT_BESTS_KEY);
      const today = getTodayInfo();
      removeDailyRecord(today.dateKey);
      document.getElementById('modal-settings').classList.remove('open');
      AudioEngine.resetSplash();
      showToast('🗑️ Stats, Personal Bests & Today’s Daily cleared.');
      renderHome();
    });

    // Hydrate external JSON dataset asynchronously without blocking UI bindings
    if (window.ShrimplionDataset) {
      window.ShrimplionDataset.load().then(() => {
        syncDatasetGlobals();
        if (document.getElementById('screen-home').classList.contains('active')) {
          renderHome();
        }
      }).catch(() => {});
    }
  });
})();
