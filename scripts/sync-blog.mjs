#!/usr/bin/env node

/**
 * sync-blog.mjs
 * Mirrors the published dev.to articles of DEVTO_USER into static pages:
 *   blog/index.html          list of every post
 *   blog/<slug>/index.html   one page per post, canonical pointing at the original
 * and refreshes the "latest posts" block and post counts in index.html.
 *
 * Everything is fetched before anything is written, so a failed run leaves the
 * committed pages untouched.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const blogDir = path.join(rootDir, 'blog');

const DEVTO_USER = 'freerave';
const SITE_URL = 'https://freerave.dev';
const LATEST_COUNT = 3;
const REQUEST_GAP_MS = 400; // dev.to rate-limits anonymous API calls

// Kept by hand in blog/; everything else under blog/ is generated and may be removed
const STATIC_FILES = new Set(['blog.css']);

const sleep = ms => new Promise(r => setTimeout(r, ms));

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

async function getJson(url, attempt = 1) {
  const res = await fetch(url, { headers: { 'Accept': 'application/vnd.forem.api-v1+json', 'User-Agent': 'freerave.dev blog sync' } });
  if (res.status === 429 && attempt <= 8) {
    const wait = Number(res.headers.get('retry-after')) * 1000 || attempt * 5000;
    await sleep(wait);
    return getJson(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`dev.to API ${res.status} for ${url}`);
  return res.json();
}

async function fetchArticles() {
  const list = [];
  for (let page = 1; ; page++) {
    const batch = await getJson(`https://dev.to/api/articles?username=${DEVTO_USER}&per_page=1000&page=${page}`);
    list.push(...batch);
    if (batch.length < 1000) break;
  }

  // The list has no body; fetch each article, one at a time to stay under the rate limit
  const full = [];
  for (const item of list) {
    full.push(await getJson(`https://dev.to/api/articles/${item.id}`));
    await sleep(REQUEST_GAP_MS);
  }

  return full
    .filter(a => a.slug && /^[a-z0-9-]+$/.test(a.slug) && a.body_html)
    // The single-article endpoint returns tag_list as a string and tags as the array
    .map(a => ({ ...a, tag_list: Array.isArray(a.tags) ? a.tags : String(a.tag_list || '').split(',').map(t => t.trim()).filter(Boolean) }))
    .sort((a, b) => b.published_at.localeCompare(a.published_at));
}

const formatDate = iso => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// dev.to sanitizes body_html; this only drops what the page's CSP would block anyway
function cleanBody(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/\son[a-z]+="[^"]*"/gi, '')
    .replace(/<img\b(?![^>]*\bloading=)/gi, '<img loading="lazy"');
}

function head({ title, description, canonical, image, type }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self' https:; frame-src https:; connect-src 'self';">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${image ? `<meta property="og:image" content="${esc(image)}">\n<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<meta name="theme-color" content="#00e5ff">
<link rel="icon" type="image/svg+xml" href="/assets/icon.svg">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/blog/blog.css">
</head>
<body>
<nav class="blog-nav">
  <a href="/" class="blog-brand"><span>Free</span>Rave</a>
  <a href="/blog/">// blog</a>
</nav>
`;
}

const foot = `<footer class="blog-foot"><a href="/">freerave.dev</a> · <a href="https://dev.to/${DEVTO_USER}" target="_blank" rel="noopener noreferrer">dev.to/@${DEVTO_USER}</a></footer>
</body>
</html>
`;

const tagList = tags => tags.map(t => `<span class="post-tag">#${esc(t)}</span>`).join('');

function postPage(a) {
  return head({
    title: `${a.title} — FreeRave`,
    description: a.description,
    canonical: a.canonical_url || a.url,
    image: a.social_image,
    type: 'article'
  }) + `<main class="post">
  ${a.cover_image ? `<img class="post-cover" src="${esc(a.cover_image)}" alt="">` : ''}
  <h1 class="post-title">${esc(a.title)}</h1>
  <div class="post-meta">
    <time datetime="${esc(a.published_at)}">${formatDate(a.published_at)}</time> · ${a.reading_time_minutes} min read
    <div class="post-tags">${tagList(a.tag_list)}</div>
  </div>
  <article class="post-body">
${cleanBody(a.body_html)}
  </article>
  <div class="post-origin">
    Originally published on <a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">dev.to</a>
    · ❤ ${a.public_reactions_count} · 💬 ${a.comments_count}
    · <a href="${esc(a.url)}#comments" target="_blank" rel="noopener noreferrer">Join the discussion →</a>
  </div>
</main>
` + foot;
}

function listPage(articles) {
  const items = articles.map(a => `  <a class="post-card" href="/blog/${a.slug}/">
    <div class="post-meta"><time datetime="${esc(a.published_at)}">${formatDate(a.published_at)}</time> · ${a.reading_time_minutes} min read</div>
    <h2>${esc(a.title)}</h2>
    <p>${esc(a.description)}</p>
    <div class="post-tags">${tagList(a.tag_list)}</div>
  </a>`).join('\n');

  return head({
    title: 'Blog — FreeRave',
    description: `${articles.length} articles on open-source tools, VS Code extensions and building in public.`,
    canonical: `${SITE_URL}/blog/`,
    image: null,
    type: 'website'
  }) + `<main class="post-list">
  <h1 class="post-title">// blog</h1>
  <p class="post-list-sub">${articles.length} articles, mirrored from <a href="https://dev.to/${DEVTO_USER}" target="_blank" rel="noopener noreferrer">dev.to/@${DEVTO_USER}</a>.</p>
${items}
</main>
` + foot;
}

// The "latest posts" block on the home page reuses the tool card styles
function latestBlock(articles) {
  const cards = articles.slice(0, LATEST_COUNT).map(a => `    <div class="tool-card">
      <div class="tool-header">
        <div class="tool-name post-card-title">${esc(a.title)}</div>
      </div>
      <p class="tool-desc">${esc(a.description)}</p>
      <a href="/blog/${a.slug}/" class="tool-link">${formatDate(a.published_at)} · ${a.reading_time_minutes} min read →</a>
    </div>`).join('\n\n');
  return `<!-- BLOG:START (generated by scripts/sync-blog.mjs) -->
  <div class="tools-grid">
${cards}
  </div>
  <div class="blog-more"><a href="/blog/" class="btn-secondary">⟶ All ${articles.length} posts</a></div>
  <!-- BLOG:END -->`;
}

async function main() {
  console.log(`🔄 Fetching dev.to articles for @${DEVTO_USER}...`);
  const articles = await fetchArticles();
  if (articles.length === 0) throw new Error('No articles returned; keeping the committed blog.');
  console.log(`📝 ${articles.length} articles fetched.`);

  // Render everything first so a template error can't leave half-written pages
  const pages = articles.map(a => [a.slug, postPage(a)]);
  const listHtml = listPage(articles);

  // Write pages, then drop folders of posts that are no longer published
  fs.mkdirSync(blogDir, { recursive: true });
  const keep = new Set(articles.map(a => a.slug));
  for (const [slug, html] of pages) {
    fs.mkdirSync(path.join(blogDir, slug), { recursive: true });
    fs.writeFileSync(path.join(blogDir, slug, 'index.html'), html, 'utf-8');
  }
  fs.writeFileSync(path.join(blogDir, 'index.html'), listHtml, 'utf-8');
  for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !keep.has(entry.name)) {
      fs.rmSync(path.join(blogDir, entry.name), { recursive: true });
      console.log(`🗑️  Removed ${entry.name}`);
    } else if (entry.isFile() && entry.name !== 'index.html' && !STATIC_FILES.has(entry.name)) {
      console.warn(`⚠️  Unexpected file left in blog/: ${entry.name}`);
    }
  }

  // Home page: latest posts block and post counts
  const indexPath = path.join(rootDir, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf-8');
  indexHtml = indexHtml.replace(/<!-- BLOG:START[\s\S]*?<!-- BLOG:END -->/, latestBlock(articles));
  indexHtml = indexHtml.replace(
    /(<div class="stat-num">)[^<]+(<\/div>\s*<div class="stat-label">Posts<\/div>)/,
    `$1${articles.length}$2`
  );
  indexHtml = indexHtml.replace(
    /(<span class="march-stat-num">)[^<]+(<\/span>\s*<span class="march-stat-label">Posts Published<\/span>)/,
    `$1${articles.length}$2`
  );
  fs.writeFileSync(indexPath, indexHtml, 'utf-8');

  console.log(`✅ blog/ and index.html updated (${articles.length} posts).`);
}

main().catch(err => {
  console.error('❌ Blog sync failed:', err);
  process.exit(1);
});
