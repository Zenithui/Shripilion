#!/usr/bin/env node
// Builds & validates the Shrimplion dataset from data/packs/*.json
// Outputs:
//   - data/manifest.json
//   - data/daily.json (365-day themed daily schedule, 2026-11-01 .. 2027-10-31)
//   - js/prompts.js (offline/file:// fallback bundle synced with data/)
// Usage:
//   /usr/local/bin/node scripts/build-dataset.mjs
//   /usr/local/bin/node scripts/build-dataset.mjs --check

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PACK_ORDER = ['world', 'science', 'culture', 'everyday', 'current'];

const PACKS = {
  mixed: {
    id: 'mixed',
    name: 'Open Ocean',
    subtitle: 'All 5 packs mixed (68 prompts)',
    icon: '🌊'
  },
  current: {
    id: 'current',
    name: 'Current & Now (2020s+)',
    subtitle: 'AI, apps, 2020s movies, streaming, music, EVs & memes',
    icon: '⚡'
  },
  world: {
    id: 'world',
    name: "Cartographer's Trench",
    subtitle: 'Countries, rivers, peaks, islands, cities & landmarks',
    icon: '🧭'
  },
  science: {
    id: 'science',
    name: 'Hadal Lab',
    subtitle: 'Elements, space, anatomy, marine life, physics & insects',
    icon: '🔬'
  },
  culture: {
    id: 'culture',
    name: 'Sunken Archive',
    subtitle: 'Myth, music, art, books, games, code & chess',
    icon: '🏛️'
  },
  everyday: {
    id: 'everyday',
    name: 'Submarine Galley',
    subtitle: 'Food, spices, pets, colors, sports, vehicles & trades',
    icon: '🧀'
  }
};

const TIERS = {
  0: {
    id: 0,
    name: 'Surfaced',
    points: 0,
    meters: 0,
    emoji: '⚪',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.18)',
    tagline: 'Out of oxygen — zero depth gained.',
    quips: [
      'beep... oxygen tank ran dry! Staying at current depth.',
      'No signal locked! Floating steady where we are.'
    ]
  },
  1: {
    id: 1,
    name: 'Plankton',
    points: 10,
    meters: 100,
    emoji: '🟢',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.18)',
    tagline: 'The obvious first choice everyone thinks of.',
    quips: [
      'Surface plankton! Everyone on Earth typed that first.',
      'Valid, sure — if you enjoy sunbathing near the boat!'
    ]
  },
  2: {
    id: 2,
    name: 'Too Clever',
    points: 15,
    meters: 150,
    emoji: '🩵',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.18)',
    tagline: 'The "clever" dodge thousands of others also guessed!',
    quips: [
      'Too clever! Thousands of trivia nerds had that exact same "unique" idea.',
      'Classic crowd bottleneck — you dodged #1 right into #2!'
    ]
  },
  3: {
    id: 3,
    name: 'Schooler',
    points: 30,
    meters: 300,
    emoji: '🔵',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.2)',
    tagline: 'Swimming safely with a respectable school.',
    quips: [
      'Solid Schooler! Sinking cleanly into darker water.',
      'Not bad, diver — leaving the surface splashes behind!'
    ]
  },
  4: {
    id: 4,
    name: 'Rare',
    points: 60,
    meters: 600,
    emoji: '🟣',
    color: '#c084fc',
    bg: 'rgba(192,132,252,0.22)',
    tagline: 'Now you’re thinking. Dodged the crowd!',
    quips: [
      'Now we’re diving! Big 600-meter drop past the crowd!',
      'beep! Rare signal locked — watch the pressure gauge!'
    ]
  },
  5: {
    id: 5,
    name: 'Deep Cut',
    points: 85,
    meters: 850,
    emoji: '🟠',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.22)',
    tagline: 'Genuinely obscure specialist knowledge!',
    quips: [
      'WHOA! Deep Cut!! Hull bolts rattling — 850m plunge!',
      'Serious abyssal recall! Almost nobody pulls that one!'
    ]
  },
  6: {
    id: 6,
    name: 'One in a Shrimplion',
    points: 100,
    meters: 1000,
    emoji: '💎',
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.26)',
    tagline: 'ULTIMATE ABYSSAL TREASURE (<1% RARITY)!',
    quips: [
      'BEEP BEEP!! ONE IN A SHRIMPLION!! FULL KILOMETER PLUNGE!!',
      'LEGENDARY TRENCH PEARL!! Straight toward the 7,000m floor!!'
    ]
  }
};

