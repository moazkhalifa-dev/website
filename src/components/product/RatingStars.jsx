import { Star } from "lucide-react";

export function RatingStars({ rating }) {
  const full = Math.round(rating);

  return (
    <div
      className="rating-stars"
      aria-label={`Rating ${rating.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star key={idx} size={14} className={idx < full ? "filled" : ""} />
      ))}
      <span>{rating.toFixed(1)}</span>
    </div>
  );
}
