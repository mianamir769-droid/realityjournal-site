#!/usr/bin/env node
/**
 * Reusable WordPress WXR (Tools > Export) importer.
 *
 * Usage:
 *   node scripts/import-wxr.mjs "C:\path\to\export.xml"
 *
 * Reads every wp:post_type=post item (any status: publish/draft/pending),
 * converts its content:encoded body into rendering-ready HTML (WordPress's
 * own wpautop + [caption] shortcode behavior, replicated so the same raw
 * content displays the same way), and writes one JSON file per post into
 * src/content/posts/<slug>.json. Existing files for the same slug are
 * overwritten so this can be re-run safely.
 *
 * Nothing about the substance of a post (wording, links, image URLs) is
 * changed - only the paragraph/caption markup needed to render the raw
 * export content is added, mirroring what WordPress itself does at
 * display time.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/import-wxr.mjs <path-to-wxr-export.xml>');
  process.exit(1);
}

const xml = fs.readFileSync(inputPath, 'utf-8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false,
  trimValues: false,
});

const doc = parser.parse(xml);
let items = doc.rss.channel.item || [];
if (!Array.isArray(items)) items = [items];

function asText(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'object') {
    // fast-xml-parser resolves CDATA text nodes to the '#text' key
    // when the element also has attributes; otherwise it's a plain string.
    return String(v['#text'] ?? '');
  }
  return String(v);
}

// Convert `[caption id="..." align="..." width="123"]<img ...> Caption text[/caption]`
// into `<figure class="wp-caption"><img ... />Caption text</figure>`, same as
// WordPress's img_caption_shortcode handler.
function convertCaptionShortcodes(html) {
  const captionRe = /\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g;
  return html.replace(captionRe, (_match, inner) => {
    const imgMatch = inner.match(/<img[^>]*>/);
    const img = imgMatch ? imgMatch[0] : '';
    const captionText = inner.replace(/<img[^>]*>/, '').trim();
    return `<figure class="wp-caption">${img}${
      captionText ? `<figcaption class="wp-caption-text">${captionText}</figcaption>` : ''
    }</figure>`;
  });
}

const BLOCK_TAGS =
  'h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|div|figure|figcaption|table|thead|tbody|tr|td|th|pre|hr|iframe|script|style|p|section|article|form|nav|header|footer|aside';
// Matches a block starting with either an opening OR closing block-level
// tag, so a lone "</figure>" (left dangling after the open/close boundary
// pass splits a figure's contents into its own blocks) isn't mistakenly
// wrapped in a <p>.
const BLOCK_TAG_START_RE = new RegExp(`^\\s*</?(${BLOCK_TAGS})[\\s>]`, 'i');
const BLOCK_OPEN_RE = new RegExp(`\\s*<(${BLOCK_TAGS})([\\s>])`, 'gi');
const BLOCK_CLOSE_RE = new RegExp(`</(${BLOCK_TAGS})>\\s*`, 'gi');

// Minimal wpautop: same two-pass approach WordPress itself uses. First,
// force a blank-line boundary around every block-level tag regardless of
// how it was spaced in the raw content (this is the step naive "split on
// blank lines" implementations miss - a heading glued to the previous
// sentence with a single newline would otherwise get wrapped into that
// paragraph). Then split on blank lines: each block becomes <p>...</p>
// unless it's already a block-level element, and single newlines inside a
// block become <br />.
function wpautopLite(html) {
  const normalized = html
    .replace(/\r\n/g, '\n')
    .replace(BLOCK_OPEN_RE, '\n\n<$1$2')
    .replace(BLOCK_CLOSE_RE, '</$1>\n\n');

  const blocks = normalized
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      if (BLOCK_TAG_START_RE.test(block)) return block;
      const withBreaks = block.replace(/\n/g, '<br />\n');
      return `<p>${withBreaks}</p>`;
    })
    .join('\n');
}

function transformContent(raw) {
  const withCaptions = convertCaptionShortcodes(raw);
  return wpautopLite(withCaptions);
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toArray(v) {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

// The site used the Rank Math SEO plugin, so the export carries real
// hand-written SEO fields in wp:postmeta. These are worth preserving exactly:
// they are the descriptions and titles that search results have been showing.
function getMeta(item, key) {
  for (const m of toArray(item['wp:postmeta'])) {
    if (asText(m?.['wp:meta_key']) === key) {
      const v = asText(m?.['wp:meta_value']).trim();
      return v || null;
    }
  }
  return null;
}

// Rank Math stores robots directives as a serialized PHP array, e.g.
// a:1:{i:0;s:7:"noindex";}. We only care whether "noindex" is in there.
function isNoindex(serialized) {
  return typeof serialized === 'string' && /"noindex"/.test(serialized);
}

const posts = [];
for (const item of items) {
  const postType = asText(item['wp:post_type']);
  if (postType !== 'post') continue;

  const status = asText(item['wp:status']);
  let rawSlug = asText(item['wp:post_name']);
  try {
    rawSlug = decodeURIComponent(rawSlug);
  } catch {
    // leave as-is if it's not valid percent-encoding
  }
  // wp:post_name isn't always sanitized (e.g. pending/draft posts can carry
  // raw title text with punctuation), so always run it through slugify to
  // guarantee a filesystem/URL-safe slug.
  let slug = slugify(rawSlug);
  if (!slug) slug = slugify(asText(item.title)) || `post-${asText(item['wp:post_id'])}`;

  const categories = [];
  const tags = [];
  for (const cat of toArray(item.category)) {
    const domain = cat?.['@_domain'];
    const name = asText(cat);
    if (!name) continue;
    if (domain === 'post_tag') tags.push(name);
    else categories.push(name);
  }

  const rawContent = asText(item['content:encoded']);

  posts.push({
    slug,
    title: asText(item.title),
    status,
    date: asText(item['wp:post_date']) || asText(item.pubDate),
    author: asText(item['dc:creator']),
    link: asText(item.link),
    categories,
    tags,
    // Preserved Rank Math SEO fields (null when the post never had one set).
    seoTitle: getMeta(item, 'rank_math_title'),
    seoDescription: getMeta(item, 'rank_math_description'),
    canonicalUrl: getMeta(item, 'rank_math_canonical_url'),
    noindex: isNoindex(getMeta(item, 'rank_math_robots')),
    focusKeyword: getMeta(item, 'rank_math_focus_keyword'),
    contentHtml: transformContent(rawContent),
  });
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const seenSlugs = new Map();
for (const post of posts) {
  const count = seenSlugs.get(post.slug) || 0;
  seenSlugs.set(post.slug, count + 1);
  if (count > 0) post.slug = `${post.slug}-${count}`;
}

for (const post of posts) {
  const file = path.join(OUT_DIR, `${post.slug}.json`);
  fs.writeFileSync(file, JSON.stringify(post, null, 2), 'utf-8');
}

const dupes = [...seenSlugs.entries()].filter(([, n]) => n > 1);
if (dupes.length) {
  console.log(`Note: ${dupes.length} slug collisions were auto-suffixed (-1, -2, ...)`);
}

const byStatus = posts.reduce((acc, p) => {
  acc[p.status] = (acc[p.status] || 0) + 1;
  return acc;
}, {});

console.log(`Imported ${posts.length} posts into ${path.relative(process.cwd(), OUT_DIR)}`);
console.log('By status:', byStatus);
