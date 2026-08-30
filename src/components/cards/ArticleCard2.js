// Ported from Elora theme: src/views/cards/article/card2-loop.html
// Simplified from two stacked author avatars to one (real posts have a
// single author, unlike the theme's demo co-author styling).
import AuthorAvatar from "@/components/AuthorAvatar";

export default function ArticleCard2({
  classList,
  linkPost,
  img,
  linkCategory,
  cat_display,
  category,
  linkAuthor,
  author,
  title,
  description,
  date,
  readTime,
}) {
  return (
    <div className={classList}>
      <div className="article card-2 position-relative">
        <div className="post-link">
          <div className="card-img-top hover-effect-1">
            <a href={linkPost} className="image">
              {img && <img src={img} alt="" className="cover-image" />}
            </a>
            <div className={`categories-container hover-linear-1 ${cat_display || ""} categories style-2`}>
              <a href={linkCategory} className=" fs-7 link-effect-1">
                <span className="text-nowrap">
                  <span className="text-1 text-hover-linear-1">{category}</span>
                  <span className="text-2 text-hover-linear-1">{category}</span>
                </span>
              </a>
            </div>
            <div className="block-author align-items-center">
              <a href={linkAuthor}>
                <AuthorAvatar name={author} size={41} />
              </a>
            </div>
          </div>
          <div className="card-body hover-up">
            <h4 className="hover-underline mb-0">
              <a href={linkPost} className="card-title">
                {title}
              </a>
            </h4>
            <p className="description text-dark my-0">{description}</p>
            <ul className="d-flex list-unstyled align-items-center text-600 m-0 ps-0">
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
