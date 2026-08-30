// Ported from Elora theme: src/views/sections/home-1/sec-2.html
import CategoryCard1 from "@/components/cards/CategoryCard1";
import { categorySlug } from "@/lib/postFormat";

export default function Sec2({ categories }) {
  return (
    <section className="sec-2-home-1 pb-80">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <h5 className="ds-5  mb-0">Topics</h5>
              <p className="fw-medium text-700 ">Browse every subject we cover</p>
            </div>
          </div>
        </div>
        <div className="row mt-3 g-24">
          {categories.map((cat, i) => (
            <CategoryCard1
              key={i}
              classList="col-lg-2 col-sm-4 col-6"
              img={cat.img}
              category={cat.name}
              linkpage_category={`/category/${categorySlug(cat.name)}/`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
