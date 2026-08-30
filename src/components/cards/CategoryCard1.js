// Ported from Elora theme: src/views/cards/category/card1-loop.html
export default function CategoryCard1({ classList, img, linkpage_category, category }) {
  return (
    <div className={classList}>
      <div className="category-card style-1 w-100 hover-up hover-linear-1" data-background={img}>
        <div className="post-content text-center">
          <h6 className="categories style-1 mb-0">
            <a href={linkpage_category} className="link-effect-1">
              <span className="text-nowrap">
                <span className="text-1 text-hover-linear-1">{category}</span>
                <span className="text-2 text-hover-linear-1">{category}</span>
              </span>
            </a>
          </h6>
        </div>
      </div>
    </div>
  );
}
