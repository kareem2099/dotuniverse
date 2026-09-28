/**
 * Extension Stats Module - Automatic Live Downloads & Version Synchronizer
 * Fetches real-time extension metrics and versions from:
 * 1. VS Marketplace API (_apis/public/gallery/extensionquery)
 * 2. Open VSX Registry API (open-vsx.org/api)
 *
 * Automatically updates DOM elements, calculates grand total downloads,
 * and caches results in localStorage (30-min TTL) to ensure instant page loads.
 */

export const ExtensionStats = {
  CACHE_KEY: 'dotuniverse_ext_stats_v1',
  CACHE_TTL: 24 * 60 * 60 * 1000, // 24 hours (1 day)

  EXTENSIONS: [
    { key: 'codetune',   vsId: 'FreeRave.codetune',   ovsxId: 'freerave/codetune' },
    { key: 'dotcommand', vsId: 'FreeRave.dotcommand', ovsxId: 'freerave/dotcommand' },
    { key: 'dotenvy',    vsId: 'FreeRave.dotenvy',    ovsxId: 'freerave/dotenvy' },
    { key: 'dotshare',   vsId: 'FreeRave.dotshare',   ovsxId: 'freerave/dotshare' },
    { key: 'dotfetch',   vsId: 'FreeRave.dotfetch',   ovsxId: 'freerave/dotfetch' },
    { key: 'dotreadme',  vsId: 'FreeRave.dotreadme',  ovsxId: 'freerave/dotreadme' },
    { key: 'dotsense',   vsId: 'FreeRave.dotsense',   ovsxId: null }
  ],

  init() {
    // 1. Instantly apply cached data if available
    const cached = this.getCached();
    if (cached && cached.data) {
      this.applyToDOM(cached.data);
    }

    // 2. Refresh from network if cache expired or missing
    if (!cached || Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.refresh();
    }
  },

  getCached() {
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setCache(data) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch (e) {
      console.warn('ExtensionStats: Failed to save to localStorage', e);
    }
  },

  async refresh(force = false) {
    try {
      const [vsData, ovsxData] = await Promise.allSettled([
        this.fetchVsMarketplace(),
        this.fetchOpenVsx()
      ]);

      const vsMap = vsData.status === 'fulfilled' ? vsData.value : {};
      const ovsxMap = ovsxData.status === 'fulfilled' ? ovsxData.value : {};

      const combined = {};
      let totalVs = 0;
      let totalOvsx = 0;

      for (const ext of this.EXTENSIONS) {
        const vs = vsMap[ext.key] || { installs: 0, version: null };
        const ovsx = ovsxMap[ext.key] || { downloads: 0, version: null };

        const version = vs.version || ovsx.version;
        const vsInstalls = vs.installs || 0;
        const ovsxDownloads = ovsx.downloads || 0;

        totalVs += vsInstalls;
        totalOvsx += ovsxDownloads;

        combined[ext.key] = {
          version,
          vsInstalls,
          ovsxDownloads,
          total: vsInstalls + ovsxDownloads
        };
      }

      const result = {
        extensions: combined,
        totals: {
          vs: totalVs,
          ovsx: totalOvsx,
          grandTotal: totalVs + totalOvsx
        },
        updatedAt: new Date().toISOString()
      };

      // Only save and apply if we got meaningful data
      if (result.totals.grandTotal > 0) {
        this.setCache(result);
        this.applyToDOM(result);
      }

      return result;
    } catch (err) {
      console.warn('ExtensionStats: Background sync failed, falling back to static/cached data', err);
      return null;
    }
  },

  async fetchVsMarketplace() {
    const body = {
      filters: [{
        criteria: this.EXTENSIONS.map(ext => ({ filterType: 7, value: ext.vsId }))
      }],
      flags: 914
    };

    const res = await fetch('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json;api-version=3.0-preview.1'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`VS Marketplace API error: ${res.status}`);
    const json = await res.json();
    const extensions = json?.results?.[0]?.extensions || [];
    const map = {};

    for (const ext of extensions) {
      const key = ext.extensionName?.toLowerCase();
      const stats = {};
      for (const s of ext.statistics || []) {
        stats[s.statisticName] = s.value;
      }
      // VS Marketplace total installs = install + downloadCount
      const installs = Math.round((stats.install || 0) + (stats.downloadCount || 0));
      const version = ext.versions?.[0]?.version || null;

      map[key] = { installs, version };
    }

    return map;
  },

  async fetchOpenVsx() {
    const map = {};
    const ovsxExts = this.EXTENSIONS.filter(e => e.ovsxId);

    const promises = ovsxExts.map(async (ext) => {
      try {
        const res = await fetch(`https://open-vsx.org/api/${ext.ovsxId}`);
        if (!res.ok) return;
        const data = await res.json();
        map[ext.key] = {
          downloads: data.downloadCount || 0,
          version: data.version || null
        };
      } catch (err) {
        console.warn(`ExtensionStats: Failed fetching Open VSX for ${ext.key}`, err);
      }
    });

    await Promise.allSettled(promises);
    return map;
  },

  applyToDOM(payload) {
    if (!payload || !payload.extensions) return;

    const { extensions, totals } = payload;

    // 1. Update each extension card
    document.querySelectorAll('.ext-card').forEach(card => {
      const key = card.dataset.extName;
      if (!key || !extensions[key]) return;

      const data = extensions[key];

      // Update version tag
      if (data.version) {
        const verEl = card.querySelector('.ext-version');
        if (verEl) {
          verEl.textContent = data.version.startsWith('v') ? data.version : `v${data.version}`;
        }
      }

      // Update VS Marketplace count
      if (data.vsInstalls > 0) {
        const vsBadge = card.querySelector('.store-badge.vs .store-dl');
        if (vsBadge) {
          vsBadge.textContent = `${data.vsInstalls.toLocaleString()} installs`;
        }
      }

      // Update Open VSX count
      if (data.ovsxDownloads > 0) {
        const ovsxBadge = card.querySelector('.store-badge.ovsx .store-dl');
        if (ovsxBadge) {
          ovsxBadge.textContent = `${data.ovsxDownloads.toLocaleString()} downloads`;
        }
      }
    });

    // 2. Update Header Download Count
    if (totals && totals.grandTotal > 0) {
      const totalStr = totals.grandTotal.toLocaleString();

      const headerTotal = document.getElementById('headerExtDownloads');
      if (headerTotal) {
        headerTotal.textContent = totalStr;
      }

      const bannerTotal = document.getElementById('bannerExtDownloads') || document.querySelector('.dl-total');
      if (bannerTotal) {
        bannerTotal.textContent = totalStr;
      }
    }
  }
};
