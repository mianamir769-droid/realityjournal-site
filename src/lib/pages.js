import fs from 'node:fs';
import path from 'node:path';

// Standalone WordPress pages imported by scripts/import-wxr.mjs - the ones
// the codebase does not build itself. They live at the same root-level URLs
// as posts (/write-for-us/), so src/pages/[slug].js serves both and asks
// here first whether a slug belongs to a page.
const PAGES_DIR = path.join(process.cwd(), 'src', 'content', 'pages');

export function getAllPageSlugs() {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

export function getPageBySlug(slug) {
  const file = path.join(PAGES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
