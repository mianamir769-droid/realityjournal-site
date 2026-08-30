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
const PAGES_DIR = path.join(__dirname, '..', 'src', 'content', 'pages');

// Read out of siteConfig.js as text rather than imported: this script runs
// under plain node, outside Next's "@/" alias resolution.
const SITE_URL = (
  fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'siteConfig.js'), 'utf-8')
    .match(/export const SITE_URL\s*=\s*["']([^"']+)["']/) || []
)[1] || '';

const SITE_NAME = (
  fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'siteConfig.js'), 'utf-8')
    .match(/export const SITE_NAME\s*=\s*["']([^"']+)["']/) || []
)[1] || '';

// WordPress pages the codebase builds itself, from siteConfig rather than
// from imported markup. Importing these too would give every site two
// competing versions of the same URL.
const OWN_PAGES = new Set(['home', 'about', 'contact', 'privacy-policy', 'terms']);

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

// The named entities WordPress actually puts in titles and term names, plus
// numeric escapes. Deliberately not a general HTML decoder: this runs on
// plain-text fields (titles, categories, tags), never on post bodies, where
// an entity is markup and must survive untouched.
const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', hellip: '…',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
};
function decodeEntities(text) {
  let out = String(text || '');
  // Repeat: WordPress double-encodes some titles ("&amp;amp;").
  for (let i = 0; i < 3; i++) {
    const next = out.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body) => {
      if (body[0] === '#') {
        const code = body[1] === 'x' || body[1] === 'X'
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
        return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : whole;
      }
      const named = NAMED_ENTITIES[body.toLowerCase()];
      return named === undefined ? whole : named;
    });
    if (next === out) break;
    out = next;
  }
  return out;
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

// A handful of imported bodies open with their own <h1> repeating the post
// title. The page template already renders the title as the h1, so leaving
// these in gives the page two or more competing top-level headings. Demoted
// to h2, which is where they belong in the outline anyway.
function demoteInlineH1(html) {
  return String(html || '')
    .replace(/<h1(\s[^>]*)?>/gi, (m, attrs) => '<h2' + (attrs || '') + '>')
    .replace(/<\/h1>/gi, '</h2>');
}

// Imported bodies carry images hotlinked from wherever the original author
// found them - stock libraries, Pinterest, other people's blogs. Serving those
// under this domain publishes photographs with no licence to them, from
// servers that can block or delete at any time.
//
// Only off-domain images are removed. Images on the site's own domain are
// kept even when they are currently 404ing, because those are the ones that
// come back as soon as the real uploads are restored - deleting them would
// throw away the markup that makes that work.
//
// A figure is removed whole rather than leaving its caption orphaned.
function stripOffDomainImages(html) {
  const ownHost = (() => {
    try { return new URL(SITE_URL).host.replace(/^www\./, '').toLowerCase(); } catch { return null; }
  })();
  const isOwn = (src) => {
    try { return new URL(src).host.replace(/^www\./, '').toLowerCase() === ownHost; } catch { return false; }
  };
  const srcOf = (tag) => (tag.match(/src="([^"]+)"/) || [])[1] || '';

  return String(html || '')
    .replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, (block) => {
      const img = block.match(/<img\b[^>]*>/i);
      if (!img) return block;
      return isOwn(srcOf(img[0])) ? block : '';
    })
    .replace(/<img\b[^>]*>/gi, (tag) => (isOwn(srcOf(tag)) ? tag : ''));
}

function transformContent(raw) {
  const withCaptions = convertCaptionShortcodes(raw);
  return stripOffDomainImages(demoteInlineH1(wpautopLite(withCaptions)));
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

// Rank Math stores its title/description fields as templates, so a post that
// never had a custom title comes through as the literal string "%title%" or
// "Something %sep% %sitename%". Rendering that verbatim publishes "%title% |
// Reality Journal" as the page title, which is what 13 posts here were doing.
// Resolved against the post's own values; anything still holding an
// unresolved %variable% is discarded so the caller falls back to the real
// title.
function resolveRankMathVars(template, { title, siteName }) {
  if (!template) return null;
  const out = String(template)
    .replace(/%title%/gi, title || '')
    .replace(/%sitename%/gi, siteName || '')
    .replace(/%sep%/gi, '|')
    .replace(/%page%/gi, '')
    .replace(/%currentyear%/gi, String(new Date().getFullYear()))
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s|-]+|[\s|-]+$/g, '')
    .trim();
  if (!out || /%[a-z_]+(\([^)]*\))?%/i.test(out)) return null;
  return out;
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
const pages = [];

