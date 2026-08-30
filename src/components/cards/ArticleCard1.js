// Ported from Elora theme: src/views/cards/article/card1-loop.html
import AuthorAvatar from "@/components/AuthorAvatar";

export default function ArticleCard1({
  classList,
  style,
  linkPost,
  img,
  linkAuthor,
  author,
  linkCategory,
  category,
  title,
  date,
  readTime,
}) {
  return (
    <div className={classList}>
      <div className={`article card-1 ${style}`}>
        <div className="hover-effect-1 card-img-top rounded-38">
          <a href={linkPost} className="">
            {img && <img src={img} className="w-100 h-100 lazyloaded card-img" alt="" />}
          </a>
          <a href={linkAuthor} className="author">
            <AuthorAvatar
              name={author}
              size={null}
              className="avatar-author-image d-flex align-items-center justify-content-center bg-100 text-dark fw-semi-bold fs-8"
            />
          </a>
        </div>
        <div className="card-body hover-up">
          <div className="left">
            <a href={linkCategory} className="badge d-block text-600 hover-linear-1">
              <span className="text-hover-linear-1">{category}</span>
            </a>
            <a className="hover-underline" href={linkPost}>
              <h5 className="card-title mb-0 text-truncate-2">{title}</h5>
            </a>
            <ul className="d-flex list-unstyled align-items-center text-600 m-0 ps-0 mt-2">
              <li>
                <p className="fs-8 fw-medium m-0">{date}</p>
              </li>
              <li>
                <div className="line-divider"></div>
              </li>
              <li>
                <p className="fs-8 fw-medium m-0">{readTime}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
