import PostArchive from "@/components/PostArchive";
import { getAllPosts, paginate, POSTS_PER_PAGE } from "@/lib/posts";

const latestHref = (p) => (p === 1 ? "/latest" : `/latest/page/${p}`);

export default function LatestPage({ posts, page, totalPages, totalPosts }) {
  return (
    <PostArchive
      title="Latest"
      subtitle="Everything published, newest first"
      breadcrumbCurrent="Latest"
      posts={posts}
      page={page}
      totalPages={totalPages}
      totalPosts={totalPosts}
      hrefFor={latestHref}
    />
  );
}

export async function getStaticPaths() {
  const totalPages = Math.max(1, Math.ceil(getAllPosts().length / POSTS_PER_PAGE));
  // Page 1 lives at /latest, so this route only covers 2..N.
  const paths = [];
  for (let p = 2; p <= totalPages; p++) paths.push({ params: { page: String(p) } });
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const page = Number(params.page);
  if (!Number.isInteger(page) || page < 2) return { notFound: true };
  const result = paginate(getAllPosts(), page);
  if (result.page !== page) return { notFound: true };
  return { props: result };
}
