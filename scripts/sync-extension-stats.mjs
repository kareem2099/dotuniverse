#!/usr/bin/env node

/**
 * sync-extension-stats.mjs
 * Automatically fetches the latest versions and download/install numbers
 * from VS Marketplace and Open VSX, then updates index.html and README.md.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const EXTENSIONS = [
  { key: 'codetune',   name: 'CodeTune',   vsId: 'FreeRave.codetune',   ovsxId: 'freerave/codetune' },
  { key: 'dotcommand', name: 'dotcommand', vsId: 'FreeRave.dotcommand', ovsxId: 'freerave/dotcommand' },
  { key: 'dotenvy',    name: 'DotEnvy',    vsId: 'FreeRave.dotenvy',    ovsxId: 'freerave/dotenvy' },
  { key: 'dotshare',   name: 'DotShare',   vsId: 'FreeRave.dotshare',   ovsxId: 'freerave/dotshare' },
  { key: 'dotfetch',   name: 'DotFetch',   vsId: 'FreeRave.dotfetch',   ovsxId: 'freerave/dotfetch' },
  { key: 'dotreadme',  name: 'DotReadme',  vsId: 'FreeRave.dotreadme',  ovsxId: 'freerave/dotreadme' },
  { key: 'dotsense',   name: 'DotSense',   vsId: 'FreeRave.dotsense',   ovsxId: null }
];

async function fetchVsMarketplace() {
  const body = {
    filters: [{
      criteria: EXTENSIONS.map(ext => ({ filterType: 7, value: ext.vsId }))
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
    const installs = Math.round((stats.install || 0) + (stats.downloadCount || 0));
    const version = ext.versions?.[0]?.version || null;

    map[key] = { installs, version };
  }

  return map;
}

async function fetchOpenVsx() {
  const map = {};
  const ovsxExts = EXTENSIONS.filter(e => e.ovsxId);

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
      console.warn(`Warning: Failed fetching Open VSX for ${ext.key}:`, err.message);
    }
  });

  await Promise.allSettled(promises);
  return map;
}

function formatNum(n) {
  return n.toLocaleString('en-US');
}

async function main() {
  console.log('🔄 Fetching live extension stats from VS Marketplace and Open VSX...');
  
  const [vsMap, ovsxMap] = await Promise.all([
    fetchVsMarketplace(),
    fetchOpenVsx()
  ]);

  let totalVs = 0;
  let totalOvsx = 0;
  const stats = {};

  for (const ext of EXTENSIONS) {
    const vs = vsMap[ext.key] || { installs: 0, version: null };
    const ovsx = ovsxMap[ext.key] || { downloads: 0, version: null };

    const version = vs.version || ovsx.version;
    const vsInstalls = vs.installs || 0;
    const ovsxDownloads = ovsx.downloads || 0;
    const itemTotal = vsInstalls + ovsxDownloads;

    totalVs += vsInstalls;
    totalOvsx += ovsxDownloads;

    stats[ext.key] = {
      name: ext.name,
      version: version ? (version.startsWith('v') ? version : `v${version}`) : null,
      vsInstalls,
      ovsxDownloads,
      total: itemTotal
    };
  }

  const grandTotal = totalVs + totalOvsx;

  console.log('\n📊 Live Extension Stats:');
  console.table(Object.entries(stats).map(([key, item]) => ({
    Extension: item.name,
    Version: item.version,
    'VS Marketplace': formatNum(item.vsInstalls),
    'Open VSX': formatNum(item.ovsxDownloads),
    'Total Downloads': formatNum(item.total)
  })));
  console.log(`\n🏆 Grand Total Downloads: ${formatNum(grandTotal)} (Marketplace: ${formatNum(totalVs)}, Open VSX: ${formatNum(totalOvsx)})\n`);

  // 1. Update index.html
  const indexPath = path.join(rootDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexHtml = fs.readFileSync(indexPath, 'utf-8');

    // Update header total
    indexHtml = indexHtml.replace(
      /(<div class="stat-num"(?: id="headerExtDownloads")?>)[^<]+(<\/div>\s*<div class="stat-label">Extension Downloads<\/div>)/,
      `$1${formatNum(grandTotal)}$2`
    );

    // Update banner total
    indexHtml = indexHtml.replace(
      /(<span class="dl-total stat-num"(?: id="bannerExtDownloads")?>)[^<]+(<\/span>)/,
      `$1${formatNum(grandTotal)}$2`
    );

    // Update each extension card
    for (const ext of EXTENSIONS) {
      const s = stats[ext.key];
      if (!s) continue;

      // Match the card block
      const cardRegex = new RegExp(`(<div class="ext-card" data-ext-name="${ext.key}">[\\s\\S]*?)(<\\/div>\\s*<\\/div>\\s*(?:<div class="ext-card"|<\\/div>\\s*<\\!-- TOTAL DOWNLOADS))`, 'i');
      indexHtml = indexHtml.replace(cardRegex, (match, cardStart, cardEnd) => {
        let updatedCard = cardStart;

        // Update version
        if (s.version) {
          updatedCard = updatedCard.replace(/(<span class="ext-version">)[^<]+(<\/span>)/, `$1${s.version}$2`);
        }

        // Update VS Marketplace installs
        if (s.vsInstalls > 0) {
          updatedCard = updatedCard.replace(
            /(<span class="store-name">VS Marketplace<\/span><span class="store-dl">)[^<]+(<\/span>)/,
            `$1${formatNum(s.vsInstalls)} installs$2`
          );
        }

        // Update Open VSX downloads
        if (s.ovsxDownloads > 0) {
          updatedCard = updatedCard.replace(
            /(<span class="store-name">Open VSX<\/span><span class="store-dl">)[^<]+(<\/span>)/,
            `$1${formatNum(s.ovsxDownloads)} downloads$2`
          );
        }

        return updatedCard + cardEnd;
      });
    }

    fs.writeFileSync(indexPath, indexHtml, 'utf-8');
    console.log('✅ index.html updated successfully.');
  }

  // 2. Update README.md
  const readmePath = path.join(rootDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, 'utf-8');

    // Update VS Code Downloads shield badge
    const badgeEncoded = encodeURIComponent(formatNum(grandTotal));
    readme = readme.replace(
      /!\[VS Code Downloads\]\(https:\/\/img\.shields\.io\/badge\/Downloads-[^-\)]+-39ff14\?style=flat-square\)/,
      `![VS Code Downloads](https://img.shields.io/badge/Downloads-${badgeEncoded}-39ff14?style=flat-square)`
    );

    // Update summary table
    readme = readme.replace(
      /(\| VS Code Downloads \| )[^|]+( \|)/,
      `$1${formatNum(grandTotal)}+$2`
    );

    // Update each extension in README table
    for (const ext of EXTENSIONS) {
      const s = stats[ext.key];
      if (!s) continue;
      const rowRegex = new RegExp(`(\\|\\s*\\[\\*\\*${ext.name}\\*\\*\\]\\([^\\)]+\\)\\s*\\|\\s*[^|]+\\s*\\|\\s*)[^|]+?(\\s*\\|\\s*)[^|]+?(\\s*\\|)`, 'i');
      readme = readme.replace(rowRegex, (match, prefix, mid, suffix) => {
        return `${prefix}${s.version || '—'}${mid}${formatNum(s.total)}+${suffix}`;
      });
    }

    fs.writeFileSync(readmePath, readme, 'utf-8');
    console.log('✅ README.md updated successfully.');
  }

  console.log('\n🎉 Sync complete!');
}

main().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
