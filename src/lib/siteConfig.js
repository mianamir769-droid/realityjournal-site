// Single place for the site-wide facts that appear across the legal pages,
// contact page, and newsletter form.
//
// >>> EDIT THESE BEFORE GOING LIVE <<<
// The legal pages below are generic boilerplate, not legal advice - have
// them reviewed, and make sure every value here is accurate for you.
export const SITE_NAME = "Reality Journal";

// Used in the legal pages, the contact page, and as the fallback target for
// newsletter signups until a newsletter provider is configured below.
export const CONTACT_EMAIL = "realityjournal.co.uk@gmail.com";

// Canonical URL of the deployed site (no trailing slash). Drives canonical
// tags, og:url, and sitemap.xml.
//
// Taken from the WordPress export's own base_site_url, since the point of
// this migration is to keep the existing URLs (and the backlinks pointing at
// them) working. If you launch on a Vercel subdomain first, set that here
// instead and switch it over when the domain is pointed - canonicals that
// name a domain the site isn't served from will confuse search engines.
export const SITE_URL = "https://www.realityjournal.co.uk";

// Country/state whose law governs the terms.
// TODO: set this to your actual jurisdiction.
export const JURISDICTION = "Pakistan";

// Year in the footer copyright line. Hardcoded rather than computed from
// `new Date()`: this is a static export, so a computed year would be baked
// in at build time on the server but recomputed in the browser, which turns
// into a hydration mismatch the moment the year rolls over.
export const COPYRIGHT_YEAR = "2026";

// Date shown as "last updated" on the legal pages. Hardcoded on purpose:
// it must reflect when the text last actually changed, not the build date.
export const LEGAL_LAST_UPDATED = "30 August 2026";

// Where the newsletter form POSTs. The site is a static export, so it has
// no backend of its own - this must point at a form/newsletter service that
// accepts a cross-origin POST (Formspree, Buttondown, ConvertKit, Mailchimp,
// a Google Form endpoint, or your own API).
//
// Set it in Vercel (Project > Settings > Environment Variables) and in a
// local .env.local file as:
//   NEXT_PUBLIC_NEWSLETTER_ENDPOINT=https://formspree.io/f/xxxxxxx
// Until it's set the form tells the visitor signup isn't available rather
// than silently swallowing their address.
export const NEWSLETTER_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || "";
