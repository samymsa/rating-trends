import type { Review } from "google-maps-review-scraper";
import { useEffect, useState } from "react";
import { AverageRating } from "./components/AverageRating";
import { PlaceName } from "./components/PlaceName";
import { RatingsChart } from "./components/RatingsChart";
import { Button } from "./components/ui/button";

function App() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function updateRatingChart() {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const {
        reviews: reviewsData,
      }: {
        reviews: Review[];
      } = await chrome.runtime.sendMessage({
        type: "GET_REVIEWS",
        url: tab.url,
      });

      setReviews(reviewsData || []);
    }

    updateRatingChart();
  }, []);

  return (
    <>
      <PlaceName />
      <AverageRating reviews={reviews} />
      <RatingsChart reviews={reviews} />

      <Button>Load more reviews</Button>
    </>
  );
}

export default App;
