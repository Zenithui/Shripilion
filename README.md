# 🦐 SHRIMPLION — Daily Reverse-Trivia Ocean Dive

A full-featured, offline-ready browser game inspired by **Krillion** (`krillion.io`), where obvious answers keep you floating at the surface with the plankton and obscure truths sink your bathysphere down to the **7,000m Hadal Trench**.

## ✨ Features

- **Living 60fps Pixel-Art Ocean Column (`js/pixel-ocean.js`)**: Starts at `0m` with a pixel sun, drifting clouds, flapping seagulls, rippling waves, and the bobbing *S.S. KRILL* research boat. Each valid answer physically plunges your yellow pixel bathysphere (with blinking **Krill** captain & spinning propeller) downward through dithered ocean strata populated by pixel sea turtles, pulsing jellyfish, giant squid, bioluminescent anglerfish, and a rocky **7,000m Hadal Trench floor** with hydrothermal vents and a glowing pearl clam.
- **Authentic Modes (`Daily Dive`, `Practice`, `Packs`, `Crew`)**:
  - **Daily Dive**: Deterministic daily 7-signal challenge (`25s` oxygen ring timer), daily streak tracking, and one-click shareable dive receipts.
  - **Practice**: Unlimited random signals with **25s Timed** or **∞ Untimed** modes.
  - **Packs**: 4 themed expedition packs (*Geography & World*, *Science & Space*, *Culture & Tech*, *Food & Everyday*).
  - **Crew**: 2–4 local divers coordinate turns — unique valid answers earn a **+150m Crew Sync Bonus**, while duplicate answers collide for **0m**.
- **~2,900+ Ranked Canonical Answers (~3,400+ Aliases)** across the 6 authentic rarity tiers:
  - 🟢 **Plankton** (`+100m`)
  - 🩵 **Too Clever** (`+150m`)
  - 🔵 **Schooler** (`+300m`)
  - 🟣 **Rare** (`+600m`)
  - 🟠 **Deep Cut** (`+850m`)
  - 💎 **One in a Shrimplion** (`+1,000m`)
- **Smart Fuzzy Matcher**: Accent-insensitive, article-tolerant, alias-aware, and forgiving of minor typos via Damerau-Levenshtein matching without false-positive collisions on short words.
- **Dynamic Ocean Descent & Procedural Submarine Audio**: Live HTML5 canvas bubbles & bioluminescence, 5 ocean depth zones (*Sunlight → Twilight → Midnight → The Abyss → Hadal Trench*), and synthesized Web Audio sonar/chimes (zero external assets required).
- **Complete Post-Dive Answer Encyclopedia**: Expand any prompt in your Dive Log after finishing a run to inspect every accepted answer across all 6 tiers.

## 🚀 Running Locally

No build step or dependencies required!

1. Open `index.html` directly in any modern browser, **or**
2. Serve locally with Python:
   ```bash
   python3 -m http.server 8080
   ```
   Then visit `http://localhost:8080`.
