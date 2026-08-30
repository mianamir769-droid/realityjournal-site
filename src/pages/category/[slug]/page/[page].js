import PostArchive from "@/components/PostArchive";
import { getAllCategories, getCategoryBySlug, getPostsInCategory, paginate, POSTS_PER_PAGE } from "@/lib/posts";

export default function CategoryPage({ category, posts, page, totalPages, totalPosts }) {
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
  const paths = [];
  for (const category of getAllCategories()) {
    const totalPages = Math.max(1, Math.ceil(getPostsInCategory(category.name).length / POSTS_PER_PAGE));
    // Page 1 lives at /category/<slug>, so this route only covers 2..N.
    for (let p = 2; p <= totalPages; p++) {
      paths.push({ params: { slug: category.slug, page: String(p) } });
    }
  }
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const category = getCategoryBySlug(params.slug);
  const page = Number(params.page);
  if (!category || !Number.isInteger(page) || page < 2) return { notFound: true };

  const result = paginate(getPostsInCategory(category.name), page);
  if (result.page !== page) return { notFound: true };
  return { props: { category, ...result } };
}
