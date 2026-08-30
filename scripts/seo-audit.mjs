#!/usr/bin/env node
/**
 * Static SEO audit of the built out/ directory. Read-only: it never edits the
 * site, it only reports. Run after `npm run build`:
 *
 *     node scripts/seo-audit.mjs
 *
 * Checks the things that are cheap to get wrong in a bulk WordPress migration
 * and expensive to notice later: missing or duplicate titles and descriptions,
 * canonical and sitemap disagreement, indexable pages with no content, orphan
 * pages nothing links to, and internal links that 404.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const OUT = path.join(root, 'out');

if (!fs.existsSync(OUT)) {
  console.error('No out/ directory. Run `npm run build` first.');
  process.exit(1);
}

const cfg = fs.readFileSync(path.join(root, 'src/lib/siteConfig.js'), 'utf-8');
const SITE_URL = (cfg.match(/export const SITE_URL\s*=\s*["']([^"']+)["']/) || [])[1] || '';

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '_next') continue;
      walk(full);
    } else if (e.name === 'index.html') {
      const rel = path.relative(OUT, dir).split(path.sep).join('/');
      pages.push({ url: rel === '' ? '/' : '/' + rel + '/', file: full });
    }
  }
})(OUT);

const pick = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };
const decode = (s) => (s || '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));

for (const p of pages) {
  const html = fs.readFileSync(p.file, 'utf-8');
  p.html = html;
  p.title = decode(pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
  p.desc = decode(pick(html, /<meta name="description" content="([^"]*)"/i));
  p.canonical = pick(html, /<link rel="canonical" href="([^"]*)"/i);
  p.robots = pick(html, /<meta name="robots" content="([^"]*)"/i);
  p.ogUrl = pick(html, /<meta property="og:url" content="([^"]*)"/i);
  p.h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((m) => decode(m[1].replace(/<[^>]+>/g, '').trim()));
  p.noindex = /noindex/i.test(p.robots || '');
  const body = html.replace(/[\s\S]*?<body[^>]*>/i, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');
  p.words = decode(body).split(/\s+/).filter(Boolean).length;
  p.links = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  p.imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
}

const indexable = pages.filter((p) => !p.noindex);
const problems = [];
const note = (sev, label, items) => problems.push({ sev, label, items });

note('ERROR', 'indexable pages with NO <title>', indexable.filter((p) => !p.title).map((p) => p.url));
note('WARN', 'titles over 65 chars (truncated in results)',
  indexable.filter((p) => p.title && p.title.length > 65).map((p) => p.title.length + '  ' + p.url));
note('WARN', 'titles under 20 chars',
  indexable.filter((p) => p.title && p.title.length < 20).map((p) => p.title + '  ' + p.url));

const byTitle = new Map();
indexable.forEach((p) => { if (p.title) byTitle.set(p.title, [...(byTitle.get(p.title) || []), p.url]); });
note('ERROR', 'DUPLICATE titles across indexable pages',
  [...byTitle.entries()].filter(([, u]) => u.length > 1)
    .map(([t, u]) => u.length + 'x  "' + t + '"  ->  ' + u.slice(0, 3).join(' , ')));

note('ERROR', 'indexable pages with NO meta description', indexable.filter((p) => !p.desc).map((p) => p.url));
note('WARN', 'meta descriptions over 165 chars',
  indexable.filter((p) => p.desc && p.desc.length > 165).map((p) => p.desc.length + '  ' + p.url));
const byDesc = new Map();
indexable.forEach((p) => { if (p.desc) byDesc.set(p.desc, [...(byDesc.get(p.desc) || []), p.url]); });
note('WARN', 'DUPLICATE meta descriptions',
  [...byDesc.entries()].filter(([, u]) => u.length > 1)
    .map(([d, u]) => u.length + 'x  "' + d.slice(0, 60) + '..."'));

note('ERROR', 'pages with NO canonical', pages.filter((p) => !p.canonical).map((p) => p.url));
// A canonical that names another URL is only a problem on a page that is
// also asking to be indexed. On a noindexed duplicate it is the intended
// pairing, so it is reported separately rather than as an error.
const crossCanon = pages.filter((p) => p.canonical && p.canonical !== SITE_URL + p.url);
note('ERROR', 'INDEXABLE page whose canonical points elsewhere',
  crossCanon.filter((p) => !p.noindex).map((p) => p.url + '  ->  ' + p.canonical));
note('INFO', 'noindexed duplicates canonicalised to their original',
  crossCanon.filter((p) => p.noindex).map((p) => p.url + '  ->  ' + p.canonical));
note('ERROR', 'og:url disagrees with canonical',
  pages.filter((p) => p.ogUrl && p.canonical && p.ogUrl !== p.canonical).map((p) => p.url));

note('ERROR', 'indexable pages with NO <h1>', indexable.filter((p) => p.h1s.length === 0).map((p) => p.url));
note('WARN', 'pages with more than one <h1>',
  pages.filter((p) => p.h1s.length > 1).map((p) => p.h1s.length + '  ' + p.url));

note('WARN', 'indexable pages under 250 words',
  indexable.filter((p) => p.words < 250).map((p) => p.words + 'w  ' + p.url));

const sm = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf-8');
const smUrls = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
note('ERROR', 'NOINDEX pages listed in sitemap.xml',
  pages.filter((p) => p.noindex && smUrls.has(SITE_URL + p.url)).map((p) => p.url));
note('WARN', 'indexable pages MISSING from sitemap.xml',
  indexable.filter((p) => !smUrls.has(SITE_URL + p.url)).map((p) => p.url));
const built = new Set(pages.map((p) => SITE_URL + p.url));
note('ERROR', 'sitemap URLs with no built page', [...smUrls].filter((u) => !built.has(u)));

const builtPaths = new Set(pages.map((p) => p.url));
const assetish = (l) => l.startsWith('/_next/') || l.startsWith('/assets/') || /\.[a-z0-9]{2,4}$/i.test(l);
const broken = new Map();
for (const p of pages) {
  for (const l of new Set(p.links)) {
    if (assetish(l)) continue;
    const norm = l.endsWith('/') ? l : l + '/';
    if (!builtPaths.has(norm)) broken.set(l, [...(broken.get(l) || []), p.url]);
  }
}
note('ERROR', 'internal links pointing at a page that does not exist',
  [...broken.entries()].map(([l, on]) => l + '   (on ' + on.length + ' pages, e.g. ' + on[0] + ')'));

const linked = new Set();
pages.forEach((p) => p.links.forEach((l) => { if (!assetish(l)) linked.add(l.endsWith('/') ? l : l + '/'); }));
note('WARN', 'indexable pages nothing links to (orphans)',
  indexable.filter((p) => p.url !== '/' && !linked.has(p.url)).map((p) => p.url));

let noAlt = 0;
const hotlinked = new Set();
for (const p of pages) {
  for (const tag of p.imgs) {
    if (!/\balt\s*=/.test(tag)) noAlt++;
    const src = (tag.match(/src="([^"]+)"/) || [])[1] || '';
    if (/^https?:\/\//i.test(src) && !src.includes('realityjournal.co.uk')) {
      try { hotlinked.add(new URL(src).host); } catch { /* malformed src */ }
    }
  }
}
note('WARN', 'img tags with no alt attribute', noAlt ? [noAlt + ' across the build'] : []);
note('WARN', 'images hotlinked from third-party hosts', [...hotlinked]);

