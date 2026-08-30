// Pure formatting helpers with no node:fs/node:path dependency - safe to
// import from components that render client-side (unlike src/lib/posts.js,
// which reads from disk and must stay server-only).

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function estimateReadTime(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min${minutes === 1 ? '' : 's'} read`;
}

export function extractFirstImage(html) {
  const match = String(html || '').match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

export function getExcerpt(html, length = 140) {
  const text = String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}

export function getInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

// "Uncategorized" is WordPress's default bucket for posts nobody assigned a
// real category to - it's not a meaningful topic, so skip it when picking
// which category to display and fall back to the next real one.
export function primaryCategory(categories) {
  const real = (categories || []).find((c) => c.toLowerCase() !== 'uncategorized');
  return real || 'Blog';
}

// "Digital Marketing" -> "digital-marketing". Used for /category/<slug> URLs.
//
// "&" is dropped rather than expanded to "and", because that is what
// WordPress's own sanitize_title does and these URLs already exist: the live
// site serves /category/luck-astronomy/, so expanding would have published
// /category/luck-and-astronomy/ and orphaned the real one.
export function categorySlug(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Link target for a category name, or "#" when there's no real category to
// link to (a post whose only category was "Uncategorized").
export function categoryHref(name) {
  if (!name || name.toLowerCase() === 'uncategorized' || name === 'Blog') return '#';
  return `/category/${categorySlug(name)}/`;
}
