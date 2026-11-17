# 🦐 SHRIMPLION — Daily Reverse-Trivia Ocean Dive

A full-featured, offline-ready browser game inspired by **Krillion** (`krillion.io`), where obvious answers keep you floating at the surface with the plankton and obscure truths sink your bathysphere down to the **7,000m Hadal Trench**.

## ✨ Features

- **Living 60fps Pixel-Art Ocean Column (`js/pixel-ocean.js`)**: Starts at `0m` with a pixel sun, drifting clouds, flapping seagulls, rippling waves, and the bobbing *S.S. KRILL* research boat. Each valid answer physically plunges your yellow pixel bathysphere (with blinking **Krill** captain & spinning propeller) downward through dithered ocean strata populated by pixel sea turtles, pulsing jellyfish, giant squid, bioluminescent anglerfish, and a rocky **7,000m Hadal Trench floor** with hydrothermal vents and a glowing pearl clam.
- **Authentic Modes (`Daily Dive`, `Practice`, `Packs`, `Crew`)**:
  - **Daily Dive, Reset & Archive**: 365-day pre-generated themed daily challenge schedule (`data/daily.json`, covering `2026-11-01` to `2027-10-31`) with `25s` oxygen ring timer, live next-dive countdown, **🔄 Reset Today's Daily Dive** (restoring prior streak cleanly), and the **📅 Daily Archive** modal to replay past themed dives.
  - **Practice**: Unlimited random signals with **⚡ 15s Blitz**, **⏱️ 25s Timed**, or **∞ Untimed** modes.
  - **Packs**: 5 themed expedition packs (*Current & Now (2020s+)*, *Geography & World*, *Science & Space*, *Culture & Tech*, *Food & Everyday* — 16 prompts per pack, 80 prompts total).
  - **Crew**: 2–4 local divers coordinate turns — unique valid answers earn a **+150m Crew Sync Bonus**, while duplicate answers collide for **0m**.
- **Dataset-Backed Question Bank (80 Prompts · 9,519 Canonical Answers · 11,195 Search Forms)**: Stored cleanly in modular JSON files under `data/packs/*.json`, `data/manifest.json`, and `data/daily.json`, loaded dynamically via `fetch()` (`js/dataset-loader.js`) with `js/prompts.js` kept in sync as an offline/`file://` fallback across all 6 rarity tiers:
  - 🟢 **Plankton** (`+100m`)
  - 🩵 **Too Clever** (`+150m`)
  - 🔵 **Schooler** (`+300m`)
  - 🟣 **Rare** (`+600m`)
  - 🟠 **Deep Cut** (`+850m`)
  - 💎 **One in a Shrimplion** (`+1,000m`)
- **Auto Spell-Check Engine (`js/matcher.js`)**: Live inline `suggestSpelling()` preview + automatic phonetic & fuzzy correction (`Filippines` → `Philippines`, `Chiwawa` → `Chihuahua`, `Flourine` → `Fluorine`, `Newyork` → `New York`, `John Kennedy` → `John F. Kennedy`), `Tab`/click suggestion chips, and an in-round `🪄 Auto-Spell: ON/OFF` toggle.
- **Sonar Combo Streaks, Hint Buoy, Personal Bests & Diver Ranks**: Consecutive Rare+ answers earn up to `+150m` **⚡ Sonar Combo** bonus; each solo dive includes a 1-time **📡 Hint Buoy** (`first letter + length`); per-prompt **🏆 Personal Bests** celebrate new rarity highs; cumulative depth unlocks Submarine Callsign Ranks in Stats.
- **OpenKrillion Visuals, Landmarks & Buddy Wardrobe**: Authentic `VT323` retro pixel typography, optional CRT scanlines, swaying falling-word + lighting **Tier Gate Ladder** plunges, real ocean depth landmarks down the water column (`60m` → `6,500m` plus the `3,800m` Titanic silhouette), clickable **Boop-the-Krill** mascot (`blub!`), Golden Krill transformation on `One in a Shrimplion` hits, and 5 pixel SVG companion buddies (`krill`, `schooler`, `rare`, `deepcut`, `evil`).
- **Dedicated Settings & Hull Customization (`⚙️ Settings`)**: Configure Auto Spell-Check, Clear Wrong Answer, Practice/Pack/Crew oxygen timer (`15s` Blitz, `25s` Classic, `35s` Relaxed, `∞ Untimed`), master volume/mute, Hydrophone Ocean Ambience, typewriter sonar key ticks, **Companion Buddy Wardrobe**, **Bathysphere Hull Paint** (`Classic Gold`, `Kraken Coral`, `Abyssal Cyan`, `Biolume Green`), Colorblind High Contrast, CRT scanlines, reduced screen shake, Daily Reset, **📥 Export JSON**, and two-step data reset.
- **Procedural Submarine Audio & Hydrophone Bed (`js/audio.js`)**: Pure Web Audio depth-reactive underwater hydrophone soundscape (`🌊` toggle), `blub` bubble synth, ascending Tier Gate sweeps, filtered ocean surge noise, master volume slider, mechanical keystroke sonar ticks, spell-correct shimmer, combo chords, zone transition fanfare, and dive reset splash.
- **Searchable Post-Dive Answer Encyclopedia**: Expand any prompt in your Dive Log, filter all accepted answers across the dive live (`🔎 Filter answers`), or copy the full prompt-by-prompt breakdown (`📝 Copy Full Log`).

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
