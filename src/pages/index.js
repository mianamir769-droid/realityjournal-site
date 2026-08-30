// Ported from Elora theme: src/views/pages/index.html (Home 1 - Magazine)
import Seo from "@/components/Seo";
import { SITE_NAME } from "@/lib/siteConfig";
import Layout from "@/components/Layout";
import Sec1 from "@/components/home1/Sec1";
import Sec2 from "@/components/home1/Sec2";
import Sec3 from "@/components/home1/Sec3";
import Sec4 from "@/components/home1/Sec4";
import Sec5 from "@/components/home1/Sec5";
import Sec6 from "@/components/home1/Sec6";
import Sec7 from "@/components/home1/Sec7";
import { getHomepageData } from "@/lib/posts";

export default function Home({ data }) {
  return (
    <>
      <Seo
        title={SITE_NAME}
        description={`${SITE_NAME} publishes articles on business, lifestyle, technology and more. Browse the latest stories.`}
        path="/"
      />
      <Layout>
        <Sec1 posts={data.hero} />
        <Sec2 categories={data.categories} />
        <Sec3 writtenLately={data.writtenLately} mostComments={data.mostComments} secondRow={data.secondRow} />
        <Sec4 authorName={data.topAuthorName} authorCount={data.topAuthorCount} posts={data.topAuthorPosts} />
        <Sec5 posts={data.editorsChoice} />
        <Sec6 featured={data.latestFeatured} items={data.latestGrid} />
        <Sec7 />
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  return { props: { data: getHomepageData() } };
}
