import StaticPage from "@/components/StaticPage";
import { SITE_NAME, CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "@/lib/siteConfig";

// NOTE: generic boilerplate, not legal advice. It describes the setup this
// site actually ships with (static hosting, a third-party newsletter form,
// no accounts, no first-party analytics). If you add analytics, ads,
// comments, or tracking pixels, this page must be updated to match, and it
// is worth having a professional review it for your jurisdiction.
export default function PrivacyPolicy() {
  return (
    <StaticPage
      path="/privacy-policy"
      title="Privacy Policy"
      intro={`How ${SITE_NAME} handles information when you visit this website.`}
      updated={LEGAL_LAST_UPDATED}
    >
      <h4 className="mb-0">Who we are</h4>
      <p className="text-700 m-0 fs-18">
        {SITE_NAME} publishes articles across a range of topics. You can reach us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-linear">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <h4 className="mb-0">Information we collect</h4>
      <p className="text-700 m-0 fs-18">
        You can read everything on this site without giving us any personal information. We do not require an account and we do not ask
        you to sign in.
      </p>
      <p className="text-700 m-0 fs-18">
        The only information you actively give us is your email address, and only if you choose to subscribe to our newsletter. We use it
        to send you the newsletter you asked for, and nothing else.
      </p>

      <h4 className="mb-0">Newsletter subscriptions</h4>
      <p className="text-700 m-0 fs-18">
        Newsletter signups are handled by a third-party email service. When you subscribe, your email address is submitted to and stored
        by that provider on our behalf, under their own privacy policy. You can unsubscribe at any time using the link in any email we
        send, or by emailing us directly, and we will remove your address.
      </p>

      <h4 className="mb-0">Hosting and server logs</h4>
      <p className="text-700 m-0 fs-18">
        This site is served as static files by our hosting provider. Like most hosts, they automatically record standard technical
        request data such as IP address, browser type, referring page and time of request, in order to serve the site and protect it from
        abuse. We do not use those logs to build profiles of individual readers.
      </p>

      <h4 className="mb-0">Cookies</h4>
      <p className="text-700 m-0 fs-18">
        We do not set advertising or tracking cookies. This site stores your light or dark theme choice in your own browser so the page
        does not change appearance on every visit. That preference stays on your device and is never sent to us.
      </p>

      <h4 className="mb-0">Content and links from other sites</h4>
      <p className="text-700 m-0 fs-18">
        Articles on this site link to other websites, and some articles display images hosted elsewhere. When your browser loads an
        external image or you follow an outbound link, that other website receives a request from your browser and applies its own
        privacy policy. We have no control over how those sites handle your information, and we encourage you to read their policies.
      </p>

      <h4 className="mb-0">Your rights</h4>
      <p className="text-700 m-0 fs-18">
        Depending on where you live, you may have the right to ask what personal information we hold about you, to request a copy, to ask
        us to correct it, or to ask us to delete it. Since the only personal information we hold is a newsletter email address, most
        requests can be settled by unsubscribing, but you are welcome to contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-linear">
          {CONTACT_EMAIL}
        </a>{" "}
        and we will respond.
      </p>

      <h4 className="mb-0">Children</h4>
      <p className="text-700 m-0 fs-18">
        This site is intended for a general audience and is not directed at children. We do not knowingly collect personal information
        from children. If you believe a child has sent us their email address, contact us and we will delete it.
      </p>

      <h4 className="mb-0">Changes to this policy</h4>
      <p className="text-700 m-0 fs-18">
        We may update this policy as the site changes. When we do, we will revise the date shown at the top of this page.
      </p>
    </StaticPage>
  );
}
