// SHRIMPLION — Procedural Web Audio Submarine, Hydrophone Ambience & SFX Engine

(function () {
  let ctx = null;
  let masterGain = null;
  let muted = localStorage.getItem('shrimplion_muted') === 'true';
  let ambientEnabled = localStorage.getItem('shrimplion_ambience') !== 'false';
  let volume = parseFloat(localStorage.getItem('shrimplion_volume') || '0.85');
  if (Number.isNaN(volume)) volume = 0.85;

  // Ambient hydrophone nodes
  let ambientActive = false;
  let ambientGain = null;
  let ambientFilter = null;
  let ambientNoiseSrc = null;
  let ambientSubOsc = null;
  let lastKeyTickAt = 0;

  function ensureContext() {
    if (muted) return null;
    try {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        ctx = new AudioCtx();
        masterGain = ctx.createGain();
        masterGain.gain.value = muted ? 0 : volume;
        masterGain.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch (_) {
      return null;
    }
  }

  function playTone(freq, type, startOffset, duration, gainPeak, endFreq) {
    const c = ensureContext();
    if (!c || !masterGain) return;
    try {
      const now = c.currentTime + (startOffset || 0);
      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(Math.max(20, freq), now);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
      }

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gainPeak, now + Math.min(0.02, duration * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    } catch (_) {
      // Ignore Web Audio scheduling errors in restricted contexts
    }
  }

  function playBubbleBurst(count, baseDelay) {
    for (let i = 0; i < count; i++) {
      const start = (baseDelay || 0) + i * 0.055 + Math.random() * 0.02;
      const f = 320 + Math.random() * 520;
      playTone(f, 'sine', start, 0.09, 0.045, f * 1.65);
    }
  }

  function playNoiseSurge(duration, lowpass, sweep, gainPeak, startOffset = 0) {
    const c = ensureContext();
    if (!c || !masterGain) return;
    try {
      const t = c.currentTime + startOffset;
      const src = c.createBufferSource();
      const buf = c.createBuffer(1, Math.ceil(c.sampleRate * (duration + 0.05)), c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      src.buffer = buf;

      const filter = c.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(lowpass || 1200, t);
      if (sweep) filter.frequency.exponentialRampToValueAtTime(Math.max(40, sweep), t + duration);

      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(gainPeak || 0.06, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      src.connect(filter);
      filter.connect(g);
      g.connect(masterGain);
      src.start(t);
      src.stop(t + duration + 0.04);
    } catch (_) {}
  }

  function buildBrownNoiseBuffer(c) {
    const len = c.sampleRate * 3;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.8;
    }
    return buf;
  }

  function syncAmbientGain() {
    if (!ctx || !ambientGain) return;
    const target = !muted && ambientEnabled && ambientActive ? 0.14 : 0.0001;
    try {
      ambientGain.gain.cancelScheduledValues(ctx.currentTime);
      ambientGain.gain.setTargetAtTime(target, ctx.currentTime, 0.25);
    } catch (_) {}
  }

  const ShrimplionAudio = {
    isMuted() {
      return muted;
    },
    isAmbientEnabled() {
      return ambientEnabled;
    },
    getVolume() {
      return volume;
    },
    setVolume(val) {
      volume = Math.max(0, Math.min(1, Number(val)));
      localStorage.setItem('shrimplion_volume', String(volume));
      if (masterGain && ctx) {
        masterGain.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.05);
      }
      return volume;
    },
    toggleMute() {
      muted = !muted;
      localStorage.setItem('shrimplion_muted', String(muted));
      if (masterGain && ctx) {
        masterGain.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.05);
      }
      if (!muted) {
        this.sonarPing();
        if (ambientEnabled && ambientActive) this.startAmbience();
      }
      syncAmbientGain();
      return muted;
    },
    toggleAmbience() {
      ambientEnabled = !ambientEnabled;
      localStorage.setItem('shrimplion_ambience', String(ambientEnabled));
      if (ambientEnabled && !muted) {
        this.startAmbience();
        this.uiClick();
      }
      syncAmbientGain();
      return ambientEnabled;
    },
    startAmbience(depthMeters = 0) {
      ambientActive = true;
      if (muted || !ambientEnabled) return;
      const c = ensureContext();
      if (!c || !masterGain) return;
      try {
        if (!ambientNoiseSrc) {
          ambientNoiseSrc = c.createBufferSource();
          ambientNoiseSrc.buffer = buildBrownNoiseBuffer(c);
          ambientNoiseSrc.loop = true;

          ambientFilter = c.createBiquadFilter();
          ambientFilter.type = 'lowpass';
          ambientFilter.Q.value = 1.4;
          ambientFilter.frequency.value = 520;

          ambientGain = c.createGain();
          ambientGain.gain.value = 0.0001;

          ambientSubOsc = c.createOscillator();
          ambientSubOsc.type = 'sine';
          ambientSubOsc.frequency.value = 58;
          const subGain = c.createGain();
          subGain.gain.value = 0.16;

          ambientNoiseSrc.connect(ambientFilter);
          ambientSubOsc.connect(subGain);
          subGain.connect(ambientFilter);
          ambientFilter.connect(ambientGain);
          ambientGain.connect(masterGain);

          ambientNoiseSrc.start();
          ambientSubOsc.start();
        }
        this.updateAmbienceDepth(depthMeters);
        syncAmbientGain();
      } catch (_) {}
    },
    updateAmbienceDepth(meters) {
      if (!ctx || !ambientFilter || !ambientSubOsc) return;
      const clamped = Math.max(0, Math.min(7000, Number(meters) || 0));
      const ratio = clamped / 7000;
      // Deeper water sounds warmer & more muffled (560Hz -> 135Hz), hull drone lowers slightly
      const cutoff = 560 - ratio * 425;
      const hullHz = 62 - ratio * 18;
      try {
        ambientFilter.frequency.setTargetAtTime(cutoff, ctx.currentTime, 0.35);
        ambientSubOsc.frequency.setTargetAtTime(hullHz, ctx.currentTime, 0.35);
      } catch (_) {}
    },
    stopAmbience() {
      ambientActive = false;
      syncAmbientGain();
    },
    uiClick() {
      playTone(740, 'triangle', 0, 0.035, 0.032, 520);
    },
    keystrokeTick() {
      const nowMs = performance.now();
      if (nowMs - lastKeyTickAt < 38) return;
      lastKeyTickAt = nowMs;
      playTone(920 + Math.random() * 140, 'sine', 0, 0.022, 0.015, 760);
    },
    spellCorrectChime() {
      playTone(659.25, 'sine', 0, 0.14, 0.045, 783.99);
      playTone(987.77, 'sine', 0.07, 0.18, 0.045, 1174.66);
    },
    hintSonar() {
      playTone(587.33, 'sine', 0, 0.25, 0.055, 880);
      playTone(1174.66, 'sine', 0.12, 0.32, 0.04, 1046.5);
      playBubbleBurst(3, 0.05);
    },
    comboChime(streak) {
      const root = 523.25 * Math.pow(1.06, Math.min(6, streak));
      playTone(root, 'triangle', 0.1, 0.18, 0.055);
      playTone(root * 1.25, 'sine', 0.17, 0.22, 0.055);
      playTone(root * 1.5, 'sine', 0.24, 0.28, 0.06);
    },
    zoneTransitionFanfare() {
      [261.63, 392.0, 493.88, 659.25].forEach((f, idx) => {
        playTone(f, 'sine', 0.12 + idx * 0.05, 0.55, 0.035);
      });
    },
    resetSplash() {
      playBubbleBurst(6, 0);
      playTone(280, 'sine', 0, 0.26, 0.055, 680);
      playTone(523.25, 'sine', 0.14, 0.24, 0.05, 783.99);
    },
    sonarPing() {
      playTone(1046.5, 'sine', 0, 0.42, 0.07, 1020);
      playTone(2093, 'sine', 0.01, 0.22, 0.02, 2040);
    },
    blub() {
      const v = 0.85 + Math.random() * 0.45;
      playTone(260 * v, 'sine', 0, 0.13, 0.08, 720 * v);
      playNoiseSurge(0.06, 1800, 700, 0.035);
    },
    tierGate(idx = 1) {
      const base = 700 + idx * 140;
      playTone(base, 'triangle', 0, 0.07, 0.055, base * 1.65);
    },
    oceanSurge() {
      playNoiseSurge(0.9, 1600, 220, 0.06);
      playTone(110, 'sine', 0, 0.8, 0.06, 48);
    },
    rejectBuzz() {
      playTone(175, 'triangle', 0, 0.11, 0.08, 125);
      playTone(135, 'triangle', 0.08, 0.13, 0.07, 98);
    },
    lowOxygenTick(secLeft) {
      const pitch = 660 + (6 - Math.min(5, secLeft)) * 75;
      playTone(pitch, 'sine', 0, 0.07, 0.045, pitch * 0.95);
    },
    diveScore(tier) {
      if (tier <= 0) {
        playTone(300, 'sine', 0, 0.28, 0.06, 150);
        return;
      }
      if (tier === 1) {
        playBubbleBurst(2, 0);
        playTone(440, 'sine', 0.02, 0.2, 0.07);
        playTone(523.25, 'sine', 0.11, 0.25, 0.07);
      } else if (tier === 2) {
        playBubbleBurst(3, 0);
        playTone(493.88, 'sine', 0.02, 0.2, 0.075);
        playTone(659.25, 'sine', 0.11, 0.28, 0.08);
      } else if (tier === 3) {
        playBubbleBurst(4, 0);
        [440, 554.37, 659.25].forEach((f, idx) => {
          playTone(f, 'sine', idx * 0.08, 0.32, 0.08);
        });
      } else if (tier === 4) {
        playBubbleBurst(5, 0);
        playTone(130.81, 'triangle', 0, 0.45, 0.06, 98);
        [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
          playTone(f, 'sine', idx * 0.075, 0.38, 0.08);
        });
      } else if (tier === 5) {
        playBubbleBurst(6, 0);
        playTone(110, 'triangle', 0, 0.6, 0.075, 73.42);
        [440, 554.37, 659.25, 880, 1108.73].forEach((f, idx) => {
          playTone(f, 'sine', idx * 0.07, 0.45, 0.085);
        });
      } else if (tier >= 6) {
        playBubbleBurst(9, 0.05);
        playTone(98, 'triangle', 0, 0.85, 0.09, 55);
        [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98].forEach((f, idx) => {
          playTone(f, 'sine', idx * 0.065, 0.62, 0.09);
          playTone(f * 1.5, 'sine', idx * 0.065 + 0.02, 0.38, 0.03);
        });
      }
    },
    diveComplete() {
      [392, 493.88, 587.33, 783.99].forEach((f, idx) => {
        playTone(f, 'sine', idx * 0.1, 0.5, 0.08);
      });
      playBubbleBurst(5, 0.15);
    }
  };

  window.ShrimplionAudio = ShrimplionAudio;
})();
