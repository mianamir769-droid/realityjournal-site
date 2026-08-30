// Ported from Elora theme: src/views/sections/home-1/sec-3.html
import ArticleCard2 from "@/components/cards/ArticleCard2";
import ArticleCard3 from "@/components/cards/ArticleCard3";
import AuthorAvatar from "@/components/AuthorAvatar";
import { formatDate, primaryCategory, categoryHref } from "@/lib/postFormat";

export default function Sec3({ writtenLately, mostComments, secondRow }) {
  const avatarAuthors = [...writtenLately, ...secondRow].slice(0, 5);

  return (
    <section className="sec-3-home-1 pb-80 overflow-hidden">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-md-6">
            <h5 className="ds-5  mb-0">Written lately</h5>
            <p className="mt-1 mb-0 ">Explore what everyone’s talking about</p>
          </div>
          <div className="col-md-6">
            <div className="d-none d-md-flex justify-content-end">
              <div className="block-author align-items-center position-relative">
                {avatarAuthors.map((post, i) => (
                  <div
                    key={post.slug}
                    className={`avatar avatar-64 rounded-circle overflow-hidden border-4 border-white z-${i + 1} hover-up`}
                  >
                    <a href={`/${post.slug}`}>
                      <AuthorAvatar name={post.author} size={64} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="border-bottom pt-2"></div>
          </div>
        </div>
        <div className="row mt-1 g-42">
          {writtenLately.map((post) => (
            <ArticleCard2
              key={post.slug}
              classList="col-lg-4 col-md-6 col-12"
              linkPost={`/${post.slug}`}
              linkAuthor="#"
              linkCategory={categoryHref(primaryCategory(post.categories))}
              category={primaryCategory(post.categories)}
              author={post.author}
              img={post.img}
              title={post.title}
              description={post.excerpt}
              date={formatDate(post.date)}
              readTime={post.readTime}
            />
          ))}
          <div className="col-lg-4 col-md-6 col-12">
            <div className="group-cardMost-comments" data-background="/assets/imgs/page/bg-home1-sec3.webp">
              <h5 className="text-white mb-0 z-1">Most comments</h5>
              {mostComments.map((post) => (
                <ArticleCard3
                  key={post.slug}
                  classList="swiper-slide"
                  style="style-3"
                  linkPost={`/${post.slug}`}
                  linkCategory={categoryHref(primaryCategory(post.categories))}
                  category={primaryCategory(post.categories)}
                  img={post.img}
                  title={post.title}
                  date={formatDate(post.date)}
                />
              ))}
            </div>
          </div>
          {secondRow.map((post) => (
            <ArticleCard2
              key={post.slug}
              classList="col-lg-4 col-md-6 col-12"
              linkPost={`/${post.slug}`}
              linkAuthor="#"
              linkCategory={categoryHref(primaryCategory(post.categories))}
              category={primaryCategory(post.categories)}
              author={post.author}
              img={post.img}
              title={post.title}
              description={post.excerpt}
              date={formatDate(post.date)}
              readTime={post.readTime}
            />
          ))}
        </div>
        <div className="row mt-5 pt-2">
          <div className="col-12">
            <div className="text-center">
              <a href="#" className="btn btn-linear hover-up fs-5">
                Become an author
                <span className="dark-mode-invert">
                  <img src="/assets/imgs/template/icons/arrow-up-right.svg" alt="" className="ms-2" />
                </span>
              </a>
              <p className="mt-3 fs-7 text-700 ">Join the content creation community and earn income</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