const ZONES = [
  { min: 0, max: 700, name: 'Sunlight Zone', sci: 'Epipelagic', badge: '☀️', desc: 'Bright coastal waters teeming with plankton.' },
  { min: 700, max: 1800, name: 'Twilight Zone', sci: 'Mesopelagic', badge: '🪼', desc: 'Fading sunbeams where lanternfish flicker.' },
  { min: 1800, max: 3500, name: 'Midnight Zone', sci: 'Bathypelagic', badge: '🦑', desc: 'Pitch-black water lit only by bioluminescence.' },
  { min: 3500, max: 5500, name: 'The Abyss', sci: 'Abyssopelagic', badge: '🐡', desc: 'Crushing pressure above hydrothermal vents.' },
  { min: 5500, max: 7001, name: 'Hadal Trench', sci: 'Hadalpelagic', badge: '👑', desc: 'The deepest ocean floor — realm of legends.' }
];

const DAILY_THEMES = [
  { theme: 'Mariana Mixed Current', subtitle: 'Balanced voyage across all five packs', bias: null },
  { theme: 'Currents & Trends (2020s+)', subtitle: 'AI, apps, 2020s pop, gaming & viral hits', bias: 'current' },
  { theme: "Cartographer's Crossing", subtitle: 'Heavy on borders, peaks, rivers & landmarks', bias: 'world' },
  { theme: 'Bioluminescent Lab', subtitle: 'Science-rich sonar survey from atoms to bugs', bias: 'science' },
  { theme: 'Sunken Archive Dive', subtitle: 'Myth, music, classics, games & lore', bias: 'culture' },
  { theme: 'Galley & Pantry Plunge', subtitle: 'Culinary flavors, breeds, sports & crafts', bias: 'everyday' },
  { theme: 'Silicon & Spotlight', subtitle: 'Spaceflight, EVs, modern films & sports stars', bias: 'current' },
  { theme: 'Pelagic Drift', subtitle: 'Wild currents from every trench', bias: null },
  { theme: 'Abyssal Atlas', subtitle: 'Charting faraway islands, deserts & capitals', bias: 'world' },
  { theme: 'Naturalist Expedition', subtitle: 'Flora, fauna, anatomy & forces of nature', bias: 'science' },
  { theme: 'Midnight Library', subtitle: 'Novels, painters, pantheons & tabletop lore', bias: 'culture' },
  { theme: 'Submarine Bazaar', subtitle: 'Currencies, trades, spices & sweet spoils', bias: 'everyday' }
];

