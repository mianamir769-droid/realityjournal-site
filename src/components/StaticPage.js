import Seo from "@/components/Seo";
import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import Sec7 from "@/components/home1/Sec7";

// Shell for the plain content pages (about, contact, privacy, terms):
// interior header, breadcrumb, a readable single column, newsletter footer.
export default function StaticPage({ title, intro, updated, path = "/", children, showNewsletter = true }) {
  return (
    <>
      <Seo title={title} description={intro} path={path} />
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
