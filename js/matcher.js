// SHRIMPLION — Phonetic & Fuzzy Answer Normalization / Spell-Check Engine
// Exposes: window.ShrimplionMatcher = { normalizeTokenString, phoneticSkeleton, compilePromptIndex, evaluateAnswer }

(function (global) {
  function normalizeTokenString(str) {
    if (!str) return '';
    let s = String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    s = s.replace(/&/g, ' and ');
    s = s.replace(/['’`]/g, '');
    s = s.replace(/c\+\+/g, ' cplusplus ');
    s = s.replace(/c#/g, ' csharp ');
    s = s.replace(/f#/g, ' fsharp ');
    s = s.replace(/[^a-z0-9]+/g, ' ').trim();
    s = s.replace(/\s+/g, ' ');
    return s;
  }

  function stripArticles(norm) {
    return norm.replace(/^(a|an|the)\s+/, '').trim();
  }

  function stripMiddleInitials(norm) {
    const tokens = norm.split(' ');
    if (tokens.length < 3) return norm;
    const kept = tokens.filter((tok, idx) => idx === 0 || idx === tokens.length - 1 || tok.length > 1);
    return kept.length >= 2 ? kept.join(' ') : norm;
  }

  function singularizeVariations(norm) {
    const vars = [norm];
    if (norm.length > 4 && norm.endsWith('ies')) {
      vars.push(norm.slice(0, -3) + 'y');
    }
    if (norm.length > 4 && norm.endsWith('es')) {
      vars.push(norm.slice(0, -2));
    }
    if (norm.length > 3 && norm.endsWith('s') && !norm.endsWith('ss')) {
      vars.push(norm.slice(0, -1));
    }
    if (norm.length > 3 && !norm.endsWith('s')) {
      vars.push(norm + 's');
    }
    return vars;
  }

  function phoneticSkeleton(norm) {
    if (!norm) return '';
    const words = norm.split(' ').map(w => {
      if (w.length <= 2) return w;
      let p = w;
      // Silent initial consonant clusters
      p = p.replace(/^(kn|gn|pn)/, 'n');
      p = p.replace(/^pt/, 't');
      p = p.replace(/^ps/, 's');
      p = p.replace(/^wr/, 'r');
      p = p.replace(/^wh/, 'w');
      p = p.replace(/^x/, 'z');

      // Consonant & vowel cluster normalizations
      p = p.replace(/cch/g, 'k');
      p = p.replace(/sch/g, 'sk');
      p = p.replace(/ck/g, 'k');
      p = p.replace(/ph/g, 'f');
      p = p.replace(/qu/g, 'kw');
      p = p.replace(/q/g, 'k');
      p = p.replace(/x/g, 'ks');
      p = p.replace(/hu([aeiou])/g, 'w$1'); // e.g. Chihuahua -> chiwawa
      p = p.replace(/ght/g, 't');
      p = p.replace(/([aeiou])gh/g, '$1');
      p = p.replace(/c([eiy])/g, 's$1');
      p = p.replace(/c/g, 'k');
      p = p.replace(/z/g, 's');
      p = p.replace(/ae|oe/g, 'e');
      p = p.replace(/([a-z0-9])\1+/g, '$1');
      return p;
    });
    return words.join(' ').trim();
  }

  // Optimal string alignment (restricted Damerau-Levenshtein) distance
  function damerauLevenshtein(a, b) {
    const lenA = a.length;
    const lenB = b.length;
    if (lenA === 0) return lenB;
    if (lenB === 0) return lenA;
    if (Math.abs(lenA - lenB) > 4) return 99;

    const d = Array.from({ length: lenA + 1 }, () => new Array(lenB + 1).fill(0));
    for (let i = 0; i <= lenA; i++) d[i][0] = i;
    for (let j = 0; j <= lenB; j++) d[0][j] = j;

    for (let i = 1; i <= lenA; i++) {
      for (let j = 1; j <= lenB; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let val = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + cost
        );
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          val = Math.min(val, d[i - 2][j - 2] + cost);
        }
        d[i][j] = val;
      }
    }
    return d[lenA][lenB];
  }

  function compilePromptIndex(promptObj) {
    if (promptObj._compiled) return promptObj._compiled;

    const exactMap = new Map();
    const spacelessMap = new Map();
    const middleStrippedMap = new Map();
    const phoneticMap = new Map();
    const allForms = [];
    const byTier = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    for (let tierNum = 1; tierNum <= 6; tierNum++) {
      const list = promptObj.tiers[tierNum] || promptObj.tiers[String(tierNum)] || [];
      for (const rawEntry of list) {
        const parts = rawEntry.split('|').map(s => s.trim()).filter(Boolean);
        if (parts.length === 0) continue;
        const canonical = parts[0];
        byTier[tierNum].push(canonical);

        for (const alias of parts) {
          const norm = normalizeTokenString(alias);
          if (!norm) continue;

          const record = {
            norm,
            spaceless: norm.replace(/\s+/g, ''),
            phonetic: phoneticSkeleton(norm),
            canonical,
            tier: tierNum
          };

          if (!exactMap.has(norm)) {
            exactMap.set(norm, record);
          }
          const noArt = stripArticles(norm);
          if (noArt && !exactMap.has(noArt)) {
            exactMap.set(noArt, record);
          }

          if (record.spaceless.length >= 4 && !spacelessMap.has(record.spaceless)) {
            spacelessMap.set(record.spaceless, record);
          }

          const midStripped = stripMiddleInitials(norm);
          if (midStripped !== norm && !middleStrippedMap.has(midStripped)) {
            middleStrippedMap.set(midStripped, record);
          }

          if (record.phonetic.length >= 5) {
            if (!phoneticMap.has(record.phonetic)) {
              phoneticMap.set(record.phonetic, [record]);
            } else {
              const bucket = phoneticMap.get(record.phonetic);
              if (!bucket.some(item => item.canonical === record.canonical)) {
                bucket.push(record);
              }
            }
          }

          allForms.push(record);
        }
      }
    }

    promptObj._compiled = {
      exactMap,
      spacelessMap,
      middleStrippedMap,
      phoneticMap,
      allForms,
      byTier
    };
    return promptObj._compiled;
  }

  function formatMatch(record, fuzzy, correctedFrom) {
    const res = {
      matched: true,
      canonical: record.canonical,
      tier: record.tier,
      fuzzy: Boolean(fuzzy)
    };
    if (fuzzy && correctedFrom) {
      res.correctedFrom = correctedFrom;
    }
    return res;
  }

  function maxEditsForLength(len) {
    if (len >= 15) return 3;
    if (len >= 9) return 2;
    if (len >= 4) return 1;
    return 0;
  }

  function evaluateAnswer(promptObj, userRawInput) {
    const idx = compilePromptIndex(promptObj);
    const cleaned = normalizeTokenString(userRawInput);
    if (!cleaned) {
      return { matched: false, empty: true, reason: 'Type an answer first!' };
    }

    const candidates = singularizeVariations(stripArticles(cleaned));
    if (!candidates.includes(cleaned)) candidates.unshift(cleaned);

    // 1. Exact & plural/article-normalized lookup
    for (const c of candidates) {
      if (idx.exactMap.has(c)) {
        return formatMatch(idx.exactMap.get(c), false);
      }
    }

    // 2. Middle-initial stripped lookup (e.g., "John Kennedy" -> "John F. Kennedy")
    for (const c of candidates) {
      const mid = stripMiddleInitials(c);
      if (idx.middleStrippedMap.has(mid)) {
        return formatMatch(idx.middleStrippedMap.get(mid), false);
      }
    }

    // 3. Spaceless lookup (e.g., "Newyork" -> "New York", "Pannacotta" -> "Panna Cotta")
    const spacelessQuery = cleaned.replace(/\s+/g, '');
    if (spacelessQuery.length >= 4 && idx.spacelessMap.has(spacelessQuery)) {
      const hit = idx.spacelessMap.get(spacelessQuery);
      return formatMatch(hit, true, userRawInput.trim());
    }

    // Never fuzz short 1-3 character codes/symbols (e.g., "C", "Go", "Io", "K2")
    if (cleaned.length < 4) {
      return {
        matched: false,
        reason: 'Not recognized in the sonar archive — try another valid answer!'
      };
    }

    // 4. Direct phonetic skeleton match (e.g., "Filippines" -> "Philippines", "Chiwawa" -> "Chihuahua")
    const queryPhonetic = phoneticSkeleton(cleaned);
    if (queryPhonetic.length >= 5 && idx.phoneticMap.has(queryPhonetic)) {
      const matches = idx.phoneticMap.get(queryPhonetic);
      if (matches.length === 1) {
        return formatMatch(matches[0], true, userRawInput.trim());
      }
      // If multiple share a phonetic skeleton, pick strictly closest raw spelling if unique
      let bestDist = Infinity;
      let bestList = [];
      for (const m of matches) {
        const d = damerauLevenshtein(cleaned, m.norm);
        if (d < bestDist) {
          bestDist = d;
          bestList = [m];
        } else if (d === bestDist) {
          bestList.push(m);
        }
      }
      if (bestList.length === 1) {
        return formatMatch(bestList[0], true, userRawInput.trim());
      }
    }

    // 5. Ranked fuzzy & phonetic spell-check across all forms
    const scored = [];
    const seenCanonical = new Set();

    for (const entry of idx.allForms) {
      if (entry.norm.length < 4) continue;
      if (seenCanonical.has(entry.canonical)) continue;

      const minLen = Math.min(entry.norm.length, cleaned.length);
      const allowed = maxEditsForLength(minLen);
      const rawDist = damerauLevenshtein(cleaned, entry.norm);
      const spacelessDist =
        spacelessQuery.length >= 5 && entry.spaceless.length >= 5
          ? damerauLevenshtein(spacelessQuery, entry.spaceless)
          : 99;
      const effDist = Math.min(rawDist, spacelessDist);

      const phonDist =
        queryPhonetic.length >= 4 && entry.phonetic.length >= 4
          ? damerauLevenshtein(queryPhonetic, entry.phonetic)
          : 99;

      // Accept threshold: within edit budget, OR very strong phonetic match on >=5 char terms
      const passesRaw = effDist <= allowed;
      const passesPhonetic = minLen >= 5 && phonDist <= 1 && effDist <= allowed + 1;

      if (passesRaw || passesPhonetic) {
        seenCanonical.add(entry.canonical);
        // Composite score prioritizes phonetic exactness on short words and lower raw distance overall
        const composite = effDist * 3 + phonDist * 2;
        scored.push({ entry, effDist, phonDist, composite });
      }
    }

    if (scored.length > 0) {
      scored.sort((a, b) => {
        if (a.composite !== b.composite) return a.composite - b.composite;
        if (a.effDist !== b.effDist) return a.effDist - b.effDist;
        return a.phonDist - b.phonDist;
      });

      const top = scored[0];
      const runnerUp = scored[1];
      const isShort = Math.min(top.entry.norm.length, cleaned.length) <= 5;
      const tied = runnerUp && runnerUp.composite === top.composite;

      // For short words (4-5 chars), require either an unambiguous winner or phonetic win
      if (isShort && tied) {
        return {
          matched: false,
          suggestion: top.entry.canonical,
          reason: `Close! Did you mean "${top.entry.canonical}" or "${runnerUp.entry.canonical}"?`
        };
      }

      if (top.effDist <= 3) {
        return formatMatch(top.entry, true, userRawInput.trim());
      }
    }

    // 6. Gentle hint when query was just outside auto-correct threshold
    let hintBest = null;
    let hintScore = Infinity;
    for (const entry of idx.allForms) {
      if (entry.norm.length < 5) continue;
      const d = damerauLevenshtein(cleaned, entry.norm);
      const pd = phoneticSkeleton(cleaned) === entry.phonetic ? 0 : 2;
      const s = d * 2 + pd;
      if (d <= maxEditsForLength(entry.norm.length) + 1 && s < hintScore) {
        hintScore = s;
        hintBest = entry;
      }
    }
    if (hintBest) {
      return {
        matched: false,
        suggestion: hintBest.canonical,
        reason: `Close! Did you mean "${hintBest.canonical}"?`
      };
    }

    return {
      matched: false,
      reason: 'Not recognized in the sonar archive — try another valid answer!'
    };
  }

  global.ShrimplionMatcher = {
    normalizeTokenString,
    phoneticSkeleton,
    compilePromptIndex,
    evaluateAnswer
  };
})(window);
