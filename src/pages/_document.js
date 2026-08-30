import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

// Vendor libraries load beforeInteractive. Two reasons this is the right
// strategy for them specifically:
//   1. beforeInteractive scripts are injected into the HTML in declaration
//      order and execute sequentially, which afterInteractive does NOT
//      guarantee - afterInteractive loads in parallel, so a dependent file
//      could run before its library defined its global (e.g. gsap-custom.js
//      throwing "gsap is not defined").
//   2. These files only define globals ($, gsap, Swiper, AOS, ...) and
//      register jQuery plugins - they don't touch the React-rendered DOM on
//      load, so they can't cause a hydration mismatch.
// Anything that DOES mutate the rendered DOM lives in _app.js instead.
const VENDOR_SCRIPTS = [
  "/assets/js/vendors/jquery-3.7.1.min.js",
  "/assets/js/vendors/swiper-bundle.min.js",
  "/assets/js/vendors/aos.js",
  "/assets/js/vendors/headhesive.min.js",
  "/assets/js/vendors/jquery.magnific-popup.min.js",
  "/assets/js/vendors/gsap.min.js",
  "/assets/js/vendors/ScrollToPlugin.min.js",
  "/assets/js/vendors/ScrollTrigger.min.js",
  "/assets/js/vendors/Splitetext.js",
  "/assets/js/vendors/howler.min.js",
  "/assets/js/vendors/jquery.appear.js",
  "/assets/js/vendors/jquery.elevatezoom.js",
  "/assets/js/vendors/jquery.sticky-sidebar.js",
];

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/assets/imgs/template/logo/favicon.svg"
        />
        {/* Fallback for anything that will not take an SVG icon. Browsers
            request /favicon.ico by path whether it is linked or not, so it is
            generated too rather than left as the Next.js default. */}
        <link rel="alternate icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Libs CSS - loaded exactly as in the original Elora theme */}
        <link rel="stylesheet" href="/assets/css/vendors/bootstrap-grid.min.css" />
        <link rel="stylesheet" href="/assets/css/vendors/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/vendors/aos.css" />
        <link rel="stylesheet" href="/assets/css/vendors/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/vendors/odometer.css" />

        {/* Sets a theme attribute on <html>, outside React's hydration
            target, so it must run early to avoid a light/dark flash. */}
        <Script src="/assets/js/vendors/color-modes.js" strategy="beforeInteractive" />
      </Head>
      <body>
        <Main />
        <NextScript />

        {VENDOR_SCRIPTS.map((src) => (
          <Script key={src} src={src} strategy="beforeInteractive" />
        ))}
      </body>
    </Html>
  );
}
