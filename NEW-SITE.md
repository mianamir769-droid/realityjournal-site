# Starting a new site from this codebase

This project is the reference build. Each additional site is its own folder,
its own GitHub repo, its own Vercel project, its own email. Nothing is shared
at runtime — only the code is copied.

Paste the block at the bottom into a **new chat** to kick one off.

---

## What I need from you

1. **Site name** (e.g. `Orbit Posts`)
2. **WordPress export** — full path to the `.xml` file
   (WP admin → Tools → Export → All content)
3. **Contact email** for that site
4. **Domain** it will live on (or "Vercel subdomain for now")
5. **GitHub repo name** and which GitHub account owns it
6. **Colour** — say "give me palettes" and pick one, or supply hex codes

## What happens, in order

1. Copy this folder to `E:\<new-site-folder>`, delete `.git`, `node_modules`,
   `.next`, `out`, and `src/content/posts/*`
2. `npm install`
3. Import the content:
   `node scripts/import-wxr.mjs "C:\path\to\export.xml"`
4. Check which embedded images actually load (many are hotlinked and dead):
   `node scripts/verify-images.mjs`
5. Regenerate the header/sidebar widget data:
   `node scripts/generate-widget-data.mjs`
6. Edit `src/lib/siteConfig.js` — name, email, domain, jurisdiction, year
7. Apply the chosen palette — see below
8. `npm run build` (sitemap + robots.txt are generated automatically)
9. `git init`, set **repo-local** identity so the right GitHub account is used:
   ```
   git config --local user.email "<that site's email>"
   git config --local credential.useHttpPath true
   ```
10. Commit, create a **private** GitHub repo, push, connect Vercel

## Changing the colours

Two steps, and that is genuinely all.

**1.** Edit the four brand variables at the top of
`src/styles/elora/utils/_colors.scss`:

```scss
$brand-1: #e64284;        // gradient start - keep dark enough for white text
$brand-2: #ff623b;        // gradient end
$brand-accent-1: #ea4c92; // flat accent fill
$brand-accent-2: #f65550;
```

**2.** Run:

```
node scripts/generate-favicon.mjs
```

That rewrites the favicon and retints the brand-gradient icons — the only
files that need a literal hex, because a browser loads them standalone and
they cannot read CSS variables.

Everything else follows automatically: logo, buttons, links, badges, hover
states, headings, underlines, the checkmark icon. There are no brand hex
values anywhere else in the codebase. To confirm after a swap:

```
grep -rin "<old-hex-1>\|<old-hex-2>" src/ public/
```

should return nothing.

## Things that are deliberate — don't "fix" them

- Posts live at **root-level URLs** (`/some-post`, not `/blog/some-post`) to
  match the original WordPress permalinks and keep backlinks working.
- Vendor JS loads `beforeInteractive`; theme JS loads **after hydration** via
  `_app.js`. Moving theme scripts earlier reintroduces hydration mismatches.
- Interior pages use `Layout header={2}` (in-flow). `header={1}` is absolute
  and is only correct on the homepage hero.
- `output: 'export'` stays on for dev too — scoping it to production broke
  dev hydration.
- Cards render **no image** rather than a placeholder when a post has no
  verified image.
- Rank Math SEO fields (`seoTitle`, `seoDescription`, canonical, robots) are
  imported and take priority over anything generated.

## Still open on every site

- Legal pages are boilerplate — have them reviewed.
- Newsletter falls back to `mailto:` until
  `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` is set in Vercel.
- Confirm the theme licence covers each additional live site.

---

## Paste this into a new chat

```
New site from my existing Next.js blog codebase.

Reference build: E:\My-NextJS-Core-Blog  (read NEW-SITE.md there first)

Site name:     <name>
WP export:     <full path to .xml>
Contact email: <email>
Domain:        <domain or "vercel subdomain for now">
GitHub repo:   <repo name> under <account>
Colour:        <"suggest palettes" or hex codes>

Copy the reference build to a new folder, import the content, apply the
config and palette, build, and set up git with repo-local credentials.
Follow the deliberate-decisions list in NEW-SITE.md.
```
