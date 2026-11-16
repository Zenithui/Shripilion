// SHRIMPLION — Async JSON Dataset Loader with Offline/Bundle Fallback
// Loads live datasets from data/manifest.json, data/packs/*.json, and data/daily.json
// when served over HTTP/GitHub Pages, falling back cleanly to js/prompts.js on file://.

(function (global) {
  let cachedPromise = null;
  let datasetMeta = {
    source: 'bundled',
    totalPrompts: Array.isArray(global.SHRIMPLION_PROMPTS) ? global.SHRIMPLION_PROMPTS.length : 0,
    totalCanonicalAnswers: 0,
    totalSearchForms: 0,
    dailyRange: null,
    loaded: false
  };

  function countPromptStats(prompts) {
    let canonical = 0;
    let forms = 0;
    for (const p of prompts) {
      if (!p || !p.tiers) continue;
      for (let t = 1; t <= 6; t++) {
        const list = p.tiers[t] || p.tiers[String(t)] || [];
        for (const entry of list) {
          canonical++;
          forms += String(entry).split('|').filter(Boolean).length;
        }
      }
    }
    return { canonical, forms };
  }

  async function fetchJson(url) {
    const resp = await fetch(url, { cache: 'no-cache' });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} loading ${url}`);
    }
    return resp.json();
  }

  async function loadInternal() {
    try {
      const manifest = await fetchJson('data/manifest.json');
      const packFiles = Object.values(manifest.packFiles || {});
      const packRequests = packFiles.map(url => fetchJson(url));
      const dailyReq = manifest.dailyFile ? fetchJson(manifest.dailyFile) : Promise.resolve(null);

      const [packResults, dailyData] = await Promise.all([
        Promise.all(packRequests),
        dailyReq
      ]);

      const mergedPrompts = packResults.flat().filter(Boolean);
      if (mergedPrompts.length > 0) {
        global.SHRIMPLION_PROMPTS = mergedPrompts;
      }
      if (manifest.packs) global.SHRIMPLION_PACKS = manifest.packs;
      if (manifest.tiers) global.SHRIMPLION_TIERS = manifest.tiers;
      if (manifest.zones) global.SHRIMPLION_ZONES = manifest.zones;
      if (dailyData) global.SHRIMPLION_DAILY_SCHEDULE = dailyData;

      const counts = countPromptStats(global.SHRIMPLION_PROMPTS || []);
      datasetMeta = {
        source: 'json',
        version: manifest.version || 2,
        totalPrompts: (global.SHRIMPLION_PROMPTS || []).length,
        totalCanonicalAnswers: manifest.totalCanonicalAnswers || counts.canonical,
        totalSearchForms: manifest.totalSearchForms || counts.forms,
        dailyRange: manifest.dailyRange || null,
        loaded: true
      };
      return datasetMeta;
    } catch (_err) {
      const counts = countPromptStats(global.SHRIMPLION_PROMPTS || []);
      datasetMeta = {
        source: 'bundled',
        version: 2,
        totalPrompts: (global.SHRIMPLION_PROMPTS || []).length,
        totalCanonicalAnswers: counts.canonical,
        totalSearchForms: counts.forms,
        dailyRange: null,
        loaded: true
      };
      return datasetMeta;
    }
  }

  function load() {
    if (!cachedPromise) {
      cachedPromise = loadInternal();
    }
    return cachedPromise;
  }

  function getMeta() {
    return datasetMeta;
  }

  global.ShrimplionDataset = {
    load,
    getMeta
  };
})(window);
