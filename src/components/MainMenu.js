// Ported from Elora theme: src/views/partials/main-menu.html
// Trimmed to what this site actually has: one homepage template, no shop,
// no theme "Features" demo pages, no collections mega-menu.
//
// The theme's "Trending" item is gone rather than pointed somewhere: it
// implies a popularity ranking, and there's no analytics or view-count data
// behind this site to rank by. Categories replaces it, which is real.
export default function MainMenu() {
  return (
    <ul className="navbar-nav">
      <li className="nav-item">
        <a className="nav-link link-effect-1 " href="/">
          <span>Home</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link link-effect-1 " href="/latest/">
          <span>Latest</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link link-effect-1 " href="/category/">
          <span>Categories</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link link-effect-1 " href="/about/">
          <span>About</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link link-effect-1 " href="/contact/">
          <span>Contact</span>
        </a>
      </li>
    </ul>
  );
}
