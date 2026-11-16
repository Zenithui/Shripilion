// SHRIMPLION — Authentic Pixel-Art Vertical Ocean World & Descent Animation Engine
// Renders sky, clouds, gulls, waves, bobbing boat (0m), descending pixel sub + Krill captain,
// dithered ocean strata, animated pixel sea creatures, scrolling depth ruler, and trench floor (7,000m).

(function () {
  const PIXEL_SCALE = 3;          // 1 virtual pixel = 3x3 CSS pixels (crisp chunky pixel art)
  const PX_PER_METER = 0.55;      // 1,000m = 550 virtual pixels (~1,650 CSS px of vertical scroll!)

  // =========================================================================
  // PIXEL SPRITE MATRICES (1 char = 1 palette color, '.' = transparent)
  // =========================================================================
  const PALETTE = {
    W: '#ffffff',
    L: '#e0f2fe',
    C: '#38bdf8',
    T: '#06b6d4',
    B: '#0284c7',
    N: '#0f172a',
    K: '#020617',
    R: '#ef4444',
    D: '#b91c1c',
    Y: '#facc15',
    G: '#fde047',
    O: '#f97316',
    A: '#d97706',
    P: '#f472b6',
    M: '#e879f9',
    V: '#a855f7',
    E: '#34d399',
    S: '#94a3b8',
    H: '#475569',
    F: '#fda4af'
  };

  // Research Boat "S.S. KRILL" (28x15)
  const SPRITE_BOAT_F1 = [
    '............RR..............',
    '............RRRR............',
    '............R...............',
    '...........YYY..............',
    '.........WWWWWWW............',
    '........WWCCWCCWW...........',
    '.......WWWWWWWWWWW..........',
    '......WWWWWWWWWWWWW.........',
    '..RRRRRRRRRRRRRRRRRRRRRRRR..',
    '...RRRRWWWWWWWWWWWWWWRRRR...',
    '....DDDDDDDDDDDDDDDDDDDD....',
    '.....DDDDDDDDDDDDDDDDDD.....',
    '......KKKKKKKKKKKKKKKK......'
  ];
  const SPRITE_BOAT_F2 = [
    '............RRRR............',
    '............RR..............',
    '............R...............',
    '...........YYY..............',
    '.........WWWWWWW............',
    '........WWCCWCCWW...........',
    '.......WWWWWWWWWWW..........',
    '......WWWWWWWWWWWWW.........',
    '..RRRRRRRRRRRRRRRRRRRRRRRR..',
    '...RRRRWWWWWWWWWWWWWWRRRR...',
    '....DDDDDDDDDDDDDDDDDDDD....',
    '.....DDDDDDDDDDDDDDDDDD.....',
    '......KKKKKKKKKKKKKKKK......'
  ];

  // Pixel Submersible with Krill Captain in Porthole (24x15)
  const SPRITE_SUB_OPEN_EYE = [
    '..........GGG...........',
    '..........YY............',
    '.........YYYY...........',
    '....YYYYYYYYYYYYYY......',
    '...YYYYYYYYYYYYYYYY.....',
    '.OOYYYYYYYYLLLLYYYYYY...',
    'OO.YYYYYYYLCFFCLYYYYYGG.',
    '.OOYYYYYYYLFPKFLYYYYYGG.',
    '...YYYYYYYLCFFCLYYYYY...',
    '...YYYYYYYYLLLLYYYYYY...',
    '....YYYYYYYYYYYYYYYY....',
    '.....AAAAAAAAAAAAAA.....',
    '......AA........AA......'
  ];
  const SPRITE_SUB_BLINK = [
    '..........GGG...........',
    '..........YY............',
    '.........YYYY...........',
    '....YYYYYYYYYYYYYY......',
    '...YYYYYYYYYYYYYYYY.....',
    '.OOYYYYYYYYLLLLYYYYYY...',
    'OO.YYYYYYYLCFFCLYYYYYGG.',
    '.OOYYYYYYYLFPPFLYYYYYGG.',
    '...YYYYYYYLCFFCLYYYYY...',
    '...YYYYYYYYLLLLYYYYYY...',
    '....YYYYYYYYYYYYYYYY....',
    '.....AAAAAAAAAAAAAA.....',
    '......AA........AA......'
  ];

  // Small Tropical Fish (9x5)
  const SPRITE_FISH_R = [
    '...OOOO..',
    'O.OOOOYKO',
    'OOOOOOOOO',
    'O.OOOOOO.',
    '...OOOO..'
  ];
  const SPRITE_FISH_L = [
    '..OOOO...',
    'OKYOOOO.O',
    'OOOOOOOOO',
    '.OOOOOO.O',
    '..OOOO...'
  ];

  // Sea Turtle (14x8)
  const SPRITE_TURTLE = [
    '....EEEEEE....',
    '..EEEEEEEEEE..',
    '.EEEEEEEEEEEEG',
    'EEEEEEEEEEEEGK',
    '..EEEEEEEEEEGG',
    '.EE........EE.',
    'EE..........EE'
  ];

  // Pulsing Jellyfish (11x12) - 2 frames
  const SPRITE_JELLY_1 = [
    '...MMMMM...',
    '.MMMMMMMMM.',
    'MMMWWMMMMMM',
    'MMMMMMMMMMM',
    'PPPPPPPPPPP',
    '.P..P.P..P.',
    '.P..P.P..P.',
    '..P.P..P.P.',
    '..P....P...'
  ];
  const SPRITE_JELLY_2 = [
    '..MMMMMMM..',
    '.MMMWWMMMM.',
    '.MMMMMMMMM.',
    '..PPPPPPP..',
    '..P.P.P.P..',
    '.P..P.P..P.',
    '..P.P.P.P..',
    '...P...P...'
  ];

  // Giant Squid (18x10)
  const SPRITE_SQUID = [
    '........RRRRRR....',
    '......RRRRRRRRRR..',
    'PPPPPRRRRRRRYKRRRR',
    '..PPPPRRRRRRRRRRRR',
    'PPPPPRRRRRRRRRRR..',
    '......RRRRRRRR....'
  ];

  // Deep-Sea Anglerfish with Glowing Lure (18x12)
  const SPRITE_ANGLER = [
    '............GGGG..',
    '...........G..GG..',
    '..........G.......',
    '....HHHHHHHHH.....',
    '..HHHHHHHHHHHH....',
    '.HHHHHHHHHHHYKHH..',
    'HHHHHHHHHHHHHHHWW.',
    'HHHHHHHHHHHHHW.W.W',
    '.HHHHHHHHHHHHWWWWW',
    '..HHHHHHHHHHHH....',
    '....HHHHHHHH......'
  ];

  // Giant Trench Pearl Clam (18x12)
  const SPRITE_CLAM = [
    '....VVVVVVVVVV....',
    '..VVVVVVVVVVVVVV..',
    '.VVVVVVVVVVVVVVVV.',
    '..VVVV..GGGG..VV..',
    '.......GPPPPG.....',
    '.......GPWWPG.....',
    '..VVVV..GGGG..VV..',
    '.VVVVVVVVVVVVVVVV.',
    '..VVVVVVVVVVVVVV..'
  ];

  // 4x4 Bayer dithering matrix for authentic retro pixel color transitions
  const BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function lerpColorHex(h1, h2, t) {
    const a = hexToRgb(h1);
    const b = hexToRgb(h2);
    const r = Math.round(a[0] + (b[0] - a[0]) * t);
    const g = Math.round(a[1] + (b[1] - a[1]) * t);
    const bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return `rgb(${r},${g},${bl})`;
  }

  // Ocean depth color stops (meters -> hex)
  const WATER_STOPS = [
    { m: 0, c: '#06b6d4' },
    { m: 350, c: '#0284c7' },
    { m: 900, c: '#0369a1' },
    { m: 1800, c: '#1e3a8a' },
    { m: 3000, c: '#1e1b4b' },
    { m: 4500, c: '#0b1026' },
    { m: 6000, c: '#050614' },
    { m: 7000, c: '#090418' }
  ];

  function getWaterColorAtMeters(m) {
    if (m <= 0) return WATER_STOPS[0].c;
    for (let i = 0; i < WATER_STOPS.length - 1; i++) {
      const s0 = WATER_STOPS[i];
      const s1 = WATER_STOPS[i + 1];
      if (m >= s0.m && m <= s1.m) {
        const t = (m - s0.m) / (s1.m - s0.m);
        // Step quantize into 10 retro bands so it looks crisp and pixelated!
        const qt = Math.round(t * 10) / 10;
        return lerpColorHex(s0.c, s1.c, qt);
      }
    }
    return WATER_STOPS[WATER_STOPS.length - 1].c;
  }

  // =========================================================================
  // ENGINE STATE
  // =========================================================================
  let canvas = null;
  let ctx = null;
  let vw = 320;
  let vh = 240;

  const world = {
    dockedAtSurface: true,     // true on home screen (sub hangs right below boat at 0m)
    currentMeters: 0,          // smoothly animated camera depth in meters
    targetMeters: 0,           // target depth in meters
    velocityMeters: 0,         // descent speed (meters/frame)
    rejectShakeFrames: 0,
    screenShakeFrames: 0,
    screenShakeMag: 0,
    frame: 0,
    subOffsetX: 0,
    clouds: [],
    gulls: [],
    creatures: [],
    bubbles: [],
    sparkles: [],
    shockwaves: [],
    splashDrops: [],
    depthCallout: null         // { text, color, life, maxLife }
  };

  function seedWorldEntities() {
    world.clouds = [
      { x: 25, yOffset: -58, w: 28, speed: 0.06 },
      { x: 130, yOffset: -72, w: 38, speed: 0.04 },
      { x: 250, yOffset: -52, w: 24, speed: 0.075 }
    ];

    world.gulls = [
      { x: 60, yOffset: -42, speed: 0.22, phase: 0 },
      { x: 195, yOffset: -60, speed: 0.17, phase: 2.1 }
    ];

    world.creatures = [];
    // Populate creatures all the way down from 60m to 6,850m!
    for (let m = 70; m < 6850; m += 95) {
      const side = Math.random() > 0.5 ? 1 : -1;
      let kind = 'fish';
      if (m < 700) {
        kind = Math.random() > 0.78 ? 'turtle' : 'fish';
      } else if (m < 1900) {
        kind = Math.random() > 0.35 ? 'jelly' : 'lantern';
      } else if (m < 3600) {
        kind = Math.random() > 0.5 ? 'squid' : 'jelly';
      } else {
        kind = Math.random() > 0.3 ? 'angler' : 'squid';
      }

      world.creatures.push({
        kind,
        meters: m + (Math.random() - 0.5) * 45,
        xFrac: Math.random(),
        vx: side * (0.12 + Math.random() * 0.22),
        phase: Math.random() * Math.PI * 2
      });
    }

    // Ambient bubbles / bioluminescent marine snow
    world.bubbles = Array.from({ length: 55 }, () => ({
      xFrac: Math.random(),
      yFrac: Math.random(),
      size: Math.random() > 0.7 ? 2 : 1,
      speed: 0.18 + Math.random() * 0.4,
      bio: Math.random() > 0.4
    }));
  }

  function resize() {
    if (!canvas) return;
    const rect = canvas.parentElement
      ? canvas.parentElement.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };
    const cssW = Math.max(300, rect.width || window.innerWidth);
    const cssH = Math.max(300, rect.height || window.innerHeight);

    vw = Math.ceil(cssW / PIXEL_SCALE);
    vh = Math.ceil(cssH / PIXEL_SCALE);
    canvas.width = vw;
    canvas.height = vh;
    ctx.imageSmoothingEnabled = false;
  }

  function drawSprite(rows, px, py, flipX) {
    const ix = Math.round(px);
    const iy = Math.round(py);
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const len = row.length;
      for (let c = 0; c < len; c++) {
        const ch = row[flipX ? len - 1 - c : c];
        if (ch === '.' || !PALETTE[ch]) continue;
        ctx.fillStyle = PALETTE[ch];
        ctx.fillRect(ix + c, iy + r, 1, 1);
      }
    }
  }

  // =========================================================================
  // MAIN 60FPS PIXEL RENDER LOOP
  // =========================================================================
  function tickAndRender() {
    world.frame++;

    // Smooth camera chase toward targetMeters
    const diff = world.targetMeters - world.currentMeters;
    if (Math.abs(diff) > 0.35) {
      // Snappy ease-out with capped cruise speed so big 1,000m plunges feel thrilling!
      const step = diff * 0.075;
      const clamped = Math.sign(step) * Math.min(Math.abs(step), 34);
      world.velocityMeters = clamped;
      world.currentMeters += clamped;
    } else {
      world.currentMeters = world.targetMeters;
      world.velocityMeters *= 0.7;
    }

    // Emit streaming exhaust bubbles from sub while plunging!
    const subScreenY = getSubVirtualY();
    const subScreenX = getSubVirtualX();

    if (Math.abs(world.velocityMeters) > 2.2) {
      for (let i = 0; i < 2; i++) {
        world.sparkles.push({
          x: subScreenX + 4 + (Math.random() - 0.5) * 10,
          y: subScreenY + 2 + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.9 - Math.random() * 1.4,
          size: Math.random() > 0.5 ? 2 : 1,
          color: '#e0f2fe',
          hollow: true,
          life: 28 + Math.random() * 16
        });
      }
    } else if (world.frame % 18 === 0) {
      // Gentle idle breathing bubble
      world.sparkles.push({
        x: subScreenX + 5,
        y: subScreenY + 3,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.45,
        size: 1,
        color: '#bae6fd',
        hollow: false,
        life: 36
      });
    }

    // Screen shake offset
    let shakeX = 0;
    let shakeY = 0;
    if (world.screenShakeFrames > 0) {
      world.screenShakeFrames--;
      shakeX = Math.round((Math.random() - 0.5) * world.screenShakeMag);
      shakeY = Math.round((Math.random() - 0.5) * world.screenShakeMag);
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Where is the water surface (0m) in virtual screen Y?
    // When currentMeters === 0: surface is at ~27% down from top so sky & boat shine clearly!
    const anchorScreenY = world.dockedAtSurface ? Math.round(vh * 0.27) : Math.round(vh * 0.24);
    const surfaceY = Math.round(anchorScreenY - world.currentMeters * PX_PER_METER);

    // 1. RENDER SKY (if surfaceY > 0)
    if (surfaceY > -10) {
      drawPixelSkyAndHarbor(surfaceY);
    }

    // 2. RENDER PIXEL WATER STRATA (from max(0, surfaceY) to vh)
    drawWaterColumn(surfaceY);

    // 3. RENDER SUNBEAMS NEAR SURFACE
    if (world.currentMeters < 750) {
      drawPixelSunbeams(surfaceY);
    }

    // 4. RENDER WAVE FOAM LINE & BOBBING BOAT AT SURFACE
    if (surfaceY > -35 && surfaceY < vh + 25) {
      drawWavesAndBoat(surfaceY);
    }

    // 5. RENDER HADAL TRENCH FLOOR AT 7,000m!
    const floorY = Math.round(surfaceY + 7000 * PX_PER_METER + 26);
    if (floorY < vh + 45) {
      drawTrenchFloor(floorY);
    }

    // 6. RENDER SEA CREATURES IN VIEWPORT
    drawCreatures(surfaceY);

    // 7. RENDER AMBIENT BUBBLES / BIOLUMINESCENT SNOW & RUSH STREAKS
    drawAmbientAndRushLines();

    // 8. RENDER SUBMERSIBLE HEADLIGHT, SUB + KRILL CAPTAIN
    drawSubmersibleAssembly(surfaceY, subScreenX, subScreenY);

    // 9. RENDER SHOCKWAVES, SPARKLES & SPLASH DROPS
    drawEffects();

    // 10. RENDER SCROLLING PIXEL DEPTH RULER ON RIGHT EDGE
    drawDepthRuler(surfaceY);

    ctx.restore();

    // Notify HUD listener of live animated meter depth
    if (typeof window.onShrimplionDepthTick === 'function') {
      window.onShrimplionDepthTick(Math.round(world.currentMeters), world.velocityMeters);
    }

    requestAnimationFrame(tickAndRender);
  }

  function getSubVirtualX() {
    let base = world.dockedAtSurface ? Math.round(vw * 0.5 - 12) : Math.round(vw * 0.18);
    if (vw < 190 && !world.dockedAtSurface) {
      base = Math.round(vw * 0.12);
    }
    if (world.rejectShakeFrames > 0) {
      world.rejectShakeFrames--;
      base += (world.rejectShakeFrames % 2 === 0 ? 3 : -3);
    }
    return base;
  }

  function getSubVirtualY() {
    const bob = Math.sin(world.frame * 0.06) * 2;
    if (world.dockedAtSurface) {
      return Math.round(vh * 0.27 + 14 + bob);
    }
    return Math.round(vh * 0.24 + 12 + bob);
  }

  function drawPixelSkyAndHarbor(surfaceY) {
    const maxSkyY = Math.min(vh, Math.max(0, surfaceY));
    for (let y = 0; y < maxSkyY; y += 2) {
      const t = Math.max(0, Math.min(1, y / Math.max(1, surfaceY)));
      if (t < 0.4) ctx.fillStyle = '#0284c7';
      else if (t < 0.72) ctx.fillStyle = '#38bdf8';
      else ctx.fillStyle = '#7dd3fc';
      ctx.fillRect(0, y, vw, 2);
    }

    // Pixel Sun
    const sunX = Math.round(vw * 0.8);
    const sunY = surfaceY - 46;
    if (sunY > -20 && sunY < vh) {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(sunX - 5, sunY - 5, 10, 10);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(sunX - 7, sunY - 3, 14, 6);
      ctx.fillRect(sunX - 3, sunY - 7, 6, 14);
    }

    // Pixel Clouds
    for (const cl of world.clouds) {
      cl.x += cl.speed;
      if (cl.x > vw + 20) cl.x = -cl.w - 10;
      const cy = Math.round(surfaceY + cl.yOffset);
      if (cy > -20 && cy < surfaceY) {
        const cx = Math.round(cl.x);
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(cx, cy + 3, cl.w, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx + 3, cy + 1, cl.w - 6, 4);
        ctx.fillRect(cx + 7, cy - 2, Math.max(6, cl.w - 15), 3);
      }
    }

    // Flapping Pixel Seagulls
    for (const g of world.gulls) {
      g.x += g.speed;
      if (g.x > vw + 15) g.x = -15;
      const gy = Math.round(surfaceY + g.yOffset + Math.sin(world.frame * 0.05 + g.phase) * 2);
      if (gy > -10 && gy < surfaceY) {
        const gx = Math.round(g.x);
        const wingUp = Math.floor((world.frame + g.phase * 10) / 14) % 2 === 0;
        ctx.fillStyle = '#ffffff';
        if (wingUp) {
          ctx.fillRect(gx - 2, gy - 1, 2, 1);
          ctx.fillRect(gx, gy, 2, 1);
          ctx.fillRect(gx + 2, gy - 1, 2, 1);
        } else {
          ctx.fillRect(gx - 2, gy + 1, 2, 1);
          ctx.fillRect(gx, gy, 2, 1);
          ctx.fillRect(gx + 2, gy + 1, 2, 1);
        }
      }
    }
  }

  function drawWaterColumn(surfaceY) {
    const startY = Math.max(0, surfaceY);
    const bandH = 4; // 4 virtual px per band
    for (let y = startY; y < vh; y += bandH) {
      const metersAtY = (y - surfaceY) / PX_PER_METER;
      const c1 = getWaterColorAtMeters(metersAtY);
      const c2 = getWaterColorAtMeters(metersAtY + 45);
      ctx.fillStyle = c1;
      ctx.fillRect(0, y, vw, bandH);

      // Subtle retro pixel dither dots along zone transitions
      if (c1 !== c2) {
        ctx.fillStyle = c2;
        for (let x = (y % 8 === 0 ? 0 : 2); x < vw; x += 4) {
          ctx.fillRect(x, y + 2, 1, 1);
        }
      }
    }
  }

  function drawPixelSunbeams(surfaceY) {
    const fade = Math.max(0, 1 - world.currentMeters / 750);
    ctx.fillStyle = `rgba(186, 230, 253, ${0.11 * fade})`;
    const startY = Math.max(0, surfaceY);
    const beams = [0.2, 0.48, 0.74];
    for (const b of beams) {
      const topX = Math.round(vw * b);
      for (let dy = 0; dy < 110; dy += 3) {
        const py = startY + dy;
        if (py > vh) break;
        ctx.fillRect(topX + Math.round(dy * 0.25), py, 12 - Math.floor(dy / 14), 2);
      }
    }
  }

  function drawWavesAndBoat(surfaceY) {
    // Animated pixel wave crests along surfaceY
    for (let x = 0; x < vw; x += 2) {
      const wave = Math.round(Math.sin(x * 0.14 + world.frame * 0.08) * 1.6);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(x, surfaceY + wave, 2, 1);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x, surfaceY + wave + 1, 2, 1);
    }

    // Bobbing S.S. KRILL boat
    const boatBob = Math.round(Math.sin(world.frame * 0.055) * 1.5);
    const boatX = Math.round(vw * 0.5 - 14);
    const boatY = surfaceY - 11 + boatBob;
    const sprite = Math.floor(world.frame / 16) % 2 === 0 ? SPRITE_BOAT_F1 : SPRITE_BOAT_F2;
    drawSprite(sprite, boatX, boatY, false);

    // Winch tether line down to sub when docked at surface
    if (world.dockedAtSurface && world.currentMeters < 30) {
      const subY = getSubVirtualY();
      ctx.fillStyle = '#94a3b8';
      for (let y = boatY + 12; y < subY + 2; y += 2) {
        ctx.fillRect(boatX + 14, y, 1, 1);
      }
    }
  }

  function drawCreatures(surfaceY) {
    for (const cr of world.creatures) {
      const cy = Math.round(surfaceY + cr.meters * PX_PER_METER);
      if (cy < -20 || cy > vh + 20) continue;

      cr.xFrac += cr.vx / vw;
      if (cr.xFrac > 1.12) cr.xFrac = -0.12;
      if (cr.xFrac < -0.12) cr.xFrac = 1.12;

      const cx = Math.round(cr.xFrac * vw);
      const bob = Math.round(Math.sin(world.frame * 0.06 + cr.phase) * 2);
      const goingLeft = cr.vx < 0;

      if (cr.kind === 'fish') {
        drawSprite(goingLeft ? SPRITE_FISH_L : SPRITE_FISH_R, cx, cy + bob, false);
        drawSprite(goingLeft ? SPRITE_FISH_L : SPRITE_FISH_R, cx + (goingLeft ? 8 : -8), cy + bob + 4, false);
      } else if (cr.kind === 'turtle') {
        drawSprite(SPRITE_TURTLE, cx, cy + bob, goingLeft);
      } else if (cr.kind === 'jelly') {
        const jf = Math.floor((world.frame + cr.phase * 10) / 20) % 2 === 0 ? SPRITE_JELLY_1 : SPRITE_JELLY_2;
        drawSprite(jf, cx, cy + bob, false);
      } else if (cr.kind === 'lantern') {
        drawSprite(goingLeft ? SPRITE_FISH_L : SPRITE_FISH_R, cx, cy + bob, false);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(cx + 3, cy + bob + 2, 2, 1);
      } else if (cr.kind === 'squid') {
        drawSprite(SPRITE_SQUID, cx, cy + bob, goingLeft);
      } else if (cr.kind === 'angler') {
        drawSprite(SPRITE_ANGLER, cx, cy + bob, goingLeft);
        // Pulsing bioluminescent lure glow!
        const lureX = goingLeft ? cx + 3 : cx + 14;
        if (Math.floor(world.frame / 10) % 2 === 0) {
          ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
          ctx.fillRect(lureX - 2, cy + bob - 2, 6, 5);
        }
      }
    }
  }

  function drawTrenchFloor(floorY) {
    // Craggy pixel abyssal floor
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, floorY, vw, vh - floorY + 20);
    for (let x = 0; x < vw; x += 4) {
      const bump = (x * 7) % 5;
      ctx.fillStyle = '#312e81';
      ctx.fillRect(x, floorY - bump, 4, bump + 2);
    }

    // Hydrothermal vent on left
    const vx = Math.round(vw * 0.25);
    ctx.fillStyle = '#334155';
    ctx.fillRect(vx - 5, floorY - 8, 10, 8);
    ctx.fillRect(vx - 3, floorY - 13, 6, 5);
    // Vent glowing embers
    const puffY = floorY - 15 - (world.frame % 18);
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(vx - 1, puffY, 2, 2);

    // Giant Shrimplion Pearl Clam on trench floor!
    const clamX = Math.round(vw * 0.68);
    drawSprite(SPRITE_CLAM, clamX, floorY - 11, false);
    if (Math.floor(world.frame / 12) % 2 === 0) {
      ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
      ctx.fillRect(clamX + 5, floorY - 9, 8, 6);
    }
  }

  function drawAmbientAndRushLines() {
    const speed = Math.abs(world.velocityMeters);

    for (const b of world.bubbles) {
      b.yFrac -= (b.speed + speed * 0.14) / vh;
      if (b.yFrac < -0.02) {
        b.yFrac = 1.02;
        b.xFrac = Math.random();
      }
      const bx = Math.round(b.xFrac * vw);
      const by = Math.round(b.yFrac * vh);

      if (speed > 5) {
        // High-speed vertical plunge rush streaks!
        const streakLen = Math.min(14, Math.round(speed * 0.45));
        ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
        ctx.fillRect(bx, by, 1, streakLen);
      } else if (world.currentMeters > 1400 && b.bio) {
        ctx.fillStyle = world.currentMeters > 4800 ? '#f472b6' : '#38bdf8';
        ctx.fillRect(bx, by, b.size, b.size);
      } else {
        ctx.fillStyle = 'rgba(224, 242, 254, 0.38)';
        ctx.fillRect(bx, by, b.size, b.size);
      }
    }
  }

  function drawSubmersibleAssembly(surfaceY, subX, subY) {
    if (subY < surfaceY - 4) return;

    // Deep-sea pixel headlight beam once below 650m!
    if (world.currentMeters > 650) {
      const intensity = Math.min(0.26, ((world.currentMeters - 650) / 2000) * 0.26);
      ctx.fillStyle = `rgba(254, 240, 138, ${intensity})`;
      for (let dx = 1; dx <= 34; dx += 2) {
        const spread = Math.round(dx * 0.32);
        ctx.fillRect(subX + 23 + dx, subY + 7 - spread, 2, spread * 2 + 2);
      }
    }

    // Blink Krill's eyes inside porthole every ~140 frames
    const isBlink = world.frame % 140 > 133;
    drawSprite(isBlink ? SPRITE_SUB_BLINK : SPRITE_SUB_OPEN_EYE, subX, subY, false);

    // Spinning pixel propeller blades on left stern
    const propPhase = Math.floor(world.frame / (Math.abs(world.velocityMeters) > 2 ? 2 : 6)) % 3;
    ctx.fillStyle = '#7dd3fc';
    if (propPhase === 0) {
      ctx.fillRect(subX - 1, subY + 4, 1, 5);
    } else if (propPhase === 1) {
      ctx.fillRect(subX - 1, subY + 5, 1, 3);
    } else {
      ctx.fillRect(subX - 2, subY + 6, 2, 1);
    }
  }

  function drawEffects() {
    // Expanding pixel shockwave rings
    for (let i = world.shockwaves.length - 1; i >= 0; i--) {
      const sw = world.shockwaves[i];
      sw.r += sw.speed;
      sw.life--;
      if (sw.life <= 0) {
        world.shockwaves.splice(i, 1);
        continue;
      }
      ctx.fillStyle = sw.color;
      const steps = 20;
      for (let s = 0; s < steps; s++) {
        const ang = (s / steps) * Math.PI * 2;
        const px = Math.round(sw.x + Math.cos(ang) * sw.r);
        const py = Math.round(sw.y + Math.sin(ang) * sw.r);
        ctx.fillRect(px, py, 2, 2);
      }
    }

    // Sparkles & exhaust bubbles
    for (let i = world.sparkles.length - 1; i >= 0; i--) {
      const p = world.sparkles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        world.sparkles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }

    // Water surface splash droplets
    for (let i = world.splashDrops.length - 1; i >= 0; i--) {
      const d = world.splashDrops[i];
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.12; // gravity
      d.life--;
      if (d.life <= 0) {
        world.splashDrops.splice(i, 1);
        continue;
      }
      ctx.fillStyle = d.color;
      ctx.fillRect(Math.round(d.x), Math.round(d.y), 2, 2);
    }
  }

  function drawDepthRuler(surfaceY) {
    // Crisp scrolling pixel ruler ticks along the right edge
    const rx = vw - 1;
    for (let m = 0; m <= 7000; m += 100) {
      const ty = Math.round(surfaceY + m * PX_PER_METER);
      if (ty < 0 || ty > vh) continue;
      const isMajor = m % 500 === 0;
      ctx.fillStyle = isMajor ? 'rgba(224, 242, 254, 0.7)' : 'rgba(148, 163, 184, 0.32)';
      ctx.fillRect(rx - (isMajor ? 6 : 3), ty, isMajor ? 6 : 3, 1);
    }
  }

  // =========================================================================
  // PUBLIC API FOR GAME CONTROLLER
  // =========================================================================
  window.ShrimplionOcean = {
    init(canvasEl) {
      canvas = canvasEl;
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      seedWorldEntities();
      resize();
      window.addEventListener('resize', resize);
      requestAnimationFrame(tickAndRender);
    },

    resetToSurfaceDock() {
      world.dockedAtSurface = true;
      world.targetMeters = 0;
    },

    triggerLaunchSplash() {
      world.dockedAtSurface = false;
      world.targetMeters = 25; // Dip just under the waves for Signal 1!
      const sx = Math.round(vw * 0.5);
      const sy = Math.round(vh * 0.27);
      for (let i = 0; i < 24; i++) {
        world.splashDrops.push({
          x: sx + (Math.random() - 0.5) * 18,
          y: sy,
          vx: (Math.random() - 0.5) * 2.2,
          vy: -1.4 - Math.random() * 2.2,
          color: i % 2 === 0 ? '#ffffff' : '#7dd3fc',
          life: 26 + Math.random() * 12
        });
      }
    },

    plungeToDepth(newTotalMeters, tierId) {
      world.dockedAtSurface = false;
      world.targetMeters = newTotalMeters;

      const sx = getSubVirtualX() + 12;
      const sy = getSubVirtualY() + 7;
      const tier = (window.SHRIMPLION_TIERS && window.SHRIMPLION_TIERS[tierId]) || { color: '#38bdf8' };

      if (tierId > 0) {
        world.shockwaves.push({
          x: sx,
          y: sy,
          r: 3,
          speed: 0.9 + tierId * 0.25,
          color: tier.color,
          life: 24 + tierId * 4
        });

        const count = 10 + tierId * 7;
        for (let i = 0; i < count; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 0.6 + Math.random() * (1.2 + tierId * 0.35);
          world.sparkles.push({
            x: sx,
            y: sy,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: tierId >= 5 && i % 2 === 0 ? 2 : 1,
            color: tierId === 6 && i % 2 === 0 ? '#fde047' : tier.color,
            life: 24 + Math.random() * 22
          });
        }
      }

      if (tierId >= 5) {
        world.screenShakeFrames = tierId === 6 ? 26 : 14;
        world.screenShakeMag = tierId === 6 ? 5 : 3;
      }
    },

    triggerRejectShake() {
      world.rejectShakeFrames = 14;
      const sx = getSubVirtualX() + 12;
      const sy = getSubVirtualY();
      for (let i = 0; i < 6; i++) {
        world.sparkles.push({
          x: sx + (Math.random() - 0.5) * 10,
          y: sy,
          vx: (Math.random() - 0.5) * 0.9,
          vy: -0.7 - Math.random() * 0.8,
          size: 2,
          color: '#fb7185',
          life: 18
        });
      }
    },

    snapToDepth(meters) {
      world.dockedAtSurface = meters <= 0;
      world.currentMeters = meters;
      world.targetMeters = meters;
    }
  };
})();
