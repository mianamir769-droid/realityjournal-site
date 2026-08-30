/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produces the static `out/` directory that Vercel serves. Kept on for
  // dev too: scoping it to production only was tried and made `next dev`
  // stop hydrating pages altogether, which is worse than the dev-only
  // "Unexpected end of JSON input" warning it was meant to silence.
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
