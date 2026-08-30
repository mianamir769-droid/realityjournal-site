import Head from "next/head";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

// Per-page <head> tags. Kept in one component so every route emits the same
// set: title, meta description, canonical, Open Graph / Twitter cards, and
// the JSON-LD entity graph.
//
// Canonicals and og:url are built from SITE_URL in src/lib/siteConfig.js -
// they are only correct once that points at the real domain.
export default function Seo({
  title,
  description,
  path = "/",
  canonical,
  noindex = false,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  breadcrumbs,
  schemaType,
}) {
  // Rank Math titles are already written as complete search-result titles
  // (many end in "| Brand" themselves), so they're used verbatim rather than
  // having the site name appended a second time.
  const alreadyBranded = typeof title === "string" && title.includes(SITE_NAME);
  const fullTitle = title === SITE_NAME || alreadyBranded ? title : `${title} | ${SITE_NAME}`;
  // WordPress exports dates as "2024-09-15 14:49:07". schema.org and
  // article:published_time both want ISO 8601, so the space form is
  // normalised here rather than shipped as-is.
  const toIso = (d) => {
    if (!d) return undefined;
    const parsed = new Date(String(d).includes("T") ? d : String(d).replace(" ", "T") + "Z");
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  };
  const published = toIso(publishedTime);
  const modified = toIso(modifiedTime) || published;

  // A canonical carried over from Rank Math wins - a handful of posts point
  // at a different URL on purpose, and overriding that would undo it.
  // Canonicals have to carry the trailing slash the site is actually served
  // on (see trailingSlash in next.config.mjs), or every page would name a URL
  // that redirects to the real one.
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  const url = canonical || `${SITE_URL}${withSlash}`;

  // One connected graph rather than a pile of loose objects: every node has a
  // stable @id and references the others, so a crawler can tell that this
  // article, this site and this publisher are the same three entities on
  // every page of the site.
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/apple-touch-icon.png`,
        width: 180,
        height: 180,
      },
    },
    {
      "@type": "WebSite",
      "@id": siteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { "@id": orgId },
      inLanguage: "en-GB",
    },
  ];

  if (schemaType === "article") {
    graph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      isPartOf: { "@id": siteId },
      publisher: { "@id": orgId },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: title,
      ...(description ? { description } : {}),
      ...(image ? { image: [image] } : {}),
      ...(published ? { datePublished: published } : {}),
      // Falls back to the publish date: an imported post has never been
      // edited here, so claiming a later modified date would be untrue.
      ...(modified ? { dateModified: modified } : {}),
      ...(author ? { author: { "@type": "Person", name: author } } : {}),
      inLanguage: "en-GB",
    });
  } else {
    graph.push({
      "@type": schemaType === "collection" ? "CollectionPage" : "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: fullTitle,
      ...(description ? { description } : {}),
      isPartOf: { "@id": siteId },
      inLanguage: "en-GB",
    });
  }

  if (breadcrumbs && breadcrumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url.startsWith("http") ? b.url : `${SITE_URL}${b.url}`,
      })),
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

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
      {published && <meta property="article:published_time" content={published} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}

      {/* Not emitted on noindex pages: describing a page as an entity while
          asking search engines to ignore it sends two opposite signals. */}
      {!noindex && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