for (const item of items) {
  const postType = asText(item['wp:post_type']);

  // Standalone WordPress pages that the theme does not already provide. Only
  // published, indexable ones: a page Rank Math marked noindex is usually
  // theme demo filler the owner never removed, and republishing it under a
  // new domain is thin duplicate content.
  if (postType === 'page') {
    const pageSlug = slugify(asText(item['wp:post_name']));
    const robots = getMeta(item, 'rank_math_robots');
    if (
      asText(item['wp:status']) === 'publish' &&
      pageSlug &&
      !OWN_PAGES.has(pageSlug) &&
      !isNoindex(robots)
    ) {
      pages.push({
        slug: pageSlug,
        title: decodeEntities(asText(item.title)),
        date: asText(item['wp:post_date']) || asText(item.pubDate),
        link: asText(item.link),
        seoTitle: resolveRankMathVars(getMeta(item, 'rank_math_title'), { title: decodeEntities(asText(item.title)), siteName: SITE_NAME }),
        seoDescription: resolveRankMathVars(getMeta(item, 'rank_math_description'), { title: decodeEntities(asText(item.title)), siteName: SITE_NAME }),
        canonicalUrl: getMeta(item, 'rank_math_canonical_url'),
        contentHtml: transformContent(asText(item['content:encoded'])),
      });
    }
    continue;
  }

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

  // WordPress stores titles and term names with HTML entities already in
  // them ("Repair &amp; Installation"), and the XML parser hands that back
  // verbatim because it was inside CDATA. Rendering it as-is prints the raw
  // entity on the page, so it is decoded once here, at the boundary.
  const categories = [];
  const tags = [];
  for (const cat of toArray(item.category)) {
    const domain = cat?.['@_domain'];
    const name = asText(cat);
    if (!name) continue;
    if (domain === 'post_tag') tags.push(decodeEntities(name));
    // Anything else WordPress files under <category> - post_format ("Image",
    // "Aside", "Quote", "Link"), nav_menu, wp_theme - is machinery, not a
    // topic. Treating it as one produces category pages the old site never
    // had, carrying one or two posts each.
    else if (domain === 'category') categories.push(decodeEntities(name));
  }

  const rawContent = asText(item['content:encoded']);
  const rmVars = { title: decodeEntities(asText(item.title)), siteName: SITE_NAME };

  posts.push({
    slug,
    title: decodeEntities(asText(item.title)),
    status,
    date: asText(item['wp:post_date']) || asText(item.pubDate),
    author: asText(item['dc:creator']),
    link: asText(item.link),
    categories,
    tags,
    // Preserved Rank Math SEO fields (null when the post never had one set).
    seoTitle: resolveRankMathVars(getMeta(item, 'rank_math_title'), rmVars),
    seoDescription: resolveRankMathVars(getMeta(item, 'rank_math_description'), rmVars),
    canonicalUrl: getMeta(item, 'rank_math_canonical_url'),
    noindex: isNoindex(getMeta(item, 'rank_math_robots')),
    focusKeyword: getMeta(item, 'rank_math_focus_keyword'),
    contentHtml: transformContent(rawContent),
  });
}

fs.mkdirSync(OUT_DIR, { recursive: true });

// Two WordPress posts can carry the same post_name - usually the same article
// republished, as happened here 20 minutes apart. Only one of them can own the
// permalink, so the later copies get a suffixed slug, and are pointed back at
// the original with a canonical and kept out of the index: they are duplicate
// content, not a second article.
const seenSlugs = new Map();
for (const post of posts) {
  const original = post.slug;
  const count = seenSlugs.get(original) || 0;
  seenSlugs.set(original, count + 1);
  if (count > 0) {
    post.slug = `${original}-${count}`;
    post.duplicateOf = original;
    post.noindex = true;
  }
}

for (const post of posts) {
  const file = path.join(OUT_DIR, `${post.slug}.json`);
  fs.writeFileSync(file, JSON.stringify(post, null, 2), 'utf-8');
}

fs.mkdirSync(PAGES_DIR, { recursive: true });
for (const page of pages) {
  fs.writeFileSync(path.join(PAGES_DIR, `${page.slug}.json`), JSON.stringify(page, null, 2), 'utf-8');
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
console.log(`Imported ${pages.length} page(s) into ${path.relative(process.cwd(), PAGES_DIR)}:`, pages.map((p) => p.slug).join(', ') || '(none)');
