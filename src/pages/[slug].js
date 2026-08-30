// Ported from Elora theme: src/views/pages/single-1.html
import Seo from "@/components/Seo";
import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import Sec1 from "@/components/single1/Sec1";
import Sec7 from "@/components/home1/Sec7";
import StaticPage from "@/components/StaticPage";
import PostBody from "@/components/single1/PostBody";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts, getCategoryCounts, getAllTags } from "@/lib/posts";
import { getAllPageSlugs, getPageBySlug } from "@/lib/pages";
import { getExcerpt } from "@/lib/postFormat";
import { primaryCategory, categoryHref } from "@/lib/postFormat";
import { SITE_URL } from "@/lib/siteConfig";

export default function BlogPost({ post, page, relatedPosts, categoryItems, tags }) {
  // A standalone WordPress page (/write-for-us/) shares this route because it
  // lives at the same root-level URL shape as a post. It gets the plain
  // content shell rather than the article furniture - no author byline,
  // related posts, or category breadcrumb, none of which it has.
  if (page) {
    return (
      <StaticPage
        path={`/${page.slug}/`}
        title={page.seoTitle || page.title}
        // Only Rank Math's own description is shown as a lead paragraph.
        // The excerpt fallback is meta-only, since it is the body's own
        // opening sentence and would be printed twice.
        intro={page.seoDescription || undefined}
        description={page.metaDescription || undefined}
        breadcrumbs={[{ name: "Home", url: "/" }, { name: page.title, url: `/${page.slug}/` }]}
      >
        <PostBody html={page.contentHtml} />
      </StaticPage>
    );
  }

  return (
    <>
      <Seo
        title={post.seoTitle || post.title}
        description={post.metaDescription}
        path={`/${post.slug}/`}
        canonical={post.canonicalUrl || undefined}
        noindex={post.noindex}
        image={post.coverImage || undefined}
        type="article"
        schemaType="article"
        publishedTime={post.date}
        author={post.author || undefined}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: primaryCategory(post.categories), url: categoryHref(primaryCategory(post.categories)) },
          { name: post.title, url: `/${post.slug}/` },
        ].filter((b) => b.url !== "#")}
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
  const paths = [...getAllPostSlugs(), ...getAllPageSlugs()].map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const page = getPageBySlug(params.slug);
  if (page) {
    // Same fallback chain the posts use: the Rank Math description if the
    // page had one, otherwise an excerpt of its own opening text rather than
    // shipping the page with no description at all.
    page.metaDescription = page.seoDescription || getExcerpt(page.contentHtml, 155) || page.title;
    return { props: { post: null, page } };
  }

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

  // A slug collision means two exports claimed one WordPress permalink. The
  // suffixed copy points its canonical at the original rather than competing
  // with it (the importer already marked it noindex).
  if (post.duplicateOf && !post.canonicalUrl) {
    post.canonicalUrl = `${SITE_URL}/${post.duplicateOf}/`;
  }

  // A handful of imported rows are empty abandoned drafts: no title, no
  // content worth reading, no SEO fields. They still get a page (every
  // imported post does), but they are kept out of search rather than
  // indexed as blank pages. The sitemap generator applies the same rule.
  if (!post.title || !post.title.trim()) post.noindex = true;
  return {
    props: {
      post,
      page: null,
      relatedPosts: getRelatedPosts(post, 5),
      categoryItems: getCategoryCounts(5),
      tags: getAllTags(9),
    },
  };
}
