import Seo from "@/components/Seo";
import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryCard1 from "@/components/cards/CategoryCard1";
import Sec7 from "@/components/home1/Sec7";
import { getAllCategories, getPostsInCategory } from "@/lib/posts";
import { extractFirstImage } from "@/lib/postFormat";
import verifiedImageSlugs from "@/lib/verifiedImages.json";

export default function CategoriesIndex({ categories }) {
  return (
    <>
      <Seo title="Categories" description="Browse every topic covered on the site." path="/category" />
      <Layout header={2}>
        <Breadcrumb position="start" pageCurrent="Categories" sub="" pageSubCurrent="" />
        <section className="pb-80 overflow-hidden">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="ds-5 mb-0">Categories</h2>
                <p className="mt-1 mb-0">Browse every topic on the site</p>
                <div className="border-bottom pt-3"></div>
              </div>
            </div>
            <div className="row mt-4 g-24">
              {categories.map((cat) => (
                <CategoryCard1
                  key={cat.slug}
                  classList="col-lg-3 col-sm-4 col-6"
                  img={cat.img}
                  category={`${cat.name} (${cat.count})`}
                  linkpage_category={`/category/${cat.slug}/`}
                />
              ))}
            </div>
          </div>
        </section>
        <Sec7 />
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const verified = new Set(verifiedImageSlugs);
  // Tiles are photo tiles, so give each category a real image from one of
  // its own posts where one exists; the card degrades to its background
  // colour when img is null rather than showing a stand-in photo.
  const categories = getAllCategories().map((cat) => {
    const rep = getPostsInCategory(cat.name).find((p) => verified.has(p.slug));
    return { ...cat, img: rep ? extractFirstImage(rep.contentHtml) : null };
  });
  return { props: { categories } };
}
