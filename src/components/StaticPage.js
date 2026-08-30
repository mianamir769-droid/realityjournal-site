import Seo from "@/components/Seo";
import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import Sec7 from "@/components/home1/Sec7";

// Shell for the plain content pages (about, contact, privacy, terms):
// interior header, breadcrumb, a readable single column, newsletter footer.
// `intro` is the visible lead paragraph. `description` is what goes in the
// meta tag, and defaults to the intro - they only differ on imported pages,
// whose meta description is an excerpt of the body and would read as a
// duplicate if it were also printed above it.
export default function StaticPage({ title, intro, description, updated, path = "/", children, showNewsletter = true, noindex = false, breadcrumbs, schemaType }) {
  return (
    <>
      <Seo title={title} description={description || intro} path={path} noindex={noindex} breadcrumbs={breadcrumbs} schemaType={schemaType} />
      <Layout header={2}>
        <Breadcrumb position="start" pageCurrent={title} sub="" pageSubCurrent="" />
        <section className="pb-80 overflow-hidden">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h1 className="ds-4 mb-0">{title}</h1>
                {intro && <p className="fs-5 text-dark mt-3 mb-0">{intro}</p>}
                {updated && <p className="fs-8 text-600 mt-2 mb-0">Last updated: {updated}</p>}
                <div className="border-bottom pt-4 mb-4"></div>
                <div className="d-flex flex-column gap-3">{children}</div>
              </div>
            </div>
          </div>
        </section>
        {showNewsletter && <Sec7 />}
      </Layout>
    </>
  );
}
