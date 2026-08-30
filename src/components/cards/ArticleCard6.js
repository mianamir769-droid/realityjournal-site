// Ported from Elora theme: src/views/cards/article/card6-loop.html
export default function ArticleCard6({
  classList,
  cardClass,
  linkPost,
  img,
  linkCategory,
  category,
  title,
}) {
  return (
    <div className={classList}>
      <div className={`article card-6 ${cardClass || ""}`}>
        <div className="post-link">
          <div className="card-img-top hover-effect-1">
            <a href={linkPost} className="image">
              {img && <img src={img} alt="" className="cover-image" />}
            </a>
            <a href={linkCategory} className="categories style-2 fs-7 mb-2 hover-linear-1">
              <span className="text-hover-linear-1">{category}</span>
            </a>
          </div>
          <a href={linkPost} className="hover-underline pt-2">
            <h5 className="card-title text-truncate-2 mb-0">{title}</h5>
          </a>
        </div>
      </div>
    </div>
  );
}
