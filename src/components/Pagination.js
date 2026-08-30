// Ported from Elora theme: src/views/partials/pagination.html
// The source is a static mock (hardcoded 1-5 and an ellipsis); this drives
// the same markup from real page counts, and collapses to a windowed range
// with ellipses so a 53-page archive doesn't render 53 circles.
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const out = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

export default function Pagination({ page, totalPages, hrefFor, classList = "" }) {
  if (totalPages <= 1) return null;
  const items = pageList(page, totalPages);

  return (
    <div className={classList}>
      <nav aria-label="Pagination">
        <ul className="pagination gap-2">
          <li className="page-item">
            {page > 1 ? (
              <a className="icon-lg pagination_item rounded-circle icon-shape" href={hrefFor(page - 1)} aria-label="Previous">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M9.49993 6.5L4.78564 11L9.49993 15.5" stroke="#0E0E0F" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17.2143 11H5" stroke="#0E0E0F" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ) : (
              <span className="icon-lg pagination_item rounded-circle icon-shape opacity-25" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M9.49993 6.5L4.78564 11L9.49993 15.5" stroke="#0E0E0F" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17.2143 11H5" stroke="#0E0E0F" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </li>

          {items.map((item, i) =>
            item === "…" ? (
              <li className="page-item d-none d-md-block" key={`gap-${i}`}>
                <h6 className="mb-0">
                  <span className="icon-lg pagination_item rounded-circle icon-shape fs-18 fw-semi-bold"> … </span>
                </h6>
              </li>
            ) : (
              <li className="page-item" key={item}>
                <h6 className="mb-0">
                  <a
                    className={`icon-lg pagination_item rounded-circle icon-shape fs-18 fw-semi-bold${item === page ? " current" : ""}`}
                    href={hrefFor(item)}
                    aria-current={item === page ? "page" : undefined}
                  >
                    {" "}
                    {item}{" "}
                  </a>
                </h6>
              </li>
            )
          )}

          <li className="page-item">
            {page < totalPages ? (
              <a className="icon-lg pagination_item rounded-circle icon-shape" href={hrefFor(page + 1)} aria-label="Next">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M12.5 6.5L17.2143 11L12.5 15.5" stroke="#0E0E0F" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.9999 11H4.78564" stroke="#0E0E0F" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ) : (
              <span className="icon-lg pagination_item rounded-circle icon-shape opacity-25" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M12.5 6.5L17.2143 11L12.5 15.5" stroke="#0E0E0F" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.9999 11H4.78564" stroke="#0E0E0F" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
