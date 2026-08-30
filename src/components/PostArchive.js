import Seo from "@/components/Seo";
import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleCard4 from "@/components/cards/ArticleCard4";
import Pagination from "@/components/Pagination";
import Sec7 from "@/components/home1/Sec7";
import { formatDate, primaryCategory, categoryHref } from "@/lib/postFormat";

// Shared listing page for /latest and /category/<slug>, both of which are
// "a heading, a grid of post cards, pagination" and differ only in title and
// which posts they pass in.
export default function PostArchive({ title, subtitle, posts, page, totalPages, totalPosts, hrefFor, breadcrumbCurrent }) {
  const pageSuffix = page > 1 ? ` - Page ${page}` : "";

  return (
    <>
      <Seo
        title={`${title}${pageSuffix}`}
        // The page number belongs in the description as well as the title:
        // without it every page of /latest/ shipped the same 20 descriptions
        // and every page of a category the same again.
        description={
          (subtitle ? `${subtitle}. ${totalPosts} articles.` : `${totalPosts} articles.`) +
          (page > 1 ? ` Page ${page} of ${totalPages}.` : '')
        }
        path={hrefFor(page)}
        schemaType="collection"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: title, url: hrefFor(1) },
          ...(page > 1 ? [{ name: `Page ${page}`, url: hrefFor(page) }] : []),
        ]}
      />
      <Layout header={2}>
        <Breadcrumb position="start" pageCurrent={breadcrumbCurrent || title} sub="" pageSubCurrent="" />

        <section className="pb-80 overflow-hidden">
          <div className="container">
            <div className="row align-items-end">
              <div className="col-md-8">
                {/* The listing heading is this page's h1. It was an h2 in
                    the template, leaving /latest/ and every category page
                    without one. */}
                <h1 className="ds-5 mb-0">{title}</h1>
                {subtitle && <p className="mt-1 mb-0">{subtitle}</p>}
              </div>
              <div className="col-md-4 d-flex">
                <div className="ms-md-auto mt-md-0 mt-2">
                  <p className="fs-7 text-700 mb-0">
                    {totalPosts} {totalPosts === 1 ? "article" : "articles"}
                    {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
                  </p>
                </div>
              </div>
              <div className="col-12">
                <div className="border-bottom pt-3"></div>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="row pt-5">
                <div className="col-12">
                  <p className="text-700 mb-0">No articles here yet.</p>
                </div>
              </div>
            ) : (
              <div className="row g-42 pt-5">
                {posts.map((post) => (
                  <ArticleCard4
                    key={post.slug}
                    classList="col-lg-3 col-md-6 col-12"
                    linkPost={`/${post.slug}/`}
                    linkAuthor={categoryHref(primaryCategory(post.categories))}
                    img={post.img}
                    title={post.title}
                    author={post.author}
                    date={formatDate(post.date)}
                  />
                ))}
              </div>
            )}

            <div className="row pt-5">
              <div className="col-12 d-flex justify-content-center">
                <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
              </div>
            </div>
          </div>
        </section>

        <Sec7 />
      </Layout>
    </>
  );
}
