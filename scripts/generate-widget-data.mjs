#!/usr/bin/env node
/**
 * Generates a small, real-content snapshot for global site-chrome widgets
 * that appear on every page (the header's search-popup "Spotlight" list,
 * the off-canvas sidebar's trending list) - these are plain components, not
 * pages, so they can't call getStaticProps/fs directly without breaking the
 * client bundle. Re-run this after re-running scripts/import-wxr.mjs or
 * scripts/verify-images.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const VERIFIED_FILE = path.join(__dirname, '..', 'src', 'lib', 'verifiedImages.json');
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'widgetData.json');

function extractFirstImage(html) {
  const match = String(html || '').match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function primaryCategory(categories) {
  const real = (categories || []).find((c) => c.toLowerCase() !== 'uncategorized');
  return real || 'Blog';
}

const verifiedSlugs = new Set(fs.existsSync(VERIFIED_FILE) ? JSON.parse(fs.readFileSync(VERIFIED_FILE, 'utf-8')) : []);

// Published only. The widgets render into every page's sidebar, so featuring
// a draft here put a link to a page the build does not generate on all 517
// pages at once. src/lib/posts.js applies the same filter.
const allPosts = fs
  .readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8')))
  .filter((p) => p.status === 'publish')
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Verified-image posts first (so the widgets show real photos where
// possible), then any other real post - those just render without a photo.
const withImage = allPosts.filter((p) => verifiedSlugs.has(p.slug));
const withoutImage = allPosts.filter((p) => !verifiedSlugs.has(p.slug));
const posts = [...withImage, ...withoutImage];

function toCard(p) {
  return {
    img: verifiedSlugs.has(p.slug) ? extractFirstImage(p.contentHtml) : null,
    linkPost: `/${p.slug}/`,
    category: primaryCategory(p.categories),
    title: p.title,
    date: formatDate(p.date),
  };
}

const spotlight = posts.slice(0, 4).map(toCard);
const trending = posts.slice(4, 8).map(toCard);

const tagCounts = new Map();
for (const p of allPosts) {
  for (const tag of p.tags || []) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
}
const tags = [...tagCounts.keys()].slice(0, 9);

function categorySlug(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Top categories for the footer column. The footer renders on every page as
// a plain component, so it can't call getStaticProps and needs this
// build-time snapshot.
const catCounts = new Map();
for (const p of allPosts) {
  for (const cat of p.categories || []) {
    if (cat.toLowerCase() === 'uncategorized') continue;
    catCounts.set(cat, (catCounts.get(cat) || 0) + 1);
  }
}
const categories = [...catCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4)
  .map(([name, count]) => ({ name, slug: categorySlug(name), count }));

fs.writeFileSync(OUT_FILE, JSON.stringify({ spotlight, trending, tags, categories }, null, 2), 'utf-8');
console.log(
  `Wrote ${path.relative(process.cwd(), OUT_FILE)}: ${spotlight.length} spotlight, ${trending.length} trending, ${tags.length} tags, ${categories.length} categories`
);
