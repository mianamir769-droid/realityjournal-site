// Ported from Elora theme: src/views/cards/article/card4-loop.html
import AuthorAvatar from "@/components/AuthorAvatar";

export default function ArticleCard4({
  classList,
  linkPost,
  img,
  linkAuthor,
  title,
  author,
  date,
}) {
  return (
    <div className={classList}>
      <div className="article card-4 hover-up">
        <div className="card-img hover-effect-1">
          <div className="card-img-top">
            <a href={linkPost}>
              {img && <img className="rounded-16 overflow-hidden cover-image" src={img} alt="" />}
            </a>
          </div>
        </div>
        <h6 className="hover-underline pt-2 mb-0">
          <a href={linkPost} className="card-title text-truncate-2">
            {title}
          </a>
        </h6>
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
  );
}
