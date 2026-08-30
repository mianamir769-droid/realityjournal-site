// Ported from Elora theme: src/views/sections/home-1/sec-1.html
import ArticleCard1 from "@/components/cards/ArticleCard1";
import { formatDate, primaryCategory, categoryHref } from "@/lib/postFormat";

export default function Sec1({ posts }) {
  return (
    <section className="sec-1-home-1 overflow-hidden" data-background="/assets/imgs/page/bg-home1-sec1.webp">
      <div className="container">
        <div className="row mb-3">
          <div className="col-12">
            <div className="text-center">
              <h1 className="ds-1 lh-110 mb-0">
                Sharing <span className="fst-italic text-linear">stories, insights, and moments</span> that define our times
              </h1>
              <p className="fs-5 text-dark mt-0 pt-3">
                A collection of voices, ideas, and moments that reflect today’s <br className="d-none d-md-block" />
                world and inspire meaningful connections.
              </p>
            </div>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-lg-7 mx-auto">
            <form action="#" className="d-flex gap-2 justify-content-center">
              <input className="form-control border-linear" type="text" placeholder="What Are You Looking For?" />
              <button className="btn btn-linear button-effect-1" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="custom-container pt-3 position-relative">
        <div className="swiper-btn align-items-center justify-content-between d-none d-lg-flex">
          <div className="swiper-button-next swiper-btn-next">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M15.9373 8.18744L22.0266 13.9999L15.9373 19.8124"
                stroke="#0D0D0D"
                strokeWidth="1.66071"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M5.97322 13.9999H21.75" stroke="#0D0D0D" strokeWidth="1.66071" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="swiper-button-prev swiper-btn-prev">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M12.0624 8.18744L5.97314 13.9999L12.0624 19.8124"
                stroke="#0D0D0D"
                strokeWidth="1.66071"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M22.0268 13.9999H6.25" stroke="#0D0D0D" strokeWidth="1.66071" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="swiper swiper-card-hero py-2">
          <div className="swiper-wrapper">
            {posts.map((post) => (
              <ArticleCard1
                key={post.slug}
                classList="swiper-slide"
                style="style-1"
                linkAuthor="#"
                linkCategory={categoryHref(primaryCategory(post.categories))}
                linkPost={`/${post.slug}`}
                img={post.img}
                author={post.author}
                category={primaryCategory(post.categories)}
                date={formatDate(post.date)}
                readTime={post.readTime}
                title={post.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
