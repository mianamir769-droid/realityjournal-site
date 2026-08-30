// Ported from Elora theme: src/views/cards/article/card7-loop.html
import AuthorAvatar from "@/components/AuthorAvatar";

export default function ArticleCard7({
  classList,
  linkPost,
  img,
  linkCategory,
  cat_display,
  category,
  title,
  description,
  linkAuthor,
  author,
  date,
}) {
  return (
    <div className={classList}>
      <div className="article card-7">
        <div className="post-link">
          <div className="card-img-top hover-effect-1">
            <a href={linkPost} className="image">
              {img && <img src={img} alt="" className="cover-image" />}
            </a>
            <a href={linkCategory} className={`${cat_display || ""} categories style-2 fs-7 mb-2 hover-linear-1`}>
              <span className="text-hover-linear-1">{category}</span>
            </a>
          </div>
          <a href={linkPost} className="hover-underline pt-4">
            <h3 className="card-title text-truncate-2 mb-0">{title}</h3>
          </a>
          <p className="card-text text-dark my-3 text-truncate-2">{description}</p>
          <div className="bottom mt-auto d-flex flex-wrap align-items-center gap-2 pt-1">
            <a href={linkAuthor} className="author d-flex align-items-center gap-2">
              <AuthorAvatar name={author} size={null} className="avatar avatar-md rounded-circle" />
            </a>
            <ul className="list-unstyled gap-4 text-600 m-0 ps-0">
              <li>
                <a href={linkAuthor} className="hover-underline hover-linear-1">
                  <span className="fs-7 text-dark fw-semi-bold text-hover-linear-1">{author}</span>
                </a>
              </li>
              <li>
                <p className="fs-8 m-0">{date}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
