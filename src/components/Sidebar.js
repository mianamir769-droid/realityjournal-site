// Ported from Elora theme: src/views/partials/sidebar.html
// (the site's off-canvas mobile navigation drawer, triggered by the
// header's .navbar-toggler button)
import ArticleCard3 from "./cards/ArticleCard3";
import SiteLogo from "@/components/SiteLogo";
import TagItem from "./cards/TagItem";
import widgetData from "@/lib/widgetData.json";
import NewsletterForm from "@/components/NewsletterForm";
import { SITE_NAME, COPYRIGHT_YEAR } from "@/lib/siteConfig";
import { categoryHref } from "@/lib/postFormat";

// Real imported posts (see scripts/generate-widget-data.mjs), not Elora's
// demo "Iconic Film Directors..." placeholder content.
const weeklyTrending = widgetData.trending.map((item, i, arr) => ({
  classList: i === arr.length - 1 ? "" : "border-bottom",
  style: "style-4",
  ...item,
  linkCategory: categoryHref(item.category),
}));

const tags = widgetData.tags.map((name) => ({ linkpage_category: "#", name }));

export default function Sidebar() {
  return (
    <>
      <div className="sidebar-left">
        <div className="header-sidebar d-flex align-items-center justify-content-between py-4">
          <a href="/" className="sidebar-brand">
            <SiteLogo />
          </a>
          <a href="#" className="close-sidebar">
            <svg className="dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17.25 6.75L6.75 17.25" stroke="#0E0E0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6.75 6.75L17.25 17.25" stroke="#0E0E0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        {/* Mirrors MainMenu. The theme's original drawer listed demo
            destinations (Home 1-5, Shop, Single 1-8, Portfolio) that don't
            exist on this site. */}
        <ul className="sidebar-nav list-unstyled ps-0">
          <li className="nav-item">
            <a className="nav-link mb-2" href="/">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link mb-2" href="/latest">
              Latest
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link mb-2" href="/category">
              Categories
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link mb-2" href="/about">
              About
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link mb-2" href="/contact">
              Contact
            </a>
          </li>
        </ul>
        <div className="block-popular">
          <p className="mb-3 fs-6 fw-bold text-linear">Weekly trending</p>
          <div className="d-flex flex-column gap-3">
            {weeklyTrending.map((item, i) => (
              <ArticleCard3 key={i} {...item} />
            ))}
          </div>
          <div className="block-tag mt-3">
            <p className="mb-3 fs-6 fw-bold text-linear">Tags</p>
            <ul className="list-unstyled d-flex flex-wrap gap-2 ps-0">
              {tags.map((item, i) => (
                <TagItem key={i} {...item} />
              ))}
            </ul>
          </div>
          {/* The theme's decorative image slider sat here showing three of
              its own stock photos. Removed rather than filled with
              unrelated post images. */}
        </div>

        <div className="sidebar-footer">
          <div className="">
            <div className="d-flex align-items-center">
              <svg className="dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
                  stroke="#0E0E0F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M5.5 6.5L12 12.25L18.5 6.5" stroke="#0E0E0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="fs-7 fw-semibold">Newsletter</span>
            </div>
            <h5 className="my-2">Subscribe our newsletter</h5>
            <p className="fs-7 mb-0">New articles straight to your inbox. No spam, just what you signed up for.</p>
          </div>
          <NewsletterForm
            inputClass="form-control border-500 fs-7 w-100"
            buttonClass="btn btn-linear button-effect-1"
          />
        </div>
        <div className="text-center">
          <p className="fs-7">
            {COPYRIGHT_YEAR} @ <span className="text-dark">{SITE_NAME}.</span> <br />
            <span> All Rights Reserved </span>
          </p>
        </div>
      </div>
      <div className="sidebar-overlay"></div>
    </>
  );
}
