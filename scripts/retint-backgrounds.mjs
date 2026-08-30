// ---------------------------------------------------------------------------
// Retint the decorative watercolour backgrounds to the brand hue.
//
// These four files are raster images baked into the theme, so unlike every
// other brand surface they cannot read the --tc-brand-* CSS variables. The
// stock artwork is a warm peach wash, which only looked right while the brand
// was pink/orange. Run this after changing the palette:
//
//     node scripts/retint-backgrounds.mjs
//
// Pristine copies are kept in page/.orig/ and are always the input, so the
// script is safe to re-run and never rotates an already-rotated image.
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pageDir = path.join(root, 'public/assets/imgs/page');
const origDir = path.join(pageDir, '.orig');

// Only the backgrounds the app actually renders. Keep in sync with
// src/components/home1/Sec{1,3,4,7}.js.
const FILES = [
  'bg-home1-sec1.webp',
  'bg-home1-sec3.webp',
  'bg-home1-sec4.webp',
  'bg-home1-sec7.webp',
];

function hueOf(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d === 0) return null;
  let h;
  if (mx === r) h = ((g - b) / d) % 6;
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

// Target hue comes from the brand gradient, so a future palette swap needs no
// edit here - only a re-run.
function brandHue() {
  const scss = fs.readFileSync(
    path.join(root, 'src/styles/elora/utils/_colors.scss'), 'utf8');
  const pats = [/\$brand-1:\s*#([0-9a-fA-F]{6})/, /\$brand-2:\s*#([0-9a-fA-F]{6})/];
  const hexes = pats.map((re) => {
    const m = scss.match(re);
    if (!m) throw new Error('could not read brand colours from _colors.scss');
    return m[1];
  });
  const hues = hexes.map((h) => hueOf(
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16)));
  // Circular mean, so a gradient straddling 0deg still averages sensibly.
  const x = hues.reduce((a, h) => a + Math.cos(h * Math.PI / 180), 0);
  const y = hues.reduce((a, h) => a + Math.sin(h * Math.PI / 180), 0);
  let h = Math.atan2(y, x) * 180 / Math.PI;
  return h < 0 ? h + 360 : h;
}

// Dominant hue of the artwork, ignoring the near-grey pixels that make up most
// of a pale wash and would otherwise swamp the histogram.
async function dominantHue(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const bins = new Array(36).fill(0);
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if ((Math.max(r, g, b) - Math.min(r, g, b)) / 255 < 0.04) continue;
    const h = hueOf(r, g, b);
    if (h !== null) bins[Math.floor(h / 10) % 36]++;
  }
  const top = bins.indexOf(Math.max(...bins));
  return top * 10 + 5;
}

const target = brandHue();
console.log(`  Brand hue: ${target.toFixed(0)}deg`);

fs.mkdirSync(origDir, { recursive: true });

for (const name of FILES) {
  const live = path.join(pageDir, name);
  const orig = path.join(origDir, name);
  if (!fs.existsSync(orig)) {
    if (!fs.existsSync(live)) { console.log(`  skip ${name} (missing)`); continue; }
    fs.copyFileSync(live, orig);
  }
  const from = await dominantHue(orig);
  const delta = Math.round(((target - from) % 360 + 360) % 360);
  const buf = await sharp(orig).modulate({ hue: delta }).webp({ quality: 88 }).toBuffer();
  fs.writeFileSync(live, buf);
  console.log(`  ${name}: ${from.toFixed(0)}deg -> ${target.toFixed(0)}deg (rotate ${delta}deg)`);
}

console.log(`  Retinted ${FILES.length} background(s). Originals kept in page/.orig/`);
