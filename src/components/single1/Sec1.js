// Ported from Elora theme: src/views/sections/single-1/sec-1.html
// Generalized to render any imported post (see src/lib/posts.js) instead of
// the theme's single hardcoded demo article.
import ArticleCard3 from "@/components/cards/ArticleCard3";
import TagItem from "@/components/cards/TagItem";
import CategoryItem from "@/components/cards/CategoryItem";
import PostBody from "@/components/single1/PostBody";
import AuthorAvatar from "@/components/AuthorAvatar";
import { formatDate, estimateReadTime, primaryCategory, categoryHref } from "@/lib/postFormat";

export default function Sec1({ post, relatedPosts, categoryItems, tags }) {
  const category = primaryCategory(post.categories);
  const readTime = estimateReadTime(post.contentHtml);

  return (
    <section className="sec-1-single-1 pb-70 overflow-hidden">
      <div className="container">
        <div className="row pt-4 g-5 main-content">
          <div className="col-lg-8">
            <div id="content" className="content">
              {post.coverImage && <img className="rounded-20 w-100 mb-4" src={post.coverImage} alt={post.title} />}
              <a href={categoryHref(category)} className="categories style-2 fs-7 mb-3 bg-100 text-dark">
                {category}
              </a>
              <h3 className="card-title mb-0">{post.title}</h3>
              <div className="border-bottom pb-3 mt-3"></div>
              <div className="d-flex flex-md-nowrap flex-wrap align-items-center gap-3 justify-content-between mb-4 pt-3">
                <div className="mt-auto d-flex flex-wrap align-items-center gap-2">
                  <AuthorAvatar name={post.author} size={48} />
                  <ul className="list-unstyled gap-4 text-600 m-0 ps-0">
                    <li>
                      <p className="fs-7 text-dark fw-semi-bold mb-1 mt-0">{post.author || "Staff"}</p>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <p className="fs-8 m-0">{formatDate(post.date)}</p>
                      <div className="line-divider"></div>
                      <p className="fs-8 m-0">{readTime}</p>
                    </li>
                  </ul>
                </div>
              </div>

              <PostBody html={post.contentHtml} />
            </div>
          </div>
          <div className="col-lg-4">
            <div id="sidebar" className="sidebar sidebar_right">
              <div className="sidebar__inner">
                <div className="row">
                  <div className="col-md-6 col-lg-12 col-12">
                    <div className="author-card">
                      <div className="card-img mb-4 text-center d-flex justify-content-center">
                        <AuthorAvatar name={post.author} size={154} />
                      </div>
                      <div className="card-body text-center">
                        <h4 className="mb-0">{post.author || "Staff"}</h4>
                        <span className="fs-7 text-linear mb-3">Contributor</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-12 col-12">
                    <div className="block-trending d-flex flex-column gap-3 mt-5">
                      <p className="mb-0 fs-6 fw-bold text-linear">Related posts</p>
                      {relatedPosts.map((item, i) => (
                        <ArticleCard3
                          key={i}
                          classList="border-bottom"
                          style="style-4"
                          linkCategory={categoryHref(primaryCategory(item.categories))}
                          linkPost={`/${item.slug}/`}
                          category={primaryCategory(item.categories)}
                          img={item.img}
                          title={item.title}
                          date={formatDate(item.date)}
                        />
                      ))}
                    </div>
                    <div className="block-category pt-4">
                      <p className="mb-3 fs-6 fw-bold text-linear">Categories</p>
                      <ul className="list-unstyled m-0 ps-0">
                        {categoryItems.map((item, i) => (
                          <CategoryItem key={i} linkpage_category={categoryHref(item.name)} name={item.name} count={item.count} />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-12 col-12">
                    <div className="block-tag mt-5">
                      <p className="mb-3 fs-6 fw-bold text-linear">Tags</p>
                      <ul className="list-unstyled d-flex flex-wrap gap-2 ps-0">
                        {tags.map((name, i) => (
                          <TagItem key={i} linkpage_category="#" name={name} />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
