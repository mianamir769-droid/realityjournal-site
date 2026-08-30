import PostArchive from "@/components/PostArchive";
import { getAllCategories, getCategoryBySlug, getPostsInCategory, paginate } from "@/lib/posts";

export default function CategoryIndex({ category, posts, page, totalPages, totalPosts }) {
  return (
    <PostArchive
      title={category.name}
      subtitle={`Articles filed under ${category.name}`}
      breadcrumbCurrent={category.name}
      posts={posts}
      page={page}
      totalPages={totalPages}
      totalPosts={totalPosts}
      hrefFor={(p) => (p === 1 ? `/category/${category.slug}` : `/category/${category.slug}/page/${p}`)}
    />
  );
}

export async function getStaticPaths() {
  return {
    paths: getAllCategories().map((c) => ({ params: { slug: c.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return { notFound: true };
  return { props: { category, ...paginate(getPostsInCategory(category.name), 1) } };
}
