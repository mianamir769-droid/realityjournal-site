import PostArchive from "@/components/PostArchive";
import { getAllPosts, paginate } from "@/lib/posts";

const latestHref = (p) => (p === 1 ? "/latest/" : `/latest/page/${p}/`);

export default function LatestIndex({ posts, page, totalPages, totalPosts }) {
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

export async function getStaticProps() {
  return { props: paginate(getAllPosts(), 1) };
}
