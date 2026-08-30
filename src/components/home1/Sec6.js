// Ported from Elora theme: src/views/sections/home-1/sec-6.html
import ArticleCard6 from "@/components/cards/ArticleCard6";
import ArticleCard7 from "@/components/cards/ArticleCard7";
import { formatDate, primaryCategory, categoryHref } from "@/lib/postFormat";

export default function Sec6({ featured, items }) {
  return (
    <section className="sec-6-home-1 pb-70 overflow-hidden">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-md-6">
            <h5 className="ds-5  mb-0">Latest news</h5>
            <p className="mt-1 mb-0 ">Expertly selected for your needs</p>
          </div>
          <div className="col-md-6 mt-md-0 mt-3 d-flex">
            <div className="ms-md-auto">
              <a href="#" className="btn btn-dark btn-sm hover-up">
                View more
                <span className="dark-mode-invert">
                  <img src="/assets/imgs/template/icons/arrow-up-right.svg" alt="" className="ms-2" />
                </span>
              </a>
            </div>
          </div>
          <div className="col-12">
            <div className="border-bottom pt-3"></div>
          </div>
        </div>
        <div className="row g-42 pt-5">
          {featured && (
            <ArticleCard7
              classList="col-lg-6 col-12"
              linkPost={`/${featured.slug}/`}
              linkCategory={categoryHref(primaryCategory(featured.categories))}
              category={primaryCategory(featured.categories)}
              img={featured.img}
              title={featured.title}
              description={featured.excerpt}
              linkAuthor="#"
              author={featured.author}
              date={formatDate(featured.date)}
            />
          )}
          <div className="col-lg-6">
            <div className="row g-42">
              {items.map((post) => (
                <ArticleCard6
                  key={post.slug}
                  classList="col-md-6 col-12"
                  linkPost={`/${post.slug}/`}
                  linkCategory={categoryHref(primaryCategory(post.categories))}
                  category={primaryCategory(post.categories)}
                  img={post.img}
                  title={post.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
