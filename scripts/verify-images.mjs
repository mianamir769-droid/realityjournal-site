#!/usr/bin/env node
/**
 * Checks that each imported post's first embedded image URL actually
 * resolves (some source domains, notably the origin site's own
 * wp-content/uploads host, can go offline independently of the post
 * content itself). Writes src/lib/verifiedImages.json: a map of
 * slug -> true for every post whose first image responded with 200 OK.
 *
 * Re-run this periodically (image hosts can go up/down) and before
 * deploying, since getHomepageData() only selects from this verified set.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'verifiedImages.json');

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
for (const f of files) {
  const post = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8'));
  // Drafts never reach the build, so verifying their images wastes requests
  // against the origin and can promote a draft into the image-led widgets.
  if (post.status !== 'publish') continue;
  const img = extractFirstImage(post.contentHtml);
  if (img) candidates.push({ slug: post.slug, img });
}

console.log(`Checking ${candidates.length} candidate image URLs...`);

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
