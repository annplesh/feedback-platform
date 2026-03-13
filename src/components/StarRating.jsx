import { useState } from "react";

// StarRating — dual-mode star component.
//
// Display mode  (onChange not provided): read-only stars.
// Input mode    (onChange provided): hover-to-preview, click-to-set.
//
// Props:
//   value    {number}    current rating 1–5
//   onChange {function}  called with new value (input mode only)
//   size     {string}    'sm' | 'md' | 'lg'

const SIZE_MAP = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-3xl",
};

export default function StarRating({ value, onChange, size = "md" }) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP.md;
  const displayValue = onChange ? hovered || value : value;

  return (
    <span
      className="flex gap-0.5"
      onMouseLeave={onChange ? () => setHovered(0) : undefined}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={[
            sizeClass,
            star <= displayValue ? "text-accent" : "text-cream",
            onChange ? "star-interactive" : "",
          ].join(" ")}
          onClick={onChange ? () => onChange(star) : undefined}
          onMouseEnter={onChange ? () => setHovered(star) : undefined}
          role={onChange ? "button" : undefined}
          aria-label={onChange ? `${star} star` : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}
