import fs from 'node:fs';
import path from 'node:path';
import { extractFirstImage, estimateReadTime, getExcerpt, categorySlug } from './postFormat.js';
import verifiedImageSlugs from './verifiedImages.json' with { type: 'json' };

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts');
const VERIFIED_IMAGE_SLUGS = new Set(verifiedImageSlugs);

export function getAllPostSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

export function getPostBySlug(slug) {
  const file = path.join(POSTS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const post = JSON.parse(fs.readFileSync(file, 'utf-8'));
  // Only set on posts whose first image passed scripts/verify-images.mjs -
  // the single-post page renders no cover image at all when this is null,
  // rather than a broken hotlink or the old generic stock placeholder.
  post.coverImage = VERIFIED_IMAGE_SLUGS.has(post.slug) ? extractFirstImage(post.contentHtml) : null;
  return post;
}

// Memoized: with 1000+ posts, getStaticProps runs once per page across a
// handful of worker processes, and each worker would otherwise re-read
// every post file for every page it builds.
let allPostsCache = null;
export function getAllPosts() {
  if (allPostsCache) return allPostsCache;
  allPostsCache = getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return allPostsCache;
}

// Aggregate categories/tags across all posts for the sidebar's Categories
// and Tags widgets (real counts from the actual imported content, not the
// theme's placeholder numbers). "Uncategorized" is WordPress's default
// bucket for posts nobody assigned a real category to, not a real topic, so
// it's excluded everywhere this is used.
export function getCategoryCounts(limit = 6) {
  const counts = new Map();
  for (const post of getAllPosts()) {
    for (const cat of post.categories || []) {
      if (cat.toLowerCase() === 'uncategorized') continue;
      counts.set(cat, (counts.get(cat) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function getAllTags(limit = 9) {
  const seen = new Set();
  for (const post of getAllPosts()) {
    for (const tag of post.tags || []) {
      seen.add(tag);
      if (seen.size >= limit) break;
    }
    if (seen.size >= limit) break;
  }
  return [...seen];
}

// Other posts for the sidebar's "related"/"recent" widgets: prefer posts
// sharing a category with the current one, then fill with the most recent
// remaining posts.
export function getRelatedPosts(post, limit = 5) {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => (p.categories || []).some((c) => (post.categories || []).includes(c)));
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit).map(toSummary);
}

export const POSTS_PER_PAGE = 24;

// Every real category, most-used first. Drives /category/<slug> routes, the
// homepage's topic tiles, and the archive listings.
export function getAllCategories() {
  const counts = new Map();
  for (const post of getAllPosts()) {
    for (const cat of post.categories || []) {
      if (cat.toLowerCase() === 'uncategorized') continue;
      counts.set(cat, (counts.get(cat) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, slug: categorySlug(name), count }));
}

export function getCategoryBySlug(slug) {
  return getAllCategories().find((c) => c.slug === slug) || null;
}

export function getPostsInCategory(name) {
  return getAllPosts().filter((p) => (p.categories || []).includes(name));
}

// Slices a post list into one page of card summaries plus the paging info
// the Pagination component needs. Pages are 1-indexed.
export function paginate(posts, page, perPage = POSTS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    posts: posts.slice(start, start + perPage).map(toSummary),
    page: current,
    totalPages,
    totalPosts: posts.length,
  };
}

// Homepage cards only ever need a handful of fields, never the full
// article body - shipping full contentHtml (often tens of KB per post) to
// the client for ~29 homepage cards bloats the page's hydration payload for
// no reason, so this trims each post down before it leaves getHomepageData.
//
// img is only set for posts whose first image passed scripts/verify-images.mjs
// (many embedded images are hotlinked from other sites and can be offline or
// hotlink-blocked) - everywhere else, cards render without a photo rather
// than a broken image or a repeated generic stock placeholder.
function toSummary(post) {
  return {
    slug: post.slug,
    title: post.title,
    author: post.author,
    date: post.date,
    categories: post.categories,
    img: VERIFIED_IMAGE_SLUGS.has(post.slug) ? extractFirstImage(post.contentHtml) : null,
    readTime: estimateReadTime(post.contentHtml),
    excerpt: getExcerpt(post.contentHtml),
  };
}

// Slices real posts into the homepage's various sections (hero swiper,
// "written lately", top author spotlight, etc.), keeping each post unique
// across the page rather than repeating the same handful everywhere.
//
// Posts with a verified working image are placed first within each section
// (so they surface in the most visible slots, e.g. the whole hero swiper),
// then remaining slots are filled with the next most recent real posts
// regardless of image - those cards just render without a photo.
export function getHomepageData() {
  const all = getAllPosts();
  const withVerifiedImage = all.filter((p) => VERIFIED_IMAGE_SLUGS.has(p.slug));
  const withoutVerifiedImage = all.filter((p) => !VERIFIED_IMAGE_SLUGS.has(p.slug));
  const prioritized = [...withVerifiedImage, ...withoutVerifiedImage];
  const used = new Set();

  function take(n) {
    const out = [];
    for (const p of prioritized) {
      if (used.has(p.slug)) continue;
      out.push(p);
      used.add(p.slug);
      if (out.length >= n) break;
    }
    return out;
  }

  const hero = take(6);
  const writtenLately = take(2);
  const mostComments = take(4);
  const secondRow = take(3);

  const authorCounts = new Map();
  for (const p of all) {
    if (!p.author) continue;
    authorCounts.set(p.author, (authorCounts.get(p.author) || 0) + 1);
  }
  const topAuthorEntry = [...authorCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const topAuthorName = topAuthorEntry ? topAuthorEntry[0] : null;
  const topAuthorCount = topAuthorEntry ? topAuthorEntry[1] : 0;
  let topAuthorPosts = topAuthorName
    ? prioritized.filter((p) => p.author === topAuthorName && !used.has(p.slug)).slice(0, 3)
    : [];
  if (topAuthorPosts.length < 3) topAuthorPosts = [...topAuthorPosts, ...take(3 - topAuthorPosts.length)];
  topAuthorPosts.forEach((p) => used.add(p.slug));

  const editorsChoice = take(8);
  const [latestFeatured] = take(1);
  const latestGrid = take(4);

  // Category tiles are photo tiles by design (no text-only variant), so
  // only list categories that have a verified-image representative.
  const categories = getCategoryCounts(50)
    .map((c) => {
      const rep = withVerifiedImage.find((p) => (p.categories || []).includes(c.name));
      return rep ? { ...c, img: extractFirstImage(rep.contentHtml) } : null;
    })
    .filter(Boolean)
    .slice(0, 12);

  return {
    hero: hero.map(toSummary),
    writtenLately: writtenLately.map(toSummary),
    mostComments: mostComments.map(toSummary),
    secondRow: secondRow.map(toSummary),
    topAuthorName,
    topAuthorCount,
    topAuthorPosts: topAuthorPosts.map(toSummary),
    editorsChoice: editorsChoice.map(toSummary),
    latestFeatured: latestFeatured ? toSummary(latestFeatured) : null,
    latestGrid: latestGrid.map(toSummary),
    categories,
  };
}
