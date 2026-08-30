import StaticPage from "@/components/StaticPage";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/siteConfig";
import { getAllPosts, getAllCategories } from "@/lib/posts";

export default function About({ postCount, categories }) {
  return (
    <StaticPage
      path="/about" title={`About ${SITE_NAME}`} intro="What this site is and who writes it.">
      <h4 className="mb-0">What we publish</h4>
      <p className="text-700 m-0 fs-18">
        {SITE_NAME} is an independent publication covering {categories.slice(0, 4).map((c) => c.name).join(", ")} and more. There are{" "}
        {postCount} articles on the site so far, and we keep adding to them.
      </p>

      <h4 className="mb-0">Topics</h4>
      <p className="text-700 m-0 fs-18">Every article is filed under at least one topic. You can browse them all from the categories below.</p>
      <ul className="list-unstyled d-flex flex-wrap gap-2 ps-0 mb-0">
        {categories.map((cat) => (
          <li key={cat.slug} className="mx-0">
            <a href={`/category/${cat.slug}`} className="tag-item link-effect-2">
              <span className="text">
                <span className="text1">
                  {cat.name} ({cat.count})
                </span>
                <span className="text2">
                  {cat.name} ({cat.count})
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <h4 className="mb-0">Get in touch</h4>
      <p className="text-700 m-0 fs-18">
        Corrections, questions, or an idea for something we should cover? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-linear">
          {CONTACT_EMAIL}
        </a>{" "}
        or use the{" "}
        <a href="/contact" className="text-linear">
          contact page
        </a>
        .
      </p>
    </StaticPage>
  );
}

export async function getStaticProps() {
  return {
    props: {
      postCount: getAllPosts().length,
      categories: getAllCategories(),
    },
  };
}