function normalizeKey(str) {
  let s = String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  s = s.replace(/&/g, ' and ');
  s = s.replace(/['’`]/g, '');
  s = s.replace(/c\+\+/g, ' cplusplus ');
  s = s.replace(/c#/g, ' csharp ');
  s = s.replace(/f#/g, ' fsharp ');
  s = s.replace(/[^a-z0-9]+/g, ' ').trim();
  return s.replace(/\s+/g, ' ');
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

function loadAndValidatePacks() {
  const allPrompts = [];
  const promptIds = new Set();
  const issues = [];
  const warnings = [];
  let totalCanonicalAnswers = 0;
  let totalSearchForms = 0;
  const packCounts = {};

  for (const packId of PACK_ORDER) {
    const filePath = path.join(ROOT, 'data', 'packs', `${packId}.json`);
    if (!fs.existsSync(filePath)) {
      issues.push(`Missing pack file: data/packs/${packId}.json`);
      continue;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const prompts = JSON.parse(raw);
    if (!Array.isArray(prompts) || prompts.length === 0) {
      issues.push(`Pack ${packId} must be a non-empty array.`);
      continue;
    }
    packCounts[packId] = prompts.length;

    for (const p of prompts) {
      if (!p.id || !p.pack || !p.prompt || !p.hint || !p.tiers) {
        issues.push(`Prompt missing required fields in ${packId}: ${JSON.stringify(p).slice(0, 80)}`);
        continue;
      }
      if (p.pack !== packId) {
        issues.push(`Prompt ${p.id} has pack="${p.pack}" inside ${packId}.json`);
      }
      if (promptIds.has(p.id)) {
        issues.push(`Duplicate prompt id: ${p.id}`);
      }
      promptIds.add(p.id);

      const seenNormToTier = new Map();
      for (let t = 1; t <= 6; t++) {
        const list = p.tiers[String(t)];
        if (!Array.isArray(list) || list.length === 0) {
          issues.push(`Prompt ${p.id} tier ${t} is empty or missing.`);
          continue;
        }
        for (const entry of list) {
          if (typeof entry !== 'string' || !entry.trim()) {
            issues.push(`Prompt ${p.id} tier ${t} has invalid empty entry.`);
            continue;
          }
          totalCanonicalAnswers++;
          const parts = entry.split('|').map(s => s.trim()).filter(Boolean);
          for (const alias of parts) {
            totalSearchForms++;
            if (/-no\b/i.test(alias)) {
              issues.push(`Draft marker "-no" found in ${p.id} tier ${t}: "${alias}"`);
            }
            const norm = normalizeKey(alias);
            if (!norm) {
              issues.push(`Empty normalized key for ${p.id} tier ${t}: "${alias}"`);
              continue;
            }
            const prev = seenNormToTier.get(norm);
            if (prev && prev.tier !== t) {
              issues.push(
                `Cross-tier duplicate in ${p.id}: "${alias}" (${norm}) in tier ${t} conflicts with "${prev.raw}" in tier ${prev.tier}`
              );
            } else if (prev && prev.tier === t && prev.entry !== entry) {
              warnings.push(
                `Same-tier duplicate alias in ${p.id} tier ${t}: "${alias}" (${norm}) across "${prev.raw}" and "${alias}"`
              );
            } else {
              seenNormToTier.set(norm, { tier: t, raw: alias, entry });
            }
          }
        }
      }

      allPrompts.push(p);
    }
  }

  return {
    allPrompts,
    packCounts,
    totalCanonicalAnswers,
    totalSearchForms,
    issues,
    warnings
  };
}

function generateDailySchedule(allPrompts) {
  const byPack = Object.fromEntries(
    PACK_ORDER.map(packId => [packId, allPrompts.filter(p => p.pack === packId).map(p => p.id)])
  );

  const anchorUtc = Date.UTC(2026, 0, 1); // 2026-01-01 = Dive #1
  const startUtc = Date.UTC(2026, 10, 1); // 2026-11-01
  const days = 365;
  const schedule = {};
  let prevIds = new Set();

  for (let i = 0; i < days; i++) {
    const dt = new Date(startUtc + i * 86400000);
    const yyyy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;
    const diveNumber = Math.floor((dt.getTime() - anchorUtc) / 86400000) + 1;

    const themeObj = DAILY_THEMES[i % DAILY_THEMES.length];
    const seed = (Number(`${yyyy}${mm}${dd}`) ^ 0x5f3759df) >>> 0;
    const rng = mulberry32(seed);

    const avail = {};
    for (const packId of PACK_ORDER) {
      const fresh = byPack[packId].filter(id => !prevIds.has(id));
      const pool = fresh.length >= 3 ? fresh : byPack[packId];
      avail[packId] = shuffleWith(pool, rng);
    }

    const picked = [];
    // Always guarantee at least 1 prompt from each of the 5 packs
    for (const packId of PACK_ORDER) {
      picked.push(avail[packId].shift());
    }

    if (themeObj.bias && avail[themeObj.bias].length >= 1) {
      picked.push(avail[themeObj.bias].shift());
      const others = shuffleWith(PACK_ORDER.filter(p => p !== themeObj.bias), rng);
      picked.push(avail[others[0]].shift());
    } else {
      const extraPacks = shuffleWith(PACK_ORDER, rng);
      for (let k = 0; k < 2; k++) {
        picked.push(avail[extraPacks[k]].shift());
      }
    }

    const promptIds = shuffleWith(picked, rng);
    prevIds = new Set(promptIds);

    schedule[dateKey] = {
      diveNumber,
      theme: themeObj.theme,
      subtitle: themeObj.subtitle,
      promptIds
    };
  }

  return schedule;
}

function formatManifest(stats, dailySchedule) {
  const dates = Object.keys(dailySchedule).sort();
  return {
    version: 2,
    datasetName: 'Shrimplion Pelagic Reverse-Trivia Corpus',
    totalPrompts: stats.allPrompts.length,
    totalCanonicalAnswers: stats.totalCanonicalAnswers,
    totalSearchForms: stats.totalSearchForms,
    dailyRange: {
      start: dates[0],
      end: dates[dates.length - 1],
      days: dates.length
    },
    packCounts: stats.packCounts,
    packFiles: Object.fromEntries(PACK_ORDER.map(p => [p, `data/packs/${p}.json`])),
    dailyFile: 'data/daily.json',
    packs: PACKS,
    tiers: TIERS,
    zones: ZONES
  };
}

function buildFallbackJs(stats, dailySchedule) {
  const header =
    `// SHRIMPLION — Deep-Sea Reverse Trivia Prompt, Rarity & Daily Schedule Bundle\n` +
    `// Auto-generated by scripts/build-dataset.mjs from data/packs/*.json & data/daily.json\n` +
    `// ${stats.allPrompts.length} prompts across 4 packs (${stats.totalCanonicalAnswers} canonical answers / ${stats.totalSearchForms} search forms)\n` +
    `// Serves both as runtime registry and offline/file:// fallback when fetch() is unavailable.\n\n`;

  return (
    header +
    `window.SHRIMPLION_PACKS = ${JSON.stringify(PACKS, null, 2)};\n\n` +
    `window.SHRIMPLION_TIERS = ${JSON.stringify(TIERS, null, 2)};\n\n` +
    `window.SHRIMPLION_ZONES = ${JSON.stringify(ZONES, null, 2)};\n\n` +
    `window.SHRIMPLION_PROMPTS = ${JSON.stringify(stats.allPrompts, null, 2)};\n\n` +
    `window.SHRIMPLION_DAILY_SCHEDULE = ${JSON.stringify(dailySchedule)};\n`
  );
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const stats = loadAndValidatePacks();

  if (stats.warnings.length > 0) {
    console.warn(`Warnings (${stats.warnings.length}):`);
    for (const w of stats.warnings.slice(0, 20)) console.warn('  WARN:', w);
  }

  if (stats.issues.length > 0) {
    console.error(`Dataset validation FAILED with ${stats.issues.length} issue(s):`);
    for (const err of stats.issues) console.error('  ERR:', err);
    process.exit(1);
  }

  const dailySchedule = generateDailySchedule(stats.allPrompts);
  const manifest = formatManifest(stats, dailySchedule);
  const manifestJson = JSON.stringify(manifest, null, 2) + '\n';
  const dailyJson = JSON.stringify(dailySchedule, null, 2) + '\n';
  const fallbackJs = buildFallbackJs(stats, dailySchedule);

  const manifestPath = path.join(ROOT, 'data', 'manifest.json');
  const dailyPath = path.join(ROOT, 'data', 'daily.json');
  const fallbackPath = path.join(ROOT, 'js', 'prompts.js');

  if (checkOnly) {
    const checks = [
      ['data/manifest.json', manifestPath, manifestJson],
      ['data/daily.json', dailyPath, dailyJson],
      ['js/prompts.js', fallbackPath, fallbackJs]
    ];
    let dirty = false;
    for (const [label, filePath, expected] of checks) {
      if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf8') !== expected) {
        console.error(`Out of sync: ${label} (run scripts/build-dataset.mjs to rebuild)`);
        dirty = true;
      }
    }
    if (dirty) process.exit(1);
    console.log(
      `Check OK: ${stats.allPrompts.length} prompts, ${stats.totalCanonicalAnswers} canonical answers, ${Object.keys(dailySchedule).length} daily dives synced.`
    );
    return;
  }

  fs.writeFileSync(manifestPath, manifestJson, 'utf8');
  fs.writeFileSync(dailyPath, dailyJson, 'utf8');
  fs.writeFileSync(fallbackPath, fallbackJs, 'utf8');

  console.log(
    `Built dataset successfully:\n` +
      `  Prompts: ${stats.allPrompts.length} (${PACK_ORDER.map(p => `${p}=${stats.packCounts[p]}`).join(', ')})\n` +
      `  Canonical answers: ${stats.totalCanonicalAnswers}\n` +
      `  Searchable forms: ${stats.totalSearchForms}\n` +
      `  Daily dives generated: ${Object.keys(dailySchedule).length} (${manifest.dailyRange.start} .. ${manifest.dailyRange.end})\n` +
      `  Synced: data/manifest.json, data/daily.json, js/prompts.js`
  );
}

main();
