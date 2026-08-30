// Ported from Elora theme: src/views/cards/category/tag-item-loop.html
export default function TagItem({ linkpage_category, name }) {
  return (
    <li className=" mx-0">
      <a href={linkpage_category} className="tag-item link-effect-2">
        <span className="text">
          <span className="text1">{name}</span>
          <span className="text2">{name}</span>
        </span>
      </a>
    </li>
  );
}
