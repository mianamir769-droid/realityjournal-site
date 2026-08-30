// Ported from Elora theme: src/views/pages/single-1.html
import Seo from "@/components/Seo";
import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import Sec1 from "@/components/single1/Sec1";
import Sec7 from "@/components/home1/Sec7";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts, getCategoryCounts, getAllTags } from "@/lib/posts";
import { primaryCategory, categoryHref } from "@/lib/postFormat";

export default function BlogPost({ post, relatedPosts, categoryItems, tags }) {
  return (
    <>
      <Seo
        title={post.seoTitle || post.title}
        description={post.metaDescription}
        path={`/${post.slug}`}
        canonical={post.canonicalUrl || undefined}
        noindex={post.noindex}
        image={post.coverImage || undefined}
        type="article"
        publishedTime={post.date}
      />
      {/* header={2}: the theme's single-post page uses header-2, the in-flow
          variant. Header-1 is absolutely positioned for the homepage hero and
          would overlap the breadcrumb here. */}
      <Layout header={2}>
        <Breadcrumb
          position="start"
          pageLink={categoryHref(primaryCategory(post.categories))}
          pageCurrent={primaryCategory(post.categories)}
          sub="true"
          pageSubCurrent={post.title}
        />
        <Sec1 post={post} relatedPosts={relatedPosts} categoryItems={categoryItems} tags={tags} />
        <Sec7 />
      </Layout>
    </>
  );
}

// `fallback: false` is required by `output: 'export'` - every path must be
// known at build time so the whole site can be emitted as static HTML.
export async function getStaticPaths() {
  const paths = getAllPostSlugs().map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { notFound: true };
  }
  // Meta description priority:
  //   1. the description actually written in Rank Math (420 posts) - this is
  //      what search results have been showing, so it must be preserved
  //   2. the post title, per your instruction, for posts that never had one
  // Deliberately not the article's opening sentence: an auto-cut excerpt
  // often starts mid-thought and reads worse than the title.
  post.metaDescription = post.seoDescription || post.seoTitle || post.title;

  // A handful of imported rows are empty abandoned drafts: no title, no
  // content worth reading, no SEO fields. They still get a page (every
  // imported post does), but they are kept out of search rather than
  // indexed as blank pages. The sitemap generator applies the same rule.
  if (!post.title || !post.title.trim()) post.noindex = true;
  return {
    props: {
      post,
      relatedPosts: getRelatedPosts(post, 5),
      categoryItems: getCategoryCounts(5),
      tags: getAllTags(9),
    },
  };
}
