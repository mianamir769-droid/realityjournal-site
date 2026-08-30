// Ported from Elora theme: src/views/sections/home-1/sec-5.html
import ArticleCard4 from "@/components/cards/ArticleCard4";
import { formatDate } from "@/lib/postFormat";

export default function Sec5({ posts }) {
  return (
    <section className="sec-5-home-1 pb-80 overflow-hidden">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-md-6">
            <h5 className="ds-5  mb-0">Editor's choice</h5>
            <p className="mt-1 mb-0 ">Handpicked stories you’ll love reading</p>
          </div>
          <div className="col-md-6 mt-md-0 mt-3 d-flex">
            <div className="ms-md-auto">
              <a href="#" className="btn btn-linear btn-sm hover-up">
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
          {posts.map((post) => (
            <ArticleCard4
              key={post.slug}
              classList="col-lg-3 col-md-6 col-12"
              linkPost={`/${post.slug}/`}
              linkAuthor="#"
              img={post.img}
              title={post.title}
              author={post.author}
              date={formatDate(post.date)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
