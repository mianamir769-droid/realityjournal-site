import StaticPage from "@/components/StaticPage";
import { SITE_NAME, CONTACT_EMAIL, JURISDICTION, LEGAL_LAST_UPDATED } from "@/lib/siteConfig";

// NOTE: generic boilerplate, not legal advice. Check the governing-law
// section matches where you actually operate, and have it reviewed before
// relying on it.
export default function Terms() {
  return (
    <StaticPage
      path="/terms"
      title="Terms & Conditions"
      intro={`The terms you agree to by using ${SITE_NAME}.`}
      updated={LEGAL_LAST_UPDATED}
    >
      <h4 className="mb-0">Acceptance</h4>
      <p className="text-700 m-0 fs-18">
        By accessing {SITE_NAME}, you agree to these terms. If you do not agree with them, please do not use the site.
      </p>

      <h4 className="mb-0">Use of the site</h4>
      <p className="text-700 m-0 fs-18">
        You may read, link to and share our articles for personal, non-commercial purposes. You may not republish our content in bulk,
        sell it, present it as your own work, or use automated tools to scrape the site in a way that disrupts it for other readers.
      </p>

      <h4 className="mb-0">Intellectual property</h4>
      <p className="text-700 m-0 fs-18">
        Unless stated otherwise, the articles and design on this site belong to {SITE_NAME} or are used with permission. Trademarks,
        product names and logos mentioned in articles belong to their respective owners and are used for identification only.
      </p>
      <p className="text-700 m-0 fs-18">
        If you believe content on this site infringes your copyright, contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-linear">
          {CONTACT_EMAIL}
        </a>{" "}
        with details of the material and your rights in it, and we will review it promptly.
      </p>

      <h4 className="mb-0">Accuracy of content</h4>
      <p className="text-700 m-0 fs-18">
        We publish our articles in good faith, but we make no guarantee that everything is complete, current or free of error. Nothing on
        this site is professional advice. Do not treat our articles as a substitute for qualified medical, legal, financial or other
        professional guidance, and always check important details independently before acting on them.
      </p>

      <h4 className="mb-0">External links</h4>
      <p className="text-700 m-0 fs-18">
        Our articles link to third-party websites that we do not own or control. Those links are provided for convenience and do not
        imply endorsement. We are not responsible for the content, products, or practices of any external site, and visiting them is at
        your own risk.
      </p>

      <h4 className="mb-0">Limitation of liability</h4>
      <p className="text-700 m-0 fs-18">
        To the fullest extent permitted by law, {SITE_NAME} is not liable for any loss or damage arising from your use of, or reliance
        on, this site or its content. The site is provided on an &ldquo;as is&rdquo; basis, and we do not warrant that it will always be
        available or uninterrupted.
      </p>

      <h4 className="mb-0">Newsletter</h4>
      <p className="text-700 m-0 fs-18">
        If you subscribe to our newsletter, you agree to receive emails from us at the address you provide. You can unsubscribe at any
        time using the link in any email we send. How we handle your address is described in our{" "}
        <a href="/privacy-policy" className="text-linear">
          Privacy Policy
        </a>
        .
      </p>

      <h4 className="mb-0">Changes to these terms</h4>
      <p className="text-700 m-0 fs-18">
        We may revise these terms from time to time. Continued use of the site after a change means you accept the revised terms. The
        date at the top of this page shows when it was last updated.
      </p>

      <h4 className="mb-0">Governing law</h4>
      <p className="text-700 m-0 fs-18">These terms are governed by the laws of {JURISDICTION}.</p>

      <h4 className="mb-0">Contact</h4>
      <p className="text-700 m-0 fs-18">
        Questions about these terms can be sent to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-linear">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </StaticPage>
  );
}
