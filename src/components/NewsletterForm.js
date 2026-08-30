import { useState } from "react";
import { NEWSLETTER_ENDPOINT, CONTACT_EMAIL, SITE_NAME } from "@/lib/siteConfig";

// The site is a static export, so there is no server of our own to POST to.
// Two modes, in priority order:
//
// 1. If NEXT_PUBLIC_NEWSLETTER_ENDPOINT is set, submit there. Nearly every
//    form/newsletter service (Formspree, Buttondown, ConvertKit, Mailchimp)
//    accepts a JSON POST with an `email` field and replies 2xx.
//
// 2. Otherwise fall back to a prefilled mailto: to CONTACT_EMAIL. Not
//    elegant, but it works with zero third-party setup and the subscriber
//    lands in the inbox we already have - better than a dead form or a
//    fake success message.
export default function NewsletterForm({ buttonClass = "btn btn-linear button-effect-1", inputClass = "form-control border-linear" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [message, setMessage] = useState("");
  // Only true when the provider request actually failed - offering "email us
  // instead" after a simple typo in the address would just be confusing.
  const [showContactFallback, setShowContactFallback] = useState(false);

  function subscribeByEmail(value) {
    const subject = encodeURIComponent(`Newsletter signup: ${value}`);
    const body = encodeURIComponent(
      `Please add this address to the ${SITE_NAME} newsletter list:\n\n${value}\n\n(Sent from the website signup form.)`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("ok");
    setMessage("Your email app should open with a ready-to-send message. Hit send and you're on the list.");
    setEmail("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;

    const value = email.trim();
    // Deliberately loose: the real validation is the confirmation email.
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setStatus("error");
      setShowContactFallback(false);
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!NEWSLETTER_ENDPOINT) {
      subscribeByEmail(value);
      return;
    }

    setStatus("sending");
    setShowContactFallback(false);
    setMessage("");
    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("ok");
      setMessage("Thanks for subscribing. Please check your inbox to confirm.");
      setEmail("");
    } catch {
      setStatus("error");
      setShowContactFallback(true);
      setMessage("Something went wrong. Please try again, or email us directly:");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="d-flex gap-2 justify-content-center">
        <label htmlFor="newsletter-email" className="visually-hidden">
          Email address
        </label>
        <input
          id="newsletter-email"
          className={inputClass}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
        />
        <button className={buttonClass} type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      {message && (
        <p className={`fs-8 mt-3 mb-0 text-center ${status === "ok" ? "text-linear" : "text-danger"}`} role="status" aria-live="polite">
          {message}
          {showContactFallback && (
            <>
              {" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-linear">
                {CONTACT_EMAIL}
              </a>
            </>
          )}
        </p>
      )}

      <div className="form-check form-switch text-center mt-4">
        <input className="form-check-input" type="checkbox" id="subscribe-consent" required />
        <label className="form-check-label" htmlFor="subscribe-consent">
          You have read and agreed to the{" "}
          <a href="/privacy-policy/" className="text-linear">
            Privacy Policy
          </a>
        </label>
      </div>
    </form>
  );
}
