import Preloader from "./Preloader";
import Header1 from "./Header1";
import Header2 from "./Header2";
import Footer1 from "./Footer1";
import BtnScrollTop from "./BtnScrollTop";

// `header` picks which of the theme's two header variants to render, matching
// how the source theme pairs them with its pages:
//   1 - position-absolute, overlays the homepage's hero background image
//   2 - position-relative, sits in normal flow (every interior page)
// Interior pages must use 2, otherwise the absolute navbar floats on top of
// the page's first section instead of above it.
export default function Layout({ children, header = 1 }) {
  return (
    <>
      <Preloader />
      {header === 2 ? <Header2 /> : <Header1 />}
      <main>{children}</main>
      <Footer1 />
      <BtnScrollTop />
    </>
  );
}
