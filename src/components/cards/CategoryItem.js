// Ported from Elora theme: src/views/cards/category/category-item-loop.html
// (used by the single-post sidebar's "Categories" list; not one of the two
// category card templates explicitly listed in the task, but the sidebar
// section uses it via @@loop so it is ported faithfully rather than
// improvised.)
export default function CategoryItem({ linkpage_category, name, count }) {
  return (
    <li className="mx-0">
      <a href={linkpage_category} className="category-item hover-up">
        <span className="text"> {name}</span>
        <span className="number">
          <span className="number-text text-nowrap odometer" data-count={count}></span>
        </span>
      </a>
    </li>
  );
}
