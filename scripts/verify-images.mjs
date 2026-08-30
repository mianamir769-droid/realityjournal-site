#!/usr/bin/env node
/**
 * Checks that each imported post's first embedded image URL actually
 * resolves, and writes src/lib/verifiedImages.json - the set of posts the
 * site is allowed to show a cover image for. getHomepageData() and the
 * sidebar widgets only ever select from this set.
 *
 * Two rules, both deliberate:
 *
 *   1. The image must live on this site's own domain. Imported WordPress
 *      bodies are full of images hotlinked from wherever the original author
 *      found them - stock libraries, Pinterest, other people's blogs. Those
 *      resolve fine, so a liveness check alone happily promotes them onto
 *      the homepage, which means publishing photographs under this domain
 *      with no licence to them, from servers that can block or delete at any
 *      time. Off-domain images are refused however healthy they look.
 *
 *   2. It must respond 200. The origin's own uploads host can go offline
 *      independently of the post content.
 *
 * So a site whose images have not been migrated yet correctly ends up with
 * none, and renders text-only cards rather than borrowed photography. Re-run
 * this once the real images are in place and they get picked up.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'verifiedImages.json');

const SITE_URL = (
  fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'siteConfig.js'), 'utf-8')
    .match(/export const SITE_URL\s*=\s*["']([^"']+)["']/) || []
)[1] || '';

// Host comparison ignores a leading www., so an image on realityjournal.co.uk
// still counts when SITE_URL is the www form.
const bareHost = (u) => {
  try { return new URL(u).host.replace(/^www\./, '').toLowerCase(); } catch { return null; }
};
const SITE_HOST = bareHost(SITE_URL);

function isOwnDomain(url) {
  const host = bareHost(url);
  return Boolean(host && SITE_HOST && host === SITE_HOST);
}

function extractFirstImage(html) {
  const match = String(html || '').match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

async function checkUrl(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal, redirect: 'follow' });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));
const candidates = [];
let offDomain = 0;
for (const f of files) {
  const post = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8'));
  // Drafts never reach the build, so verifying their images wastes requests
  // against the origin and can promote a draft into the image-led widgets.
  if (post.status !== 'publish') continue;
  const img = extractFirstImage(post.contentHtml);
  if (!img) continue;
  if (!isOwnDomain(img)) { offDomain++; continue; }
  candidates.push({ slug: post.slug, img });
}

console.log(`Skipped ${offDomain} post(s) whose first image is hosted off-domain.`);
console.log(`Checking ${candidates.length} candidate image URLs on ${SITE_HOST}...`);

const CONCURRENCY = 8;
const results = {};
let i = 0;
async function worker() {
  while (i < candidates.length) {
    const { slug, img } = candidates[i++];
    const ok = await checkUrl(img);
    results[slug] = ok;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${slug} (${new URL(img).host})`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const verifiedSlugs = Object.entries(results)
  .filter(([, ok]) => ok)
  .map(([slug]) => slug);

fs.writeFileSync(OUT_FILE, JSON.stringify(verifiedSlugs, null, 2), 'utf-8');
console.log(`\n${verifiedSlugs.length}/${candidates.length} images verified. Wrote ${path.relative(process.cwd(), OUT_FILE)}`);
