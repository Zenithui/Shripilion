# 🦐 SHRIMPLION — Daily Reverse-Trivia Ocean Dive

A full-featured, offline-ready browser game inspired by **Krillion** (`krillion.io`), where obvious answers keep you floating at the surface with the plankton and obscure truths sink your bathysphere down to the **7,000m Hadal Trench**.

## ✨ Features

- **Living 60fps Pixel-Art Ocean Column (`js/pixel-ocean.js`)**: Starts at `0m` with a pixel sun, drifting clouds, flapping seagulls, rippling waves, and the bobbing *S.S. KRILL* research boat. Each valid answer physically plunges your yellow pixel bathysphere (with blinking **Krill** captain & spinning propeller) downward through dithered ocean strata populated by pixel sea turtles, pulsing jellyfish, giant squid, bioluminescent anglerfish, and a rocky **7,000m Hadal Trench floor** with hydrothermal vents and a glowing pearl clam.
- **Authentic Modes (`Daily Dive`, `Practice`, `Packs`, `Crew`)**:
  - **Daily Dive & Archive**: 365-day pre-generated themed daily challenge schedule (`data/daily.json`, covering `2026-11-01` to `2027-10-31`) with `25s` oxygen ring timer, live next-dive countdown, daily streak tracking, and a **📅 Daily Archive** modal to replay past themed dives without affecting today's streak.
  - **Practice**: Unlimited random signals with **25s Timed** or **∞ Untimed** modes.
  - **Packs**: 4 expanded themed expedition packs (*Geography & World*, *Science & Space*, *Culture & Tech*, *Food & Everyday* — 14 prompts each).
  - **Crew**: 2–4 local divers coordinate turns — unique valid answers earn a **+150m Crew Sync Bonus**, while duplicate answers collide for **0m**.
- **Dataset-Backed Question Bank (56 Prompts · 7,153 Canonical Answers · 8,364 Search Forms)**: Stored cleanly in modular JSON files under `data/packs/*.json`, `data/manifest.json`, and `data/daily.json`, loaded dynamically via `fetch()` (`js/dataset-loader.js`) with `js/prompts.js` kept in sync as an offline/`file://` fallback across all 6 rarity tiers:
  - 🟢 **Plankton** (`+100m`)
  - 🩵 **Too Clever** (`+150m`)
  - 🔵 **Schooler** (`+300m`)
  - 🟣 **Rare** (`+600m`)
  - 🟠 **Deep Cut** (`+850m`)
  - 💎 **One in a Shrimplion** (`+1,000m`)
- **Phonetic & Fuzzy Spell-Check Engine (`js/matcher.js`)**: Accent-insensitive, article-tolerant, spaceless-aware (`Newyork`), middle-initial tolerant (`John Kennedy`), and forgiving of phonetic misspellings (`Filippines`, `Chiwawa`, `Flourine`, `Gnocci`) and short-word unambiguous typos (`Irak` → `Iraq`) with `"Close! Did you mean ...?"` near-miss hints and `"✨ Spell-corrected"` badges.
- **Dynamic Ocean Descent & Procedural Submarine Audio**: Live HTML5 canvas bubbles & bioluminescence, 5 ocean depth zones (*Sunlight → Twilight → Midnight → The Abyss → Hadal Trench*), and synthesized Web Audio sonar/chimes (zero external assets required).
- **Complete Post-Dive Answer Encyclopedia**: Expand any prompt in your Dive Log after finishing a run to inspect every accepted answer across all 6 tiers.

## 🚀 Running Locally & Rebuilding Dataset

1. Serve locally (enables live `fetch()` loading from `data/`):
   ```bash
   python3 -m http.server 8080
   ```
   Or open `index.html` directly (uses the synced `js/prompts.js` fallback bundle).
2. After editing `data/packs/*.json`, validate & rebuild `data/manifest.json`, `data/daily.json`, and `js/prompts.js`:
   ```bash
   node scripts/build-dataset.mjs
   ```
