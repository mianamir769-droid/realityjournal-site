// Ported from Elora theme: src/views/sections/home-1/sec-4.html
import ArticleCard5 from "@/components/cards/ArticleCard5";
import AuthorAvatar from "@/components/AuthorAvatar";
import { formatDate, primaryCategory, categoryHref } from "@/lib/postFormat";

export default function Sec4({ authorName, authorCount, posts }) {
  return (
    <section className="sec-4-home-1 pb-80">
      <div className="custom-container">
        <div className="block-award" data-background="/assets/imgs/page/bg-home1-sec4.webp">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h5 className="ds-5  mb-0">Author award</h5>
              </div>
              <div className="col-md-6 mt-md-0 mt-3 d-flex">
                <div className="ms-md-auto">
                  <a href="#" className="btn btn-dark btn-sm hover-up">
                    View all posts
                    <span className="dark-mode-invert">
                      <img src="/assets/imgs/template/icons/arrow-up-right.svg" alt="" className="ms-2" />
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-12">
                <div className="border-bottom pt-3"></div>
              </div>
            </div>
            <div className="row align-items-stretch g-4 pt-5">
              <div className="col-lg-4 col-12">
                <div className="card-author style-1 hover-effect-4">
                  <AuthorAvatar name={authorName} variant="block" />
                  <div className="content">
                    <a href="#">
                      <h5 className="mb-0">{authorName || "Staff"}</h5>
                    </a>
                    <ul className="d-flex list-unstyled align-items-center text-600 m-0 ps-0">
                      <li>
                        <a href="#">
                          <p className="fs-7 text-linear mt-1 mb-0">Contributor</p>
                        </a>
                      </li>
                      <li>
                        <div className="line-divider"></div>
                      </li>
                      <li>
                        <p className="fs-7 mt-1 mb-0">{authorCount} posts</p>
                      </li>
                    </ul>
                    <div className="d-inline-flex group-social-icons bg-transparent mt-4">
                      <a href="#" className="icon-shape icon-32 bg-white hover-up">
                        <svg className="dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
                          <path
                            d="M8.84863 9.20312H6.5415V16.0938H3.46533V9.20312H0.942871V6.37305H3.46533V4.18896C3.46533 1.72803 4.94189 0.34375 7.1875 0.34375C8.26416 0.34375 9.40234 0.559082 9.40234 0.559082V2.98926H8.14111C6.91064 2.98926 6.5415 3.72754 6.5415 4.52734V6.37305H9.2793L8.84863 9.20312Z"
                            fill="black"
                          />
                        </svg>
                      </a>
                      <a href="#" className="icon-shape icon-32 bg-white hover-up">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                          <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                        </svg>
                      </a>
                      <a href="#" className="icon-shape icon-32 bg-white hover-up">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                        </svg>
                      </a>
                      <a href="#" className="icon-shape icon-32 bg-white hover-up">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-behance" viewBox="0 0 16 16">
                          <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391s.497.426.641.747c.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922s.461.957.461 1.563c0 .496-.105.922-.285 1.278a2.3 2.3 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.3 5.3 0 0 1-1.278.176L0 12.803V3zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a1 1 0 0 0-.32-.355 1.8 1.8 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39c.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305zm6.858-.035q.428.427 1.278.426c.39 0 .746-.106 1.032-.286q.426-.32.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.1 4.1 0 0 1-1.527-.285 2.8 2.8 0 0 1-1.137-.782 2.85 2.85 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4 4 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.496.105.996.07 1.563h-5.15c0 .58.21 1.11.496 1.396m2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176s-.356.25-.496.39a.96.96 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-12 d-flex flex-column gap-2 justify-content-between">
                {posts.map((post) => (
                  <ArticleCard5
                    key={post.slug}
                    classList="col-12"
                    linkPost={`/${post.slug}`}
                    linkCategory={categoryHref(primaryCategory(post.categories))}
                    category={primaryCategory(post.categories)}
                    img={post.img}
                    title={post.title}
                    date={formatDate(post.date)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