const robotsTxt = path.join(OUT, 'robots.txt');
note('ERROR', 'robots.txt missing', fs.existsSync(robotsTxt) ? [] : ['out/robots.txt']);
if (fs.existsSync(robotsTxt)) {
  const r = fs.readFileSync(robotsTxt, 'utf-8');
  note('ERROR', 'robots.txt does not reference the sitemap', /Sitemap:/i.test(r) ? [] : [r.trim().slice(0, 80)]);
  note('ERROR', 'robots.txt disallows everything', /Disallow:\s*\/\s*$/m.test(r) ? [r.trim()] : []);
}

const withSchema = pages.filter((p) => /application\/ld\+json/.test(p.html));
note('WARN', 'structured data (JSON-LD) coverage',
  withSchema.length === 0 ? ['0 of ' + pages.length + ' pages carry any JSON-LD'] : []);

note('ERROR', 'pages missing html lang', pages.filter((p) => !/<html[^>]+lang=/i.test(p.html)).map((p) => p.url));
note('ERROR', 'pages missing viewport meta', pages.filter((p) => !/name="viewport"/i.test(p.html)).map((p) => p.url));

const CAP = 12;
let errors = 0, warns = 0;
console.log('\nSEO audit - ' + pages.length + ' built pages (' + indexable.length +
  ' indexable, ' + (pages.length - indexable.length) + ' noindex)\n');
for (const { sev, label, items } of problems) {
  if (!items.length) continue;
  if (sev === 'ERROR') errors += items.length;
  else if (sev === 'WARN') warns += items.length;
  const mark = sev === 'ERROR' ? '[!]' : sev === 'WARN' ? '[~]' : '[i]';
  console.log(mark + ' ' + label + ': ' + items.length);
  items.slice(0, CAP).forEach((i) => console.log('      ' + i));
  if (items.length > CAP) console.log('      ... and ' + (items.length - CAP) + ' more');
  console.log('');
}
const clean = problems.filter((p) => !p.items.length).map((p) => p.label);
console.log('Passed with nothing to report (' + clean.length + '):');
clean.forEach((c) => console.log('      ok  ' + c));
console.log('\nTotals: ' + errors + ' error-level, ' + warns + ' warning-level\n');
