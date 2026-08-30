// Ported from Elora theme: src/views/cards/article/card5-loop.html
export default function ArticleCard5({
  classList,
  linkPost,
  title,
  linkCategory,
  category,
  date,
  img,
}) {
  return (
    <div className={classList}>
      <div className="article card-5 d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div className="card-header">
          <a href={linkPost} className="hover-underline">
            <h5 className="card-title mb-0">{title}</h5>
          </a>
          <ul className="d-flex list-unstyled align-items-center text-600 m-0 ps-0 mt-2">
            <li>
              <a href={linkCategory} className="badge d-block text-600 hover-linear-1">
                <span className="text-hover-linear-1">{category}</span>
              </a>
            </li>
            <li>
              <div className="line-divider"></div>
            </li>
            <li>
              <p className="fw-medium m-0">{date}</p>
            </li>
          </ul>
        </div>
        <div className="hover-effect-2 card-img">
          <div className="position-relative">
            <a href={linkPost}>
              {img && <img src={img} alt="" className="cover-image" />}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
