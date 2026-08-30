/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produces the static `out/` directory that Vercel serves. Kept on for
  // dev too: scoping it to production only was tried and made `next dev`
  // stop hydrating pages altogether, which is worse than the dev-only
  // "Unexpected end of JSON input" warning it was meant to silence.
  output: 'export',
  // The WordPress site these URLs come from served every page with a trailing
  // slash, and the whole point of the migration is that existing links keep
  // resolving. This makes the export write out/<slug>/index.html and makes
  // next/link emit hrefs that match. vercel.json redirects the unslashed form.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
