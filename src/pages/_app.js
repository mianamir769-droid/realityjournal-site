import "@/styles/elora/main.scss";
import { useEffect } from "react";

// The theme's own scripts, as opposed to the vendor libraries in
// _document.js. These immediately mutate the React-rendered DOM (jQuery
// fading #preloader, painting data-background images, GSAP/AOS adding
// classes and inline styles, the sticky nav writing element.style.top), so
// they must not run until React has finished hydrating - otherwise the live
// DOM differs from the server HTML when React compares them, which is the
// "Hydration failed" error.
//
// They're injected here by hand rather than with next/script because that
// gives two guarantees together that no single next/script strategy does:
//   - runs strictly after hydration (useEffect), avoiding the mismatch that
//     beforeInteractive caused;
//   - runs in a guaranteed sequential order, which afterInteractive does not
//     promise (it loads in parallel, which is how gsap-custom.js ended up
//     executing before gsap.min.js had defined `gsap`).
// Vendor globals are already available, since _document.js loads those
// beforeInteractive.
const THEME_SCRIPTS = [
  "/assets/js/vendors/smart-stick-nav.js",
  "/assets/js/gsap-custom.js",
  "/assets/js/vendors/image-hover-effects.js",
  // Odometer lives here rather than with the vendor libraries because it is
  // not passive: on load it scans for `.odometer` elements and stamps an
  // `odometer-auto-theme` class onto them. Running that before hydration
  // rewrote server-rendered markup and produced a hydration mismatch on any
  // page with an odometer (the sidebar's category counts). Must stay ahead
  // of main.js, which calls into it.
  "/assets/js/vendors/jquery.odometer.min.js",
  "/assets/js/main.js",
];

const THEME_SCRIPT_MARKER = "data-elora-theme";

function loadScript(src) {
  return new Promise((resolve) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.setAttribute(THEME_SCRIPT_MARKER, "");
    // Resolve on error too: one missing theme script shouldn't stall the
    // rest of the chain.
    el.onload = resolve;
    el.onerror = resolve;
    document.body.appendChild(el);
  });
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Guard against React StrictMode's double-invoked effects in dev, which
    // would otherwise inject and re-run every theme script twice.
    if (document.querySelector(`script[${THEME_SCRIPT_MARKER}]`)) return;

    let cancelled = false;
    (async () => {
      for (const src of THEME_SCRIPTS) {
        if (cancelled) return;
        await loadScript(src);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <Component {...pageProps} />;
}
