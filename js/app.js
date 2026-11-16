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
      subtitle: 'Balanced 7-signal dive across all 4 packs',
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
    return shuffleWith([w[0], s[0], c[0], e[0], w[1], s[1], c[1], e[1]], rng).slice(0, 7);
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
  const state = {
    mode: 'daily',          // 'daily' | 'archive' | 'practice' | 'pack' | 'crew'
    packId: 'mixed',
    untimed: false,
    timerDuration: 25,
    prompts: [],
    sigIndex: 0,
    totalDepth: 0,
    results: [],
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
    lastShareText: ''
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

    if (dailyRec) {
      playBtn.textContent = `VIEW DAILY DIVE #${today.diveNumber} (${dailyRec.totalDepth.toLocaleString()}m)`;
      typeKrillSpeech(
        document.getElementById('home-krill-speech'),
        `beep! You reached ${dailyRec.totalDepth.toLocaleString()}m on today’s dive (${dailyEntry.theme}). Try Archive, Practice, Packs, or Crew!`
      );
    } else {
      playBtn.textContent = `PLAY DAILY DIVE #${today.diveNumber}`;
      typeKrillSpeech(
        document.getElementById('home-krill-speech'),
        `beep. Today’s current is ${dailyEntry.theme} — obscure truths sink us toward 7,000m!`
      );
    }

    showScreen('home');
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
      state.mode = 'practice';
      state.packId = 'mixed';
      state.untimed = Boolean(opts.untimed);
      state.timerDuration = 25;
      state.prompts = getPackPrompts('mixed');
      state.crewNames = [];
    } else if (mode === 'pack') {
      state.mode = 'pack';
      state.packId = opts.packId || 'world';
      state.untimed = false;
      state.timerDuration = 25;
      state.prompts = getPackPrompts(state.packId);
      state.crewNames = [];
    } else if (mode === 'crew') {
      state.mode = 'crew';
      state.packId = 'mixed';
      state.untimed = false;
      state.timerDuration = 25;
      state.prompts = getPackPrompts('mixed');
      state.crewNames = opts.crewNames && opts.crewNames.length >= 2
        ? opts.crewNames
        : ['Diver 1', 'Diver 2'];
    }

    state.sigIndex = 0;
    state.totalDepth = 0;
    state.results = [];
    state.crewTurnIdx = 0;
    state.crewRoundPicks = [];
    state.inReveal = false;

    AudioEngine.sonarPing();
    Ocean.triggerLaunchSplash();
    showScreen('play');
    startSignal();
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

    document.getElementById('oxygen-vignette').classList.remove('urgent');
    document.getElementById('plunge-stamp-wrap').classList.remove('show');
    document.getElementById('plunge-card').classList.remove('active');
    document.getElementById('prompt-card').classList.remove('diving-minimized');

    renderSignalDots();

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
    const evalRes = Matcher.evaluateAnswer(promptObj, input.value);

    if (!evalRes.matched) {
      if (evalRes.empty) return;
      AudioEngine.rejectBuzz();
      Ocean.triggerRejectShake();
      document.getElementById('reject-text').textContent = `✕ ${evalRes.reason}`;
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
    state.totalDepth = Math.min(7000, state.totalDepth + metersGained);

    state.results.push({
      promptId: promptObj.id,
      promptText: promptObj.prompt,
      answer: displayAnswer,
      tier,
      meters: metersGained,
      fuzzy
    });

    // 1. Trigger Pixel Ocean Plunge & Web Audio!
    AudioEngine.diveScore(tier);
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

    metersPop.textContent = `+${metersGained.toLocaleString()}m`;
    metersPop.style.color = tierInfo.color;

    stampWrap.classList.remove('show');
    void stampWrap.offsetWidth;
    stampWrap.classList.add('show');

    // 4. Populate Bottom Plunge Card + Krill Typewriter Reaction
    document.getElementById('plunge-answer-name').textContent = displayAnswer;
    document.getElementById('plunge-fuzzy-tag').textContent = fuzzy
      ? (correctedFrom ? `✨ Spell-corrected (${correctedFrom})` : '✨ Typo forgiven')
      : '';

    const quipPool = tierInfo.quips || [tierInfo.tagline];
    const chosenQuip = customQuip || quipPool[Math.floor(Math.random() * quipPool.length)];
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
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yKey = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
      if (stats.lastDailyDate === yKey) stats.dailyStreak += 1;
      else if (stats.lastDailyDate !== today.dateKey) stats.dailyStreak = 1;
      stats.lastDailyDate = today.dateKey;

      saveDailyRecord(today.dateKey, {
        diveNumber: today.diveNumber,
        dateKey: today.dateKey,
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
      totalDepth: state.totalDepth,
      emojis,
      results: state.results
    });
  }

  function renderSummary(data) {
    const zone = getZoneForDepth(data.totalDepth);
    document.getElementById('res-mode-label').textContent = data.label;
    document.getElementById('res-zone-badge').textContent = `${zone.badge} ${zone.name} (${zone.sci})`;
    document.getElementById('res-depth-big').textContent = `${data.totalDepth.toLocaleString()}m`;

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
            return `<span class="ans-chip${mine ? ' mine' : ''}">${escapeHtml(a)}</span>`;
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

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // =========================================================================
  // STATS MODAL & EVENT BINDINGS
  // =========================================================================
  function openStats() {
    const st = loadStats();
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

  document.addEventListener('DOMContentLoaded', async () => {
    Ocean.init(document.getElementById('ocean-canvas'));
    syncSoundBtn();

    if (window.ShrimplionDataset) {
      await window.ShrimplionDataset.load();
      syncDatasetGlobals();
    }

    renderHome();

    document.getElementById('btn-top-home').addEventListener('click', renderHome);
    document.getElementById('btn-play-daily').addEventListener('click', () => launchDive('daily'));

    // Mode drawers
    document.getElementById('btn-mode-practice').addEventListener('click', () => toggleHomeDrawer('practice'));
    document.getElementById('btn-mode-packs').addEventListener('click', () => toggleHomeDrawer('packs'));
    document.getElementById('btn-mode-crew').addEventListener('click', () => toggleHomeDrawer('crew'));

    document.getElementById('btn-launch-practice-timed').addEventListener('click', () => launchDive('practice', { untimed: false }));
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

    // Gameplay
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

    // Results actions
    document.getElementById('btn-share').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(state.lastShareText);
        showToast('📋 Copied dive score to clipboard!');
      } catch (_) {
        showToast('📋 Score ready to share!');
      }
    });
    document.getElementById('btn-again-practice').addEventListener('click', () => launchDive('practice', { untimed: false }));
    document.getElementById('btn-back-surface').addEventListener('click', renderHome);

    // Modals & Sound
    document.getElementById('btn-archive').addEventListener('click', openArchive);
    document.getElementById('btn-stats').addEventListener('click', openStats);
    document.getElementById('btn-help').addEventListener('click', () => {
      document.getElementById('modal-help').classList.add('open');
    });
    document.querySelectorAll('[data-close]').forEach(b => {
      b.addEventListener('click', () => b.closest('.modal-overlay').classList.remove('open'));
    });
    document.querySelectorAll('.modal-overlay').forEach(ov => {
      ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });
    });
    document.getElementById('btn-sound').addEventListener('click', () => {
      AudioEngine.toggleMute();
      syncSoundBtn();
    });
  });
})();
