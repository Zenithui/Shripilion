// SHRIMPLION — Procedural Web Audio Submarine & Ocean Sound Engine

(function () {
  let ctx = null;
  let muted = localStorage.getItem('shrimplion_muted') === 'true';

  function ensureContext() {
    if (muted) return null;
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, type, startOffset, duration, gainPeak, endFreq) {
    const c = ensureContext();
    if (!c) return;
    const now = c.currentTime + startOffset;
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + Math.min(0.02, duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playBubbleBurst(count, baseDelay) {
    for (let i = 0; i < count; i++) {
      const start = (baseDelay || 0) + i * 0.055 + Math.random() * 0.02;
      const f = 320 + Math.random() * 520;
      playTone(f, 'sine', start, 0.09, 0.045, f * 1.65);
    }
  }

  const ShrimplionAudio = {
    isMuted() {
      return muted;
    },
    toggleMute() {
      muted = !muted;
      localStorage.setItem('shrimplion_muted', String(muted));
      if (!muted) this.sonarPing();
      return muted;
    },
    sonarPing() {
      playTone(1046.5, 'sine', 0, 0.42, 0.07, 1020);
      playTone(2093, 'sine', 0.01, 0.22, 0.02, 2040);
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
        // Surfaced / 0m
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
        // ONE IN A SHRIMPLION — Trench Pearl Fanfare!
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
