import Head from "next/head";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

// Per-page <head> tags. Kept in one component so every route emits the same
// set: title, meta description, canonical, and Open Graph / Twitter cards.
//
// Canonicals and og:url are built from SITE_URL in src/lib/siteConfig.js -
// they are only correct once that points at the real domain.
export default function Seo({ title, description, path = "/", canonical, noindex = false, image, type = "website", publishedTime }) {
  // Rank Math titles are already written as complete search-result titles
  // (many end in "| Brand" themselves), so they're used verbatim rather than
  // having the site name appended a second time.
  const alreadyBranded = typeof title === "string" && title.includes(SITE_NAME);
  const fullTitle = title === SITE_NAME || alreadyBranded ? title : `${title} | ${SITE_NAME}`;
  // A canonical carried over from Rank Math wins - a handful of posts point
  // at a different URL on purpose, and overriding that would undo it.
  // Canonicals have to carry the trailing slash the site is actually served
  // on (see trailingSlash in next.config.mjs), or every page would name a URL
  // that redirects to the real one.
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  const url = canonical || `${SITE_URL}${withSlash}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, follow" />}
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
