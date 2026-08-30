import { SITE_NAME } from "@/lib/siteConfig";

// The theme ships its wordmark as an SVG of vector paths spelling "Elora",
// so it can't just have its text swapped. This renders the site name as
// styled text instead, using the theme's own brand gradient (.text-linear),
// so it re-colours automatically with the palette - no per-site logo file.
//
// Swap this whole component for an <img> if you later have a real logo file.
export default function SiteLogo({ className = "", size = 26 }) {
  return (
    <span
      className={`text-linear fw-bold ${className}`}
      style={{ fontSize: size, lineHeight: 1.1, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}
    >
      {SITE_NAME}
    </span>
  );
}
