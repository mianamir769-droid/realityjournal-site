// Ported from Elora theme: src/views/sections/home-1/sec-7.html
// The theme's inert `<form action="#">` is replaced by NewsletterForm, which
// actually submits to a newsletter provider. `id="subscribe"` gives the
// footer's Subscribe link somewhere to jump to.
import NewsletterForm from "@/components/NewsletterForm";

export default function Sec7() {
  return (
    <section className="sec-7-home-1 pb-120 pt-5 position-relative overflow-hidden" id="subscribe">
      <div className="decorate-1 position-absolute top-0 start-50 translate-middle-x z-n1 d-none d-md-block">
        <img src="/assets/imgs/page/bg-home1-sec7.webp" alt="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-9 col-12 mx-auto text-center">
            <h4 className="ds-4  mb-5">
              Keep the inspiration flowing Your weekly <span className="text-linear fst-italic">boost of tips and insights</span>
            </h4>
          </div>
          <div className="col-lg-7 col-md-10 col-12 mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
