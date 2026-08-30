import StaticPage from "@/components/StaticPage";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/siteConfig";

// Deliberately a mailto link rather than a message form: this is a static
// export with no backend, so a form here would need its own third-party
// endpoint. A plain email address always works and never silently loses a
// message. Swap in a form service later if the volume justifies it.
export default function Contact() {
  return (
    <StaticPage
      path="/contact" title="Contact" intro={`Get in touch with ${SITE_NAME}.`}>
      <h4 className="mb-0">Email us</h4>
      <p className="text-700 m-0 fs-18">
        The fastest way to reach us is by email. We read everything that comes in and reply to what needs a reply.
      </p>
      <p className="m-0">
        <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-linear button-effect-1">
          {CONTACT_EMAIL}
        </a>
      </p>

      <h4 className="mb-0">Corrections</h4>
      <p className="text-700 m-0 fs-18">
        If you have spotted something inaccurate in an article, send us the link and what you believe is wrong. We would rather fix it
        than leave it standing.
      </p>

      <h4 className="mb-0">Writing for us</h4>
      <p className="text-700 m-0 fs-18">
        Interested in contributing? Email us with a short note about the topics you cover and a couple of writing samples.
      </p>

      <h4 className="mb-0">Advertising and partnerships</h4>
      <p className="text-700 m-0 fs-18">
        For advertising, sponsorship or partnership enquiries, use the same address and tell us what you have in mind.
      </p>
    </StaticPage>
  );
}
