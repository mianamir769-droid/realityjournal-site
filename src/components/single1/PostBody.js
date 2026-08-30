// Renders imported post content:encoded HTML verbatim (paragraphs/headings/
// links/captions already normalized by scripts/import-wxr.mjs). Replaces
// ContentSingle.js, which held Elora's hardcoded demo article text - real
// posts have arbitrary content, not that fixed structure.
export default function PostBody({ html }) {
  return <div className="d-flex flex-column gap-3" dangerouslySetInnerHTML={{ __html: html }} />;
}
