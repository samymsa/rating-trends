import type { Review } from "google-maps-review-scraper";
import { Rating, RatingButton } from "./ui/shadcn-io/rating";

function getAverageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.review.rating, 0);
  return total / reviews.length;
}

export function AverageRating({ reviews }: { reviews: Review[] }) {
  const averageRating = parseFloat(getAverageRating(reviews).toFixed(1));

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xl font-bold">
        {averageRating.toLocaleString()}
      </span>
      <Rating value={averageRating} readOnly>
        {Array.from({ length: 5 }).map((_, index) => (
          <RatingButton className="text-green-500" key={index} size={18} />
        ))}
      </Rating>
      <span className="text-muted-foreground mt-0.5 text-xs">
        Based on the last {reviews.length} reviews
      </span>
    </div>
  );
}
