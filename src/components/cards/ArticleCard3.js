// Ported from Elora theme: src/views/cards/article/card3-loop.html
// Note: the source template contains an unused/unresolved `@@bg-badge` token
// (no @@loop call in the theme ever supplies a `bg-badge` value for it), so
// it is dropped here rather than reproduced as a literal "@@bg-badge" string.
export default function ArticleCard3({
  classList,
  style,
  linkPost,
  img,
  linkCategory,
  category,
  title,
  date,
}) {
  return (
    <div className={`${classList} hover-up z-1`}>
      <div className={`article card-3 ${style}`}>
        <a href={linkPost} className="card-img size-98 hover-effect-2">
          {img && <img className="w-100" src={img} alt="" />}
        </a>
        <div className="card-body">
          <a href={linkCategory} className="badge fs-8">
            <span className="fs-8 text-500 fw-semi-bold">{category}</span>
          </a>
          <h6 className="fs-5 mb-0 hover-underline">
            <a href={linkPost}>
              <span className="card-title text-truncate-2">{title}</span>
            </a>
          </h6>
          <div className="d-flex align-items-center mt-2 text-600">
            <span className="fs-8">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
