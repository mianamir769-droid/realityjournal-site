import StaticPage from "@/components/StaticPage";
import { getAllCategories } from "@/lib/posts";

// Without this file Next emits its own bare 404, and because trailingSlash is
// on that also lands at /404/ as an ordinary indexable URL with no canonical.
// This version is noindexed and gives the visitor somewhere to go, which
// matters more here than usual: this is a migration, so some of the inbound
// links pointing at the old WordPress site will land on it.
export default function NotFound({ categories }) {
  return (
    <StaticPage
      path="/404/"
      noindex
      showNewsletter={false}
      title="Page not found"
      intro="That page does not exist, or it moved when the site was rebuilt."
    >
      <p className="text-700 m-0 fs-18">
        Try the{" "}
        <a href="/latest/" className="text-linear">
          latest articles
        </a>
        , or start from the{" "}
        <a href="/" className="text-linear">
          homepage
        </a>
        .
      </p>

      <h4 className="mb-0">Browse by topic</h4>
      <ul className="list-unstyled d-flex flex-wrap gap-2 ps-0 mb-0">
        {categories.map((cat) => (
          <li key={cat.slug} className="mx-0">
            <a href={`/category/${cat.slug}/`} className="tag-item link-effect-2">
              <span className="text">
                <span className="text1">{cat.name}</span>
                <span className="text2">{cat.name}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </StaticPage>
  );
}

export async function getStaticProps() {
  return { props: { categories: getAllCategories().slice(0, 8) } };
}
