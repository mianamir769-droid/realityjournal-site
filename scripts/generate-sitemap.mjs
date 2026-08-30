#!/usr/bin/env node
/**
 * Writes out/sitemap.xml and out/robots.txt after `next build`.
 *
 * Runs as an npm `postbuild` step, so it always reflects the pages that were
 * actually exported - it walks out/ rather than guessing routes.
 *
 * SITE_URL in src/lib/siteConfig.js must point at the real domain for these
 * to be usable; the script refuses to emit a sitemap full of example.com URLs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'out');
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

const cfgSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'siteConfig.js'), 'utf-8');
const SITE_URL = (cfgSource.match(/export const SITE_URL\s*=\s*["']([^"']+)["']/) || [])[1] || '';

if (!fs.existsSync(OUT)) {
  console.error('out/ not found - run the build first.');
  process.exit(1);
}

if (!SITE_URL || SITE_URL.includes('example.com')) {
  console.warn(
    '\n  ! SITE_URL is still a placeholder in src/lib/siteConfig.js.\n' +
      '    Skipping sitemap.xml (a sitemap of example.com URLs is worse than none).\n' +
      '    Set your real domain and rebuild to generate it.\n'
  );
  // robots.txt is still worth writing, just without a Sitemap: line.
  fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n', 'utf-8');
  console.log('  Wrote out/robots.txt (no Sitemap line yet)');
  process.exit(0);
}

const base = SITE_URL.replace(/\/$/, '');

// Last-modified dates come from the post data, so article URLs carry a real
// <lastmod> rather than the build timestamp.
const postDates = new Map();
// Slugs deliberately excluded from search (see the noindex rule in
// src/pages/[slug].js): empty untitled drafts, and anything Rank Math marked
// noindex. Listing a noindexed URL in the sitemap sends mixed signals.
const excluded = new Set();
if (fs.existsSync(POSTS_DIR)) {
  for (const f of fs.readdirSync(POSTS_DIR)) {
    if (!f.endsWith('.json')) continue;
    try {
      const p = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8'));
      if (p.noindex || !p.title || !String(p.title).trim()) excluded.add(p.slug);
      const d = new Date(p.date);
      if (!Number.isNaN(d.getTime())) postDates.set(p.slug, d.toISOString().slice(0, 10));
    } catch {
      /* skip unreadable post */
    }
  }
}

const urls = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_next') continue;
      walk(full);
    } else if (entry.name.endsWith('.html') && entry.name !== '404.html') {
      let rel = path.relative(OUT, full).split(path.sep).join('/');
      rel = rel.replace(/index\.html$/, '').replace(/\.html$/, '');
      const slug = rel.replace(/\/$/, '');
      if (excluded.has(slug)) continue;
      const loc = rel === '' ? `${base}/` : `${base}/${rel}`;
      urls.push({ loc, lastmod: postDates.get(slug) });
    }
  }
})(OUT);

urls.sort((a, b) => a.loc.localeCompare(b.loc));

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>`)
    .join('\n') +
  '\n</urlset>\n';

fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml, 'utf-8');
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`, 'utf-8');

console.log(`  Wrote out/sitemap.xml (${urls.length} URLs) and out/robots.txt`);
