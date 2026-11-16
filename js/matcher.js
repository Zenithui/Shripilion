// SHRIMPLION — Smart Reverse-Trivia Answer Normalization & Fuzzy Matcher

(function () {
  function normalizeTokenString(raw) {
    if (!raw || typeof raw !== 'string') return '';
    let s = raw
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Preserve programming symbols like C++, C#, F#
    s = s.replace(/\+\+/g, ' plusplus ');
    s = s.replace(/#/g, ' sharp ');
    s = s.replace(/&/g, ' and ');

    // Remove apostrophes cleanly (Night's -> Nights, Cote d'Ivoire -> Cote dIvoire / Cote d Ivoire)
    s = s.replace(/['’`]/g, '');

    // Replace punctuation/hyphens/slashes with spaces
    s = s.replace(/[^a-z0-9]+/g, ' ').trim();

    // Expand leading or standalone "st" -> "saint" when followed by another word
    s = s.replace(/\bst\s+(?=[a-z])/g, 'saint ');

    // Collapse whitespace
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }

  function stripLeadingArticles(norm) {
    return norm.replace(/^(the|a|an)\s+/, '').trim();
  }

  function singularize(norm) {
    if (norm.length <= 4) return norm;
    if (norm.endsWith('ies') && norm.length > 5) {
      return norm.slice(0, -3) + 'y';
    }
    if (norm.endsWith('oes') || norm.endsWith('ches') || norm.endsWith('shes') || norm.endsWith('xes')) {
      return norm.slice(0, -2);
    }
    if (norm.endsWith('s') && !norm.endsWith('ss') && !norm.endsWith('us') && !norm.endsWith('is')) {
      return norm.slice(0, -1);
    }
    return norm;
  }

  // Optimal String Alignment / Restricted Damerau-Levenshtein distance
  function damerauLevenshtein(a, b) {
    const lenA = a.length;
    const lenB = b.length;
    if (Math.abs(lenA - lenB) > 3) return 99;

    const dp = Array.from({ length: lenA + 1 }, () => new Array(lenB + 1).fill(0));
    for (let i = 0; i <= lenA; i++) dp[i][0] = i;
    for (let j = 0; j <= lenB; j++) dp[0][j] = j;

    for (let i = 1; i <= lenA; i++) {
      for (let j = 1; j <= lenB; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1); // transposition
        }
      }
    }
    return dp[lenA][lenB];
  }

  // Pre-compile an index for a prompt object (cached on prompt._compiled)
  function compilePromptIndex(promptObj) {
    if (promptObj._compiled) return promptObj._compiled;

    const exactMap = new Map(); // normalizedKey -> { canonical, tier }
    const allForms = [];        // [{ key, canonical, tier }]
    const byTier = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    for (const tierStr of Object.keys(promptObj.tiers)) {
      const tier = Number(tierStr);
      const rawList = promptObj.tiers[tier] || [];

      for (const rawEntry of rawList) {
        const parts = rawEntry.split('|').map(p => p.trim()).filter(Boolean);
        if (!parts.length) continue;

        // Capitalize first letter if accidentally lowercase in raw data
        let canonical = parts[0];
        if (canonical[0] && canonical[0] === canonical[0].toLowerCase() && canonical !== 'qutebrowser' && canonical !== 'w3m') {
          canonical = canonical[0].toUpperCase() + canonical.slice(1);
        }

        byTier[tier].push(canonical);

        for (const variant of parts) {
          const norm = normalizeTokenString(variant);
          if (!norm) continue;
          const stripped = stripLeadingArticles(norm);

          const record = { canonical, tier };
          if (!exactMap.has(norm)) {
            exactMap.set(norm, record);
            allForms.push({ key: norm, canonical, tier });
          }
          if (stripped && stripped !== norm && !exactMap.has(stripped)) {
            exactMap.set(stripped, record);
            allForms.push({ key: stripped, canonical, tier });
          }
          // Also index singularized form if different
          const sing = singularize(stripped || norm);
          if (sing && sing !== norm && sing !== stripped && !exactMap.has(sing)) {
            exactMap.set(sing, record);
          }
        }
      }
    }

    promptObj._compiled = { exactMap, allForms, byTier };
    return promptObj._compiled;
  }

  function evaluateAnswer(promptObj, userRawInput) {
    const norm = normalizeTokenString(userRawInput);
    if (!norm) {
      return { matched: false, empty: true, reason: 'Type an answer first!' };
    }

    const index = compilePromptIndex(promptObj);
    const stripped = stripLeadingArticles(norm);
    const singular = singularize(stripped || norm);

    // 1. Exact / normalized / article-stripped / singularized match
    const direct =
      index.exactMap.get(norm) ||
      index.exactMap.get(stripped) ||
      index.exactMap.get(singular);

    if (direct) {
      return {
        matched: true,
        canonical: direct.canonical,
        tier: direct.tier,
        fuzzy: false
      };
    }

    // 2. Check if user typed a generic category word from the prompt itself
    const promptWords = normalizeTokenString(promptObj.prompt).split(' ');
    const genericWords = new Set(['country', 'state', 'city', 'capital', 'element', 'planet', 'moon', 'dinosaur', 'bird', 'tree', 'fruit', 'cheese', 'pasta', 'dog', 'breed', 'sport', 'currency', 'game', 'instrument', 'language', 'browser', 'play', 'president', 'constellation']);
    if (genericWords.has(stripped) && promptWords.includes(stripped)) {
      return {
        matched: false,
        reason: `Name a specific ${stripped}!`
      };
    }

    // 3. Safe Damerau-Levenshtein typo tolerance for medium/long words
    const target = stripped || norm;
    if (target.length >= 6) {
      const maxAllowed = target.length >= 10 ? 2 : 1;
      let bestDist = 99;
      let bestRecord = null;
      let ambiguous = false;

      for (const item of index.allForms) {
        if (item.key.length < 5) continue;
        if (Math.abs(item.key.length - target.length) > maxAllowed) continue;
        // Require matching first character for distance-2 fuzzy matches to prevent wild jumps
        if (maxAllowed === 2 && item.key[0] !== target[0]) continue;

        const dist = damerauLevenshtein(target, item.key);
        if (dist <= maxAllowed) {
          if (dist < bestDist) {
            bestDist = dist;
            bestRecord = item;
            ambiguous = false;
          } else if (dist === bestDist && bestRecord && bestRecord.canonical !== item.canonical) {
            ambiguous = true;
          }
        }
      }

      if (bestRecord && !ambiguous) {
        return {
          matched: true,
          canonical: bestRecord.canonical,
          tier: bestRecord.tier,
          fuzzy: true
        };
      }
    }

    return {
      matched: false,
      reason: 'Not in the deep-sea database — keep guessing!'
    };
  }

  window.ShrimplionMatcher = {
    normalizeTokenString,
    compilePromptIndex,
    evaluateAnswer
  };
})();
