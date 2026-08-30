// Ported from Elora theme: src/views/partials/breadcumb.html
export default function Breadcrumb({ position, pageLink, pageCurrent, sub, pageSubCurrent }) {
  return (
    <div className="sec-breadcumb">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ul className={`breadcrumb list-unstyled d-flex flex-wrap gap-2 align-items-center justify-content-${position} m-0 ps-0 py-4`}>
                <li className="breadcrumb-item">
                  <a href="/" className="text-600 fs-7 hover-dark">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <span className="icon-shape icon-xxs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M6.125 4.5625L9.5625 7.84375L6.125 11.125" stroke="#626568" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </li>
                <li className={`breadcrumb-item active text-dark fs-7 ${sub}`} aria-current="page">
                  <a href={pageLink} className="text-600 fs-7 hover-dark">
                    {pageCurrent}
                  </a>
                </li>
                <li className={`breadcrumb-item ${sub}`}>
                  <span className="icon-shape icon-xxs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M6.125 4.5625L9.5625 7.84375L6.125 11.125" stroke="#626568" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </li>
                <li className={`breadcrumb-item active text-dark fs-7 text-${position}`} aria-current="page">
                  {pageSubCurrent}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
