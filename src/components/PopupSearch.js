// Ported from Elora theme: src/views/partials/popup-search.html
import TagItem from "./cards/TagItem";
import ArticleCard3 from "./cards/ArticleCard3";
import widgetData from "@/lib/widgetData.json";
import { categoryHref } from "@/lib/postFormat";

// Real imported posts and real tags (see scripts/generate-widget-data.mjs),
// not Elora's demo "Breaking Down the Elements..." placeholder content.
// Tags stay unlinked: there are no per-tag archive pages, only categories.
const tagItems = widgetData.tags.map((name) => ({ linkpage_category: "#", name }));

const spotlightItems = widgetData.spotlight.map((item) => ({
  classList: "swiper-slide",
  style: "style-1",
  ...item,
  linkCategory: categoryHref(item.category),
}));

export default function PopupSearch() {
  return (
    <>
    <div className="popup-search d-none d-md-block">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="popup-search-content position-relative">
              <a href="#" className="close-popup position-absolute top-0 end-0 m-3">
                <svg className="dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17.25 6.75L6.75 17.25" stroke="#0E0E0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.75 6.75L17.25 17.25" stroke="#0E0E0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <h4 className="mb-4">What are you looking for?</h4>
              <form action="#" className="d-flex flex-wrap flex-lg-nowrap gap-2">
                <input className="form-control border-500" type="text" placeholder="Type to discover stories that matter…" />
                <button className="btn btn-linear button-effect-1 px-5" type="submit">
                  Search
                </button>
              </form>
              <div className="block-tag mt-3">
                <ul className="list-unstyled d-flex flex-wrap gap-2 ps-0">
                  {tagItems.map((item, i) => (
                    <TagItem key={i} {...item} />
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <div className="block-recomment">
                  <h5 className="mb-3 text-linear fw-semi-bold">Spotlight</h5>
                  <div className="swiper swiper-popup-search">
                    <div className="swiper-wrapper pt-2">
                      {spotlightItems.map((item, i) => (
                        <ArticleCard3 key={i} {...item} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="popup-search-overlay"></div>
    </>
  );
}
