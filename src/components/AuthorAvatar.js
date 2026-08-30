import { getInitials } from "@/lib/postFormat";

// Real imported posts don't have a real author photo (WordPress exports
// only the author's display name), so rather than assigning a random Elora
// demo stock photo to a real byline, this renders initials wherever the
// theme expected a photo.
//
// variant="circle" (default): a sized circular badge. Pass `size` to reuse
// the theme's existing avatar-NN sizing classes (e.g. 48, 64, "md"), or
// size={null} plus an explicit `className` to slot into a spot that already
// has its own sizing class (e.g. "avatar-author-image").
//
// variant="block": fills its parent (100% width/height) with large centered
// initials - used where the theme shows a large author portrait photo
// rather than a small circular avatar.
export default function AuthorAvatar({ name, size = 48, className = "", variant = "circle" }) {
  const initials = getInitials(name);

  if (variant === "block") {
    return (
      <div
        className={`w-100 h-100 d-flex align-items-center justify-content-center bg-100 text-dark fw-bold ${className}`}
        style={{ fontSize: "3rem", minHeight: 220 }}
      >
        {initials}
      </div>
    );
  }

  const sizeClasses = size ? `avatar avatar-${size} rounded-circle ` : "";
  return (
    <div className={`${sizeClasses}d-flex align-items-center justify-content-center bg-100 text-dark fw-semi-bold ${className}`}>
      {initials}
    </div>
  );
}
